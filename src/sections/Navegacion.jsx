import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { AnimatePresence, m, useMotionValueEvent, useScroll } from 'framer-motion'
import Magnetico from '../components/Magnetico'
import Wordmark from '../components/Wordmark'
import { ENLACES } from '../data/secciones'
import { useAgenda } from '../lib/agenda'
import { useAtraparFoco } from '../lib/foco'
import { useIntroTerminada } from '../lib/intro'
import { EXPO } from '../lib/movimiento'
import { irA, useBloquearScroll } from '../lib/scroll'
import MenuMovil from './apertura/MenuMovil'
import { useSeccionActiva } from './apertura/seccionActiva'
import './apertura/apertura.css'

/**
 * Navegación fija: transparente sobre la portada y carbón translúcido con desenfoque al bajar.
 * Se esconde al bajar y vuelve al subir. Wordmark a la izquierda, «Agendar» dorado siempre a mano.
 * Escritorio ancho (xl): las secciones a la vista, con la activa subrayada en latón.
 * Teléfono y tableta: menú a pantalla completa que se abre en círculo desde su botón.
 */
export default function Navegacion() {
  const listo = useIntroTerminada()
  const { irAAgenda } = useAgenda()
  const [abierto, setAbierto] = useState(false)
  const [oculta, setOculta] = useState(false)
  const [solida, setSolida] = useState(false)
  const [origen, setOrigen] = useState('100% 0%')
  const activa = useSeccionActiva()
  const capa = useRef(null)
  const botonMenu = useRef(null)
  const pendiente = useRef(null)
  const { scrollY } = useScroll()

  useBloquearScroll(abierto)
  useAtraparFoco(capa, abierto, () => setAbierto(false))

  useMotionValueEvent(scrollY, 'change', (y) => {
    const delta = y - (scrollY.getPrevious() ?? y)
    setSolida(y > 24)
    if (y < 160) setOculta(false)
    else if (delta > 6) setOculta(true)
    else if (delta < -6) setOculta(false)
  })

  // En escritorio ancho el menú del teléfono no existe: si estaba abierto, se cierra.
  useEffect(() => {
    const medio = window.matchMedia('(min-width: 1280px)')
    const cerrar = () => {
      if (medio.matches) setAbierto(false)
    }
    medio.addEventListener('change', cerrar)
    return () => medio.removeEventListener('change', cerrar)
  }, [])

  const viajar = (destino) => (destino === '#agenda' ? irAAgenda() : irA(destino))

  // Con el menú abierto el scroll está bloqueado: primero se cierra y, ya cerrado, se viaja.
  useEffect(() => {
    if (abierto || !pendiente.current) return
    const destino = pendiente.current
    pendiente.current = null
    viajar(destino)
  }, [abierto]) // eslint-disable-line react-hooks/exhaustive-deps

  const ir = (destino) => (evento) => {
    evento?.preventDefault()
    if (!abierto) return viajar(destino)
    pendiente.current = destino
    return setAbierto(false)
  }

  const alternar = () => {
    const caja = botonMenu.current?.getBoundingClientRect()
    if (caja) setOrigen(`${Math.round(caja.left + caja.width / 2)}px ${Math.round(caja.top + caja.height / 2)}px`)
    setAbierto((v) => !v)
  }

  return (
    <div ref={capa}>
      <AnimatePresence>{abierto && <MenuMovil key="menu" activa={activa} ir={ir} origen={origen} />}</AnimatePresence>

      <m.header
        className={clsx('fixed inset-x-0 top-0', abierto ? 'z-[51]' : 'z-nav')}
        initial={false}
        animate={{ y: oculta && !abierto ? '-100%' : '0%' }}
        transition={{ duration: 0.6, ease: EXPO }}
      >
        <div
          aria-hidden="true"
          className={clsx(
            'absolute inset-0 border-b border-hueso/[0.07] bg-carbon/80 backdrop-blur-xl backdrop-saturate-150 transition-opacity duration-500',
            solida && !abierto ? 'opacity-100' : 'opacity-0',
          )}
        />
        <m.div
          className="contenedor relative flex h-16 items-center justify-between gap-3 lg:h-20"
          initial={{ opacity: 0, y: -18 }}
          animate={listo ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.9, ease: EXPO, delay: 0.3 }}
        >
          <a href="#inicio" onClick={ir('#inicio')} aria-label="Rickbarber, ir al inicio" className="-ml-1 shrink-0 rounded-md p-1">
            <Wordmark titulo={null} className="text-[1.42rem] xs:text-[1.6rem] lg:text-[1.9rem]" />
          </a>

          <nav aria-label="Secciones" className="absolute left-1/2 hidden -translate-x-1/2 xl:block">
            <ul className="flex items-center gap-6 2xl:gap-8">
              {ENLACES.map((enlace) => {
                const actual = activa === enlace.id
                return (
                  <li key={enlace.id}>
                    <a
                      href={`#${enlace.id}`}
                      onClick={ir(`#${enlace.id}`)}
                      aria-current={actual ? 'true' : undefined}
                      className={clsx(
                        'etiqueta relative block whitespace-nowrap py-2 tracking-[0.16em] transition-colors duration-300 hover:text-laton-claro',
                        actual ? 'text-laton' : 'text-hueso/80',
                      )}
                    >
                      {enlace.corto}
                      {/* Subrayado de la activa: se dibuja de izquierda a derecha (CSS, sin layout de framer). */}
                      <span
                        aria-hidden="true"
                        className={clsx(
                          'absolute inset-x-0 bottom-0 h-px bg-laton transition-transform duration-500 ease-expo motion-reduce:transition-none',
                          actual ? 'origin-left scale-x-100' : 'origin-right scale-x-0',
                        )}
                      />
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="-mr-1.5 flex items-center gap-1.5 xs:gap-2.5">
            <Magnetico fuerza={0.25}>
              <a href="#agenda" onClick={ir('#agenda')} className="boton boton-laton boton-chico">
                <span aria-hidden="true" className="brillo" />
                <span>Agendar</span>
              </a>
            </Magnetico>

            <button
              ref={botonMenu}
              type="button"
              onClick={alternar}
              aria-expanded={abierto}
              aria-controls="menu-movil"
              aria-label={abierto ? 'Cerrar el menú' : 'Abrir el menú'}
              className="relative grid size-11 place-items-center rounded-full text-hueso xl:hidden"
            >
              <span
                className="absolute h-[1.5px] w-[22px] rounded-full bg-current transition-transform duration-500 ease-expo"
                style={{ transform: abierto ? 'rotate(45deg)' : 'translateY(-4px)' }}
              />
              <span
                className="absolute h-[1.5px] rounded-full bg-current transition-[transform,width] duration-500 ease-expo"
                style={{ width: abierto ? 22 : 14, transform: abierto ? 'rotate(-45deg)' : 'translate(4px, 4px)' }}
              />
            </button>
          </div>
        </m.div>
      </m.header>
    </div>
  )
}
