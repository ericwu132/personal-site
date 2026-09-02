import { Link } from 'react-router-dom'
import AnimatedContent from './AnimatedContent'

type NavItem = {
  label: string
  /** Internal route, or an external/absolute href. */
  to: string
  external?: boolean
}

// No "about" tab — the reveal on the home page is the introduction.
// Email, LinkedIn and GitHub live in SiteFooter rather than up here.
// Other profiles, should they ever earn a place:
//   devpost   https://devpost.com/ericwu132
//   instagram https://www.instagram.com/ericwu132/
const items: NavItem[] = [
  { label: 'about', to: '/about' },
  { label: 'work', to: '/work' },
  { label: 'projects', to: '/projects' },
  { label: 'notes', to: '/notes' },
  { label: 'resume', to: '/EricResumeExternal.pdf', external: true },
]

type NavProps = {
  /** Gate the cascade on the intro finishing. */
  show?: boolean
  /** Render the tabs in place at once, skipping the cascade. */
  skip?: boolean
  /** Milliseconds before the first tab starts descending. */
  baseDelay?: number
  /** Milliseconds added per tab, for the cascade. 0 moves all four together. */
  stagger?: number
}

export default function Nav({ show = true, skip = false, baseDelay = 0, stagger = 70 }: NavProps) {
  return (
    <nav className="nav">
      <ul>
        {items.map((item, i) => (
          <li key={item.label}>
            <AnimatedContent
              direction="down"
              show={show}
              skip={skip}
              delay={baseDelay + i * stagger}
            >
              {item.external ? (
                <a href={item.to} target="_blank" rel="noreferrer">
                  {item.label}
                </a>
              ) : (
                <Link to={item.to}>{item.label}</Link>
              )}
            </AnimatedContent>
          </li>
        ))}
      </ul>
    </nav>
  )
}
