import { useRef } from 'react'
import { m, useScroll, useTransform } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import Rotulo from '../components/Rotulo'
import TextoDividido from '../components/TextoDividido'
import Revelar from '../components/Revelar'
import Foto from '../components/Foto'
import Grano from '../components/Grano'
import Poste from '../components/Poste'
import { IconoInstagram } from '../components/Iconos'
import { BARBERIA, ESTILOS, buscarServicio } from '../data/barberia.js'
import { useAgenda } from '../lib/agenda'
import { EXPO, VISTA, useMenosMovimiento } from '../lib/movimiento'
import { useCarrusel } from './vitrina/carrusel'
import './vitrina/vitrina.css'

/**
 * Trabajos (#trabajos): los cortes reales de su Instagram en un carrusel que se desliza con el
 * dedo (scroll nativo con imán) y se arrastra con el ratón. Cada lámina: foto enmarcada con
 * paralaje lateral, número editorial, nombre del estilo y «Lo quiero» → agenda con el servicio.
 * Cierra con una tarjeta para agendar.
 */

const TOTAL = ESTILOS.length + 1 // los estilos + la tarjeta final
const dos = (n) => String(n).padStart(2, '0')
const ANCHO_LAMINA = 'w-[78vw] max-w-[360px] sm:w-[44vw] lg:w-[400px] lg:max-w-none xl:w-[420px]'

export default function Trabajos() {
  const menos = useMenosMovimiento()
  const { irAAgenda } = useAgenda()
  const carrusel = useCarrusel({ total: TOTAL, menos })
  const sesgo = menos ? 0 : carrusel.sesgo

  return (
    <section id="trabajos" aria-labelledby="trabajos-titulo" className="seccion relative border-t border-hueso/10">
      <div className="contenedor">
        <Rotulo id="trabajos" />
        <div className="mt-6 grid gap-8 lg:grid-cols-12 lg:items-end">
          <TextoDividido
            como="h2"
            id="trabajos-titulo"
            texto="Recién salidos de la *silla*"
            className="titulo-seccion lg:col-span-8"
          />
          <Revelar como="p" retraso={0.15} className="max-w-sm text-niebla lg:col-span-4 lg:justify-self-end lg:pb-3">
            Cortes reales que Rick publicó en su Instagram. Desliza, escoge el tuyo y agéndalo en un toque.
          </Revelar>
        </div>

        {/* Contador, progreso y flechas */}
        <div className="mt-10 flex items-center gap-5 lg:mt-14">
          {/* En escritorio se ven casi todas a la vez: ahí sobra el número y quedan la línea y las flechas. */}
          <p className="font-display text-xl tabular-nums leading-none tracking-[0.04em] lg:hidden" aria-hidden="true">
            <span className="text-laton">{dos(carrusel.indice + 1)}</span>
            <span className="text-niebla"> / {dos(TOTAL)}</span>
          </p>
          <div className="relative h-px flex-1 bg-hueso/15" aria-hidden="true">
            <m.div className="absolute inset-0 origin-left bg-laton" style={{ scaleX: carrusel.progreso }} />
          </div>
          <div className="hidden gap-2 md:flex">
            <BotonFlecha etiqueta="Corte anterior" onClick={() => carrusel.mover(-1)} desactivado={carrusel.alInicio}>
              <ArrowLeft className="size-5" strokeWidth={1.5} />
            </BotonFlecha>
            <BotonFlecha etiqueta="Corte siguiente" onClick={() => carrusel.mover(1)} desactivado={carrusel.alFinal}>
              <ArrowRight className="size-5" strokeWidth={1.5} />
            </BotonFlecha>
          </div>
        </div>
      </div>

      <m.ul
        ref={carrusel.ref}
        aria-label="Cortes de Rick"
        className="carrusel sin-barra mt-6 gap-4 pb-4 md:gap-6 lg:mt-8 lg:gap-8"
        initial="oculto"
        whileInView="visible"
        viewport={VISTA}
        variants={{ oculto: {}, visible: { transition: { staggerChildren: 0.12 } } }}
      >
        {ESTILOS.map((estilo, i) => (
          <Lamina
            key={estilo.id}
            estilo={estilo}
            numero={dos(i + 1)}
            contenedor={carrusel.ref}
            sesgo={sesgo}
            menos={menos}
            alAgendar={() => irAAgenda(estilo.servicio)}
          />
        ))}
        <m.li variants={entrada(menos)} className={ANCHO_LAMINA}>
          <m.div
            style={{ skewX: sesgo }}
            className="relative flex h-full min-h-[24rem] flex-col justify-between gap-8 overflow-hidden border border-laton/30 bg-grafito p-6 lg:p-8"
          >
            <Grano fijo={false} opacidad={0.08} />
            <div className="relative flex items-start justify-between">
              <Poste className="h-24 w-auto lg:h-28" />
              <span className="etiqueta text-niebla">{dos(TOTAL)}</span>
            </div>
            <div className="relative">
              <p className="font-display text-[clamp(2.6rem,11vw,3.4rem)] uppercase leading-[0.92]">
                ¿El próximo
                <br />
                eres <span className="text-laton">tú</span>?
              </p>
              <p className="mt-4 max-w-[17rem] text-sm text-niebla">
                Escoge servicio, día y hora. Rick te confirma el cupo por WhatsApp.
              </p>
            </div>
            <div className="relative flex flex-col items-start gap-3">
              <button type="button" onClick={() => irAAgenda()} className="boton boton-laton w-full" draggable={false}>
                Agenda tu cita
              </button>
              <a
                href={BARBERIA.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                draggable={false}
                className="etiqueta inline-flex min-h-[44px] items-center gap-2 text-hueso/80 transition-colors hover:text-laton-claro"
              >
                <IconoInstagram className="size-4" />
                Más cortes en @{BARBERIA.instagram.usuario}
              </a>
            </div>
          </m.div>
        </m.li>
      </m.ul>

      <p className="contenedor mt-3 flex items-center gap-2 text-xs text-niebla md:hidden" aria-hidden="true">
        <ArrowRight className="size-3.5" strokeWidth={1.5} />
        Desliza para ver más
      </p>
    </section>
  )
}

/** Cada lámina entra destapándose de abajo arriba (o, con «reducir movimiento», con un fundido). */
function entrada(menos) {
  return menos
    ? { oculto: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.4 } } }
    : {
        oculto: { clipPath: 'inset(100% 0% 0% 0%)', y: 40 },
        visible: { clipPath: 'inset(0% 0% 0% 0%)', y: 0, transition: { duration: 1.1, ease: EXPO } },
      }
}

