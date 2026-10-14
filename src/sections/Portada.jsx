import { useRef } from 'react'
import clsx from 'clsx'
import { m, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import BotonWhatsApp from '../components/BotonWhatsApp'
import Magnetico from '../components/Magnetico'
import TextoDividido from '../components/TextoDividido'
import { BARBERIA, PORTADA } from '../data/barberia.js'
import { useAgenda } from '../lib/agenda'
import { useIntroTerminada } from '../lib/intro'
import { EXPO, useMenosMovimiento, usePunteroFino } from '../lib/movimiento'
import { irA } from '../lib/scroll'
import Abanico from './apertura/Abanico'
import Sello from './apertura/Sello'
import './apertura/apertura.css'

// «Barbería de élite» en dos renglones fijos: «Barbería» / «de *élite*» (la última palabra en latón).
const [PRIMERA, ...RESTO] = PORTADA.titulo.split(' ')
const SEGUNDA = RESTO.map((palabra, i) => (i === RESTO.length - 1 ? `*${palabra}*` : palabra)).join(' ')

/**
 * Portada (#inicio): «BARBERÍA DE ÉLITE» enorme, letra a letra desde su máscara cuando termina
 * la intro; tres cortes reales en marcos que se cruzan (se abren al bajar y siguen al cursor en
 * escritorio), el sello giratorio con el poste dentro, la bajada de su bio y los dos botones.
 */
export default function Portada() {
  const listo = useIntroTerminada()
  const menos = useMenosMovimiento()
  const fino = usePunteroFino()
  const { irAAgenda } = useAgenda()
  const seccion = useRef(null)
  const { scrollYProgress } = useScroll({ target: seccion, offset: ['start start', 'end start'] })
  const giroSello = useTransform(scrollYProgress, [0, 1], [0, 200])

  // Posición del cursor sobre la portada, de −1 a 1, con resorte (solo escritorio).
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const mx = useSpring(px, { stiffness: 70, damping: 18, mass: 0.8 })
  const my = useSpring(py, { stiffness: 70, damping: 18, mass: 0.8 })
  const seguir = fino && !menos
  const mover = (evento) => {
    const caja = seccion.current.getBoundingClientRect()
    px.set(((evento.clientX - caja.left) / caja.width) * 2 - 1)
    py.set(((evento.clientY - caja.top) / caja.height) * 2 - 1)
  }
  const soltar = () => {
    px.set(0)
    py.set(0)
  }

  const entrar = (retraso) => ({
    initial: { opacity: 0, y: 22 },
    animate: listo ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 1, ease: EXPO, delay: retraso },
  })

  const agendar = (evento) => {
    evento.preventDefault()
    irAAgenda()
  }

  const bajar = () => {
    const caja = seccion.current?.getBoundingClientRect()
    if (caja) irA(caja.bottom + window.scrollY)
  }

  const titulo = {
    por: 'letra',
    alVer: false,
    animate: listo ? 'visible' : 'oculto',
    escalon: 0.045,
    duracion: 1.05,
    className: 'block',
  }

  return (
    <section
      id="inicio"
      ref={seccion}
      aria-labelledby="inicio-titulo"
      className="relative isolate flex min-h-[100svh] flex-col overflow-x-clip pb-8 pt-[calc(var(--alto-nav)+0.9rem)] lg:pb-14 lg:pt-[calc(var(--alto-nav)+1.5rem)]"
      onPointerMove={seguir ? mover : undefined}
      onPointerLeave={seguir ? soltar : undefined}
    >
      <div className="contenedor portada-reticula relative flex-1">
        <div className="portada-titular relative z-10">
          <m.p {...entrar(0)} className="etiqueta -mb-[0.1em] flex items-center gap-3 whitespace-nowrap tracking-[0.2em] text-laton xs:tracking-etiqueta">
            <span aria-hidden="true" className="hidden h-px w-8 shrink-0 bg-current xs:block" />
            {BARBERIA.rubro} · {BARBERIA.ubicacion.zona}
          </m.p>
          <h1 id="inicio-titulo" className="portada-titulo font-display uppercase text-hueso">
            <TextoDividido texto={PRIMERA} retraso={0.08} {...titulo} />
            <TextoDividido texto={SEGUNDA} retraso={0.3} {...titulo} />
          </h1>
        </div>

        <div className="portada-abanico relative mt-5 lg:mt-0">
          <div
            aria-hidden="true"
            className="portada-resplandor pointer-events-none absolute left-1/2 top-1/2 -z-10 aspect-square w-[150%] -translate-x-1/2 -translate-y-1/2 rounded-full"
          />
          <Abanico
            listo={listo}
            progreso={scrollYProgress}
            mx={mx}
            my={my}
            menos={menos}
            className="mx-auto w-[92%] max-w-[25rem] lg:w-full lg:max-w-[38rem]"
          >
            {/* El sello, arriba a la derecha (como en el teléfono): abajo tapaba el pie de la foto
                de la izquierda y dejaba trozos de texto sueltos («…LOR»). */}
            <m.div
              className="absolute -right-[3%] -top-[9%] z-20 w-[28%] lg:-right-[6%] lg:-top-[5%] lg:w-[27%]"
              style={menos ? undefined : { rotate: giroSello }}
            >
              <m.div
                initial={{ opacity: 0, scale: 0.5, rotate: -140 }}
                animate={listo ? { opacity: 1, scale: 1, rotate: 0 } : undefined}
                transition={{ duration: 1.4, ease: EXPO, delay: 0.9 }}
              >
                <Sello className="w-full" />
              </m.div>
            </m.div>
          </Abanico>
        </div>

        <div className="portada-bajada relative z-10 mt-6 lg:mt-10">
          <m.ul
            {...entrar(0.7)}
            aria-label="Especialidades"
            className="flex max-w-[34rem] flex-wrap items-center gap-x-3 gap-y-1.5 text-[15px] leading-snug text-hueso/80 lg:text-lg"
          >
            {PORTADA.bajada.map((texto, i) => (
              <li key={texto} className="flex items-center gap-3">
                {i > 0 && <span aria-hidden="true" className="size-[5px] shrink-0 rotate-45 bg-laton" />}
                {texto}
              </li>
            ))}
          </m.ul>

          <m.div {...entrar(0.85)} className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center lg:mt-9">
            <Magnetico className="w-full sm:w-auto">
              <a href="#agenda" onClick={agendar} className="boton boton-laton group w-full sm:w-auto">
                <span aria-hidden="true" className="brillo" />
                <span>Agenda tu cita</span>
                <ArrowRight className="size-4 transition-transform duration-500 ease-expo group-hover:translate-x-1" strokeWidth={1.8} aria-hidden="true" />
              </a>
            </Magnetico>
            <div className="flex items-center justify-between gap-4">
              <BotonWhatsApp magnetico />
              <Indicador listo={listo} alPulsar={bajar} className="pr-1 sm:hidden" />
            </div>
          </m.div>
        </div>
      </div>

      <Indicador listo={listo} alPulsar={bajar} className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 sm:flex lg:bottom-10" vertical />
    </section>
  )
}

/** «Desliza» con una gota que baja por un hilo; al pulsarlo, baja a la sección siguiente. */
function Indicador({ listo, alPulsar, vertical = false, className }) {
  return (
    <div className={className}>
      <m.button
        type="button"
        onClick={alPulsar}
        aria-label="Bajar a la siguiente sección"
        className={clsx(
          'flex items-center gap-3 rounded-full p-1 text-niebla transition-colors duration-300 hover:text-laton-claro',
          vertical && 'flex-col',
        )}
        initial={{ opacity: 0 }}
        animate={listo ? { opacity: 1 } : undefined}
        transition={{ duration: 0.9, delay: 1.5 }}
      >
        <span className="etiqueta text-[10px] md:text-[10px]">Desliza</span>
        <span aria-hidden="true" className="indicador-hilo" />
      </m.button>
    </div>
  )
}
