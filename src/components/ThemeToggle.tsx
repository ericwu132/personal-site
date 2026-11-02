import { useState } from 'react'

export default function ThemeToggle() {
  const [ivory, setIvory] = useState(false)

  function toggleTheme() {
    const next = !ivory
    if (next) document.documentElement.dataset.theme = 'cream'
    else delete document.documentElement.dataset.theme
    setIvory(next)
  }

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={toggleTheme}
      aria-label="Ivory theme"
      aria-pressed={ivory}
      title={`Switch to ${ivory ? 'olive' : 'ivory'} theme`}
    >
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.3" />
        <path d="M10 3a7 7 0 0 0 0 14Z" fill="currentColor" />
      </svg>
    </button>
  )
}
