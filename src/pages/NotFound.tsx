import { Link } from 'react-router-dom'

type NotFoundProps = {
  backTo?: string
  backLabel?: string
}

export default function NotFound({ backTo = '/', backLabel = 'home' }: NotFoundProps) {
  return (
    <main className="page">
      <Link className="back" to={backTo}>
        &larr; {backLabel}
      </Link>
      <h1 className="page-title">not found</h1>
      <p className="prose">There's nothing at this address.</p>
    </main>
  )
}
