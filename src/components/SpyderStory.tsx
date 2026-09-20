import type { Photo } from '../spyderStory'

export function PhotoSlot({ photo, compact = false }: { photo: Photo; compact?: boolean }) {
  return (
    <figure className={`wp-photo${compact ? ' wp-photo--compact' : ''}`}>
      <div className="wp-photo-frame">
        {photo.src ? <img src={photo.src} alt={photo.alt ?? photo.label} loading="lazy" /> : (
          <div className="wp-placeholder">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" aria-hidden="true">
              <rect x="3" y="5" width="26" height="22" rx="2" />
              <circle cx="11" cy="12" r="2.5" />
              <path d="m4 25 8-8 5 5 5-8 7 11" />
            </svg>
            <span>{photo.label}</span>
            <small>photo placeholder</small>
          </div>
        )}
      </div>
      {!compact && <figcaption>{photo.caption}</figcaption>}
    </figure>
  )
}

