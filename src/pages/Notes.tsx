import PageHeader from '../components/PageHeader'
import { Link } from 'react-router-dom'
import { notes } from '../content'

export default function Notes() {
  return (
    <main className="page">
      <PageHeader />
      <h1 className="page-title">notes</h1>
        {notes.length ? (
          <ul className="entries">
            {notes.map((note) => (
              <li key={note.slug}>
                <Link className="entry" to={`/notes/${note.slug}`}>
                  <div className="entry-text">
                    <h2>{note.title}</h2>
                    <p className="meta">{note.date}</p>
                    {note.summary && <p>{note.summary}</p>}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : <p className="page-note">nothing here yet.</p>}
    </main>
  )
}
