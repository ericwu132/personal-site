import PageHeader from '../components/PageHeader'

type NotFoundProps = {
  backTo?: string
  backLabel?: string
}

export default function NotFound({ backTo = '/', backLabel = 'home' }: NotFoundProps) {
  return (
    <main className="page">
      <PageHeader backTo={backTo} backLabel={backLabel} />
      <h1 className="page-title">not found</h1>
      <p className="prose">There's nothing at this address.</p>
    </main>
  )
}
