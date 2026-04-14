# Code review: `docusaurus-plugin-banner`

**Reviewer:** Principal engineer, onboarding
**Scope:** `src/`, build config, tests, distribution
**Verdict:** The plugin works for the happy path, but it leaks through several abstraction layers, has real security and correctness bugs, and ships an accessibility story that would fail a basic audit. It needs a targeted rewrite of the client bootstrap, hardening of the dismissal flow, and removal of `dangerouslySetInnerHTML` in its current form.

This review is intentionally blunt. It is meant as a teaching artifact — each critique explains _why_ it matters, not just _what_ is wrong.

---

## 1. Security

### 1.1 `dangerouslySetInnerHTML` on user-configured content (`Banner.tsx:116`)

The `content` option is injected raw into the DOM. The README advertises this as a feature ("Can be plain text or HTML string"). That is an XSS footgun:

- Site authors often templatize banner content from env vars, CMS fields, or translation files. As soon as any of those inputs becomes untrusted, the banner is a stored-XSS vector on every page of the docs site.
- There is no sanitization (no DOMPurify, no allow-list). A downstream consumer has no way to opt into safety without forking.
- The plugin could trivially accept a `ReactNode` (via a component export) OR sanitize via `DOMPurify` and a configurable allow-list. Offering both a `content: string` (plain text, escaped) and `html: string` (explicit opt-in) channel would be strictly better.

**Teaching point:** APIs should make the safe path the default. `content` that accepts either text or HTML is the opposite — the dangerous path is the only path.

### 1.2 CSS injection via `linkColor` (`Banner.tsx:62-70`)

`linkColor` and the computed `bannerId` are interpolated unescaped into a `<style>` tag:

```tsx
const linkStyles = `
  #${bannerId} a {
    color: ${linkColor};
    ...
