import React, { useState, useEffect } from 'react'

interface BannerProps {
  content: string
  dismissible: boolean
  backgroundColor: string
  textColor: string
  showCloseIcon: boolean
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

  const bannerStyle: React.CSSProperties = {
    backgroundColor,
    color: textColor,
    padding: '12px 16px',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
    opacity: isAnimating ? 0 : 1,
    transform: isAnimating ? 'translateY(-100%)' : 'translateY(0)',
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
      style={bannerStyle} 
      className={className}
      role="banner"
      aria-label="Site banner"
    >
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


