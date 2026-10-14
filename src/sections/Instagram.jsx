import { m } from 'framer-motion'
import { Play } from 'lucide-react'
import Rotulo from '../components/Rotulo'
import TextoDividido from '../components/TextoDividido'
import Revelar from '../components/Revelar'
import Foto from '../components/Foto'
import Grano from '../components/Grano'
import Contador from '../components/Contador'
import Magnetico from '../components/Magnetico'
import { IconoInstagram } from '../components/Iconos'
import { BARBERIA, HISTORIAS } from '../data/barberia.js'
import { EXPO, VISTA, useMenosMovimiento } from '../lib/movimiento'
import { sinEmojis } from '../lib/texto'
import './vitrina/vitrina.css'

/**
 * Instagram (#instagram): su perfil con anillo de historia, el contador que sube hasta sus 1.492
 * seguidores y 95 publicaciones, y la tira de sus 6 últimas publicaciones como historias (con sus
 * textos reales) que enlazan al perfil. En el teléfono la tira se desliza; desde 1024 px, rejilla.
 */
export default function Instagram() {
  const menos = useMenosMovimiento()
  const ig = BARBERIA.instagram
  const enlace = { href: ig.url, target: '_blank', rel: 'noopener noreferrer' }

  const destapar = menos
    ? { oculto: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.4 } } }
    : {
        oculto: { clipPath: 'inset(100% 0% 0% 0%)', y: 30 },
        visible: { clipPath: 'inset(0% 0% 0% 0%)', y: 0, transition: { duration: 1, ease: EXPO } },
      }

  return (
    <section id="instagram" aria-labelledby="instagram-titulo" className="seccion relative border-t border-hueso/10">
      <div className="contenedor">
        <Rotulo id="instagram" />

        <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-x-16">
          <div className="lg:col-span-7">
            {/* Perfil con anillo de historia en latón */}
            <Revelar className="flex items-center gap-4">
              <a {...enlace} aria-label={`Perfil de @${ig.usuario} en Instagram`} className="relative shrink-0 rounded-full p-[3px]">
                <span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full motion-safe:animate-girar"
                  style={{ background: 'conic-gradient(from 0deg, #E3C88E, #9C7A3C, #C9A15B, #F2EDE4, #E3C88E)' }}
                />
                <span className="relative block rounded-full bg-carbon p-[3px]">
                  <Foto id="perfil" alt="" sizes="64px" className="size-14 rounded-full lg:size-16" />
                </span>
              </a>
              <div className="min-w-0 leading-tight">
                <p className="font-semibold">@{ig.usuario}</p>
                <p className="truncate text-sm text-niebla">{BARBERIA.nombreCompleto}</p>
              </div>
            </Revelar>

            <TextoDividido
              como="h2"
              id="instagram-titulo"
              texto={`La silla, *en vivo*`}
              className="titulo-seccion mt-8"
            />
          </div>

          {/* Cifras reales al 14-oct-2026 */}
          <dl className="grid grid-cols-[auto_1fr] items-end gap-x-8 border-y border-hueso/10 py-6 lg:col-span-5">
            <div className="flex flex-col-reverse">
              <dt className="etiqueta mt-3 text-niebla">Seguidores</dt>
              <dd className="font-display text-[clamp(3.6rem,19vw,7rem)] leading-[0.82] text-laton">
                <Contador valor={ig.seguidores} duracion={2.2} />
              </dd>
            </div>
            <div className="flex flex-col-reverse">
              <dt className="etiqueta mt-3 text-niebla">Publicaciones</dt>
              <dd className="font-display text-[clamp(2.2rem,10vw,3.5rem)] leading-[0.82]">
                <Contador valor={ig.publicaciones} duracion={2.2} retraso={0.2} />
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Tira de historias */}
      <m.ul
        aria-label={`Últimas publicaciones de @${ig.usuario}`}
        className="tira sin-barra contenedor mt-12 gap-3 pb-2 lg:mt-16 lg:grid lg:grid-cols-6 lg:items-start lg:gap-4"
        variants={{ oculto: {}, visible: { transition: { staggerChildren: 0.08 } } }}
        initial="oculto"
        whileInView="visible"
        viewport={VISTA}
      >
        {HISTORIAS.map((historia, i) => (
          <m.li key={historia.id} variants={destapar} className="w-[44vw] max-w-[220px] lg:w-auto lg:max-w-none lg:even:mt-12">
            <a {...enlace} aria-label={`${sinEmojis(historia.texto)} Ver en Instagram`} data-cursor="Ver" className="group block">
              <div className="relative aspect-[9/16] overflow-hidden rounded-xl bg-grafito ring-1 ring-hueso/10">
                <Foto
                  id={historia.foto}
                  alt=""
                  rellenar
                  sizes="(min-width: 1024px) 220px, 44vw"
                  imgClassName="transition-transform duration-700 ease-expo group-hover:scale-[1.06]"
                />
                <Grano fijo={false} opacidad={0.08} />
                <span aria-hidden="true" className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-carbon/70 to-transparent" />
                {/* Barras de historia: las anteriores llenas, la actual se llena al pasar el cursor */}
                <span aria-hidden="true" className="absolute inset-x-2 top-2 flex gap-1">
                  {HISTORIAS.map((otra, j) => (
                    <span key={otra.id} className="relative h-[2px] flex-1 overflow-hidden rounded-full bg-hueso/30">
                      {j < i && <span className="absolute inset-0 bg-hueso" />}
                      {j === i && <span className="historia__llenado absolute inset-0 bg-hueso" />}
                    </span>
                  ))}
                </span>
                <span aria-hidden="true" className="absolute left-2 top-5 flex items-center gap-1.5">
                  <Foto id="perfil" alt="" sizes="24px" className="size-5 rounded-full ring-1 ring-hueso/60" />
                  <span className="text-[11px] font-semibold text-hueso [text-shadow:0_1px_4px_rgb(0_0_0/0.6)]">{ig.usuario}</span>
                </span>
                <span
                  aria-hidden="true"
                  className="absolute bottom-3 right-3 grid size-9 place-items-center rounded-full bg-carbon/60 text-hueso backdrop-blur-sm transition-colors duration-300 group-hover:bg-laton group-hover:text-carbon"
                >
                  <Play className="size-4 translate-x-px" strokeWidth={1.75} fill="currentColor" />
                </span>
              </div>
              <p className="mt-3 line-clamp-2 text-sm leading-snug text-niebla transition-colors duration-300 group-hover:text-hueso">
                {historia.texto}
              </p>
            </a>
          </m.li>
        ))}
      </m.ul>

      <div className="contenedor mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-center lg:mt-16">
        <Magnetico>
          <a {...enlace} className="boton boton-laton">
            <IconoInstagram className="size-[1.2em] shrink-0" />
            <span>Síguenos @{ig.usuario}</span>
          </a>
        </Magnetico>
        <p className="max-w-xs text-sm text-niebla">Cortes nuevos, barbas y uno que otro chiste.</p>
      </div>
    </section>
  )
}
