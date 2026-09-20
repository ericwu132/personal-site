import PageHeader from '../components/PageHeader'
import { Link } from 'react-router-dom'
import type { Entry } from '../content'

type EntryListProps = {
  heading: string
  /** Route these entries live under, e.g. '/notes'. */
  basePath: string
  entries: Entry[]
  /** Shown in place of the list while there is nothing to list yet. */
  emptyNote?: string
}

/** Dated list of writing — shared by /notes and /work. */
export default function EntryList({ heading, basePath, entries, emptyNote }: EntryListProps) {
  // Once real entries land, the note disappears on its own.
  if (entries.length === 0 && emptyNote) {
    return (
      <main className="page">
        <PageHeader />

        <h1 className="page-title">{heading}</h1>
        <p className="page-note">{emptyNote}</p>
      </main>
    )
  }

  return (
    <main className="page">
      <PageHeader />

      <h1 className="page-title">{heading}</h1>

      <ul className="entries">
        {entries.map((entry) => (
          <li key={entry.slug}>
            {basePath === '/work' ? (
              <Link className="work-entry" to={`${basePath}/${entry.slug}`}>
                <div className="work-entry-row">
                  <div>
                    <h2>{entry.org ?? entry.title}</h2>
                    <p>{entry.title} · {entry.date}</p>
                    {entry.summary && <p className="work-entry-result">{entry.summary}</p>}
                  </div>
                  {entry.logo && <img className="entry-logo" src={entry.logo} alt="" />}
                </div>
              </Link>
            ) : <Link className="entry" to={`${basePath}/${entry.slug}`}>
              <div className="entry-text">
                <h2>{entry.title}</h2>
                {/* Plain text here, never a link: the whole row is already an
                    anchor, and nesting one inside it is invalid HTML. */}
                <p className="meta">
                  {entry.org ? `${entry.org} · ${entry.date}` : entry.date}
                </p>
              </div>

              {/* alt="" on purpose — the org name sits right beside it, so
                  announcing it again is noise for a screen reader. */}
              {entry.logo && <img className="entry-logo" src={entry.logo} alt="" loading="lazy" />}
            </Link>}
          </li>
        ))}
      </ul>
    </main>
  )
}
