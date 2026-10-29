import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import ProjectPhotos from '../components/ProjectPhotos'
import { PhotoSlot } from '../components/SpyderStory'
import { photos as spyderPhotos, type Photo } from '../spyderStory'
import { projects, type Project } from '../content'

type PortfolioEntry = {
  slug: string
  title: string
  blurb: string
  project?: Project
  photoGroups?: Project['photoGroups']
  placeholders?: string[]
  compact?: boolean
  photos?: Photo[]
  detailsHref?: string
}

function existingProject(slug: string, blurb?: string): PortfolioEntry {
  const project = projects.find((item) => item.slug === slug)!
  return { slug, title: project.title, blurb: blurb ?? project.blurb, project }
}

const entries: PortfolioEntry[] = [
  {
    slug: 'spyder-controls',
    title: 'spyder controls',
    blurb: 'pcba test fixtures i designed, built, and troubleshot at spyder controls. improvements to the ssp24 test jig reduced false failures by over 70%. i also built a jig to verify the marine override panel’s three circuit breakers, with results displayed on a touchscreen.',
    photos: spyderPhotos,
    detailsHref: '/work/spyder-controls',
  },
  {
    ...existingProject('smart-tatami', 'undergraduate research at the university of waterloo: a pressure-sensing judo mat that measures contact location and relative force during throws. i’m developing the velostat sensor array and a custom altium pcb for scanning and reading the sensors.'),
  },
  {
    slug: 'midnight-sun',
    title: 'midnight sun — buck-boost converter',
    blurb: 'buck-boost converter schematic and pcb layout for midnight sun.',
    photoGroups: [{
      afterParagraph: 0,
      photos: [
        { src: '/buck-boost-3d.png', alt: '3D view of the buck-boost converter PCB', caption: '3d view', width: 865, height: 342 },
        { src: '/buck-boost-schematic.png', alt: 'Buck-boost converter circuit schematic', caption: 'schematic', width: 1303, height: 811 },
        { src: '/buck-boost-layout.png', alt: 'Buck-boost converter PCB layout and routing', caption: 'layout', width: 1609, height: 649 },
      ],
    }],
    compact: true,
  },
  existingProject('omni-assist', 'an autonomous wheelchair attachment built at YHack. i designed the wheel hubs, motor mounts, and ratcheting clamps in solidworks, and assembled the motor electronics and aluminium frame. 1st in hardware and best use of viam.'),
  {
    slug: 'kitchenbot',
    title: 'kitchenbot',
    blurb: '',
    photoGroups: [{
      afterParagraph: 0,
      photos: [
        { src: '/kitchenbot-arm-cad.png', alt: 'CAD model of the Kitchenbot robotic arm showing its articulated joints, motors, and mounting brackets.', caption: 'cad of the kitchenbot arm.', width: 1107, height: 1026 },
      ],
    }],
  },
  existingProject('vex-robotics', 'competition robots for team 3388c. i designed the robots in fusion 360, from custom laser-cut parts and a winch climbing mechanism to tightly packaged odometry pods. provincial champions and worlds competitors in 2024.'),
]

export default function Portfolio() {
  return (
    <main className="page portfolio-page">
      <PageHeader />
      <h1 className="page-title">portfolio</h1>
      <p className="portfolio-intro">robots, electronics, and things i’ve built. a collection of projects, from the first cad sketch to the working prototype.</p>

      {entries.map((entry) => (
        <section className={`portfolio-project${entry.compact ? ' portfolio-project--compact' : ''}`} key={entry.slug} aria-labelledby={`portfolio-${entry.slug}`}>
          <div className="portfolio-heading">
            <h2 id={`portfolio-${entry.slug}`}>{entry.title}</h2>
            {entry.project && <Link className="text-link portfolio-detail" to={`/projects/${entry.slug}`}>project details <span aria-hidden="true">↗</span></Link>}
            {entry.detailsHref && <Link className="text-link portfolio-detail" to={entry.detailsHref}>work details <span aria-hidden="true">↗</span></Link>}
          </div>
          {entry.blurb && <p className="portfolio-blurb">{entry.blurb}</p>}

          {entry.photos && (
            <div className="spyder-story portfolio-fixture-photos">
              {entry.photos.map((photo) => <PhotoSlot key={photo.label} photo={photo} />)}
            </div>
          )}

          {entry.photoGroups ? (
            <ProjectPhotos groups={entry.photoGroups} />
          ) : entry.project?.photoGroups?.length ? (
            <ProjectPhotos groups={entry.project.photoGroups} />
          ) : entry.project?.image ? (
            <ProjectPhotos groups={[{ afterParagraph: 0, photos: [{ src: entry.project.image, alt: entry.title, caption: '', width: 1200, height: 900 }] }]} />
          ) : null}

          {entry.placeholders && (
            <div className={`portfolio-placeholders${entry.placeholders.length === 3 ? ' portfolio-placeholders--three' : ''}`}>
              {entry.placeholders.map((label) => (
                <figure key={label}>
                  <div className="portfolio-placeholder">
                    <span>{label}</span>
                    <small>image coming soon</small>
                  </div>
                </figure>
              ))}
            </div>
          )}
        </section>
      ))}
    </main>
  )
}
