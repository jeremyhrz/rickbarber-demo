import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { m } from 'framer-motion'
import Poste from '../components/Poste'
import TextoDividido from '../components/TextoDividido'
import { WORDMARK_TEXTO } from '../components/Wordmark'
import { BARBERIA } from '../data/barberia.js'
import { terminarIntro } from '../lib/intro'
import { EXPO, useMenosMovimiento } from '../lib/movimiento'
import { useBloquearScroll } from '../lib/scroll'

const CORTINA = [0.76, 0, 0.24, 1]
const MARCA_MS = 1000 // poste girando + «RICKBARBER» letra a letra + el filo de la navaja
const CORTE_S = 0.6 // la pantalla se parte en dos por el filo: 1 + 0,6 = 1,6 s en total

/**
 * Intro (solo la 1.ª visita de la sesión; lo decide src/lib/intro.js). Sobre carbón, el poste de
 * barbero gira, «RICKBARBER» sube letra a letra y un filo de latón cruza la pantalla como una
 * navaja: la pantalla se parte por ahí en dos mitades (la de arriba sube, la de abajo baja) y
 * deja ver la portada, que ya estaba pintada debajo. Cada mitad lleva su copia de la marca, así
 * la marca también se «corta». Se salta con un toque, la rueda o una tecla.
 * Con «reducir movimiento»: la marca quieta y un fundido corto.
 */
export default function Intro() {
  const menos = useMenosMovimiento()
  const [fase, setFase] = useState('marca') // marca → corte → fin
  const corte = fase === 'corte'

  useBloquearScroll(fase === 'marca')

  useEffect(() => {
    const t = window.setTimeout(() => setFase((f) => (f === 'marca' ? 'corte' : f)), menos ? 550 : MARCA_MS)
    return () => window.clearTimeout(t)
  }, [menos])

  // La portada y la navegación entran mientras la cortina se abre. Si la animación no avisa al
  // terminar, la intro se quita igual: nunca puede quedarse tapando la página.
  useEffect(() => {
    if (fase !== 'corte') return undefined
    terminarIntro()
    const t = window.setTimeout(() => setFase('fin'), (menos ? 0.35 : CORTE_S) * 1000 + 250)
    return () => window.clearTimeout(t)
  }, [fase, menos])

  useEffect(() => {
    if (fase !== 'marca') return undefined
    const saltar = () => setFase('corte')
    const eventos = ['pointerdown', 'wheel', 'touchmove', 'keydown']
    eventos.forEach((e) => window.addEventListener(e, saltar, { passive: true }))
    return () => eventos.forEach((e) => window.removeEventListener(e, saltar))
  }, [fase])

  if (fase === 'fin') return null

  return (
    <div aria-hidden="true" data-intro className="fixed inset-0 z-intro" style={{ pointerEvents: corte ? 'none' : 'auto' }}>
      {['arriba', 'abajo'].map((mitad) => (
        <m.div
          key={mitad}
          className={clsx('absolute inset-x-0 h-1/2 overflow-hidden bg-carbon', mitad === 'arriba' ? 'top-0' : 'bottom-0')}
          animate={corte ? (menos ? { opacity: 0 } : { y: mitad === 'arriba' ? '-101%' : '101%' }) : undefined}
          transition={menos ? { duration: 0.35 } : { duration: CORTE_S, ease: CORTINA }}
          onAnimationComplete={() => {
            if (corte && mitad === 'arriba') setFase('fin')
          }}
        >
          {/* La copia de la marca mide toda la pantalla: cada mitad enseña la suya. */}
          <div className={clsx('absolute inset-x-0 h-[200%]', mitad === 'arriba' ? 'top-0' : 'bottom-0')}>
            <Marca menos={menos} />
          </div>
        </m.div>
      ))}

      {/* El filo de la navaja: una línea de latón cruza la pantalla justo por donde se parte. */}
      <m.div
        className="absolute inset-x-0 top-1/2 h-px origin-left bg-laton-claro shadow-[0_0_14px_rgb(227_200_142/0.7)]"
        initial={{ scaleX: 0 }}
        animate={corte ? { opacity: 0 } : { scaleX: 1 }}
        transition={corte ? { duration: 0.18 } : { duration: 0.34, delay: 0.64, ease: [0.65, 0, 0.35, 1] }}
      />
    </div>
  )
}

/** Poste + «RICKBARBER» centrados; el rótulo cuelga debajo sin mover el centro (el corte pasa por la marca). */
function Marca({ menos }) {
  return (
    <div className="grid h-full place-items-center px-5">
      <div className="relative">
        <span className="flex items-center gap-[0.2em] font-display text-[clamp(3rem,15.6vw,8.75rem)] uppercase leading-none text-hueso">
          <m.span
            className="block"
            initial={{ opacity: 0, scale: 0.55 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, ease: EXPO }}
          >
            <Poste duracion={0.7} className="h-[1.04em] w-auto" />
          </m.span>
          <TextoDividido
            texto={WORDMARK_TEXTO}
            por="letra"
            alVer={false}
            retraso={menos ? 0 : 0.1}
            escalon={0.034}
            duracion={0.62}
            className="block translate-y-[0.03em] tracking-[0.03em]"
          />
        </span>
        <div className="absolute inset-x-0 top-full mt-[clamp(1.1rem,3vh,1.75rem)] flex justify-center">
          <m.p
            className="etiqueta whitespace-nowrap text-niebla"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: menos ? 0 : 0.42, ease: EXPO }}
          >
            {BARBERIA.rubro} · {BARBERIA.ubicacion.zona}
          </m.p>
        </div>
      </div>
    </div>
  )
}
