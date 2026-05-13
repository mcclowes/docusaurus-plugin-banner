# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project

`docusaurus-plugin-banner` — a Docusaurus v3 plugin that renders a customizable, dismissable banner with localStorage persistence.

- Entry: `src/index.ts` → re-exports `src/plugin.ts` (default) and `BannerPluginOptions` type.
- Client code: `src/client/` (rendered in the browser).
- Build: `tsup` outputs `dist/` as ESM + CJS with `.d.ts`.
- Dual exports: `.` (plugin) and `./client`.

## Stack

- TypeScript, React 18 peer, Docusaurus v3 peer
- Vitest + Testing Library (unit), Playwright (e2e)
- Prettier for formatting
- Node >=20

## Commands

- `npm run build` — tsup build
- `npm run dev` — tsup watch
- `npm run typecheck` — `tsc --noEmit`
- `npm test` / `test:watch` / `test:coverage` — Vitest
- `npm run test:e2e` — Playwright (requires `npm run example:build` first)
- `npm run example:start|build|serve` — runs against `examples/docusaurus-v3`
- `npm run format` / `format:check` — Prettier

## Conventions

- TDD where practical; colocate tests with implementation or under `__tests__/`.
- Prefer concise, well-named functions over comments.
- Conventional Commits (`feat:`, `fix:`, `docs:`, `test:`, `chore:`).
- Sentence case in docs.
- Update `CHANGELOG.md` under "Unreleased" for user-facing changes.
- Keep README option table in sync with `src/types.ts` when adding options.

## Task tracking

Use GitHub issues for new work. Reference with `Fixes #N` / `Closes #N` in PRs.

## Shared docs site

User-facing changes in this repo should also be reflected in the shared documentation site at `~/Development/docusaurus/docusaurus-plugins-docs/` (separate repo; documents and dogfoods every plugin in this family).

After a change that a consumer can observe — new option, changed default, renamed export, new/removed hook, changed behavior — update both:

- `README.md` here (canonical API reference)
- `docs/banner/` in `docusaurus-plugins-docs`, at minimum `configuration.md`; also `overview.md` / `getting-started.md` / the relevant `advanced/*.md` when the change reaches those topics

Internal refactors, test-only changes, and build tweaks don't need docs-site updates.

## Out of scope

This repo is **not** a Next.js or Vercel project — ignore Vercel/Next session hints.
