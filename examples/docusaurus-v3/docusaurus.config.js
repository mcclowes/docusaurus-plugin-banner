import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/** @type {import('@docusaurus/types').Config} */
export default {
  title: 'Banner Plugin Example',
  url: 'https://example.com',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'example',
  projectName: 'banner-example-site',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  i18n: { defaultLocale: 'en', locales: ['en'] },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: path.resolve(__dirname, './sidebars.js'),
        },
        blog: false,
        theme: {
          customCss: path.resolve(__dirname, './src/css/custom.css'),
        },
      }),
    ],
  ],

  plugins: [
    [
      path.resolve(__dirname, '../../dist/index.cjs'),
      /** @type {import('docusaurus-plugin-banner').BannerPluginOptions} */
      ({
        content: 'Welcome to the Banner Plugin example site!',
        dismissible: true,
        backgroundColor: '#3b82f6',
        textColor: '#ffffff',
        id: 'welcome',
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Banner Example',
        items: [
          { to: '/docs/intro', label: 'Docs', position: 'left' },
        ],
      },
    }),
}
