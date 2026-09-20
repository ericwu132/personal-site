import PageHeader from '../components/PageHeader'
import { Link } from 'react-router-dom'
import Thumb from '../components/Thumb'
import { projects } from '../content'

export default function Projects() {
  return (
    <main className="page">
      <PageHeader />

      <h1 className="page-title">projects</h1>

      <ul className="cards">
        {projects.map((project) => (
          <li key={project.slug}>
            <Link className="card" to={`/projects/${project.slug}`}>
              <Thumb src={project.image} alt={project.title} />
              <div className="card-text">
                <h2>
                  {project.title} <span className="meta">{project.year}</span>
                </h2>
                <p>{project.blurb}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
