import type { Project } from '../content'

/** Shared by project write-ups and the portfolio so photo arrangements stay in sync. */
export default function ProjectPhotos({ groups }: { groups: NonNullable<Project['photoGroups']> }) {
  return groups.map((group) => (
    <div className="entry-photo-group project-photo-group" key={group.afterParagraph}>
      {group.heading && <h2>{group.heading}</h2>}
      <div className={`entry-gallery project-gallery${group.photos.length === 1 ? ' entry-gallery--single' : ''}${group.layout ? ` project-gallery--${group.layout}` : ''}`}>
        {group.photos.map((photo) => (
          <figure key={photo.src} style={photo.maxWidth ? { maxWidth: photo.maxWidth, width: '100%', marginInline: 'auto' } : undefined}>
            <a href={photo.src} target="_blank" rel="noreferrer" aria-label={`View full photo: ${photo.caption || photo.alt}`}>
              <span style={{ display: 'block', overflow: 'hidden', borderRadius: 3, aspectRatio: photo.cropBottom ? `${photo.width} / ${photo.height - photo.cropBottom}` : undefined }}>
                <img src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" />
              </span>
            </a>
            {photo.caption && <figcaption>{photo.caption}</figcaption>}
          </figure>
        ))}
      </div>
    </div>
  ))
}
