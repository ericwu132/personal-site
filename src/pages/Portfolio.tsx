import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import ProjectPhotos from '../components/ProjectPhotos'
import { PhotoSlot } from '../components/SpyderStory'
import { photos as spyderPhotos, type Photo } from '../spyderStory'
import { projects, work, type Project } from '../content'
import { useReducedMotion } from '../useReducedMotion'

// Blender stays separate from the engineering portfolio.
const categories = ['electromechanical', 'mechanical', 'electrical', 'blender'] as const
type Category = (typeof categories)[number]

type PortfolioEntry = {
  slug: string
  title: string
  blurb: string
  categories: Category[]
  project?: Project
  photoGroups?: Project['photoGroups']
  placeholders?: string[]
  compact?: boolean
  photos?: Photo[]
  detailsHref?: string
  gallery?: 'schematics' | 'uwfe' | 'blender' | 'watonomous'
}

function existingProject(slug: string, categories: Category[], blurb?: string): PortfolioEntry {
  const project = projects.find((item) => item.slug === slug)!
  return { slug, title: project.title, blurb: blurb ?? project.blurb, categories, project }
}

const entries: PortfolioEntry[] = [
  {
    slug: 'spyder-controls',
    title: 'spyder controls',
    categories: ['electromechanical', 'mechanical', 'electrical'],
    blurb: 'pcba test fixtures i designed, built, and troubleshot at spyder controls. improvements to the ssp24 test jig reduced false failures by over 70%. i also built a jig to verify the marine override panel’s three circuit breakers, with results displayed on a touchscreen.',
    photos: spyderPhotos,
    detailsHref: '/work/spyder-controls',
  },
  {
    ...existingProject('smart-tatami', ['electrical'], 'undergraduate research at the university of waterloo: a pressure-sensing judo mat that measures contact location and relative force during throws. i’m developing the velostat sensor array and a custom altium pcb for scanning and reading the sensors.'),
    gallery: 'schematics',
  },
  existingProject('omni-assist', ['mechanical', 'electrical'], 'an autonomous wheelchair attachment built at YHack. i designed the wheel hubs, motor mounts, and ratcheting clamps in solidworks, and assembled the motor electronics and aluminium frame. 1st in hardware and best use of viam.'),
  {
    slug: 'watonomous',
    title: 'watonomous humanoid',
    categories: ['mechanical'],
    blurb: 'mechanical design for watonomous\'s bipedal humanoid. i designed and prototyped simplified cnc leg linkages in solidworks and onshape, reducing part count by 66%. i also evaluated bearings and spacers for the leg joints, considering loads, rpm limits, and fit tolerances for dynamic walking.',
    detailsHref: '/work/watonomous',
    gallery: 'watonomous',
    photoGroups: [{
      afterParagraph: 0,
      photos: [
        { src: '/watonomous-leg-linkage.png', alt: 'CAD model of the WATonomous humanoid leg linkage assembly, showing its links, joints, and mounting points.', caption: 'leg linkage assembly.', width: 980, height: 425, maxWidth: 620 },
        { src: '/watonomous-humanoid-legs.png', alt: 'CAD model of the paired WATonomous humanoid legs with articulated joints and feet.', caption: 'bipedal humanoid legs.', width: 450, height: 769, maxWidth: 270 },
      ],
    }],
  },
  {
    slug: 'kitchenbot',
    title: 'kitchenbot',
    categories: ['mechanical'],
    blurb: 'cad of the kitchenbot arm, showing its joints, motors, and mounting brackets.',
    photoGroups: [{
      afterParagraph: 0,
      photos: [
        { src: '/kitchenbot-arm-cad.png', alt: 'CAD model of the Kitchenbot robotic arm showing its articulated joints, motors, and mounting brackets.', caption: 'cad of the kitchenbot arm.', width: 1107, height: 1026 },
      ],
    }],
  },
  {
    slug: 'midnight-sun',
    title: 'buck boost converter',
    categories: ['electrical'],
    blurb: 'buck-boost converter for midnight sun, from the schematic and pcb routing to the 3d board view.',
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
  {
    slug: 'waterloo-formula-electric',
    title: 'waterloo formula electric',
    categories: ['mechanical'],
    blurb: work.find((entry) => entry.slug === 'waterloo-formula-electric')!.summary!,
    detailsHref: '/work/waterloo-formula-electric',
    gallery: 'uwfe',
    photoGroups: [{
      afterParagraph: 0,
      photos: work.find((entry) => entry.slug === 'waterloo-formula-electric')!.photoGroups!
        .flatMap((group) => group.photos.map((photo) => ({ ...photo, caption: '' }))),
    }],
  },
  existingProject('vex-robotics', ['mechanical'], 'competition robots for team 3388c. i designed the robots in fusion 360, from custom laser-cut parts and a winch climbing mechanism to tightly packaged odometry pods. provincial champions and worlds competitors in 2024.'),
  {
    slug: 'blender-saturn',
    title: 'saturn',
    categories: ['blender'],
    blurb: 'a saturn scene in blender, from the basic sphere and ring meshes to a textured render. a study in mesh modeling, shader materials, and lighting, with banded colors across the planet and concentric detail in the rings.',
    gallery: 'blender',
    photoGroups: [{ afterParagraph: 0, photos: [
      { src: '/blender/saturn-wip.png', alt: 'Blender solid viewport showing the untextured Saturn sphere, ring mesh, and a moon.', caption: 'wip — blocking out the planet, rings, and moon in the solid viewport.', width: 815, height: 410 },
      { src: '/blender/saturn.png', alt: 'Rendered Saturn with golden bands, detailed rings, and small moons against a star field.', caption: 'render — materials, lighting, and a star-field background.', width: 1920, height: 1080 },
    ] }],
  },
  {
    slug: 'blender-black-hole',
    title: 'black hole',
    categories: ['blender'],
    blurb: 'an attempt to recreate gargantua, the black hole from interstellar. i used the shader editor with texture coordinate, mapping, and spherical gradient texture nodes feeding a principled volume shader, then developed the glowing accretion disk and the curved halo around the dark center.',
    gallery: 'blender',
    photoGroups: [{ afterParagraph: 0, photos: [
      { src: '/blender/black-hole-wip.png', alt: 'Blender viewport and shader editor showing an early black-hole scene and its volume node setup.', caption: 'wip — testing the spherical gradient and principled volume node setup.', width: 1920, height: 1080, cropBottom: 40 },
      { src: '/blender/black-hole.png', alt: 'Interstellar-inspired black hole with a pale blue accretion disk and a bright curved halo.', caption: 'render — a blue accretion disk and an interstellar-inspired silhouette.', width: 1210, height: 678 },
    ] }],
  },
  {
    slug: 'blender-earth',
    title: 'earth',
    categories: ['blender'],
    blurb: 'an earth render in blender, exploring image textures, cloud detail, and atmospheric shading. the close-up composition puts the focus on the blue atmospheric rim and the transition from daylight into shadow.',
    gallery: 'blender',
    photoGroups: [{ afterParagraph: 0, photos: [
      { src: '/blender/earth.png', alt: 'Close-up render of Earth showing continents, clouds, a blue atmospheric rim, and the day-night boundary.', caption: 'render — surface textures, clouds, and the atmospheric rim.', width: 1920, height: 1080 },
    ] }],
  },
]

/** Must match the .portfolio-panel[data-leaving] transition in index.css. */
const LEAVE_MS = 180

// Electromechanical includes all engineering projects, excluding Blender.
const inTab = (entry: PortfolioEntry, category: Category) =>
  category === 'electromechanical' ? !entry.categories.includes('blender') : entry.categories.includes(category)

const counts = Object.fromEntries(
  categories.map((category) => [category, entries.filter((entry) => inTab(entry, category)).length]),
) as Record<Category, number>

type IndicatorBox = { x: number; y: number; w: number; h: number }

export default function Portfolio() {
  // `active` is the tab the reader picked; `shown` is the one on screen, which
  // lags behind for one fade so the old projects can leave before the new
  // ones arrive (same idea as the route fade in App.tsx). Plain state, not a
  // ?tab= param: App renders routes from a location that only updates on
  // pathname changes, so a search-param change would never reach this page.
  const [active, setActive] = useState<Category>(categories[0])
  const [shown, setShown] = useState<Category>(categories[0])
  const leaving = active !== shown
  const visible = entries.filter((entry) => inTab(entry, shown))
  if (shown === 'mechanical') {
    visible.sort((a, b) => Number(a.slug === 'spyder-controls') - Number(b.slug === 'spyder-controls'))
  }
  const reduced = useReducedMotion()

  const layoutRef = useRef<HTMLDivElement>(null)
  const tablistRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [box, setBox] = useState<IndicatorBox | null>(null)
  const [indicatorReady, setIndicatorReady] = useState(false)

  useEffect(() => {
    if (!leaving) return
    const swap = () => {
      setShown(active)
      // If the reader has scrolled into the list, bring them back to its top
      // so the new tab starts at its first project, not mid-page. The panel is
      // invisible at this point, so an instant jump reads as part of the fade.
      const layout = layoutRef.current
      if (layout && layout.getBoundingClientRect().top < 0) {
        layout.scrollIntoView({ block: 'start' })
      }
    }
    if (reduced) {
      swap()
      return
    }
    const timer = setTimeout(swap, LEAVE_MS)
    return () => clearTimeout(timer)
  }, [leaving, active, reduced])

  // Slide the accent marker to the selected tab. Re-measured whenever a tab
  // changes size: web fonts loading, or the rail/row breakpoint flipping.
  useLayoutEffect(() => {
    const measure = () => {
      const tab = tabRefs.current[categories.indexOf(active)]
      if (!tab) return
      setBox({ x: tab.offsetLeft, y: tab.offsetTop, w: tab.offsetWidth, h: tab.offsetHeight })
    }
    measure()
    const observer = new ResizeObserver(measure)
    if (tablistRef.current) observer.observe(tablistRef.current)
    tabRefs.current.forEach((tab) => tab && observer.observe(tab))
    return () => observer.disconnect()
  }, [active])

  // Turn the slide transition on only after the first placement, so the
  // marker doesn't sweep in from the corner on page load.
  useEffect(() => {
    if (!box || indicatorReady) return
    const frame = requestAnimationFrame(() => setIndicatorReady(true))
    return () => cancelAnimationFrame(frame)
  }, [box, indicatorReady])

  const select = (category: Category) => setActive(category)

  const indicatorStyle = box
    ? ({ '--x': `${box.x}px`, '--y': `${box.y}px`, '--w': `${box.w}px`, '--h': `${box.h}px` } as CSSProperties)
    : undefined

  // Arrow keys move between tabs, per the WAI-ARIA tabs pattern.
  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = categories.length - 1
    const next =
      event.key === 'ArrowDown' || event.key === 'ArrowRight' ? (index === last ? 0 : index + 1)
      : event.key === 'ArrowUp' || event.key === 'ArrowLeft' ? (index === 0 ? last : index - 1)
      : event.key === 'Home' ? 0
      : event.key === 'End' ? last
      : null
    if (next === null) return
    event.preventDefault()
    select(categories[next])
    tabRefs.current[next]?.focus()
  }

  return (
    <main className="page portfolio-page">
      <PageHeader />
      <h1 className="page-title">portfolio</h1>
      <p className="portfolio-intro">robots, electronics, and things i’ve built. a collection of projects, from the first cad sketch to the working prototype.</p>

      <div className="portfolio-layout" ref={layoutRef}>
      <nav className="portfolio-tabs-rail" aria-label="Portfolio categories">
        <div className="portfolio-tabs-card">
        <p className="portfolio-tabs-label" aria-hidden="true">categories</p>
        <div className="portfolio-tabs" role="tablist" ref={tablistRef}>
          {categories.map((category, index) => (
            <button
              key={category}
              ref={(el) => { tabRefs.current[index] = el }}
              type="button"
              role="tab"
              id={`portfolio-tab-${category}`}
              aria-selected={active === category}
              aria-controls="portfolio-panel"
              tabIndex={active === category ? 0 : -1}
              onClick={() => select(category)}
              onKeyDown={(event) => onTabKeyDown(event, index)}
            >
              <span>{category}</span>
              <span className="portfolio-tab-count" aria-hidden="true">{counts[category]}</span>
            </button>
          ))}
          <span
            className="portfolio-tab-indicator"
            aria-hidden="true"
            style={indicatorStyle}
            data-visible={box ? '' : undefined}
            data-ready={indicatorReady ? '' : undefined}
          />
        </div>
        </div>
      </nav>

      <div
        className="portfolio-panel"
        id="portfolio-panel"
        role="tabpanel"
        aria-labelledby={`portfolio-tab-${shown}`}
        aria-busy={leaving || undefined}
        data-leaving={leaving || undefined}
        key={shown}
      >
      {visible.map((entry, index) => (
        <section
          className={`portfolio-project${entry.compact ? ' portfolio-project--compact' : ''}${entry.gallery ? ` portfolio-project--${entry.gallery}` : ''}`}
          key={entry.slug}
          aria-labelledby={`portfolio-${entry.slug}`}
          // Staggers the entrance; capped so lower projects aren't left waiting.
          style={{ '--i': Math.min(index, 4) } as CSSProperties}
        >
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
      </div>
      </div>
    </main>
  )
}
