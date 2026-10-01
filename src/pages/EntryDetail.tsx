import PageHeader from '../components/PageHeader'
import { Fragment } from 'react'
import { useParams } from 'react-router-dom'
import type { Entry } from '../content'
import NotFound from './NotFound'
import { PhotoSlot } from '../components/SpyderStory'
import { photos, sections } from '../spyderStory'

type EntryDetailProps = {
  /** Label and route of the list this entry belongs to. */
  heading: string
  basePath: string
  entries: Entry[]
}

/** A single dated entry — shared by /notes/:slug and /work/:slug. */
export default function EntryDetail({ heading, basePath, entries }: EntryDetailProps) {
  const { slug } = useParams()
  const entry = entries.find((e) => e.slug === slug)

  if (!entry) return <NotFound backTo={basePath} backLabel={heading} />

  return (
    <main className="page">
      <PageHeader backTo={basePath} backLabel={heading} />

      <h1 className="page-title">{entry.title}</h1>
      <p className="meta page-meta">
        {entry.org && (
          <>
            {entry.orgUrl ? (
              <a className="text-link" href={entry.orgUrl} target="_blank" rel="noreferrer">
                {entry.org}
              </a>
            ) : (
              entry.org
            )}
            {' · '}
          </>
        )}
        {entry.date}
      </p>

      {basePath === '/work' && entry.slug === 'spyder-controls' ? (
        <div className="spyder-story">
          {sections.map((section, index) => (
            <section className="spyder-story-section" key={section.title}>
              <h2>{section.title.toLowerCase()}</h2>
              <p>{section.text.toLowerCase()}</p>
              <PhotoSlot photo={photos[index]} />
            </section>
          ))}
        </div>
      ) : <div className="prose">
        {entry.body.map((paragraph, i) => (
          <Fragment key={i}>
          <p>
            {typeof paragraph === 'string' ? paragraph : paragraph.map((part, j) =>
              typeof part === 'string' ? part : (
                <a key={j} className="text-link" href={part.href} target="_blank" rel="noreferrer">
                  <strong>{part.label}</strong>
                </a>
              )
            )}
          </p>
          {entry.photoGroups?.filter((group) => group.afterParagraph === i).map((group) => (
            <div className="entry-photo-group" key={group.afterParagraph}>
              {group.heading && <h2>{group.heading}</h2>}
              <div className={`entry-gallery${group.photos.length === 1 ? ' entry-gallery--single' : ''}`}>
                {group.photos.map((photo) => (
                  <figure key={photo.src}>
                    <a href={photo.src} target="_blank" rel="noreferrer" aria-label={`View full photo: ${photo.caption}`}>
                      <img src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" />
                    </a>
                    <figcaption>{photo.caption}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          ))}
          </Fragment>
        ))}
      </div>}
    </main>
  )
}
