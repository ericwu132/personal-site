import { useEffect, useMemo, useRef, useState } from 'react'
import { useReducedMotion } from '../useReducedMotion'

type TextTypeProps = {
  text: string
  /** Milliseconds between characters. */
  typingSpeed?: number
  /** Milliseconds to wait before the first character appears. */
  initialDelay?: number
  showCursor?: boolean
  cursorCharacter?: string
  /** Render the finished string at once, skipping the animation entirely. */
  skip?: boolean
  className?: string
  onComplete?: () => void
}

/**
 * Types a string out one character at a time. Reduced-motion users get the
 * whole string immediately, with onComplete still firing so the rest of the
 * reveal sequence downstream doesn't stall.
 */
export default function TextType({
  text,
  typingSpeed = 65,
  initialDelay = 350,
  showCursor = true,
  cursorCharacter = '|',
  skip = false,
  className,
  onComplete,
}: TextTypeProps) {
  const reduced = useReducedMotion()
  const immediate = reduced || skip

  // Split by code point, not UTF-16 unit: slicing a string mid-surrogate would
  // emit a lone half and render as a replacement glyph. Latin and CJK are both
  // safe either way, but emoji and the like are not.
  const chars = useMemo(() => [...text], [text])

  // Progress is stored alongside the string it belongs to, so swapping `text`
  // resets it during render instead of needing a setState in an effect.
  const [typed, setTyped] = useState({ text, count: 0 })
  const count = immediate ? chars.length : typed.text === text ? typed.count : 0
  const done = count >= chars.length

  // Held in a ref so a changing callback identity doesn't restart the typing.
  // Declared first so it is populated before the typing effect below runs.
  const onCompleteRef = useRef(onComplete)
  useEffect(() => {
    onCompleteRef.current = onComplete
  })

  useEffect(() => {
    if (immediate) {
      onCompleteRef.current?.()
      return
    }

    let index = 0
    let timer: ReturnType<typeof setTimeout>

    const step = () => {
      index += 1
      setTyped({ text, count: index })
      if (index < chars.length) {
        timer = setTimeout(step, typingSpeed)
      } else {
        onCompleteRef.current?.()
      }
    }

    timer = setTimeout(step, initialDelay)
    // Cleanup keeps StrictMode's double-mount from running two typing chains.
    return () => clearTimeout(timer)
  }, [text, chars, typingSpeed, initialDelay, immediate])

  return (
    <span className="type">
      {/* The finished string, visually hidden, holds the line's real width and
          height so nothing around it moves as characters arrive. It is also
          what screen readers announce — once, in full, not per keystroke. */}
      <span className="type-reserve">
        {text}
        {/* Same markup as the live cursor below, so the two strings measure
            identically down to the cursor's margin. */}
        {showCursor && <span className="cursor">{cursorCharacter}</span>}
      </span>
      <span className={`type-visible${className ? ` ${className}` : ''}`} aria-hidden="true">
        {chars.slice(0, count).join('')}
        {showCursor && (
          <span className="cursor" data-done={done || undefined}>
            {cursorCharacter}
          </span>
        )}
      </span>
    </span>
  )
}
