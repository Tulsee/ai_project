import { useState, useEffect } from 'react'

// Subscribe to a CSS media query and re-render when it changes.
// Lets our inline-style components react to viewport size (inline styles
// can't carry media queries on their own).
export function useMediaQuery(query) {
  const get = () =>
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia(query).matches
      : false

  const [matches, setMatches] = useState(get)

  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    onChange() // sync immediately in case the query changed
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}

// Phones / small tablets in portrait.
export const useIsMobile = () => useMediaQuery('(max-width: 768px)')
