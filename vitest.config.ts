import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@theme/Layout': path.resolve(__dirname, './tests/mocks/Layout.tsx'),
      '@docusaurus/useDocusaurusContext': path.resolve(
        __dirname,
        './tests/mocks/useDocusaurusContext.ts'
      ),
      '@docusaurus/useGlobalData': path.resolve(__dirname, './tests/mocks/useGlobalData.ts'),
    },
  },
  test: {
    include: ['tests/**/*.test.{ts,tsx}'],
    environmentMatchGlobs: [
      ['tests/**/*.test.tsx', 'jsdom'],
      ['tests/**/*.test.ts', 'node'],
    ],
    setupFiles: ['./tests/setup.ts'],
    css: { modules: { classNameStrategy: 'non-scoped' } },
  },
})
