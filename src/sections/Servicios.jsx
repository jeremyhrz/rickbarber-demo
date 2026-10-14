import { useState } from 'react'
import clsx from 'clsx'
import { AnimatePresence, m } from 'framer-motion'
import { ArrowRight, Plus } from 'lucide-react'
import Foto from '../components/Foto'
import Grano from '../components/Grano'
import { Icono, IconoWhatsApp } from '../components/Iconos'
import Revelar from '../components/Revelar'
import Rotulo from '../components/Rotulo'
import TextoDividido from '../components/TextoDividido'
import { SERVICIOS, buscarServicio, textoPrecio } from '../data/barberia.js'
import { useAgenda } from '../lib/agenda'
import { EXPO, useMenosMovimiento } from '../lib/movimiento'
import { enlaceWhatsApp, mensajeServicio } from '../lib/whatsapp.js'
import { useMedia } from './agenda/useMedia'
import './agenda/agenda.css'

// Encuadre de cada foto cuando el marco no tiene su misma proporción (las caras, arriba).
const ENCUADRE = {
  'rubio-textura': '50% 38%',
  'barba-navaja': '50% 50%',
  'rick-cortando': '50% 30%',
  'fade-verde': '50% 45%',
  'rick-sonrie': '50% 0%',
}

/**
 * #servicios (brief §6.5): los servicios de SERVICIOS, numerados, con su icono, descripción,
 * etiquetas y «Precio a consultar». «Agendar este» lo deja marcado en la Agenda y baja a #agenda.
 * - Teléfono: acordeón; al abrir una fila se destapa su foto.
 * - Escritorio: índice editorial; la fila bajo el cursor enciende su foto en el marco fijo.
 */
export default function Servicios() {
  const escritorio = useMedia('(min-width: 1024px)')
  return (
    <section id="servicios" aria-labelledby="servicios-titulo" className="seccion relative border-t border-hueso/10">
      <div className="contenedor">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-16">
          <div className="lg:col-span-7">
            <Rotulo id="servicios" />
            <TextoDividido como="h2" id="servicios-titulo" texto="Lo que *hacemos*" className="titulo-seccion mt-6" />
          </div>
          <Revelar como="p" retraso={0.1} y={20} className="max-w-md text-[1.05rem] leading-relaxed text-hueso/80 lg:col-span-5 lg:pb-2">
            Cortes actuales, barbas en manos de especialistas y asesoría en cirugía capilar. Elige el tuyo y te lo dejamos
            marcado en la agenda.
          </Revelar>
        </div>
        {escritorio ? <IndiceEscritorio /> : <AcordeonTelefono />}
      </div>
    </section>
  )
}

/* ── Teléfono (y tableta): acordeón ───────────────────────────────────────────────── */

