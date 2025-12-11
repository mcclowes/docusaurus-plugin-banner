import React from 'react'
import { createRoot, Root } from 'react-dom/client'
import Banner from './Banner'

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

  // Get banner data from global data (Docusaurus v3)
  // Try accessing via window first, then fallback to generated module if available
  let bannerData = 
    (window as any).__docusaurus?.globalData?.['docusaurus-plugin-banner']?.default ||
    (window as any).docusaurus?.globalData?.['docusaurus-plugin-banner']?.default
  
  // If not found, try to import from generated module (this will work at runtime)
  if (!bannerData && typeof window !== 'undefined') {
    try {
      // Dynamic import of generated globalData - only works after Docusaurus has loaded
      const globalDataModule = (window as any).__docusaurus_internal?.globalData
      if (globalDataModule) {
        bannerData = globalDataModule['docusaurus-plugin-banner']?.default
      }
    } catch {
      // Ignore errors - globalData might not be available yet
    }
  }
  
  if (!bannerData) return

  // Create container for the banner
  const container = document.createElement('div')
  container.id = 'docusaurus-plugin-banner-container'
  
  // Insert at the beginning of body
  document.body.insertBefore(container, document.body.firstChild)

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
