import { Link, useParams } from 'react-router-dom'
import type { Entry } from '../content'
import NotFound from './NotFound'

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
      <Link className="back" to={basePath}>
        &larr; {heading}
      </Link>

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

      <div className="prose">
        {entry.body.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    </main>
  )
}
