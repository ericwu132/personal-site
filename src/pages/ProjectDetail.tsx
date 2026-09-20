import PageHeader from '../components/PageHeader'
import { useParams } from 'react-router-dom'
import Thumb from '../components/Thumb'
import Embed from '../components/Embed'
import { findProject } from '../content'
import NotFound from './NotFound'

export default function ProjectDetail() {
  const { slug } = useParams()
  const project = findProject(slug)

  if (!project) return <NotFound backTo="/projects" backLabel="projects" />

  return (
    <main className="page">
      <PageHeader backTo="/projects" backLabel="projects" />

      <div className={project.devpostUrl ? 'project-heading' : undefined}>
      <h1 className="page-title">
        {project.title} <span className="meta">{project.year}</span>
      </h1>
      {project.devpostUrl && (
        <a className="project-devpost" href={project.devpostUrl} target="_blank" rel="noreferrer">
          Devpost
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M14 4h6v6M20 4 10 14M10 4H4v16h16v-6" />
          </svg>
          <span className="visually-hidden"> (opens in a new tab)</span>
        </a>
      )}
      </div>

      {project.video ? (
        <Embed src={project.video} title={project.title} />
      ) : (
        <Thumb src={project.image} alt={project.title} ratio="3 / 2" />
      )}

      <div className="prose">
        <p className="lede">{project.blurb}</p>
        {project.body.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}

        {project.links && project.links.length > 0 && (
          <ul className="links">
            {project.links.map((link) => (
              <li key={link.href}>
                <a href={link.href} target="_blank" rel="noreferrer">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
