import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AnimatedContent from './AnimatedContent'
import { useFinePointer } from '../useFinePointer'

/** External targets, mirroring the footer. */
const LINKS: Record<string, string> = {
  resume: '/EricResumeExternal.pdf',
  linkedin: 'https://www.linkedin.com/in/w-eric/',
  github: 'https://github.com/ericwu132',
  x: 'https://x.com/ericwu132',
  email: 'mailto:e95wu@uwaterloo.ca',
}

const ROUTES = ['work', 'projects', 'notes', 'about']

const HELP =
  'commands: work · projects · notes · about · resume · linkedin · github · x · email · whoami · clear'

const MAX_BUFFER = 40

type TerminalProps = {
  /** Gate on the hero reveal finishing. */
  show: boolean
  /** Render settled at once (returning visitor within this page load). */
  skip?: boolean
  /** Milliseconds after `show` before the hint fades in. */
  hintDelay?: number
}

/**
 * The typewriter, made typeable. A faint hint appears under the tabs; typing
 * anywhere on the home page fills a prompt line, Enter runs the command. The
 * tabs stay the real navigation — this is a layer for the curious, and it
 * never advertises itself on keyboardless devices.
 */
export default function Terminal({ show, skip = false, hintDelay = 1200 }: TerminalProps) {
  const navigate = useNavigate()
  const fine = useFinePointer()
  const [buffer, setBuffer] = useState('')
  const [response, setResponse] = useState('')
  // Clicking the hint swaps it for a blinking caret — the signal to start
  // typing. Typing without clicking works too; Escape hands the hint back.
  const [armed, setArmed] = useState(false)

  useEffect(() => {
    const run = () => {
      const cmd = buffer.trim().toLowerCase()
      if (!cmd) return
      setBuffer('')

      if (ROUTES.includes(cmd)) {
        navigate(`/${cmd}`)
        return
      }
      if (cmd === 'home' || cmd === 'cd') {
        setResponse('already here.')
        return
      }
      if (cmd === 'email') {
        setResponse('opening your mail app…')
        window.location.assign(LINKS.email)
        return
      }
      if (LINKS[cmd]) {
        setResponse(`opening ${cmd}…`)
        window.open(LINKS[cmd], '_blank', 'noopener,noreferrer')
        return
      }
      switch (cmd) {
        case 'help':
        case '?':
          setResponse(HELP)
          break
        case 'hi':
        case 'hello':
        case 'hey':
          setResponse('hi! nice meeting you')
          break
        case 'nihao':
        case '你好':
        case 'ni hao':
          setResponse('你好!')
          break
        case 'whoami':
          setResponse('eric wu. wait, that’s me! you’re you.')
          break
        case 'clear':
          setResponse('')
          break
        default:
          setResponse(`command not found: ${cmd} — try 'help'`)
      }
    }

    const onKey = (e: KeyboardEvent) => {
      // The prompt only listens once it has been clicked into, the way a real
      // input does — stray keystrokes on the page shouldn't land in it.
      if (!armed) return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const t = e.target as HTMLElement | null
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return

      if (e.key === 'Enter') {
        run()
      } else if (e.key === 'Escape') {
        setBuffer('')
        setResponse('')
        setArmed(false)
      } else if (e.key === 'Backspace') {
        setBuffer((b) => b.slice(0, -1))
      } else if (e.key.length === 1) {
        // A leading space would only scroll the page; require a real character
        // to start a command.
        if (buffer === '' && e.key === ' ') return
        e.preventDefault()
        setBuffer((b) => (b.length < MAX_BUFFER ? b + e.key : b))
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [armed, buffer, navigate])

  // Clicking anywhere outside the prompt line hands the hint back, like an
  // input losing focus.
  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if ((e.target as Element | null)?.closest?.('.terminal-line')) return
      setArmed(false)
      setBuffer('')
      setResponse('')
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [])

  return (
    <div className="terminal">
      <AnimatedContent show={show} skip={skip} delay={hintDelay}>
        {/* Decorative layer — the tabs above are the real navigation. */}
        <p className="terminal-line">
          {armed ? (
            <span aria-hidden="true">
              &gt; {buffer}
              <span className="cursor">|</span>
            </span>
          ) : fine ? (
            <button
              type="button"
              className="terminal-hint"
              onClick={() => setArmed(true)}
              aria-label="activate the typing prompt"
            >
              &gt; click here to type...
            </button>
          ) : (
            ' '
          )}
        </p>
        <p className="terminal-response" aria-live="polite">
          {response || ' '}
        </p>
      </AnimatedContent>
    </div>
  )
}
