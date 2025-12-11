import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Banner from '../src/client/Banner'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(window, 'localStorage', { value: localStorageMock })

const defaultProps = {
  content: 'Test banner content',
  dismissible: true,
  backgroundColor: '#3b82f6',
  textColor: '#ffffff',
  showCloseIcon: true,
  linkColor: '#ffffff',
  linkUnderline: true,
  storageKey: 'test-banner-dismissed',
}

describe('Banner', () => {
  beforeEach(() => {
    localStorageMock.clear()
  })

  describe('rendering', () => {
    it('should render banner with content', () => {
      render(<Banner {...defaultProps} />)

      expect(screen.getByRole('banner')).toBeInTheDocument()
      expect(screen.getByText('Test banner content')).toBeInTheDocument()
    })

    it('should render with correct background color', () => {
      render(<Banner {...defaultProps} />)

      const banner = screen.getByRole('banner')
      expect(banner).toHaveStyle({ backgroundColor: '#3b82f6' })
    })

    it('should render with correct text color', () => {
      render(<Banner {...defaultProps} />)

      const banner = screen.getByRole('banner')
      expect(banner).toHaveStyle({ color: '#ffffff' })
    })

    it('should render HTML content', () => {
      render(<Banner {...defaultProps} content="<strong>Bold</strong> text" />)

      expect(screen.getByText('Bold')).toBeInTheDocument()
      expect(screen.getByText('Bold').tagName).toBe('STRONG')
    })

    it('should apply custom className', () => {
      render(<Banner {...defaultProps} className="custom-class" />)

      const banner = screen.getByRole('banner')
      expect(banner).toHaveClass('custom-class')
    })

    it('should have correct aria attributes', () => {
      render(<Banner {...defaultProps} />)

      const banner = screen.getByRole('banner')
      expect(banner).toHaveAttribute('aria-label', 'Site banner')
    })
  })

  describe('dismiss button', () => {
    it('should show dismiss button when dismissible and showCloseIcon are true', () => {
      render(<Banner {...defaultProps} />)

      expect(screen.getByRole('button', { name: 'Dismiss banner' })).toBeInTheDocument()
    })

    it('should not show dismiss button when dismissible is false', () => {
      render(<Banner {...defaultProps} dismissible={false} />)

      expect(screen.queryByRole('button', { name: 'Dismiss banner' })).not.toBeInTheDocument()
    })

    it('should not show dismiss button when showCloseIcon is false', () => {
      render(<Banner {...defaultProps} showCloseIcon={false} />)

      expect(screen.queryByRole('button', { name: 'Dismiss banner' })).not.toBeInTheDocument()
    })
  })

  describe('dismissal behavior', () => {
    it('should hide banner when dismiss button is clicked', async () => {
      render(<Banner {...defaultProps} />)

      const dismissButton = screen.getByRole('button', { name: 'Dismiss banner' })
      fireEvent.click(dismissButton)

      await waitFor(
        () => {
          expect(screen.queryByRole('banner')).not.toBeInTheDocument()
        },
        { timeout: 500 }
      )
    })

    it('should save dismissal to localStorage', async () => {
      render(<Banner {...defaultProps} />)

      const dismissButton = screen.getByRole('button', { name: 'Dismiss banner' })
      fireEvent.click(dismissButton)

      await waitFor(
        () => {
          expect(localStorageMock.getItem('test-banner-dismissed')).toBe('true')
        },
        { timeout: 500 }
      )
    })

    it('should use id in localStorage key when provided', async () => {
      render(<Banner {...defaultProps} id="my-banner" />)

      const dismissButton = screen.getByRole('button', { name: 'Dismiss banner' })
      fireEvent.click(dismissButton)

      await waitFor(
        () => {
          expect(localStorageMock.getItem('test-banner-dismissed-my-banner')).toBe('true')
        },
        { timeout: 500 }
      )
    })

    it('should not render if previously dismissed', () => {
      localStorageMock.setItem('test-banner-dismissed', 'true')

      render(<Banner {...defaultProps} />)

      expect(screen.queryByRole('banner')).not.toBeInTheDocument()
    })

    it('should not render if previously dismissed with id', () => {
      localStorageMock.setItem('test-banner-dismissed-my-banner', 'true')

      render(<Banner {...defaultProps} id="my-banner" />)

      expect(screen.queryByRole('banner')).not.toBeInTheDocument()
    })
  })

  describe('unique banner IDs', () => {
    it('should use default ID when no id provided', () => {
      render(<Banner {...defaultProps} />)

      const banner = screen.getByRole('banner')
      expect(banner).toHaveAttribute('id', 'docusaurus-banner-default')
    })

    it('should use custom ID when provided', () => {
      render(<Banner {...defaultProps} id="custom-id" />)

      const banner = screen.getByRole('banner')
      expect(banner).toHaveAttribute('id', 'docusaurus-banner-custom-id')
    })
  })
})
