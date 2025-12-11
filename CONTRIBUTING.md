# Contributing to docusaurus-plugin-banner

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing.

## Development Setup

1. **Fork and clone the repository**

   ```bash
   git clone https://github.com/YOUR_USERNAME/docusaurus-plugin-banner.git
   cd docusaurus-plugin-banner
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Build the plugin**

   ```bash
   npm run build
   ```

## Development Workflow

### Making Changes

1. Create a new branch for your changes:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes to the source code in `src/`

3. Build the plugin to verify it compiles:

   ```bash
   npm run build
   ```

4. Run the type checker:

   ```bash
   npm run typecheck
   ```

### Testing

We have both unit tests and end-to-end tests.

**Unit Tests:**

```bash
# Run all unit tests
npm test

# Run tests in watch mode during development
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

**End-to-End Tests:**

```bash
# Build the example site first
npm run example:build

# Run e2e tests
npm run test:e2e

# Run e2e tests with Playwright UI
npm run test:e2e:ui
```

### Using the Example Site

The example site in `examples/docusaurus-v3/` is useful for manual testing:

```bash
# Start the example site in development mode
npm run example:start

# Build and serve the example site
npm run example:build
npm run example:serve
```

### Code Formatting

We use Prettier for code formatting:

```bash
# Format all files
npm run format

# Check if files are formatted correctly
npm run format:check
```

## Pull Request Process

1. **Ensure all tests pass:**

   ```bash
   npm test
   npm run typecheck
   npm run format:check
   ```

2. **Update documentation** if you've changed any public APIs or added features

3. **Update CHANGELOG.md** with a description of your changes under the "Unreleased" section

4. **Submit your pull request** with a clear description of the changes

## Commit Messages

Use clear, descriptive commit messages. We recommend following the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `test:` for test changes
- `chore:` for maintenance tasks

Examples:

```
feat: add position option for top/bottom banner placement
fix: resolve banner flickering on page navigation
docs: update README with new configuration options
test: add unit tests for dismissal behavior
```

## Reporting Issues

When reporting issues, please include:

- Your Node.js version (`node --version`)
- Your Docusaurus version
- Steps to reproduce the issue
- Expected vs actual behavior
- Any error messages or console output

## Code of Conduct

Please be respectful and constructive in all interactions. We're all here to build something useful together.

## Questions?

If you have questions, feel free to open an issue with the "question" label.
