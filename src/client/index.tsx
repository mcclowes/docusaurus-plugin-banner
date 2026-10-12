import React from 'react'
import { createRoot, Root } from 'react-dom/client'
import globalData from '@generated/globalData'
import Banner from './Banner'

type BannerData = React.ComponentProps<typeof Banner>

let bannerRoot: Root | null = null

function initBanner() {
  if (typeof window === 'undefined') return

  // Clean up existing banner root if present
  if (bannerRoot) {
    bannerRoot.unmount()
    bannerRoot = null
  }

  // Clear existing banner container if present
  const existingBanner = document.getElementById('docusaurus-plugin-banner-container')
  if (existingBanner) {
    existingBanner.remove()
  }

  // Docusaurus keys plugin data by instance id, which is the banner's `id` option when set
  const instances = globalData['docusaurus-plugin-banner'] ?? {}
  const bannerData = Object.values(instances)[0] as BannerData | undefined

  if (!bannerData) return

  // Create container for the banner
  const container = document.createElement('div')
  container.id = 'docusaurus-plugin-banner-container'

  // Insert before the navbar wrapper (or at beginning of body as fallback)
  const navbarWrapper = document.querySelector('.navbar-sidebar-wrapper, .navbar')?.parentElement
  if (navbarWrapper) {
    navbarWrapper.insertBefore(container, navbarWrapper.firstChild)
  } else {
    document.body.insertBefore(container, document.body.firstChild)
  }

  // Create React root and render banner
  bannerRoot = createRoot(container)
  bannerRoot.render(<Banner {...bannerData} />)
}

// Initialize banner when the route is ready
export function onRouteDidUpdate() {
  // Small delay to ensure DOM is ready
  setTimeout(() => {
    initBanner()
  }, 0)
}

// Also initialize on initial page load
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBanner)
  } else {
    initBanner()
  }
}