function Lamina({ estilo, numero, contenedor, sesgo, menos, alAgendar }) {
  const ref = useRef(null)
  const servicio = buscarServicio(estilo.servicio)
  // Paralaje lateral: la foto se desliza un poco más lento que la lámina al cruzar el carrusel.
  const { scrollXProgress } = useScroll({ target: ref, container: contenedor, axis: 'x', offset: ['start end', 'end start'] })
  const x = useTransform(scrollXProgress, [0, 1], ['9%', '-9%'])

  return (
    <m.li ref={ref} variants={entrada(menos)} className={ANCHO_LAMINA}>
      <m.article style={{ skewX: sesgo }} className="group">
        <figure>
          <div data-cursor="Arrastra" className="marco aspect-[4/5]">
            <m.div className="absolute inset-y-0 -inset-x-[11%]" style={{ x: menos ? 0 : x }}>
              <Foto
                id={estilo.foto}
                rellenar
                vineta
                sizes="(min-width: 1280px) 520px, (min-width: 1024px) 500px, (min-width: 640px) 55vw, 96vw"
                imgClassName="transition-transform duration-700 ease-expo group-hover:scale-[1.05]"
              />
            </m.div>
            <Grano fijo={false} opacidad={0.1} />
            <span className="etiqueta absolute left-5 top-5 z-[3] rounded-full bg-carbon/75 px-3 py-1.5 text-[10px] text-hueso md:text-[11px]">
              {servicio?.nombre}
            </span>
            <span
              aria-hidden="true"
              className="texto-contorno absolute bottom-3 right-5 z-[3] font-display text-[5.5rem] leading-none lg:text-[6.5rem]"
            >
              {numero}
            </span>
          </div>
          <figcaption className="mt-5 lg:mt-6">
            <h3 className="font-display text-[2.1rem] uppercase leading-none tracking-[0.01em] lg:text-[2.5rem]">{estilo.nombre}</h3>
            <p className="mt-2 text-[0.95rem] text-niebla">{estilo.detalle}</p>
          </figcaption>
        </figure>
        <button
          type="button"
          onClick={alAgendar}
          draggable={false}
          aria-label={`Lo quiero: agendar ${servicio?.nombre ?? 'una cita'} (${estilo.nombre})`}
          className="etiqueta mt-2 inline-flex min-h-[44px] items-center gap-2 text-laton transition-colors hover:text-laton-claro"
        >
          Lo quiero
          <ArrowUpRight
            className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            strokeWidth={1.75}
          />
        </button>
      </m.article>
    </m.li>
  )
}

function BotonFlecha({ etiqueta, onClick, desactivado, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={desactivado}
      aria-label={etiqueta}
      className="grid size-11 place-items-center rounded-full border border-hueso/20 text-hueso transition-colors duration-300 hover:border-laton hover:bg-laton hover:text-carbon disabled:opacity-30"
    >
      {children}
    </button>
  )
}