```

If `id` or `linkColor` ever come from untrusted input, an attacker can break out of the declaration (`red; } body { display:none } a {`). Even for trusted input, a stray `}` is a silent footgun. Either validate with a regex, escape, or push colors through React style attributes on a rendered `<a>` wrapper.

### 1.3 No CSP story

Inline `<style>` and inline `style={}` both violate strict CSP (`style-src 'self'`) unless the host site opts into `'unsafe-inline'`. Docs sites running behind enterprise CSPs will silently break. At minimum, document this. Better: ship a real CSS module.

---

## 2. Correctness and edge cases the team has missed

### 2.1 SSR hydration mismatch on first render (`Banner.tsx:28`)

`useState(false)` means the banner renders **hidden** on first paint, then flashes in after the `useEffect` reads `localStorage`. That's not SSR — this is a client-only module — but it still produces a visible flash on every page load. The idiomatic fix is to read `localStorage` lazily inside the initializer (`useState(() => !localStorage.getItem(...))`) guarded by a `typeof window` check. Right now every user with the banner _not_ dismissed sees no banner for a frame, then a banner slamming in.

### 2.2 `localStorage` may throw (`Banner.tsx:35`, `53`)

Safari private mode, quota-exceeded, disabled storage, `SecurityError` in sandboxed iframes — every `localStorage` access is in a try/catch-free block. One angry user with strict privacy settings will crash the render. Wrap access, fall back to in-memory.

### 2.3 Dismissal race: state flip happens **after** the 300ms timeout (`Banner.tsx:46-55`)

The code sets `isAnimating=true`, then in the timeout sets `isVisible=false` **and writes localStorage**. Two problems:

1. If the user navigates away in that 300ms window, `localStorage` is never written and the banner resurrects on the next page.
2. If the component unmounts during the timeout (route change in Docusaurus SPA), you leak a timer and `setState` on an unmounted component. No cleanup in `useEffect`.

Fix: write to `localStorage` synchronously on click; drive the animation via a CSS class; clear the timer on unmount.

### 2.4 Global client module runs at import time (`client/index.tsx:69-75`)

The module has side effects at import: it calls `initBanner()` or registers a `DOMContentLoaded` listener _unconditionally_. Combined with `onRouteDidUpdate`, this means on a cold load the banner initializes **twice** (once from the bottom-of-file branch, once from Docusaurus's own route lifecycle). The cleanup at the top of `initBanner` papers over this by unmounting whatever it just mounted, which is wasteful and causes the flash described in 2.1.

**Teaching point:** Side-effectful module top-levels are an anti-pattern. Export functions, let the framework call them. Docusaurus _gives_ you lifecycle hooks — use only those.

### 2.5 Fragile global-data lookup (`client/index.tsx:24-39`)

The code probes three different window shapes:

```ts
(window as any).__docusaurus?.globalData?.[...]
(window as any).docusaurus?.globalData?.[...]
(window as any).__docusaurus_internal?.globalData
```

None of these are Docusaurus's public API. The correct path is to import via `@docusaurus/useGlobalData` (or `useRouteContext`) inside a React component, which is the supported contract. This code will break on any Docusaurus minor version that reshuffles its internals, and there's no version assertion.

### 2.6 DOM insertion point races the framework (`client/index.tsx:48-53`)

`.navbar-sidebar-wrapper, .navbar` are Docusaurus implementation details. If the navbar renders _after_ `onRouteDidUpdate` fires (Suspense boundary, lazy nav), the selector fails and the banner gets shoved under `document.body.firstChild`, landing above anything else the framework injects first. The fallback order is also wrong: `navbar-sidebar-wrapper` exists only when the mobile sidebar is open, which flips the insertion target based on viewport state between page loads.

### 2.7 Single `id` but `setGlobalData` ships only one banner

The `id` option is plumbed through the storage key, but `loadContent` flattens all options into a single global-data entry. You cannot configure multiple banners despite the type hints suggesting you can. Either implement multi-banner properly (array of configs) or remove the `id` feature from the public API.

### 2.8 `className` is applied but `id` collides (`Banner.tsx:109`)

`bannerId = docusaurus-banner-${id || 'default'}`. If a consumer has two instances configured with no `id` (per 2.7 they can't, but if they tried), both get `id="docusaurus-banner-default"` — invalid HTML.

### 2.9 Animation-out respects `dismissible` but not state (`Banner.tsx:40-56`)

Clicking dismiss while already animating kicks off another 300ms timer. No guard. Not catastrophic, but the sort of thing unit tests should cover.

### 2.10 No `prefers-reduced-motion` handling

Hard-coded 300ms opacity/max-height transition. Users with motion sensitivity get the animation regardless. A one-line media query would fix this.

### 2.11 `maxHeight: '100px'` is a magic number (`Banner.tsx:81`)

Long content or large fonts will clip. Either measure the element, or don't animate height at all (animate opacity + margin-top, let height be natural).

### 2.12 No `aria-live` / dismissed state is not announced

`role="banner"` is fine, but for a dynamic notification, `role="status"` or `aria-live="polite"` would be more correct. The dismiss button has `aria-label` but no `aria-expanded`/`aria-hidden` coordination after dismissal (the element is removed, which is acceptable — but then the _button_ should also be focusable cleanly, and currently focus is lost silently after dismissal, violating WCAG 2.4.3).

### 2.13 Options validation is absent (`plugin.ts`)

`options.content` is required by the type but never checked at runtime. Pass `undefined` and you get a React render of `undefined` inside `dangerouslySetInnerHTML` — silent no-op or crash depending on React version. A Docusaurus plugin should validate with Joi (which Docusaurus ships) via `validateOptions`. That also gives proper build-time error messages.

### 2.14 `storageKey` collisions

Default `'docusaurus-banner-dismissed'`. Two sites under the same origin (subpath deployments, Verdaccio previews) share localStorage — dismissing on site A dismisses on site B. Scope the key to `window.location.pathname` root, or document this clearly.

### 2.15 No way to re-show a dismissed banner when content changes

If a site updates the banner copy, previously-dismissed users never see it. The _minimum_ viable fix is hashing `content` into the storage key, or exposing a `version` option. This is the single most common real-world bug with banner plugins and it isn't addressed.

---

## 3. Architecture and API design

### 3.1 Plugin contract leaks into the client

The plugin emits `setGlobalData(content)` where `content` is the full options object. Then the client reads it via undocumented window paths. The **supported** pattern for Docusaurus is: expose a theme component, consume `useGlobalData` inside it, and let Docusaurus handle routing/SSR. The current approach bypasses React's tree, manually `createRoot`s a detached container, and imperatively mounts/unmounts on every route change. That is a Docusaurus plugin written like a vanilla `<script>` tag. It forfeits SSR, theme-toggle integration, and swizzling.

**Teaching point:** When a framework has a lifecycle, use it. Reach for `createRoot` only when you've proven the framework path doesn't work.

### 3.2 Styling strategy is inconsistent

Inline styles on the root, `<style>` tag for link rules, `className` prop for consumers. Three styling systems in one 130-line component. Pick one: CSS modules (Docusaurus supports them natively), and expose CSS custom properties for colors so consumers can theme without re-rendering.

### 3.3 Options defaults live in the plugin, not the types

`plugin.ts:8-19` hardcodes defaults. They should live as a `DEFAULT_OPTIONS` constant, validated by Joi, and ideally exported so tests don't re-declare them (see `Banner.test.tsx:24-33`).

### 3.4 `require.resolve('./client')` in an ESM package

`package.json` declares `"type": "module"`, but `plugin.ts:40` uses CommonJS `require.resolve`. This works only because tsup emits dual output, but mixing CJS require in an ESM source file is asking for "require is not defined" in ESM-strict runtimes. Use `import.meta.resolve` or a path string.

---

## 4. Build, tooling, and repo hygiene

- `default.profraw` is checked into the repo root. Profiling artifact; should be gitignored (the latest commits suggest this was partially addressed — verify).
- `dist/` is listed next to `src/` in the working tree. Fine for publishing, but ensure it's gitignored, not committed.
- Jest 29 + `jest-environment-jsdom` 30 in dev deps — version skew. Pick one major.
- `@babel/preset-*` is installed alongside `tsup`. You have two compilation toolchains. The Jest side uses babel; the build side uses tsup. Tests therefore never execute the code path users actually run. Swap to `@swc/jest` or `ts-jest` for parity, or commit to babel and drop tsup's TS transform nuances from the mental model.
- `playwright.config.ts` exists with a single `banner.spec.ts` — good. Is it wired into CI? (Not visible here; confirm.)
- No `CHANGELOG` automation, no release workflow visible. For a published npm package, add `changesets` or similar.
- Engines: `"node": ">=18.0"`. Node 18 is EOL April 2025. Bump.

---

## 5. Testing gaps

Looking at `__tests__/Banner.test.tsx`: it mocks localStorage, which is fine, but:

- No test for the localStorage-throws case (2.2).
- No test for unmount-during-animation (2.3).
- No test for the SSR/first-paint flash (2.1).
- No test for the plugin itself validating options (2.13).
- `plugin.test.ts` likely doesn't exercise `getClientModules`'s `require.resolve` path under ESM.
- No visual regression test on the actual DOM insertion point (2.6).
- The e2e spec is a single file — it should cover: dismissal persists across reload, dismissal scoped per-id, content update invalidates dismissal (once 2.15 is fixed).

**Teaching point:** Tests should target the _risks_, not the _surface area_. Every bug listed above is a test that should exist.

---

## 6. Documentation

- README markets `content` as HTML-capable without flagging XSS. That is a docs bug as much as a code bug.
- No migration notes for the breaking change if/when multi-banner lands.
- No examples directory walkthrough in the review scope — `examples/docusaurus-v3` exists, good, but confirm it's exercised in CI.

---

## 7. Prioritized action list

**P0 — security / correctness**

1. Sanitize or React-ify `content`; stop shipping raw HTML by default (1.1).
2. Wrap all `localStorage` access in try/catch with in-memory fallback (2.2).
3. Write localStorage synchronously on dismiss; clear timers on unmount (2.3).
4. Validate plugin options via Docusaurus's Joi hook (2.13).

**P1 — architecture** 5. Replace manual `createRoot` bootstrap with a theme component + `useGlobalData` (3.1, 2.4, 2.5). 6. Hash `content` (or accept explicit `version`) into the storage key (2.15). 7. Fix SSR/first-paint flash by initializing state from localStorage synchronously (2.1).

**P2 — polish** 8. `prefers-reduced-motion`, `role="status"`, focus-return after dismiss (2.10, 2.12). 9. CSS modules + CSS variables, drop inline `<style>` (1.2, 3.2). 10. Tooling parity between Jest and tsup (§4).

---

## 8. What the team is doing well

Credit where due, so the junior team doesn't read this as "everything is bad":

- The options surface is small and coherent; defaults are sensible.
- Types are exported separately and cleanly re-exported from `index.ts`.
- `storageKey` is customizable — many banner plugins hardcode it.
- Dual ESM/CJS output via tsup is correctly configured in `package.json` exports map.
- Tests exist and use Testing Library's semantic queries rather than DOM traversal.
- The e2e scaffold with Playwright is the right call for this kind of DOM-integration plugin.

The bones are fine. The problems are in the client bootstrap and the `content` contract — both fixable without a rewrite of the public API.
