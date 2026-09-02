import { useEffect, useState } from 'react'

const QUERY = '(hover: hover) and (pointer: fine)'

const current = () =>
  typeof window !== 'undefined' && window.matchMedia(QUERY).matches

/**
 * True on mouse-and-keyboard devices. The hover preview and the terminal are
 * layers for those; on touch they stay dormant and must not advertise
 * themselves.
 */
export function useFinePointer() {
  const [fine, setFine] = useState(current)

  useEffect(() => {
    const mq = window.matchMedia(QUERY)
    const onChange = () => setFine(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return fine
}
