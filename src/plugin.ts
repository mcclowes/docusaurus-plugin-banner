import type { LoadContext, Plugin } from '@docusaurus/types'
import type { BannerPluginOptions } from './types'

const DEFAULT_OPTIONS = {
  dismissible: true,
  backgroundColor: '#3b82f6',
  textColor: '#ffffff',
  showCloseIcon: true,
  linkColor: '#ffffff',
  linkUnderline: true,
  storageKey: 'docusaurus-banner-dismissed',
} as const

function validateOptions(options: BannerPluginOptions): void {
  if (!options || typeof options !== 'object') {
    throw new Error('[docusaurus-plugin-banner] options object is required')
  }
  if (typeof options.content !== 'string' || options.content.length === 0) {
    throw new Error(
      '[docusaurus-plugin-banner] `content` is required and must be a non-empty string'
    )
  }
  const stringFields: Array<keyof BannerPluginOptions> = [
    'backgroundColor',
    'textColor',
    'linkColor',
    'className',
    'storageKey',
    'id',
    'version',
  ]
  for (const field of stringFields) {
    const value = options[field]
    if (value !== undefined && typeof value !== 'string') {
      throw new Error(`[docusaurus-plugin-banner] \`${field}\` must be a string when provided`)
    }
  }
  const boolFields: Array<keyof BannerPluginOptions> = [
    'dismissible',
    'showCloseIcon',
    'linkUnderline',
  ]
  for (const field of boolFields) {
    const value = options[field]
    if (value !== undefined && typeof value !== 'boolean') {
      throw new Error(`[docusaurus-plugin-banner] \`${field}\` must be a boolean when provided`)
    }
  }
}

export default function bannerPlugin(
  context: LoadContext,
  options: BannerPluginOptions
): Plugin<BannerPluginOptions> {
  validateOptions(options)

  const resolvedOptions: BannerPluginOptions = {
    dismissible: options.dismissible ?? DEFAULT_OPTIONS.dismissible,
    content: options.content,
    backgroundColor: options.backgroundColor ?? DEFAULT_OPTIONS.backgroundColor,
    textColor: options.textColor ?? DEFAULT_OPTIONS.textColor,
    showCloseIcon: options.showCloseIcon ?? DEFAULT_OPTIONS.showCloseIcon,
    linkColor: options.linkColor ?? DEFAULT_OPTIONS.linkColor,
    linkUnderline: options.linkUnderline ?? DEFAULT_OPTIONS.linkUnderline,
    className: options.className,
    storageKey: options.storageKey ?? DEFAULT_OPTIONS.storageKey,
    id: options.id,
    version: options.version,
  }

  return {
    name: 'docusaurus-plugin-banner',

    async loadContent() {
      return {
        ...resolvedOptions,
      }
    },

    async contentLoaded({ content, actions }) {
      if (!content) return
      const { setGlobalData } = actions
      setGlobalData(content)
    },

    getClientModules() {
      return [require.resolve('./client')]
    },
  }
}
