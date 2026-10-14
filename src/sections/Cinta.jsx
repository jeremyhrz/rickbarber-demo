import CintaInfinita from '../components/Cinta'
import Poste from '../components/Poste'
import { CINTA } from '../data/barberia.js'

const TIPO = 'font-display text-[clamp(2.1rem,9vw,4.6rem)] uppercase leading-none'

/**
 * Cinta: dos franjas que se cruzan en X y corren en sentidos contrarios. Delante, latón con letras
 * carbón y un poste de barbero de separador; detrás, grafito con letras huecas. Las dos aceleran,
 * cambian de sentido y se sesgan con la velocidad del scroll (lo hace <CintaInfinita>).
 * La de detrás es decorativa (aria-hidden): la de delante ya deja la lista para lectores de pantalla.
 */
export default function Cinta() {
  return (
    <section aria-label="Especialidades" className="relative overflow-hidden">
      <div className="relative h-[clamp(11rem,46vw,20rem)]">
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-[36%] w-[130%] -translate-x-1/2 -translate-y-1/2 rotate-[5deg] lg:rotate-[2.8deg]"
        >
          <CintaInfinita
            elementos={CINTA}
            direccion={1}
            velocidad={2.2}
            className={`${TIPO} border-y border-laton/20 bg-grafito py-[0.3em]`}
            claseElemento="texto-contorno tracking-[0.02em]"
            claseSeparador="text-[0.4em] text-laton/80"
          />
        </div>
        <div className="absolute left-1/2 top-[63%] w-[130%] -translate-x-1/2 -translate-y-1/2 -rotate-[4deg] shadow-profunda lg:-rotate-[2.4deg]">
          <CintaInfinita
            elementos={CINTA}
            velocidad={3}
            className={`${TIPO} bg-laton py-[0.3em] text-carbon`}
            claseElemento="tracking-[0.02em]"
            separador={<Poste tapas={false} animado={false} className="h-[0.66em] w-auto" />}
            claseSeparador="inline-flex items-center !px-[0.5em]"
          />
        </div>
      </div>
    </section>
  )
}
