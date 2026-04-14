import React, { useEffect, useRef, useState } from 'react'

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
  version?: string
}

const ANIMATION_MS = 300

function safeGetItem(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function safeSetItem(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // Storage unavailable (private mode, quota, disabled). Silently continue.
  }
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function buildDismissedKey(
  storageKey: string,
  id: string | undefined,
  version: string | undefined
): string {
  // Preserve the legacy `${storageKey}-${id}` format when no version is given so
  // that existing dismissals survive an upgrade. A `version` bump deliberately
  // invalidates prior dismissals.
  const base = id ? `${storageKey}-${id}` : storageKey
  return version ? `${base}::v=${version}` : base
}

function initialVisible(dismissedKey: string): boolean {
  if (typeof window === 'undefined') return false
  return safeGetItem(dismissedKey) !== 'true'
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
  version,
}: BannerProps) {
  const dismissedKey = buildDismissedKey(storageKey, id, version)

  // Initialize synchronously to avoid first-paint flash.
  const [isVisible, setIsVisible] = useState<boolean>(() => initialVisible(dismissedKey))
  const [isAnimating, setIsAnimating] = useState(false)
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (dismissTimerRef.current) {
        clearTimeout(dismissTimerRef.current)
        dismissTimerRef.current = null
      }
    }
  }, [])

  const handleDismiss = () => {
    if (!dismissible || isAnimating) return

    // Persist immediately so navigation mid-animation still records dismissal.
    safeSetItem(dismissedKey, 'true')

    if (prefersReducedMotion()) {
      setIsVisible(false)
      return
    }

    setIsAnimating(true)
    dismissTimerRef.current = setTimeout(() => {
      setIsVisible(false)
      setIsAnimating(false)
      dismissTimerRef.current = null
    }, ANIMATION_MS)
  }

  if (!isVisible) return null

  const bannerId = `docusaurus-banner-${id || 'default'}`
  const escapedLinkColor = sanitizeCssColor(linkColor)

  const linkStyles = `
    #${bannerId} a {
      color: ${escapedLinkColor};
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
    maxHeight: isAnimating ? 0 : 'none',
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
      aria-live="polite"
      aria-label="Site banner"
    >
      <style>{linkStyles}</style>
      <div style={contentStyle} dangerouslySetInnerHTML={{ __html: content }} />
      {dismissible && showCloseIcon && (
        <button
          type="button"
          aria-label="Dismiss banner"
          onClick={handleDismiss}
          style={closeButtonStyle}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.8')}
        >
          ×
        </button>
      )}
    </div>
  )
}

// Reject anything that could break out of a CSS declaration. Conservative:
// allow hex, rgb/rgba/hsl/hsla, and a short allow-list of named colors.
function sanitizeCssColor(input: string): string {
  const trimmed = String(input).trim()
  if (/^#[0-9a-fA-F]{3,8}$/.test(trimmed)) return trimmed
  if (/^(rgb|rgba|hsl|hsla)\([0-9.,\s%/-]+\)$/.test(trimmed)) return trimmed
  if (/^[a-zA-Z]+$/.test(trimmed)) return trimmed
  return '#ffffff'
}
