import type { LoadContext, Plugin } from '@docusaurus/types'
import type { BannerPluginOptions } from './types'

export default function bannerPlugin(
  context: LoadContext,
  options: BannerPluginOptions
): Plugin<BannerPluginOptions> {
  const resolvedOptions: BannerPluginOptions = {
    dismissible: options.dismissible ?? true,
    content: options.content,
    backgroundColor: options.backgroundColor ?? '#3b82f6',
    textColor: options.textColor ?? '#ffffff',
    showCloseIcon: options.showCloseIcon ?? true,
    linkColor: options.linkColor ?? '#ffffff',
    linkUnderline: options.linkUnderline ?? true,
    className: options.className,
    storageKey: options.storageKey ?? 'docusaurus-banner-dismissed',
    id: options.id,
  }

  return {
    name: 'docusaurus-plugin-banner',

    // Called during site build/serve. Use to produce data to be consumed later.
    async loadContent() {
      return {
        ...resolvedOptions,
      }
    },

    // Called after loadContent. Use to create routes or inject data into the client.
    async contentLoaded({ content, actions }) {
      if (!content) return
      const { setGlobalData } = actions
      setGlobalData(content)
    },

    // Optionally ship client modules. These run on the client bundle.
    getClientModules() {
      return [require.resolve('./client')]
    },
  }
}

