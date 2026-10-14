import { useCallback, useEffect, useRef, useState } from 'react'
import { useMotionValueEvent, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion'

/** Distancia entre tarjetas: ancho de la primera + el hueco (gap) del carrusel. */
function medirPaso(el) {
  const primera = el.firstElementChild
  if (!primera) return el.clientWidth || 1
  const hueco = parseFloat(getComputedStyle(el).columnGap) || 0
  return primera.getBoundingClientRect().width + hueco || 1
}

/**
 * Carrusel con scroll NATIVO (en el teléfono, el dedo con su inercia de siempre) y, con ratón,
 * arrastre: se agarra, se suelta y se acomoda en la tarjeta más cercana en el sentido del gesto.
 *
 *   const c = useCarrusel({ total: 4, menos })
 *   <ul ref={c.ref} className="carrusel">…</ul>
 *   c.indice (0…total-1, para el contador) · c.alInicio / c.alFinal (para las flechas)
 *   c.progreso (0…1, MotionValue) · c.sesgo (grados, MotionValue) · c.mover(±1) (una tarjeta)
 */
export function useCarrusel({ total, menos = false }) {
  const ref = useRef(null)
  const [estado, setEstado] = useState({ indice: 0, alInicio: true, alFinal: false })
  const { scrollX, scrollXProgress } = useScroll({ container: ref })
  const impulso = useSpring(useVelocity(scrollX), { stiffness: 260, damping: 40 })
  const sesgo = useTransform(impulso, [-2600, 0, 2600], [4, 0, -4], { clamp: true })

  const actualizar = useCallback(
    (x) => {
      const el = ref.current
      if (!el) return
      const tope = el.scrollWidth - el.clientWidth
      const alInicio = x <= 4
      const alFinal = x >= tope - 4
      // Al final del recorrido, la última tarjeta (aunque no llegue a imantarse al borde).
      const indice = Math.min(total - 1, Math.max(0, alFinal ? total - 1 : Math.round(x / medirPaso(el))))
      setEstado((antes) =>
        antes.indice === indice && antes.alInicio === alInicio && antes.alFinal === alFinal ? antes : { indice, alInicio, alFinal },
      )
    },
    [total],
  )

  useMotionValueEvent(scrollX, 'change', actualizar)
  useEffect(() => {
    actualizar(ref.current?.scrollLeft ?? 0)
  }, [actualizar])

  // Una tarjeta hacia un lado, contando desde donde está el scroll (no desde el contador, que al
  // final del recorrido marca la última aunque el scroll se haya quedado antes).
  const mover = useCallback(
    (sentido) => {
      const el = ref.current
      if (!el) return
      const paso = medirPaso(el)
      const actual = Math.round(el.scrollLeft / paso)
      el.scrollTo({ left: Math.max(0, actual + sentido) * paso, behavior: menos ? 'auto' : 'smooth' })
    },
    [menos],
  )

  // Arrastre con ratón (el táctil ya lo hace el navegador).
  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    let gesto = null
    let reloj = 0

    const abajo = (evento) => {
      if (evento.pointerType !== 'mouse' || evento.button !== 0) return
      gesto = { x: evento.clientX, izquierda: el.scrollLeft, movido: false, id: evento.pointerId }
    }
    const mover = (evento) => {
      if (!gesto) return
      const dx = evento.clientX - gesto.x
      if (!gesto.movido) {
        if (Math.abs(dx) < 6) return
        gesto.movido = true
        window.clearTimeout(reloj)
        el.classList.add('carrusel--arrastrando')
        el.setPointerCapture?.(gesto.id)
      }
      el.scrollLeft = gesto.izquierda - dx
    }
    const soltar = (evento) => {
      if (!gesto) return
      const { movido, x } = gesto
      gesto = null
      if (!movido) return
      el.releasePointerCapture?.(evento.pointerId)
      // El clic que llega justo después de soltar no debe abrir el enlace que quedó debajo.
      const bloquear = (e) => {
        e.preventDefault()
        e.stopPropagation()
      }
      el.addEventListener('click', bloquear, { capture: true, once: true })
      window.setTimeout(() => el.removeEventListener('click', bloquear, { capture: true }), 60)
      // Se acomoda en la tarjeta siguiente o anterior según el sentido del gesto.
      const dx = evento.clientX - x
      const posicion = el.scrollLeft / medirPaso(el)
      const destino = Math.min(total - 1, Math.max(0, Math.round(posicion + (dx < 0 ? 0.35 : dx > 0 ? -0.35 : 0))))
      el.scrollTo({ left: destino * medirPaso(el), behavior: menos ? 'auto' : 'smooth' })
      // El imán vuelve cuando terminó de acomodarse (si vuelve antes, tironea).
      const devolverIman = () => el.classList.remove('carrusel--arrastrando')
      reloj = window.setTimeout(devolverIman, menos ? 0 : 650)
    }
    const sinArrastreNativo = (evento) => evento.preventDefault()

    el.addEventListener('pointerdown', abajo)
    el.addEventListener('pointermove', mover)
    el.addEventListener('pointerup', soltar)
    el.addEventListener('pointercancel', soltar)
    el.addEventListener('dragstart', sinArrastreNativo)
    return () => {
      window.clearTimeout(reloj)
      el.removeEventListener('pointerdown', abajo)
      el.removeEventListener('pointermove', mover)
      el.removeEventListener('pointerup', soltar)
      el.removeEventListener('pointercancel', soltar)
      el.removeEventListener('dragstart', sinArrastreNativo)
    }
  }, [total, menos])

  return { ref, ...estado, progreso: scrollXProgress, sesgo, mover }
}
