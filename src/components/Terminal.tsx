import { useRef, useState } from 'react'
import AnimatedContent from './AnimatedContent'

/**
 * Where messages go. The site is static, so a message can only reach an inbox
 * via a form service: the page POSTs here and Formspree emails Eric.
 *
 * This is a plain JSON POST rather than @formspree/react's `useForm`, because
 * the prompt is one bare input rather than a <form> with named fields.
 * Formspree's AJAX endpoint accepts JSON directly, so the library would add a
 * dependency and buy nothing.
 *
 * Public by design: a Formspree form id is safe in a public repo.
 */
const FORM_ENDPOINT = 'https://formspree.io/f/xyeyjdek'

/** Web3Forms only. Formspree identifies the form by its URL alone. */
const ACCESS_KEY = ''

/** First email address in the message, if the sender included one. */
const EMAIL_RE = /[^\s@]+@[^\s@]+\.[^\s@]{2,}/

/** A message, not a command — 40 characters was a command's length. */
const MAX_BUFFER = 500

type Status = 'idle' | 'sending' | 'sent' | 'error'

/**
 * Minimum gap between two successful sends from one browser.
 *
 * This is a speed bump, not a security control — anyone willing to open
 * devtools or a private window walks straight past it. It exists to stop
 * casual repeat-sending. The real ceiling is Formspree's own spam filtering
 * and the 50-per-month cap on the free plan.
 */
const COOLDOWN_MS = 30_000
const LAST_SENT_KEY = 'terminal:lastSent'

/** Milliseconds still to wait, or 0. localStorage access is guarded: private
 *  browsing and blocked site data both throw on read. */
function cooldownRemaining(): number {
  try {
    const last = Number(localStorage.getItem(LAST_SENT_KEY))
    if (!last) return 0
    // A clock change could put `last` in the future; treat that as expired
    // rather than locking the visitor out indefinitely.
    const elapsed = Date.now() - last
    if (elapsed < 0) return 0
    return Math.max(0, COOLDOWN_MS - elapsed)
  } catch {
    return 0
  }
}

function markSent() {
  try {
    localStorage.setItem(LAST_SENT_KEY, String(Date.now()))
  } catch {
    // No storage to remember by; the cooldown just won't survive a reload.
  }
}

async function sendMessage(message: string): Promise<boolean> {
  if (!FORM_ENDPOINT) {
    // Not configured: never fire a request at an endpoint that isn't there,
    // and never claim success. If this ships unconfigured, a visitor must be
    // told their message didn't land rather than being quietly dropped.
    console.warn(
      '[terminal] FORM_ENDPOINT is empty — nothing was sent. Paste a Formspree ' +
        'form URL or Web3Forms key in Terminal.tsx to enable messages. Message was:',
      message,
    )
    return false
  }
  const body: Record<string, string> = {
    message,
    // Formspree reads _subject for the email's subject line.
    _subject: 'a message from your site',
  }
  // The prompt invites people to include their email for a reply. Lifting it
  // into `email` makes Formspree set Reply-To, so replying just works — the
  // full message still carries it either way if the match is wrong.
  const sender = message.match(EMAIL_RE)?.[0]
  if (sender) body.email = sender
  if (ACCESS_KEY) body.access_key = ACCESS_KEY

  const res = await fetch(FORM_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  })
  return res.ok
}

type TerminalProps = {
  /** Gate on the hero reveal. */
  show: boolean
  /** Render settled at once (returning visitor within this page load). */
  skip?: boolean
  /** Milliseconds after `show` before the prompt fades in. */
  hintDelay?: number
}

/**
 * A message box dressed as a terminal line.
 *
 * It is a real <input>, not a keystroke buffer painted onto a <span>. That is
 * what makes it work on a phone — tapping an input is the only thing that
 * opens the on-screen keyboard — and it comes with paste, selection, and IME
 * (so the 你好 greeting can actually be typed back) for free. It also gives
 * the "can't type until you click in" behaviour natively: an unfocused input
 * receives nothing.
 */
export default function Terminal({ show, skip = false, hintDelay = 1200 }: TerminalProps) {
  const [buffer, setBuffer] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  // Held separately from `status` so the cooldown can count down in its text.
  const [response, setResponse] = useState('')
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const send = async () => {
    const message = buffer.trim()
    if (!message || status === 'sending') return

    const wait = cooldownRemaining()
    if (wait > 0) {
      // Keep what they typed — they only have to wait, not retype.
      setResponse(`slow down! one message every 30s. try again in ${Math.ceil(wait / 1000)}s.`)
      return
    }

    setStatus('sending')
    setResponse('sending…')
    setBuffer('')
    try {
      if (await sendMessage(message)) {
        markSent()
        setStatus('sent')
        setResponse('sent! thanks for the note.')
      } else {
        setStatus('error')
        setResponse('that didn’t go through — the mail icon below works too.')
      }
    } catch {
      setStatus('error')
      setResponse('that didn’t go through — the mail icon below works too.')
    }
  }

  return (
    <div className="terminal">
      <AnimatedContent show={show} skip={skip} delay={hintDelay}>
        <p className="terminal-line">
          <span className="terminal-arrow" aria-hidden="true">
            &gt;
          </span>
          <input
            ref={inputRef}
            className="terminal-input"
            type="text"
            value={buffer}
            placeholder="leave me a message…"
            aria-label="leave me a message"
            maxLength={MAX_BUFFER}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="send"
            onChange={(e) => setBuffer(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                void send()
              } else if (e.key === 'Escape') {
                setBuffer('')
                setResponse('')
                inputRef.current?.blur()
              }
            }}
          />
        </p>
        <p className="terminal-response" aria-live="polite">
          {response || (focused ? 'enter to send! add your email if you’d like me to reply.' : ' ')}
        </p>
      </AnimatedContent>
    </div>
  )
}
