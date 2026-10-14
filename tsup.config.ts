import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'client/index': 'src/client/index.tsx',
  },
  dts: true,
  format: ['cjs', 'esm'],
  sourcemap: true,
  clean: true,
  shims: true,
  target: 'es2019',
  esbuildOptions(options) {
    // Node supports import.meta; keep the browser bundle's existing language target.
    options.supported = { ...options.supported, 'import-meta': true }
  },
  external: [
    'react',
    'react-dom',
    '@docusaurus/core',
    '@docusaurus/types',
    '@generated/docusaurus.config',
    '@generated/globalData',
    '@generated/i18n',
    '@generated/codeTranslations',
    '@generated/site-metadata',
  ],
  noExternal: [],
  treeshake: true,
})
