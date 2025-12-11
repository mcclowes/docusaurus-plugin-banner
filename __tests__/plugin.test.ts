import bannerPlugin from '../src/plugin'
import type { LoadContext } from '@docusaurus/types'

const mockContext: LoadContext = {
  siteDir: '/mock/site',
  generatedFilesDir: '/mock/.docusaurus',
  siteConfig: {} as any,
  siteConfigPath: '/mock/docusaurus.config.js',
  outDir: '/mock/build',
  baseUrl: '/',
  i18n: {} as any,
  localizationDir: '/mock/i18n',
  codeTranslations: {},
  future: {} as any,
}

describe('bannerPlugin', () => {
  it('should return a plugin object with correct name', () => {
    const plugin = bannerPlugin(mockContext, { content: 'Test banner' })
    expect(plugin.name).toBe('docusaurus-plugin-banner')
  })

  it('should have loadContent method', () => {
    const plugin = bannerPlugin(mockContext, { content: 'Test banner' })
    expect(typeof plugin.loadContent).toBe('function')
  })

  it('should have contentLoaded method', () => {
    const plugin = bannerPlugin(mockContext, { content: 'Test banner' })
    expect(typeof plugin.contentLoaded).toBe('function')
  })

  it('should have getClientModules method', () => {
    const plugin = bannerPlugin(mockContext, { content: 'Test banner' })
    expect(typeof plugin.getClientModules).toBe('function')
  })

  describe('loadContent', () => {
    it('should return resolved options with defaults', async () => {
      const plugin = bannerPlugin(mockContext, { content: 'Test banner' })
      const content = await plugin.loadContent!()

      expect(content).toEqual({
        content: 'Test banner',
        dismissible: true,
        backgroundColor: '#3b82f6',
        textColor: '#ffffff',
        showCloseIcon: true,
        linkColor: '#ffffff',
        linkUnderline: true,
        className: undefined,
        storageKey: 'docusaurus-banner-dismissed',
        id: undefined,
      })
    })

    it('should use custom options when provided', async () => {
      const plugin = bannerPlugin(mockContext, {
        content: 'Custom banner',
        dismissible: false,
        backgroundColor: '#ff0000',
        textColor: '#000000',
        showCloseIcon: false,
        linkColor: '#0000ff',
        linkUnderline: false,
        className: 'custom-class',
        storageKey: 'custom-key',
        id: 'custom-id',
      })
      const content = await plugin.loadContent!()

      expect(content).toEqual({
        content: 'Custom banner',
        dismissible: false,
        backgroundColor: '#ff0000',
        textColor: '#000000',
        showCloseIcon: false,
        linkColor: '#0000ff',
        linkUnderline: false,
        className: 'custom-class',
        storageKey: 'custom-key',
        id: 'custom-id',
      })
    })
  })

  describe('contentLoaded', () => {
    it('should call setGlobalData with content', async () => {
      const plugin = bannerPlugin(mockContext, { content: 'Test banner' })
      const content = await plugin.loadContent!()

      const mockSetGlobalData = jest.fn()

      await plugin.contentLoaded!({
        content,
        actions: {
          setGlobalData: mockSetGlobalData,
          addRoute: jest.fn(),
          createData: jest.fn(),
        },
      })

      expect(mockSetGlobalData).toHaveBeenCalledWith(content)
    })

    it('should not call setGlobalData when content is undefined', async () => {
      const plugin = bannerPlugin(mockContext, { content: 'Test banner' })

      const mockSetGlobalData = jest.fn()

      await plugin.contentLoaded!({
        content: undefined,
        actions: {
          setGlobalData: mockSetGlobalData,
          addRoute: jest.fn(),
          createData: jest.fn(),
        },
      })

      expect(mockSetGlobalData).not.toHaveBeenCalled()
    })
  })

  describe('getClientModules', () => {
    it('should return an array with client module path', () => {
      const plugin = bannerPlugin(mockContext, { content: 'Test banner' })
      const clientModules = plugin.getClientModules!()

      expect(Array.isArray(clientModules)).toBe(true)
      expect(clientModules.length).toBe(1)
      expect(clientModules[0]).toContain('client')
    })
  })
})
