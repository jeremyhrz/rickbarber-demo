import { useLayoutEffect, useRef, useState } from 'react'
import clsx from 'clsx'

/**
 * Contenedor que acompaña con una transición corta los cambios de alto de su contenido
 * (los pasos del asistente no miden lo mismo). Con «reducir movimiento», salta sin animar.
 * Recorta lo que se salga (overflow hidden): el aire para los anillos de foco va en
 * `claseInterior` (el alto medido lo incluye).
 */
export default function AlturaSuave({ className, claseInterior, children }) {
  const interior = useRef(null)
  const [alto, setAlto] = useState(null)

  useLayoutEffect(() => {
    const elemento = interior.current
    if (!elemento) return undefined
    const medir = () => setAlto(elemento.offsetHeight)
    medir()
    const observador = new ResizeObserver(medir)
    observador.observe(elemento)
    return () => observador.disconnect()
  }, [])

  return (
    <div className={clsx('altura-suave', className)} style={{ height: alto ?? 'auto' }}>
      <div ref={interior} className={claseInterior}>
        {children}
      </div>
    </div>
  )
}
