import React from 'react'
import { createRoot, Root } from 'react-dom/client'
import useGlobalData from '@docusaurus/useGlobalData'
import Banner from './Banner'

let bannerRoot: Root | null = null

function BannerWrapper() {
  const globalData = useGlobalData()
  const bannerData = globalData['docusaurus-plugin-banner']?.default as any

  if (!bannerData) return null

  return <Banner {...bannerData} />
}

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

  // Create container for the banner
  const container = document.createElement('div')
  container.id = 'docusaurus-plugin-banner-container'
  
  // Insert at the beginning of body
  document.body.insertBefore(container, document.body.firstChild)

  // Create React root and render banner wrapper
  bannerRoot = createRoot(container)
  bannerRoot.render(<BannerWrapper />)
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
