import assert from 'node:assert/strict'
import test from 'node:test'
import { readPublicationState } from './release-state.mjs'

const release = {
  name: 'docusaurus-plugin-banner',
  version: '0.4.0',
  repository: 'mcclowes/docusaurus-plugin-banner',
  refType: 'tag',
  refName: 'v0.4.0',
}

const response = (status, body = {}) => new Response(JSON.stringify(body), { status })

test('a fresh version tag still needs both publication channels', async () => {
  const state = await readPublicationState(release, async (url) =>
    url.endsWith('/repos/' + release.repository)
      ? response(200, { full_name: release.repository })
      : response(404)
  )
  assert.deepEqual(state, { npm_published: false, github_published: false, skip: false })
})

test('a successful response without package metadata cannot trigger publication', async () => {
  await assert.rejects(
    readPublicationState(release, async (url) => {
      if (url.endsWith('/repos/' + release.repository)) {
        return response(200, { full_name: release.repository })
      }
      return url.startsWith('https://registry.npmjs.org/') ? response(200, null) : response(404)
    }),
    /invalid|unexpected/
  )
})

const publishedPackage = { name: release.name, version: release.version }
const publishedRelease = { tag_name: 'v0.4.0', draft: false }
const services =
  ({ npm = null, github = null, repoStatus = 200 } = {}) =>
  async (url) => {
    if (url.endsWith('/repos/' + release.repository)) {
      return response(repoStatus, { full_name: release.repository })
    }
    const data = url.startsWith('https://registry.npmjs.org/') ? npm : github
    return response(data === null ? 404 : 200, data)
  }

for (const [label, npm, github, expected] of [
  [
    'npm only',
    publishedPackage,
    null,
    { npm_published: true, github_published: false, skip: false },
  ],
  [
    'GitHub only',
    null,
    publishedRelease,
    { npm_published: false, github_published: true, skip: false },
  ],
  [
    'both',
    publishedPackage,
    publishedRelease,
    { npm_published: true, github_published: true, skip: true },
  ],
]) {
  test(`a rerun with ${label} published resumes only the missing channel`, async () => {
    assert.deepEqual(await readPublicationState(release, services({ npm, github })), expected)
  })
}

test('a draft GitHub release is not completed publication', async () => {
  const state = await readPublicationState(
    release,
    services({
      npm: publishedPackage,
      github: { ...publishedRelease, draft: true },
    })
  )
  assert.deepEqual(state, { npm_published: true, github_published: false, skip: false })
})

test('a fresh main-branch version needs publication even without a tag trigger', async () => {
  assert.deepEqual(
    await readPublicationState({ ...release, refType: 'branch', refName: 'main' }, services()),
    {
      npm_published: false,
      github_published: false,
      skip: false,
    }
  )
})

test('a version-mismatched tag fails before requesting publication state', async () => {
  await assert.rejects(
    readPublicationState({ ...release, refName: 'v0.5.0' }, async () => {
      assert.fail('No service request should run for a mismatched tag')
    }),
    /does not match/
  )
})

for (const status of [401, 403, 404, 429, 500]) {
  test(`repository access HTTP ${status} cannot be mistaken for a missing release`, async () => {
    await assert.rejects(
      readPublicationState(release, services({ repoStatus: status })),
      /repository access check failed/
    )
  })
}

for (const service of ['npm', 'GitHub']) {
  test(`${service} outage fails instead of authorizing publication`, async () => {
    await assert.rejects(
      readPublicationState(release, async (url) => {
        if (url.endsWith('/repos/' + release.repository))
          return response(200, { full_name: release.repository })
        return response(
          url.startsWith('https://registry.npmjs.org/') === (service === 'npm') ? 503 : 404
        )
      }),
      /HTTP 503/
    )
  })
}

test('transport failure is not missing publication', async () => {
  await assert.rejects(
    readPublicationState(release, async () => {
      throw new Error('Connection timed out')
    }),
    /timed out/
  )
})

test('wrong package or release metadata cannot authorize publication', async () => {
  await assert.rejects(
    readPublicationState(release, services({ npm: { ...publishedPackage, version: '0.3.0' } })),
    /unexpected package version/
  )
  await assert.rejects(
    readPublicationState(
      release,
      services({ github: { ...publishedRelease, tag_name: 'v0.3.0' } })
    ),
    /unexpected release/
  )
})

test('GitHub credentials are sent only to GitHub and scoped package paths are encoded', async () => {
  const requests = []
  await readPublicationState(
    { ...release, name: '@example/banner', token: 'test-token' },
    async (url, options) => {
      requests.push({ url, headers: options.headers })
      return url.endsWith('/repos/' + release.repository)
        ? response(200, { full_name: release.repository })
        : response(404)
    }
  )
  const npm = requests.find(({ url }) => url.startsWith('https://registry.npmjs.org/'))
  assert.equal(npm.url, 'https://registry.npmjs.org/%40example%2Fbanner/0.4.0')
  assert.equal(npm.headers.Authorization, undefined)
  assert(
    requests
      .filter(({ url }) => url.startsWith('https://api.github.com/'))
      .every(({ headers }) => headers.Authorization === 'Bearer test-token')
  )
})
