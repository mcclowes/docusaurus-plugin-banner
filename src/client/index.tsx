import React from 'react'
import ReactDOM from 'react-dom'
// @ts-ignore - Docusaurus v2 doesn't export this from the package root
import useDocusaurusContext from '@docusaurus/core/lib/client/exports/useDocusaurusContext'
import Banner from './Banner'

function BannerWrapper() {
  const { globalData } = useDocusaurusContext()
  const bannerData = globalData['docusaurus-plugin-banner']?.default as any

  if (!bannerData) return null

  return <Banner {...bannerData} />
}

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
  ReactDOM.render(<BannerWrapper />, container)
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
