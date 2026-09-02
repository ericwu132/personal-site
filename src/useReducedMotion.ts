import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

const current = () =>
  typeof window !== 'undefined' && window.matchMedia(QUERY).matches

/** Tracks the user's motion preference, including changes made while open. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(current)

  useEffect(() => {
    const mq = window.matchMedia(QUERY)
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return reduced
}
