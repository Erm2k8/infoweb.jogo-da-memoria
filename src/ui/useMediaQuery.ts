import { useSyncExternalStore } from 'react'

export const CONSULTA_MOBILE = '(max-width: 640px)'

export function useMediaQuery(consulta: string) {
  return useSyncExternalStore(
    (avisar) => {
      const lista = window.matchMedia(consulta)
      lista.addEventListener('change', avisar)
      return () => lista.removeEventListener('change', avisar)
    },
    () => window.matchMedia(consulta).matches,
  )
}