function AcordeonTelefono() {
  const { irAAgenda } = useAgenda()
  const [abierto, setAbierto] = useState(SERVICIOS[0].id)
  // Las fotos se montan la primera vez que se abre su fila (no se descargan las 5 de golpe).
  const [vistos, setVistos] = useState(() => new Set([SERVICIOS[0].id]))

  const alternar = (id) => {
    setAbierto((actual) => (actual === id ? null : id))
    setVistos((previos) => (previos.has(id) ? previos : new Set(previos).add(id)))
  }

  return (
    <ol className="mt-12 border-t border-hueso/10 md:mt-16">
      {SERVICIOS.map((s, i) => {
        const esAbierto = abierto === s.id
        const idPanel = `servicio-${s.id}`
        return (
          <Revelar como="li" key={s.id} retraso={Math.min(i, 3) * 0.05} y={24} className="border-b border-hueso/10">
            <h3>
              <button
                type="button"
                id={`${idPanel}-boton`}
                aria-expanded={esAbierto}
                aria-controls={idPanel}
                onClick={() => alternar(s.id)}
                className="group flex w-full items-center gap-4 py-5 text-left"
              >
                <span
                  className={clsx(
                    'grid size-12 shrink-0 place-items-center rounded-full ring-1 transition-colors duration-500',
                    esAbierto ? 'bg-laton text-carbon ring-laton' : 'text-laton ring-hueso/15',
                  )}
                >
                  <Icono nombre={s.icono} className="size-6" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="etiqueta block text-laton">{s.numero}</span>
                  <span
                    className={clsx(
                      'mt-1 block font-display text-[clamp(1.6rem,7.4vw,2.6rem)] uppercase leading-[0.95] transition-colors duration-500 [overflow-wrap:anywhere]',
                      esAbierto ? 'text-hueso' : 'text-hueso/85',
                    )}
                  >
                    {s.titulo}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className={clsx(
                    'grid size-10 shrink-0 place-items-center rounded-full ring-1 transition-[transform,background-color,color] duration-500 ease-expo motion-reduce:transition-none',
                    esAbierto ? 'rotate-45 bg-hueso text-carbon ring-hueso' : 'text-hueso ring-hueso/20',
                  )}
                >
                  <Plus className="size-4" strokeWidth={2} />
                </span>
              </button>
            </h3>
            <div id={idPanel} role="region" aria-labelledby={`${idPanel}-boton`} className="plegable" data-abierto={esAbierto} inert={!esAbierto}>
              <div>
                <div className="grid gap-6 pb-8 md:grid-cols-2 md:items-center md:gap-10">
                  {vistos.has(s.id) && <FotoTelefono servicio={s} abierto={esAbierto} />}
                  <div>
                    <p className="text-hueso/85">{s.descripcion}</p>
                    <Etiquetas lista={s.etiquetas} className="mt-4" />
                    <p className="etiqueta mt-6 flex items-center gap-2.5 text-niebla">
                      <span aria-hidden="true" className="size-1.5 rounded-full bg-laton" />
                      {textoPrecio(s)}
                    </p>
                    <div className="mt-4 flex gap-2.5">
                      <button type="button" onClick={() => irAAgenda(s.id)} className="boton boton-laton flex-1">
                        Agendar este
                        <ArrowRight className="size-4" aria-hidden="true" />
                      </button>
                      <a
                        href={enlaceWhatsApp(mensajeServicio(s))}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Pregúntale a Rick por ${s.nombre} en WhatsApp`}
                        className="grid size-[52px] shrink-0 place-items-center rounded-full text-hueso ring-1 ring-hueso/25 transition-colors duration-300 hover:bg-hueso hover:text-carbon"
                      >
                        <IconoWhatsApp className="size-[22px]" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Revelar>
        )
      })}
    </ol>
  )
}

function FotoTelefono({ servicio: s, abierto }) {
  const menos = useMenosMovimiento()
  const cerrado = 'inset(0% 0% 100% 0% round 18px)'
  const pleno = 'inset(0% 0% 0% 0% round 18px)'
  return (
    <m.div
      className="relative aspect-[5/4] overflow-hidden rounded-[18px] bg-grafito md:aspect-[4/5]"
      initial={menos ? { opacity: 0 } : { clipPath: cerrado }}
      animate={menos ? { opacity: abierto ? 1 : 0 } : { clipPath: abierto ? pleno : cerrado }}
      transition={{ duration: menos ? 0.3 : 0.95, ease: EXPO, delay: abierto && !menos ? 0.12 : 0 }}
    >
      <m.div
        className="absolute inset-0"
        initial={menos ? false : { scale: 1.2 }}
        animate={{ scale: abierto ? 1 : 1.2 }}
        transition={{ duration: 1.3, ease: EXPO, delay: abierto ? 0.12 : 0 }}
      >
        <Foto id={s.foto} rellenar vineta sizes="(min-width: 768px) 45vw, 92vw" posicion={ENCUADRE[s.foto]} />
      </m.div>
      <Grano fijo={false} opacidad={0.08} />
      <span aria-hidden="true" className="texto-contorno absolute bottom-1 right-4 font-display text-[4.75rem] leading-none">
        {s.numero}
      </span>
    </m.div>
  )
}

/* ── Escritorio: índice editorial + foto fija ─────────────────────────────────────── */

function IndiceEscritorio() {
  const { irAAgenda } = useAgenda()
  const [foto, setFoto] = useState({ actual: SERVICIOS[0].id, previa: null })
  const mostrar = (id) => setFoto((f) => (f.actual === id ? f : { actual: id, previa: f.actual }))

  return (
    <div className="mt-20 grid grid-cols-12 gap-16">
      <ol className="col-span-7 border-t border-hueso/10">
        {SERVICIOS.map((s, i) => {
          const activo = foto.actual === s.id
          return (
            <Revelar
              como="li"
              key={s.id}
              retraso={i * 0.06}
              y={28}
              onPointerEnter={() => mostrar(s.id)}
              onFocus={() => mostrar(s.id)}
              className="relative border-b border-hueso/10"
            >
              <span
                aria-hidden="true"
                className={clsx(
                  'absolute inset-x-0 -top-px h-px origin-left bg-laton transition-transform duration-700 ease-expo motion-reduce:transition-none',
                  activo ? 'scale-x-100' : 'scale-x-0',
                )}
              />
              <div className="grid grid-cols-[3.5rem_minmax(0,1fr)_auto] gap-x-6 py-9">
                <span className={clsx('etiqueta pt-2.5 transition-colors duration-500', activo ? 'text-laton' : 'text-niebla')}>
                  {s.numero}
                </span>
                <div>
                  <h3
                    className={clsx(
                      'font-display text-[clamp(2.5rem,3.6vw,3.6rem)] uppercase leading-[0.92] transition-colors duration-700 ease-expo',
                      activo ? 'text-hueso' : 'text-hueso/55',
                    )}
                  >
                    {s.titulo}
                  </h3>
                  <p className="mt-4 max-w-[34rem] text-hueso/75">{s.descripcion}</p>
                  <Etiquetas lista={s.etiquetas} className="mt-5" />
                  <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-3">
                    <button
                      type="button"
                      onClick={() => irAAgenda(s.id)}
                      className={clsx('boton boton-chico', activo ? 'boton-laton' : 'boton-linea')}
                    >
                      Agendar este
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </button>
                    <a
                      href={enlaceWhatsApp(mensajeServicio(s))}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/precio inline-flex min-h-11 items-center gap-3 text-[0.88rem]"
                    >
                      <span className="etiqueta text-niebla">{textoPrecio(s)}</span>
                      <span aria-hidden="true" className="h-3.5 w-px bg-hueso/20" />
                      <span className="flex items-center gap-1.5 font-semibold text-laton transition-colors duration-300 group-hover/precio:text-laton-claro">
                        <IconoWhatsApp className="size-4" />
                        Pregúntale a Rick
                      </span>
                    </a>
                  </div>
                </div>
                <span
                  className={clsx(
                    'grid size-16 place-items-center rounded-full ring-1 transition-colors duration-500',
                    activo ? 'bg-laton text-carbon ring-laton' : 'text-laton ring-hueso/15',
                  )}
                >
                  <Icono nombre={s.icono} className="size-7" grosor={1.4} />
                </span>
              </div>
            </Revelar>
          )
        })}
      </ol>
      <div className="col-span-5">
        <div className="sticky top-[calc(var(--alto-nav)+2.5rem)]">
          <FotoActiva actual={foto.actual} previa={foto.previa} alAgendar={irAAgenda} />
        </div>
      </div>
    </div>
  )
}

/** El marco de escritorio: la foto nueva se destapa de abajo arriba encima de la anterior. */
function FotoActiva({ actual, previa, alAgendar }) {
  const menos = useMenosMovimiento()
  const s = buscarServicio(actual)
  return (
    <Revelar y={40}>
      <div
        aria-hidden="true"
        data-cursor="Agendar"
        onClick={() => alAgendar(actual)}
        className="relative aspect-[4/5] cursor-pointer overflow-hidden rounded-[28px] bg-grafito shadow-profunda ring-1 ring-hueso/10"
      >
        {SERVICIOS.map((x) => {
          const esActual = x.id === actual
          const esPrevia = x.id === previa
          const visible = esActual || esPrevia
          return (
            <m.div
              key={x.id}
              className="absolute inset-0"
              style={{ zIndex: esActual ? 2 : esPrevia ? 1 : 0 }}
              initial={false}
              animate={menos ? { opacity: esActual ? 1 : 0 } : { clipPath: visible ? 'inset(0% 0% 0% 0%)' : 'inset(100% 0% 0% 0%)' }}
              transition={esActual ? { duration: menos ? 0.3 : 0.95, ease: EXPO } : { duration: 0 }}
            >
              <m.div
                className="absolute inset-0"
                initial={false}
                animate={{ scale: esActual ? 1 : 1.14 }}
                transition={{ duration: 1.3, ease: EXPO }}
              >
                <Foto id={x.foto} alt="" rellenar vineta sizes="(min-width: 1024px) 36vw, 1px" posicion={ENCUADRE[x.foto]} />
              </m.div>
            </m.div>
          )
        })}
        <Grano fijo={false} opacidad={0.09} />
        <div className="absolute inset-x-0 bottom-0 z-[3] flex items-end justify-between gap-6 p-7">
          <AnimatePresence mode="wait" initial={false}>
            <m.span
              key={actual}
              className="texto-contorno font-display text-[7.5rem] leading-[0.8]"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12, transition: { duration: 0.2 } }}
              transition={{ duration: 0.7, ease: EXPO }}
            >
              {s.numero}
            </m.span>
          </AnimatePresence>
          <span className="etiqueta pb-2 text-right text-hueso/85">{s.nombre}</span>
        </div>
      </div>
    </Revelar>
  )
}

function Etiquetas({ lista, className }) {
  return (
    <ul className={clsx('flex flex-wrap gap-2', className)}>
      {lista.map((etiqueta) => (
        <li key={etiqueta} className="rounded-full px-3 py-1 text-[0.78rem] font-semibold text-hueso/80 ring-1 ring-hueso/15">
          {etiqueta}
        </li>
      ))}
    </ul>
  )
}
