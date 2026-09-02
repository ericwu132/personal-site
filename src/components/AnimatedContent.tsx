import { useEffect, useState, type ReactNode } from 'react'
import { useReducedMotion } from '../useReducedMotion'

type AnimatedContentProps = {
  children: ReactNode
  /**
   * 'none' is a plain fade. 'up' enters from below and rises; 'down' enters
   * from above and descends.
   */
  direction?: 'up' | 'down' | 'none'
  /** Gate the reveal on something else finishing. */
  show?: boolean
  /** Render in the final resting state at once, skipping the animation. */
  skip?: boolean
  /** How far, in pixels, it travels to reach its resting place. */
  distance?: number
  delay?: number
  duration?: number
  className?: string
}

/**
 * Slide-and-fade reveal. Both directions resolve to translateY(0), so whatever
 * this wraps ends up exactly where normal layout would have put it — the
 * children occupy their real space the whole time and nothing reflows.
 */
export default function AnimatedContent({
  children,
  direction = 'none',
  show = true,
  skip = false,
  distance = 24,
  delay = 0,
  duration = 700,
  className,
}: AnimatedContentProps) {
  const reduced = useReducedMotion()

  // Only ever flips to true; `show` gates the reveal on top of it, so the
  // offset start state stays painted until the caller says go.
  const [ready, setReady] = useState(false)
  const shown = show && ready

  useEffect(() => {
    // Two frames: the first commits the offset start state, the second lets the
    // transition observe an actual change rather than collapsing it.
    let inner = 0
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setReady(true))
    })
    return () => {
      cancelAnimationFrame(outer)
      cancelAnimationFrame(inner)
    }
  }, [])

  if (reduced || skip) {
    return (
      <div className={className} style={{ opacity: show ? 1 : 0 }}>
        {children}
      </div>
    )
  }

  const ease = 'cubic-bezier(.22,1,.36,1)'
  const sliding = direction !== 'none'
  const offset = direction === 'up' ? distance : -distance

  return (
    <div
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        // A plain fade emits no transform at all, rather than an identity one.
        transform: sliding ? (shown ? 'translateY(0)' : `translateY(${offset}px)`) : undefined,
        transition: sliding
          ? `opacity ${duration}ms ${ease} ${delay}ms, transform ${duration}ms ${ease} ${delay}ms`
          : `opacity ${duration}ms ${ease} ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}
