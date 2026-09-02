import { Link } from 'react-router-dom'
import type { Entry } from '../content'

type EntryListProps = {
  heading: string
  /** Route these entries live under, e.g. '/notes'. */
  basePath: string
  entries: Entry[]
}

/** Dated list of writing — shared by /notes and /work. */
export default function EntryList({ heading, basePath, entries }: EntryListProps) {
  return (
    <main className="page">
      <Link className="back" to="/">
        &larr; back
      </Link>

      <h1 className="page-title">{heading}</h1>

      <ul className="entries">
        {entries.map((entry) => (
          <li key={entry.slug}>
            <Link className="entry" to={`${basePath}/${entry.slug}`}>
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
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
