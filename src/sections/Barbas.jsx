import { useRef } from 'react'
import { m, useScroll, useTransform } from 'framer-motion'
import Rotulo from '../components/Rotulo'
import TextoDividido from '../components/TextoDividido'
import Revelar from '../components/Revelar'
import Foto from '../components/Foto'
import Grano from '../components/Grano'
import BotonWhatsApp from '../components/BotonWhatsApp'
import Magnetico from '../components/Magnetico'
import { IconoNavaja, IconoPeine } from '../components/Iconos'
import { TEXTOS, buscarServicio } from '../data/barberia.js'
import { useAgenda } from '../lib/agenda'
import { mensajeServicio } from '../lib/whatsapp'
import { EXPO, VISTA, useMenosMovimiento } from '../lib/movimiento'
import './vitrina/vitrina.css'

/**
 * Especialistas en barbas (#barbas): el bloque protagonista. La foto de la navaja se abre con el
 * scroll (clip-path + escala), detrás corre «NAVAJA · PERFILADO» gigante en contorno, una navaja
 * traza la línea del perfilado y la frase real del pecho queda pegada como en su video.
 */

const PASOS = [
  { icono: IconoPeine, nombre: 'Perfilado', texto: 'Líneas limpias y un contorno parejo, a la medida de tu cara.' },
  { icono: IconoNavaja, nombre: 'Afeitado con navaja', texto: 'El acabado al ras que solo da la navaja.' },
]

export default function Barbas() {
  const menos = useMenosMovimiento()
  const { irAAgenda } = useAgenda()
  const barba = buscarServicio('barba')
  const ref = useRef(null)
  const refFoto = useRef(null)

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const fondoX = useTransform(scrollYProgress, [0, 1], ['6%', '-46%'])
  const { scrollYProgress: avanceFoto } = useScroll({ target: refFoto, offset: ['start end', 'center center'] })
  const recorte = useTransform(avanceFoto, [0, 1], ['inset(16% 12% 16% 12%)', 'inset(0% 0% 0% 0%)'])
  const escala = useTransform(avanceFoto, [0, 1], [1.3, 1])

  return (
    <section ref={ref} id="barbas" aria-labelledby="barbas-titulo" className="seccion relative overflow-hidden border-t border-hueso/10">
      {/* Palabra gigante de fondo, en contorno, que corre con el scroll */}
      <m.p
        aria-hidden="true"
        className="texto-contorno pointer-events-none absolute left-0 top-[9%] hidden select-none whitespace-nowrap font-display text-[24vw] uppercase leading-none opacity-[0.18] lg:block"
        style={{ x: menos ? 0 : fondoX }}
      >
        Navaja · Perfilado · Navaja
      </m.p>

      <div className="contenedor relative">
        <Rotulo id="barbas" />
        <TextoDividido
          como="h2"
          id="barbas-titulo"
          texto={`Especialistas en *barbas*`}
          className="titulo-seccion mt-6 lg:max-w-[12ch]"
        />

        {/* La navaja traza la línea del perfilado */}
        <div className="relative mt-8 h-8 max-w-xl lg:mt-10" aria-hidden="true">
          <m.span
            className="absolute inset-x-0 top-1/2 h-px origin-left bg-laton/70"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={VISTA}
            transition={{ duration: 1.6, ease: EXPO, delay: 0.2 }}
          />
          <m.span
            className="absolute inset-0"
            initial={{ x: '-100%' }}
            whileInView={{ x: '0%' }}
            viewport={VISTA}
            transition={{ duration: 1.6, ease: EXPO, delay: 0.2 }}
          >
            <IconoNavaja className="absolute right-0 top-1/2 size-8 -translate-y-1/2 translate-x-1/2 text-laton-claro" grosor={1.3} />
          </m.span>
        </div>

        <div className="mt-10 grid gap-14 lg:mt-14 lg:grid-cols-12 lg:items-center lg:gap-x-16">
          {/* Foto protagonista */}
          <div ref={refFoto} className="relative lg:col-span-7">
            <m.div className="marco shadow-profunda" style={{ clipPath: menos ? undefined : recorte }}>
              <m.div style={{ scale: menos ? 1 : escala }} className="relative">
                {/* Cuadrada en el teléfono (encuadre más cerrado), 4:3 desde la tableta */}
                <Foto id="barba-navaja-cuadrada" vineta sizes="92vw" className="md:hidden" />
                <Foto id="barba-navaja" vineta sizes="(min-width: 1280px) 760px, (min-width: 1024px) 58vw, 92vw" className="hidden md:block" />
              </m.div>
              <Grano fijo={false} opacidad={0.12} />
              <span className="etiqueta absolute left-5 top-5 z-[3] flex items-center gap-2 rounded-full bg-carbon/75 px-3 py-1.5 text-[10px] text-hueso md:text-[11px]">
                <span className="size-1.5 rounded-full bg-laton" />
                {barba.etiquetas.join(' · ')}
              </span>
            </m.div>

            {/* La frase real del pecho, pegada como el texto de su video */}
            <m.figure
              className="relative z-[4] -mt-10 ml-auto mr-2 max-w-[19rem] md:-mt-14 md:mr-8 lg:absolute lg:-bottom-12 lg:-right-10 lg:m-0 lg:max-w-[21rem]"
              initial={{ opacity: 0, y: 30, rotate: 0 }}
              whileInView={{ opacity: 1, y: 0, rotate: -3 }}
              viewport={VISTA}
              transition={{ duration: 0.9, ease: EXPO, delay: 0.35 }}
            >
              <blockquote className="rounded-lg bg-hueso px-4 py-3 text-[0.95rem] font-semibold leading-snug text-carbon shadow-profunda">
                «{TEXTOS.pecho}»
              </blockquote>
              <figcaption className="etiqueta mt-3 text-right text-[10px] text-niebla">— Visto en su Instagram</figcaption>
            </m.figure>
          </div>

          {/* Texto */}
          <div className="lg:col-span-5">
            <Revelar como="p" className="max-w-md text-lg leading-relaxed text-hueso/90 lg:text-xl">
              {barba.descripcion}
            </Revelar>

            <ol className="mt-10 border-t border-hueso/10">
              {PASOS.map((paso, i) => {
                const IconoPaso = paso.icono
                return (
                  <Revelar key={paso.nombre} como="li" retraso={0.1 * i} className="flex gap-5 border-b border-hueso/10 py-6">
                    <span className="font-display text-sm leading-6 text-laton">0{i + 1}</span>
                    <div className="flex-1">
                      <h3 className="flex items-center justify-between gap-4 font-display text-[1.75rem] uppercase leading-none">
                        {paso.nombre}
                        <IconoPaso className="size-7 shrink-0 text-laton" grosor={1.3} />
                      </h3>
                      <p className="mt-2 text-niebla">{paso.texto}</p>
                    </div>
                  </Revelar>
                )
              })}
            </ol>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Magnetico className="w-full sm:w-auto">
                <button type="button" onClick={() => irAAgenda('barba')} className="boton boton-laton w-full sm:w-auto">
                  Agendar barba
                </button>
              </Magnetico>
              <BotonWhatsApp mensaje={mensajeServicio(barba)} className="w-full sm:w-auto">
                Pregúntale a Rick
              </BotonWhatsApp>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
