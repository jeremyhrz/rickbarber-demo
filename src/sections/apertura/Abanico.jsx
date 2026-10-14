import clsx from 'clsx'
import { m, useTransform } from 'framer-motion'
import Foto from '../../components/Foto'
import { ESTILOS } from '../../data/barberia.js'
import { EXPO } from '../../lib/movimiento'

/*
 * Los tres cortes de la portada, de atrás hacia delante. `giro`: inclinación en reposo (grados).
 * `abre`: [x px, y px, grados] que suman al bajar toda la portada (el abanico se abre).
 * `puntero`: cuánto siguen al cursor en escritorio (profundidad). Solo la del centro es la foto
 * principal de la página (`prioridad`): las demás cargan en diferido.
 */
const MARCOS = [
  {
    foto: 'fade-verde',
    // Escritorio: un poco hacia el hueco entre columnas para que su pie («Fade con color») no quede
    // debajo de la foto del centro, y 4 % más arriba para que el «N.º 01» no asome por debajo de ella.
    lugar: '-left-[3%] top-[15%] w-[45%] lg:-left-[4%] lg:top-[11%]',
    giro: -8,
    abre: [-30, -26, -5],
    puntero: 1.25,
    retraso: 0.5,
    sizes: '(min-width: 1024px) 240px, 42vw',
  },
  {
    foto: 'largo-textura',
    lugar: '-right-[3%] top-[21%] w-[45%] lg:right-0',
    giro: 7.5,
    abre: [30, 16, 5],
    puntero: 1.5,
    retraso: 0.62,
    sizes: '(min-width: 1024px) 240px, 42vw',
  },
  {
    foto: 'rubio-textura',
    lugar: 'left-[25%] top-0 z-10 w-[50%] lg:left-[24%] lg:w-[52%]',
    giro: -2,
    abre: [0, -64, 3],
    puntero: 0.7,
    retraso: 0.36,
    sizes: '(min-width: 1024px) 290px, 50vw',
    prioridad: true,
  },
]

/**
 * Abanico de fotos en marcos que se cruzan: se destapan al terminar la intro, se abren con el
 * scroll y, en escritorio, siguen al cursor. `progreso` (0→1 al bajar la portada), `mx` y `my`
 * (−1→1, posición del cursor) son MotionValues de la portada. `children`: lo que flota encima (el sello).
 */
export default function Abanico({ listo, progreso, mx, my, menos, className, children }) {
  return (
    <div className={clsx('relative aspect-[100/86] lg:aspect-[100/90]', className)}>
      {MARCOS.map((marco, i) => (
        <Marco key={marco.foto} {...marco} numero={i + 1} listo={listo} progreso={progreso} mx={mx} my={my} menos={menos} />
      ))}
      {children}
    </div>
  )
}

function Marco({ foto, lugar, giro, abre, puntero, retraso, sizes, prioridad = false, numero, listo, progreso, mx, my, menos }) {
  const estilo = ESTILOS.find((e) => e.foto === foto)
  // p: avance del scroll (0→1) · c: posición del cursor (−1→1)
  const x = useTransform([progreso, mx], ([p, c]) => p * abre[0] + c * 14 * puntero)
  const y = useTransform([progreso, my], ([p, c]) => p * abre[1] + c * 10 * puntero)
  const rotate = useTransform([progreso, mx], ([p, c]) => giro + p * abre[2] + c * 1.8 * puntero)

  return (
    <m.figure className={clsx('absolute', lugar)} style={menos ? { rotate: giro } : { x, y, rotate }}>
      <m.div
        className="bg-grafito p-[5px] shadow-profunda ring-1 ring-hueso/10 lg:p-1.5"
        initial={menos ? { opacity: 0 } : { clipPath: 'inset(100% 0% 0% 0%)' }}
        animate={listo ? (menos ? { opacity: 1 } : { clipPath: 'inset(0% 0% 0% 0%)' }) : undefined}
        transition={{ duration: menos ? 0.5 : 1.25, ease: EXPO, delay: menos ? 0.1 : retraso }}
      >
        <div className="relative overflow-hidden">
          <m.div
            initial={menos ? false : { scale: 1.32 }}
            animate={listo && !menos ? { scale: 1 } : undefined}
            transition={{ duration: 1.7, ease: EXPO, delay: retraso }}
          >
            <Foto id={foto} sizes={sizes} prioridad={prioridad} vineta />
          </m.div>
        </div>
        {estilo && (
          <figcaption className="flex items-center justify-between gap-2 px-0.5 pb-px pt-[7px] text-[8.5px] font-semibold uppercase leading-none tracking-[0.14em] text-niebla xs:text-[9px] lg:px-1 lg:pt-2.5 lg:text-[9px] lg:tracking-[0.12em] xl:text-[9.5px] xl:tracking-[0.16em] 2xl:text-[10px] 2xl:tracking-[0.2em]">
            <span className="truncate">{estilo.nombre}</span>
            {/* Entre 1024 y 1279 px no cabe junto al nombre («Largo con tex…»). */}
            <span className="hidden shrink-0 text-laton xl:inline">N.º {String(numero).padStart(2, '0')}</span>
          </figcaption>
        )}
      </m.div>
    </m.figure>
  )
}
