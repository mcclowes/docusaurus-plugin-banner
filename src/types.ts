export type BannerPluginOptions = {
  /**
   * Whether the banner is dismissable by users
   * @default true
   */
  dismissible?: boolean
  
  /**
   * Banner content to display. Can be plain text or HTML string
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
}

