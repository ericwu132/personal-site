import { Link } from 'react-router-dom'
import Signature from './Signature'

type PageHeaderProps = {
  backTo?: string
  backLabel?: string
}

export default function PageHeader({ backTo, backLabel = 'back' }: PageHeaderProps) {
  const hasParent = backTo && backTo !== '/'

  return (
    <header className="page-header">
      {hasParent ? (
        <Link className="back" to={backTo}>&larr; {backLabel}</Link>
      ) : <Link className="page-home" to="/" aria-label="Eric Wu — home">
        <span className="page-home-arrow" aria-hidden="true">&larr;</span>
        <Signature show skip />
      </Link>}
    </header>
  )
}
