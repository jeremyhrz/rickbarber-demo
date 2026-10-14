import { useMemo } from 'react'
import { m } from 'framer-motion'
import Wordmark from '../../components/Wordmark'
import { BARBERIA, textoPrecio } from '../../data/barberia.js'
import { EXPO, useMenosMovimiento } from '../../lib/movimiento'

const mayuscula = (texto) => (texto ? texto.charAt(0).toUpperCase() + texto.slice(1) : texto)

/**
 * Código de barras decorativo que sale de los datos de la cita: cambia si cambias servicio,
 * día u hora (FNV-1a + xorshift; nada aleatorio, el mismo ticket da siempre las mismas barras).
 */
function barras(semilla, cantidad = 54) {
  let h = 2166136261
  for (const letra of semilla) h = Math.imul(h ^ letra.codePointAt(0), 16777619)
  const lista = []
  let x = 0
  for (let i = 0; i < cantidad; i += 1) {
    h ^= h << 13
    h ^= h >>> 17
    h ^= h << 5
    const ancho = 1 + ((h >>> 0) % 3)
    lista.push({ x, ancho })
    x += ancho + 1 + ((h >>> 9) % 2)
  }
  return { lista, total: x - 1 }
}

/**
 * El resumen de la cita como un ticket de barbería: sale de una ranura (se «imprime»), con el
 * borde de abajo en dientes de sierra, línea de corte, sello «Por confirmar» y el campo
 * «A nombre de» escrito sobre la línea.
 */
export default function Ticket({ servicio, dia, turno, nombre, alCambiarNombre }) {
  const menos = useMenosMovimiento()
  const codigo = useMemo(() => barras(`${servicio?.id}|${dia?.clave}|${turno?.clave}`), [servicio, dia, turno])

  return (
    <div className="ticket-ranura">
      <span aria-hidden="true" className="ticket-ranura__boca" />
      <m.div
        className="ticket"
        initial={menos ? { opacity: 0 } : { clipPath: 'inset(0% 0% 100% 0%)', y: -36 }}
        animate={menos ? { opacity: 1 } : { clipPath: 'inset(0% 0% 0% 0%)', y: 0 }}
        transition={menos ? { duration: 0.3 } : { duration: 1.15, ease: EXPO, delay: 0.1 }}
      >
        <div className="flex items-start justify-between gap-3 px-5 pb-5 pt-7">
          <div className="min-w-0">
            <Wordmark titulo={null} bicolor={false} className="text-[1.45rem]" />
            <p className="ticket__rotulo mt-2">
              {BARBERIA.rubro}
              <br />
              {BARBERIA.ubicacion.corto}
            </p>
          </div>
          {/* El sello cae sobre el papel cuando el ticket ya salió de la ranura. */}
          <m.span
            className="ticket__sello mt-0.5 shrink-0"
            initial={menos ? false : { opacity: 0, scale: 1.9, rotate: -22 }}
            animate={{ opacity: 1, scale: 1, rotate: -7 }}
            transition={{ delay: 1.05, type: 'spring', stiffness: 420, damping: 17, mass: 0.7 }}
          >
            Por
            <br />
            confirmar
          </m.span>
        </div>

        <div className="ticket__corte" aria-hidden="true" />

        <dl className="space-y-3.5 px-5 pt-5">
          <Linea rotulo="Servicio" valor={servicio?.nombre} />
          <Linea rotulo="Día" valor={mayuscula(dia?.largo)} />
          <Linea rotulo="Hora" valor={turno?.etiqueta} />
        </dl>
        <p className="mt-4 px-5 pb-5 text-[0.8rem] font-semibold text-carbon/70">{textoPrecio(servicio)}</p>

        <div className="ticket__corte" aria-hidden="true" />

        <div className="px-5 pt-5">
          <label htmlFor="agenda-nombre" className="ticket__rotulo">
            A nombre de <span className="normal-case tracking-normal">(opcional)</span>
          </label>
          <input
            id="agenda-nombre"
            type="text"
            className="ticket__campo"
            value={nombre}
            onChange={(evento) => alCambiarNombre(evento.target.value)}
            onKeyDown={(evento) => {
              if (evento.key === 'Enter') evento.currentTarget.blur()
            }}
            maxLength={40}
            placeholder="Tu nombre"
            autoComplete="given-name"
            autoCapitalize="words"
            enterKeyHint="done"
            spellCheck={false}
          />
        </div>

        <div className="px-5 pt-6" aria-hidden="true">
          <svg viewBox={`0 0 ${codigo.total} 40`} preserveAspectRatio="none" className="block h-11 w-full text-carbon/85">
            {codigo.lista.map((barra) => (
              <rect key={barra.x} x={barra.x} width={barra.ancho} height="40" fill="currentColor" />
            ))}
          </svg>
          <p className="ticket__rotulo mt-2 flex justify-between !tracking-[0.3em]">
            <span>{BARBERIA.marca}</span>
            <span>{BARBERIA.ubicacion.zona}</span>
          </p>
        </div>
      </m.div>
    </div>
  )
}

function Linea({ rotulo, valor }) {
  return (
    <div className="flex items-baseline gap-3">
      <dt className="ticket__dt ticket__rotulo">{rotulo}</dt>
      <dd className="max-w-[68%] text-right text-[1rem] font-bold leading-snug">{valor ?? '—'}</dd>
    </div>
  )
}
