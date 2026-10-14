import { useEffect, useState } from 'react'

/** true mientras se cumpla la media query (se lee al montar, sin parpadeo). */
export function useMedia(consulta) {
  const [cumple, setCumple] = useState(() => typeof window !== 'undefined' && window.matchMedia(consulta).matches)
  useEffect(() => {
    const medio = window.matchMedia(consulta)
    const cambiar = () => setCumple(medio.matches)
    cambiar()
    medio.addEventListener('change', cambiar)
    return () => medio.removeEventListener('change', cambiar)
  }, [consulta])
  return cumple
}
