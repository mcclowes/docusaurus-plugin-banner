export type BannerPluginOptions = {
  /**
   * Whether the banner is dismissable by users
   * @default true
   */
  dismissible?: boolean

  /**
   * Banner content to display. Can be plain text or HTML string.
   *
   * SECURITY: This value is injected via `dangerouslySetInnerHTML`. Only pass
   * trusted content. If the content originates from user input, a CMS, or any
   * other untrusted source, sanitize it before passing it to the plugin.
   */
  content: string

  /**
   * Background color of the banner
   * @default '#3b82f6'
   */
  backgroundColor?: string

  /**
   * Text color of the banner content
   * @default '#ffffff'
   */
  textColor?: string

  /**
   * Whether to close the banner (X button) icon
   * Only shown if dismissible is true
   * @default true
   */
  showCloseIcon?: boolean

  /**
   * Link color within the banner content
   * @default '#ffffff'
   */
  linkColor?: string

  /**
   * Whether to underline links
   * @default true
   */
  linkUnderline?: boolean

  /**
   * Custom CSS class name for the banner
   */
  className?: string

  /**
   * Custom storage key for persisting dismissal state
   * @default 'docusaurus-banner-dismissed'
   */
  storageKey?: string

  /**
   * ID for the banner - useful when multiple banners are needed
   */
  id?: string

  /**
   * Version string appended to the dismissal storage key. Bump this when the
   * banner content changes to re-show the banner to users who previously
   * dismissed the prior version.
   */
  version?: string
}
