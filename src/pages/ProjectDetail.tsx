import { Link, useParams } from 'react-router-dom'
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
      <Link className="back" to="/projects">
        &larr; projects
      </Link>

      <h1 className="page-title">
        {project.title} <span className="meta">{project.year}</span>
      </h1>

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
