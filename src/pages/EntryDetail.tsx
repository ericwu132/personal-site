import PageHeader from '../components/PageHeader'
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
          <p key={i}>{paragraph}</p>
        ))}
      </div>}
    </main>
  )
}
