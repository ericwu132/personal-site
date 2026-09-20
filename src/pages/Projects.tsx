import PageHeader from '../components/PageHeader'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Thumb from '../components/Thumb'
import { projects } from '../content'

const filters = ['all', 'electromechanical', 'software'] as const

export default function Projects() {
  const [filter, setFilter] = useState<(typeof filters)[number]>('all')
  const visibleProjects = projects.filter((project) => filter === 'all' || project.category === filter)
  return (
    <main className="page">
      <PageHeader />

      <div className="projects-heading">
        <h1 className="page-title">projects</h1>
        <div className="project-filters" role="group" aria-label="Filter projects">
          {filters.map((category) => (
            <button key={category} type="button" aria-pressed={filter === category} aria-controls="project-list" onClick={() => setFilter(category)}>
              {category}
            </button>
          ))}
        </div>
      </div>
      <p className="visually-hidden" role="status">{visibleProjects.length} projects shown</p>

      <ul className="cards" id="project-list">
        {visibleProjects.map((project) => (
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
