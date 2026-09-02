import { Link } from 'react-router-dom'

export default function About() {
  return (
    <main className="page">
      <Link className="back" to="/">
        &larr; back
      </Link>

      <h1 className="page-title">about</h1>

      <p className="page-note">
        work in progress! i’m working hard to get this pushed out.
      </p>
    </main>
  )
}
