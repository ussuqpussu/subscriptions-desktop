import { useSyncExternalStore } from 'react'

/** true, пока выполняется медиазапрос. Окно ПК можно тянуть, поэтому значение живое. */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query)
      list.addEventListener('change', onChange)
      return () => list.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}
