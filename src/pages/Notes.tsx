import PageHeader from '../components/PageHeader'
import { Link } from 'react-router-dom'
import { notes } from '../content'

export default function Notes() {
  return (
    <main className="page">
      <PageHeader />
      <h1 className="page-title">notes</h1>
        {notes.length ? (
          <ul className="notes-list">
            {notes.map((note) => (
              <li key={note.slug}>
                <Link className="entry note-entry" to={`/notes/${note.slug}`}>
                  <div className="entry-text">
                    {note.readingList && <span className="note-kind">reading list</span>}
                    <h2>{note.title}</h2>
                    {note.date && <p className="meta">{note.date}</p>}
                    {note.summary && <p>{note.summary}</p>}
                  </div>
                  <span className="note-arrow" aria-hidden="true">↗</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : <p className="page-note">nothing here yet.</p>}
    </main>
  )
}
