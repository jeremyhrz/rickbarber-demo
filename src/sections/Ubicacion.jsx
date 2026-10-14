import { m } from 'framer-motion'
import { ArrowUpRight, Clock, MapPin, Navigation } from 'lucide-react'
import Rotulo from '../components/Rotulo'
import TextoDividido from '../components/TextoDividido'
import Revelar from '../components/Revelar'
import Grano from '../components/Grano'
import Poste from '../components/Poste'
import BotonWhatsApp from '../components/BotonWhatsApp'
import Magnetico from '../components/Magnetico'
import { BARBERIA, HORARIO } from '../data/barberia.js'
import { EXPO, VISTA, useMenosMovimiento } from '../lib/movimiento'
import './vitrina/vitrina.css'

/**
 * Ubicación (#ubicacion): C.C. Cristal, planta baja, Naguanagua. Un «plano» abstracto (no es un
 * mapa real: no inventa calles) con el pin y sus ondas que abre Google Maps, el horario con puntos
 * guía (POR CONFIRMAR en barberia.js, con su nota) y los botones «Cómo llegar» y «Escríbenos».
 */
export default function Ubicacion() {
  const menos = useMenosMovimiento()
  const u = BARBERIA.ubicacion
  const enlaceMapa = { href: u.mapa, target: '_blank', rel: 'noopener noreferrer' }

  return (
    <section id="ubicacion" aria-labelledby="ubicacion-titulo" className="seccion relative border-t border-hueso/10">
      <div className="contenedor grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-x-16">
        <div className="lg:col-span-6">
          <Rotulo id="ubicacion" />
          {/* Dos renglones en vez de la coma: la máscara del revelado le recortaba la colita. */}
          <h2 id="ubicacion-titulo" className="titulo-seccion mt-6">
            <TextoDividido texto={u.corto} className="block" />
            <TextoDividido texto={`*${u.nivel}*`} retraso={0.12} className="block" />
          </h2>
          <Revelar className="mt-8 space-y-1">
            <p className="flex items-center gap-2 text-lg font-semibold">
              <MapPin className="size-5 shrink-0 text-laton" strokeWidth={1.5} />
              {u.zona} · {u.ciudad}, {u.estado}
            </p>
            <p className="pl-7 text-niebla">
              {u.lugar}, {u.nivel.toLowerCase()}
              <br />
              <span className="whitespace-nowrap">{u.direccion}</span>
            </p>
          </Revelar>

          {/* Horario */}
          <Revelar retraso={0.1} className="mt-10 max-w-md border-t border-hueso/10 pt-6">
            <p className="etiqueta flex items-center gap-2 text-laton">
              <Clock className="size-4" strokeWidth={1.75} />
              Horario
            </p>
            <dl className="mt-4 space-y-3">
              {HORARIO.filas.map((fila) => (
                <div key={fila.dias} className="flex items-baseline">
                  <dt className="shrink-0 text-hueso">{fila.dias}</dt>
                  <span aria-hidden="true" className="puntos" />
                  <dd className={fila.horas === 'Cerrado' ? 'shrink-0 text-niebla' : 'shrink-0 font-semibold text-hueso'}>{fila.horas}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-xs text-niebla">Horario por confirmar.</p>
          </Revelar>

          <Revelar retraso={0.15} className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Magnetico className="w-full sm:w-auto">
              <a {...enlaceMapa} className="boton boton-laton w-full sm:w-auto">
                <Navigation className="size-[1.15em] shrink-0" strokeWidth={2} />
                <span>Cómo llegar</span>
              </a>
            </Magnetico>
            <BotonWhatsApp className="w-full sm:w-auto" />
          </Revelar>
        </div>

        {/* «Plano»: abre Google Maps */}
        <m.a
          {...enlaceMapa}
          aria-label={`Abrir ${u.lugar}, ${u.zona}, en Google Maps`}
          data-cursor="Ir"
          className="plano group relative block aspect-[4/5] overflow-hidden border border-hueso/10 sm:aspect-[4/3] lg:col-span-6 lg:aspect-square"
          initial={menos ? { opacity: 0 } : { clipPath: 'inset(8% 8% 8% 8%)', opacity: 0 }}
          whileInView={menos ? { opacity: 1 } : { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 }}
          viewport={VISTA}
          transition={{ duration: menos ? 0.4 : 1.2, ease: EXPO }}
        >
          <Grano fijo={false} opacidad={0.08} />
          {/* Ejes del plano */}
          <span aria-hidden="true" className="absolute inset-x-0 top-1/2 h-px bg-laton/25" />
          <span aria-hidden="true" className="absolute inset-y-0 left-1/2 w-px bg-laton/25" />
          {/* Ondas y pin */}
          <span aria-hidden="true" className="absolute inset-0">
            <span className="onda" />
            <span className="onda" />
            <span className="onda" />
          </span>
          <span aria-hidden="true" className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-full flex-col items-center">
            <span className="grid size-14 place-items-center rounded-full bg-laton text-carbon shadow-laton transition-transform duration-500 ease-expo group-hover:-translate-y-1.5">
              <Poste tapas={false} className="h-7 w-auto" />
            </span>
            <span className="h-4 w-px bg-laton" />
          </span>
          <span
            aria-hidden="true"
            className="etiqueta absolute left-1/2 top-1/2 mt-4 -translate-x-1/2 whitespace-nowrap rounded-full border border-laton/40 bg-carbon/85 px-3 py-1.5 text-[10px] text-laton-claro"
          >
            Aquí estamos
          </span>
          {/* Reglas en los bordes, como un plano de arquitecto */}
          <span
            aria-hidden="true"
            className="absolute inset-y-0 left-0 w-2"
            style={{ backgroundImage: 'repeating-linear-gradient(to bottom, rgb(201 161 91 / 0.5) 0 1px, transparent 1px 22px)' }}
          />
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-2"
            style={{ backgroundImage: 'repeating-linear-gradient(to right, rgb(201 161 91 / 0.5) 0 1px, transparent 1px 22px)' }}
          />
          {/* Brújula */}
          <span aria-hidden="true" className="etiqueta absolute right-5 top-5 grid size-10 place-items-center rounded-full border border-hueso/20 text-[10px] text-hueso/80">
            N
          </span>
          {/* Etiqueta del lugar */}
          <span className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-4 bg-carbon/85 p-4 sm:inset-x-5 sm:bottom-5 sm:p-5">
            <span>
              <span className="block font-display text-[1.65rem] uppercase leading-none">{u.lugar}</span>
              <span className="etiqueta mt-2 block text-[10px] text-niebla">
                {u.nivel} · {u.zona}
              </span>
            </span>
            <span className="grid size-10 shrink-0 place-items-center rounded-full border border-laton/50 text-laton transition-colors duration-300 group-hover:bg-laton group-hover:text-carbon">
              <ArrowUpRight className="size-5" strokeWidth={1.5} />
            </span>
          </span>
        </m.a>
      </div>
    </section>
  )
}
