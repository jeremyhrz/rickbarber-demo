import clsx from 'clsx'
import { m } from 'framer-motion'
import { ArrowLeft, CalendarDays, Check, ChevronRight, RotateCcw, Sun, Sunset } from 'lucide-react'
import BotonWhatsApp from '../../components/BotonWhatsApp'
import { Icono, IconoWhatsApp } from '../../components/Iconos'
import Poste from '../../components/Poste'
import { SERVICIOS } from '../../data/barberia.js'
import { enlaceWhatsApp, mensajeGeneral } from '../../lib/whatsapp.js'
import { EXPO } from '../../lib/movimiento'
import Ticket from './Ticket'
import VistaMensaje from './VistaMensaje'

/** Los 4 pasos del asistente, en orden. */
export const PASOS = [
  { id: 'servicio', corto: 'Servicio', titulo: '¿Qué te vas a hacer?' },
  { id: 'dia', corto: 'Día', titulo: '¿Qué día vienes?' },
  { id: 'hora', corto: 'Hora', titulo: '¿A qué hora?' },
  { id: 'confirmar', corto: 'Confirmar', titulo: 'Tu ticket' },
]

/** Cada opción entra escalonada detrás del paso (el padre define el escalón). */
export const HIJO = {
  entrar: { opacity: 0, y: 14 },
  centro: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EXPO } },
}

const mayuscula = (texto) => texto.charAt(0).toUpperCase() + texto.slice(1)

/** «Hoy · 14 oct» / «Mañana · 15 oct» / «Vie 16 oct» (corto: va en un chip). */
export function nombreCortoDia(dia) {
  if (dia.esHoy) return `Hoy · ${dia.numero} ${dia.mes}`
  if (dia.esManana) return `Mañana · ${dia.numero} ${dia.mes}`
  return mayuscula(dia.corta)
}

/* ── Cabecera: volver, «Paso 2 de 4» y la barra de progreso ─────────────────────────── */

