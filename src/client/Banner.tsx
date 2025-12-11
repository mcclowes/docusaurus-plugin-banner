import React, { useState, useEffect } from 'react'

interface BannerProps {
  content: string
  dismissible: boolean
  backgroundColor: string
  textColor: string
  showCloseIcon: boolean
  linkColor: string
  linkUnderline: boolean
  className?: string
  storageKey: string
  id?: string
}

export default function Banner({
  content,
  dismissible,
  backgroundColor,
  textColor,
  showCloseIcon,
  linkColor,
  linkUnderline,
  className,
  storageKey,
  id,
}: BannerProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Check if banner was previously dismissed
    if (typeof window !== 'undefined') {
      const dismissedKey = id ? `${storageKey}-${id}` : storageKey
      const wasDismissed = localStorage.getItem(dismissedKey) === 'true'
      setIsVisible(!wasDismissed)
    }
  }, [storageKey, id])

  const handleDismiss = () => {
    if (!dismissible) return

    // Animate out
    setIsAnimating(true)
    
    setTimeout(() => {
      setIsVisible(false)
      setIsAnimating(false)
      
      // Store dismissal state
      if (typeof window !== 'undefined') {
        const dismissedKey = id ? `${storageKey}-${id}` : storageKey
        localStorage.setItem(dismissedKey, 'true')
      }
    }, 300) // Match animation duration
  }

  if (!isVisible) return null

  const bannerId = `docusaurus-banner-${id || 'default'}`

  const linkStyles = `
    #${bannerId} a {
      color: ${linkColor};
      text-decoration: ${linkUnderline ? 'underline' : 'none'};
    }
    #${bannerId} a:hover {
      opacity: 0.8;
    }
  `

  const bannerStyle: React.CSSProperties = {
    backgroundColor,
    color: textColor,
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'opacity 0.3s ease-out, max-height 0.3s ease-out',
    opacity: isAnimating ? 0 : 1,
    maxHeight: isAnimating ? 0 : '100px',
    overflow: 'hidden',
  }

  const contentStyle: React.CSSProperties = {
    flex: 1,
    textAlign: 'center',
    maxWidth: '100%',
  }

  const closeButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    color: textColor,
    fontSize: '24px',
    cursor: 'pointer',
    padding: '0 8px',
    lineHeight: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '16px',
    opacity: 0.8,
    transition: 'opacity 0.2s',
  }

  return (
    <div
      id={bannerId}
      style={bannerStyle}
      className={className}
      role="banner"
      aria-label="Site banner"
    >
      <style>{linkStyles}</style>
      <div 
        style={contentStyle}
        dangerouslySetInnerHTML={{ __html: content }}
      />
      {dismissible && showCloseIcon && (
        <button
          type="button"
          aria-label="Dismiss banner"
          onClick={handleDismiss}
          style={closeButtonStyle}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}
        >
          ×
        </button>
      )}
    </div>
  )
}
