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

      {!project.photoGroups?.length && (project.video ? (
        <Embed src={project.video} title={project.title} />
      ) : (
        <Thumb src={project.image} alt={project.title} ratio="3 / 2" />
      ))}

      <div className="prose">
        <p className="lede">{project.blurb}</p>
        {project.body.map((paragraph, i) => (
          <p key={i}>
            {typeof paragraph === 'string' ? paragraph : paragraph.map((part, j) => (
              typeof part === 'string' ? part : (
                <a key={j} className="text-link" href={part.href} target="_blank" rel="noreferrer">{part.label}</a>
              )
            ))}
          </p>
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
          {project.photoGroups?.map((group) => (
            <div className="entry-photo-group project-photo-group" key={group.afterParagraph}>
              {group.heading && <h2>{group.heading}</h2>}
              <div className={`entry-gallery project-gallery${group.photos.length === 1 ? ' entry-gallery--single' : ''}`}>
                {group.photos.map((photo) => (
                  <figure key={photo.src}>
                    <a href={photo.src} target="_blank" rel="noreferrer" aria-label={`View full photo: ${photo.caption}`}>
                      <span style={{ display: 'block', overflow: 'hidden', borderRadius: 3, aspectRatio: photo.cropBottom ? `${photo.width} / ${photo.height - photo.cropBottom}` : undefined }}>
                        <img src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" />
                      </span>
                    </a>
                    <figcaption>{photo.caption}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          ))}
      </div>
    </main>
  )
}
