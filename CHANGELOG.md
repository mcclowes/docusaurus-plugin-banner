# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Jest unit tests for plugin and Banner component (25 tests)
- Playwright e2e tests for banner functionality
- Example Docusaurus v3 site in `examples/docusaurus-v3/`
- GitHub Actions CI workflow for automated testing
- CONTRIBUTING.md with development guidelines
- Prettier configuration for code formatting
- New npm scripts: `test`, `test:watch`, `test:coverage`, `test:e2e`, `example:start`, `example:build`, `example:serve`, `format`, `format:check`

### Changed

- Updated README with testing and development documentation
- Updated `.gitignore` to include test artifacts
- Updated `.npmignore` to exclude tests, examples, and config from npm package
- Updated `package.json` with test dependencies and scripts

## [0.1.0] - 2024-11-03

### Added

- Initial release
- Customizable banner content (plain text or HTML)
- Dismissible banners with X button
- localStorage persistence for dismissal state
- Configurable colors: `backgroundColor`, `textColor`, `linkColor`
- Link styling options: `linkColor`, `linkUnderline`
- Custom CSS class support via `className`
- Multiple banner support with unique `id` and `storageKey`
- Smooth dismiss animation
- TypeScript support with exported types
- Docusaurus v3 and React 18 compatibility