export function Progreso({ paso, alVolver }) {
  const inicio = paso === 0
  return (
    <div className="flex items-center gap-3">
      {/* En el paso 1 el hueco lo ocupa el poste; desde el 2, la flecha para volver. */}
      <div className="relative -ml-1 size-11 shrink-0">
        <span
          aria-hidden="true"
          className={clsx(
            'absolute inset-0 grid place-items-center rounded-full ring-1 ring-laton/30 transition-[opacity,transform] duration-500 ease-expo motion-reduce:transition-none',
            inicio ? 'scale-100 opacity-100' : 'scale-50 opacity-0',
          )}
        >
          <Poste className="h-7 w-auto" />
        </span>
        <button
          type="button"
          onClick={alVolver}
          disabled={inicio}
          aria-label="Volver al paso anterior"
          className="absolute inset-0 grid place-items-center rounded-full text-hueso ring-1 ring-hueso/20 transition-[opacity,background-color,transform] duration-500 ease-expo hover:bg-hueso/10 active:scale-90 disabled:pointer-events-none disabled:scale-50 disabled:opacity-0"
        >
          <ArrowLeft className="size-5" strokeWidth={1.75} aria-hidden="true" />
        </button>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <p className="etiqueta text-niebla">
            Paso <span className="text-hueso">{paso + 1}</span> de {PASOS.length}
          </p>
          <p className="etiqueta text-laton">{PASOS[paso].corto}</p>
        </div>
        <div className="mt-2.5 grid grid-cols-4 gap-1.5" aria-hidden="true">
          {PASOS.map((p, i) => (
            <span key={p.id} className="h-[3px] overflow-hidden rounded-full bg-hueso/10">
              <m.span
                className="block h-full origin-left rounded-full bg-laton"
                initial={false}
                animate={{ scaleX: i <= paso ? 1 : 0 }}
                transition={{ duration: 0.7, ease: EXPO, delay: i <= paso ? 0.08 : 0 }}
              />
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

/** Lo ya elegido, en chips que llevan de vuelta a su paso. */
export function Migas({ servicio, dia, paso, alIr }) {
  const migas = []
  if (servicio && paso > 0) {
    migas.push({
      paso: 0,
      icono: <Icono nombre={servicio.icono} className="size-4" />,
      texto: servicio.nombre,
      etiqueta: `Cambiar el servicio: ${servicio.nombre}`,
    })
  }
  if (dia && paso > 1) {
    migas.push({
      paso: 1,
      icono: <CalendarDays className="size-4" strokeWidth={1.75} />,
      texto: nombreCortoDia(dia),
      etiqueta: `Cambiar el día: ${dia.largo}`,
    })
  }
  if (!migas.length) return null
  return (
    <ul className="mt-4 flex flex-wrap gap-2">
      {migas.map((miga) => (
        <li key={miga.paso}>
          <button
            type="button"
            onClick={() => alIr(miga.paso)}
            aria-label={miga.etiqueta}
            className="flex min-h-11 items-center gap-1.5 rounded-full bg-hueso/[0.06] py-2 pl-2.5 pr-3.5 text-[0.84rem] font-semibold text-hueso ring-1 ring-hueso/10 transition-colors duration-300 hover:bg-hueso/[0.12] hover:ring-laton/40"
          >
            <span className="text-laton" aria-hidden="true">
              {miga.icono}
            </span>
            {miga.texto}
          </button>
        </li>
      ))}
    </ul>
  )
}

/* ── Paso 1: servicio ─────────────────────────────────────────────────────────────── */

export function PasoServicio({ elegido, alElegir }) {
  return (
    <ul className="grid gap-2">
      {SERVICIOS.map((s) => {
        const sel = elegido === s.id
        return (
          <m.li key={s.id} variants={HIJO}>
            <button
              type="button"
              aria-pressed={sel}
              onClick={() => alElegir(s.id)}
              className={clsx(
                'flex min-h-16 w-full items-center gap-3.5 rounded-2xl px-3 py-2.5 text-left ring-1 transition-[background-color,box-shadow,transform] duration-300 ease-suave active:scale-[0.985] xs:px-3.5',
                sel ? 'bg-laton/10 ring-laton/80' : 'bg-grafito-claro ring-hueso/[0.07] hover:ring-hueso/25',
              )}
            >
              <span
                className={clsx(
                  'grid size-11 shrink-0 place-items-center rounded-full ring-1 transition-colors duration-300',
                  sel ? 'bg-laton text-carbon ring-laton' : 'text-laton ring-laton/30',
                )}
              >
                <Icono nombre={s.icono} className="size-[22px]" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[1.02rem] font-bold leading-tight text-hueso">{s.nombre}</span>
                <span className="mt-1 block truncate text-[0.8rem] leading-tight text-niebla">{s.etiquetas.join(' · ')}</span>
              </span>
              <span
                aria-hidden="true"
                className={clsx(
                  'grid size-6 shrink-0 place-items-center rounded-full ring-1 transition-colors duration-300',
                  sel ? 'bg-laton text-carbon ring-laton' : 'text-transparent ring-hueso/25',
                )}
              >
                <Check className="size-3.5" strokeWidth={3} />
              </span>
            </button>
          </m.li>
        )
      })}
    </ul>
  )
}

/* ── Paso 2: día ──────────────────────────────────────────────────────────────────── */

export function PasoDia({ dias, elegido, alElegir }) {
  return (
    <ul className="grid grid-cols-4 gap-2 sm:gap-2.5">
      {dias.map((d) => {
        const sel = elegido === d.clave
        const marca = d.esHoy ? 'Hoy' : d.esManana ? 'Mañana' : d.mes
        return (
          <m.li key={d.clave} variants={HIJO}>
            <button
              type="button"
              aria-pressed={sel}
              aria-label={`${d.esHoy ? 'Hoy, ' : d.esManana ? 'Mañana, ' : ''}${d.largo}`}
              onClick={() => alElegir(d.clave)}
              className={clsx(
                'flex h-[5.5rem] w-full flex-col items-center justify-center rounded-2xl ring-1 transition-[background-color,box-shadow,color,transform] duration-300 ease-suave active:scale-95 sm:h-24',
                sel ? 'bg-laton text-carbon shadow-laton ring-laton' : 'bg-grafito-claro text-hueso ring-hueso/[0.07] hover:ring-hueso/25',
              )}
            >
              <span className={clsx('etiqueta text-[0.6rem]', sel ? 'text-carbon/75' : 'text-niebla')}>{d.diaSemana}</span>
              <span className="mt-1 font-display text-[1.9rem] leading-none tabular-nums sm:text-[2.1rem]">{d.numero}</span>
              <span
                className={clsx(
                  'mt-1.5 text-[0.7rem] font-bold leading-none',
                  sel ? 'text-carbon/80' : d.esHoy || d.esManana ? 'text-laton' : 'text-niebla',
                )}
              >
                {marca}
              </span>
            </button>
          </m.li>
        )
      })}
      <m.li variants={HIJO}>
        <a
          href={enlaceWhatsApp(mensajeGeneral())}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="¿Otro día? Escríbele a Rick por WhatsApp"
          className="flex h-[5.5rem] w-full flex-col items-center justify-center gap-1.5 rounded-2xl border border-dashed border-hueso/20 px-1 text-center text-niebla transition-colors duration-300 hover:border-laton/60 hover:text-hueso sm:h-24"
        >
          <IconoWhatsApp className="size-5" />
          <span className="text-[0.7rem] font-bold leading-tight">¿Otro día?</span>
        </a>
      </m.li>
    </ul>
  )
}

/* ── Paso 3: hora ─────────────────────────────────────────────────────────────────── */

const MOMENTOS = [
  { id: 'mañana', titulo: 'Mañana', Simbolo: Sun },
  { id: 'tarde', titulo: 'Tarde', Simbolo: Sunset },
]

export function PasoHora({ turnos, elegido, alElegir }) {
  const hayPasados = turnos.some((t) => !t.disponible)
  return (
    <div className="space-y-6">
      {MOMENTOS.map(({ id, titulo, Simbolo }) => {
        const lista = turnos.filter((t) => t.momento === id)
        if (!lista.length) return null
        return (
          <div key={id} role="group" aria-label={titulo}>
            <p className="etiqueta flex items-center gap-2 text-niebla" aria-hidden="true">
              <Simbolo className="size-4 text-laton" strokeWidth={1.75} />
              {titulo}
            </p>
            <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
              {lista.map((t) => {
                const sel = t.disponible && elegido === t.clave
                const [hora, ...resto] = t.etiqueta.split(' ')
                return (
                  <m.li key={t.clave} variants={HIJO}>
                    <button
                      type="button"
                      disabled={!t.disponible}
                      aria-pressed={sel}
                      aria-label={t.disponible ? t.etiqueta : `${t.etiqueta}, ya pasó`}
                      title={t.disponible ? undefined : 'Ya pasó'}
                      onClick={() => alElegir(t.clave)}
                      className={clsx(
                        'grid h-12 w-full place-items-center rounded-xl ring-1 transition-[background-color,box-shadow,color,transform] duration-300 ease-suave',
                        !t.disponible
                          ? 'cursor-not-allowed text-hueso/25 ring-hueso/[0.05]'
                          : sel
                            ? 'bg-laton text-carbon shadow-laton ring-laton'
                            : 'bg-grafito-claro text-hueso ring-hueso/[0.07] hover:ring-hueso/25 active:scale-95',
                      )}
                    >
                      <span className={clsx('whitespace-nowrap', !t.disponible && 'line-through decoration-hueso/40')}>
                        <span className="text-[1rem] font-bold tabular-nums">{hora}</span>{' '}
                        <span className={clsx('text-[0.68rem] font-bold', t.disponible && !sel && 'text-niebla')}>{resto.join(' ')}</span>
                      </span>
                    </button>
                  </m.li>
                )
              })}
            </ul>
          </div>
        )
      })}
      {hayPasados && <p className="text-[0.82rem] text-niebla">Las horas tachadas ya pasaron.</p>}
    </div>
  )
}

/* ── Paso 4: ticket y confirmar ───────────────────────────────────────────────────── */

export function PasoConfirmar({ servicio, dia, turno, nombre, mensaje, alCambiarNombre, alReiniciar }) {
  return (
    <div>
      <Ticket servicio={servicio} dia={dia} turno={turno} nombre={nombre} alCambiarNombre={alCambiarNombre} />
      <m.div variants={HIJO} className="mt-7">
        <BotonWhatsApp variante="laton" mensaje={mensaje} className="w-full" data-confirmar="">
          Confirmar por WhatsApp
        </BotonWhatsApp>
        <p className="mt-4 flex items-center justify-center gap-2 text-center text-[0.9rem] text-hueso/80">
          <Check className="size-4 shrink-0 text-laton" strokeWidth={2.5} aria-hidden="true" />
          Rick te confirma el cupo por WhatsApp.
        </p>
      </m.div>
      <m.div variants={HIJO} className="mt-5 border-t border-hueso/10 pt-2 lg:hidden">
        <details className="agenda-detalles group">
          <summary className="flex min-h-12 cursor-pointer items-center justify-between gap-3 text-[0.88rem] font-semibold text-hueso/85">
            Ver el mensaje que le llega
            <ChevronRight className="size-4 text-laton transition-transform duration-300 group-open:rotate-90" aria-hidden="true" />
          </summary>
          <VistaMensaje texto={mensaje} className="mb-2 mt-1" />
        </details>
      </m.div>
      <m.div variants={HIJO} className="mt-1 flex justify-center lg:mt-3">
        <button
          type="button"
          onClick={alReiniciar}
          className="flex min-h-11 items-center gap-2 px-3 text-[0.82rem] font-semibold text-niebla transition-colors duration-300 hover:text-hueso"
        >
          <RotateCcw className="size-3.5" aria-hidden="true" />
          Empezar de nuevo
        </button>
      </m.div>
    </div>
  )
}
