import { useId } from 'react'
import clsx from 'clsx'
import Poste from '../../components/Poste'
import { PORTADA } from '../../data/barberia.js'

// «C.C. CRISTAL · NAGUANAGUA · RICKBARBER · », en bucle alrededor del círculo.
const TEXTO = `${PORTADA.sello} · `.toUpperCase()
const RADIO = 45
const VUELTA = 2 * Math.PI * RADIO

/**
 * Sello circular de la portada: el texto gira despacio (motion-safe:animate-girar) alrededor del
 * poste de barbero, que sube sus franjas. Decorativo (aria-hidden): la dirección ya está escrita en
 * la página. El tamaño sale del ancho: <Sello className="w-28" />.
 */
export default function Sello({ className }) {
  const id = `sello-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  return (
    // Todo va en capas absolutas: así el poste no estira la caja y el sello queda siempre redondo.
    <div
      aria-hidden="true"
      className={clsx('relative aspect-square rounded-full bg-carbon text-laton shadow-profunda ring-1 ring-laton/35', className)}
    >
      <svg viewBox="0 0 120 120" className="absolute inset-0 size-full motion-safe:animate-girar">
        <defs>
          <path id={id} d={`M60,60 m-${RADIO},0 a${RADIO},${RADIO} 0 1,1 ${RADIO * 2},0 a${RADIO},${RADIO} 0 1,1 -${RADIO * 2},0`} />
        </defs>
        <text className="font-sans" fontSize="8.4" fontWeight="700" letterSpacing="1.6" fill="currentColor">
          <textPath href={`#${id}`} textLength={(VUELTA - 1.5).toFixed(1)} lengthAdjust="spacing">
            {TEXTO}
          </textPath>
        </text>
      </svg>
      <span className="absolute inset-[23%] rounded-full ring-1 ring-laton/30" />
      <Poste className="absolute left-1/2 top-1/2 h-[40%] w-auto -translate-x-1/2 -translate-y-1/2" />
    </div>
  )
}
