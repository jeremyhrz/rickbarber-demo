import { useRef } from 'react'
import { m, useScroll, useTransform } from 'framer-motion'
import Rotulo from '../components/Rotulo'
import TextoDividido from '../components/TextoDividido'
import Revelar from '../components/Revelar'
import Foto from '../components/Foto'
import Magnetico from '../components/Magnetico'
import { BARBERIA, TEXTOS } from '../data/barberia.js'
import { useAgenda } from '../lib/agenda'
import { EXPO, VISTA, useMenosMovimiento } from '../lib/movimiento'
import Marco from './vitrina/Marco'
import './vitrina/vitrina.css'

/**
 * Rick (#rick): «El de la silla». Dos láminas que se cruzan con paralaje (Rick cortando y Rick
 * riéndose con un cliente, con su «No deberías ser tan cercana…» pegado encima), un texto corto en
 * su voz y su frase del ex como cita. Sin años de experiencia ni premios: solo lo que él publica.
 */
export default function Rick() {
  const menos = useMenosMovimiento()
  const { irAAgenda } = useAgenda()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const yAtras = useTransform(scrollYProgress, [0, 1], [24, -24])
  const yDelante = useTransform(scrollYProgress, [0, 1], [48, -48])
  const { nombre, apodo } = BARBERIA.barbero

  return (
    <section id="rick" aria-labelledby="rick-titulo" className="seccion relative overflow-hidden border-t border-hueso/10">
      <div className="contenedor grid gap-14 lg:grid-cols-12 lg:gap-x-16 lg:gap-y-12">
        <header className="lg:col-span-6 lg:col-start-1 lg:row-start-1">
          <Rotulo id="rick" />
          <TextoDividido como="h2" id="rick-titulo" texto="El de la *silla*" className="titulo-seccion mt-6" />
        </header>

        {/* Collage: dos láminas que se cruzan */}
        <div ref={ref} className="relative mx-auto mb-4 aspect-[10/11] w-full max-w-[540px] lg:mb-0 lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:row-start-1 lg:self-center">
          <m.div
            className="absolute left-0 top-0 w-[63%]"
            style={{ y: menos ? 0 : yAtras, rotate: -2.5 }}
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={VISTA}
            transition={{ duration: 1.1, ease: EXPO }}
          >
            <Marco id="rick-cortando" sizes="(min-width: 1024px) 340px, 63vw" className="shadow-profunda" />
            <p className="etiqueta mt-3 text-[10px] text-niebla">Manos a la obra</p>
          </m.div>

          <m.div
            className="absolute bottom-0 right-0 w-[54%]"
            style={{ y: menos ? 0 : yDelante, rotate: 3 }}
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={VISTA}
            transition={{ duration: 1.1, ease: EXPO, delay: 0.15 }}
          >
            <Marco id="rick-sonrie" sizes="(min-width: 1024px) 300px, 54vw" posicion="50% 0%" className="shadow-profunda" />
            {/* Su texto de video, como lo publicó («cercana», tal cual). Va abajo, sobre la capa amarilla:
                arriba tapaba la cara de Rick, que es justo lo que la foto enseña. */}
            <p className="absolute -left-[6%] top-[66%] z-[4] max-w-[12rem] -rotate-[5deg] rounded-md bg-hueso px-3 py-2 text-[0.8rem] font-semibold leading-snug text-carbon shadow-profunda sm:-left-[20%] sm:top-[64%] sm:max-w-[13rem] sm:text-sm">
              «{TEXTOS.cercana}»
            </p>
          </m.div>
        </div>

        <div className="lg:col-span-6 lg:col-start-1 lg:row-start-2">
          <Revelar como="p" className="max-w-lg text-lg leading-relaxed text-hueso/90 lg:text-xl">
            Me llamo {nombre}, pero en la silla soy <span className="text-laton">{apodo}</span>. Cortes actuales, barbas bien
            perfiladas y buena conversación: aquí vienes a salir nuevo y, de paso, a reírte un rato.
          </Revelar>

          <Revelar como="figure" retraso={0.1} className="relative mt-12 border-l border-laton/50 pl-6 lg:mt-14 lg:pl-8">
            <span aria-hidden="true" className="absolute -top-7 left-4 font-display text-[5rem] leading-none text-laton/80 lg:left-6">
              “
            </span>
            <blockquote className="text-[1.45rem] font-light leading-snug text-hueso lg:text-[1.75rem]">{TEXTOS.ex}</blockquote>
            <figcaption className="mt-6 flex items-center gap-4">
              <span className="relative size-12 shrink-0 overflow-hidden rounded-full ring-1 ring-laton ring-offset-2 ring-offset-carbon">
                <Foto id="perfil" alt="" sizes="48px" className="size-full" />
              </span>
              <span className="leading-tight">
                <span className="block font-semibold">
                  {nombre} «{apodo}»
                </span>
                <span className="text-sm text-niebla">El barbero · @{BARBERIA.instagram.usuario}</span>
              </span>
            </figcaption>
          </Revelar>

          <Revelar retraso={0.15} className="mt-12">
            <Magnetico>
              <button type="button" onClick={() => irAAgenda()} className="boton boton-laton">
                Agenda con {apodo}
              </button>
            </Magnetico>
          </Revelar>
        </div>
      </div>
    </section>
  )
}
