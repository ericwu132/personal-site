import { useEffect, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import EntryList from './pages/EntryList'
import EntryDetail from './pages/EntryDetail'
import About from './pages/About'
import NotFound from './pages/NotFound'
import SiteFooter from './components/SiteFooter'
import { notes, work } from './content'
import { useReducedMotion } from './useReducedMotion'

/** Must match the .route transition duration in index.css. */
const FADE_MS = 220

export default function App() {
  const location = useLocation()
  const reduced = useReducedMotion()

  // The route currently on screen, which lags behind the URL for one fade.
  const [displayed, setDisplayed] = useState(location)
  const leaving = location.pathname !== displayed.pathname

  useEffect(() => {
    if (!leaving) return
    const swap = () => {
      setDisplayed(location)
      window.scrollTo(0, 0)
    }
    if (reduced) {
      swap()
      return
    }
    // Let the outgoing page finish fading before swapping in the new one.
    const timer = setTimeout(swap, FADE_MS)
    return () => clearTimeout(timer)
  }, [leaving, location, reduced])

  return (
    <>
      <div className="route" data-leaving={leaving || undefined}>
        <Routes location={displayed}>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route
            path="/work"
            element={<EntryList heading="work" basePath="/work" entries={work} />}
          />
          <Route
            path="/work/:slug"
            element={<EntryDetail heading="work" basePath="/work" entries={work} />}
          />
          <Route
            path="/notes"
            element={
              <EntryList
                heading="notes"
                basePath="/notes"
                entries={notes}
                emptyNote="work in progress! i’m working hard to get these pushed out."
              />
            }
          />
          <Route
            path="/notes/:slug"
            element={<EntryDetail heading="notes" basePath="/notes" entries={notes} />}
          />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      {/* Outside .route, so it stays put instead of flickering on navigation. */}
      <SiteFooter />
    </>
  )
}
