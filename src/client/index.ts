import React from 'react'
import { createRoot, Root } from 'react-dom/client'
import Banner from './Banner'

let bannerRoot: Root | null = null

function initBanner() {
  if (typeof window === 'undefined') return
  
  // Clear existing banner if present
  const existingBanner = document.getElementById('docusaurus-plugin-banner-container')
  if (existingBanner) {
    existingBanner.remove()
  }

  // Create container for the banner
  const container = document.createElement('div')
  container.id = 'docusaurus-plugin-banner-container'
  
  // Insert at the beginning of body
  document.body.insertBefore(container, document.body.firstChild)

  // Create React root and render banner
  bannerRoot = createRoot(container)
  
  // Get banner data from window global data
  const bannerData = (window as any).docusaurus?.globalData?.['docusaurus-plugin-banner']?.default
  
  if (!bannerData) return
  
  bannerRoot.render(React.createElement(Banner, bannerData))
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
