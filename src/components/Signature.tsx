import { useEffect, useLayoutEffect, useRef } from 'react'
import { RECORDED_MS, SIGNATURE, VIEWBOX, toPath } from '../signature'
import { useReducedMotion } from '../useReducedMotion'

type SignatureProps = {
  /** Gate the drawing on the greeting finishing. */
  show: boolean
  /** Render finished at once (returning visitor, within this page load). */
  skip?: boolean
  /** Total wall-clock length of the replay. */
  durationMs?: number
  /** Beat between the greeting finishing and the pen touching down. */
  startDelayMs?: number
  onComplete?: () => void
}

/** Strokes shorter than this can't show a dash animation — they get a fade. */
const MIN_DASH_LENGTH = 6

const paths = SIGNATURE.map((stroke) => ({
  d: toPath(stroke),
  startMs: stroke[0].t,
  endMs: stroke[stroke.length - 1].t,
}))

/**
 * Replays a recorded signature by animating each stroke's `stroke-dashoffset`.
 *
 * Every stroke keeps its own slice of the original recording — scaled to
 * `durationMs` but not evened out — so the pauses between letters survive.
 * That rhythm is the whole point; a uniform stagger reads as a machine.
 */
export default function Signature({
  show,
  skip = false,
  durationMs = 2400,
  startDelayMs = 300,
  onComplete,
}: SignatureProps) {
  const reduced = useReducedMotion()
  const immediate = reduced || skip
  const pathRefs = useRef<(SVGPathElement | null)[]>([])
  // Set by the layout effect below, which always runs before the passive
  // effect that releases the strokes — so no state, and no extra render.
  const lengths = useRef<number[]>([])

  const onCompleteRef = useRef(onComplete)
  useEffect(() => {
    onCompleteRef.current = onComplete
  })

  // Seed each path as fully "un-drawn" before the browser paints, so the
  // signature never flashes complete for a frame on the way in.
  useLayoutEffect(() => {
    lengths.current = pathRefs.current.map((el) => {
      if (!el) return 0
      const len = el.getTotalLength()
      if (len >= MIN_DASH_LENGTH && !immediate) {
        // Gap is deliberately longer than the dash: with `${len}` alone the
        // path's end lands exactly on a dash boundary, and a round linecap
        // renders a visible dot there even at zero length. The extra gap keeps
        // the whole un-drawn path strictly inside it.
        //
        // This length is in user units, which is also why the paths must NOT
        // use vector-effect="non-scaling-stroke": that makes Chrome lay the
        // dash pattern out in screen space, so on a scaled-up viewBox the tail
        // of each path overruns the gap and shows as a stray tick.
        el.style.strokeDasharray = `${len} ${len + 4}`
        el.style.strokeDashoffset = `${len}`
      } else {
        el.style.strokeDasharray = 'none'
        el.style.strokeDashoffset = '0'
      }
      return len
    })
  }, [immediate])

  // Release the strokes: each transitions over its own recorded window.
  useEffect(() => {
    if (!show) return

    if (immediate) {
      onCompleteRef.current?.()
      return
    }

    const scale = durationMs / RECORDED_MS
    let raf = 0
    raf = requestAnimationFrame(() => {
      pathRefs.current.forEach((el, i) => {
        if (!el) return
        const { startMs, endMs } = paths[i]
        const delay = startDelayMs + startMs * scale
        const dur = Math.max((endMs - startMs) * scale, 60)
        const len = lengths.current[i] ?? 0

        if (len >= MIN_DASH_LENGTH) {
          // linear: a pen doesn't ease out in the middle of a stroke.
          el.style.transition = `stroke-dashoffset ${dur}ms linear ${delay}ms`
          el.style.strokeDashoffset = '0'
        } else {
          // The i-dot is ~2 units long; a dash animation on it is invisible.
          el.style.opacity = '0'
          el.style.transition = `opacity 120ms ease ${delay}ms`
          requestAnimationFrame(() => {
            el.style.opacity = '1'
          })
        }
      })
    })

    const done = setTimeout(
      () => onCompleteRef.current?.(),
      startDelayMs + durationMs + 80,
    )
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(done)
    }
  }, [show, immediate, durationMs, startDelayMs])

  return (
    <svg
      className="signature"
      viewBox={`${VIEWBOX.x} ${VIEWBOX.y} ${VIEWBOX.w} ${VIEWBOX.h}`}
      role="img"
      aria-label="eric wu"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <title>eric wu</title>
      {paths.map((p, i) => (
        <path
          key={i}
          ref={(el) => {
            pathRefs.current[i] = el
          }}
          d={p.d}
        />
      ))}
    </svg>
  )
}
