import clsx from 'clsx'
import { AnimatePresence, m } from 'framer-motion'
import Foto from '../../components/Foto'
import { IconoWhatsApp } from '../../components/Iconos'
import { BARBERIA } from '../../data/barberia.js'
import { EXPO } from '../../lib/movimiento'

/**
 * Así le llega el mensaje a Rick: una burbuja de chat con el texto EXACTO que abre WhatsApp.
 * Cada renglón nuevo (servicio, día, hora, nombre) entra con un fundido a medida que se elige.
 */
export default function VistaMensaje({ texto, className }) {
  const lineas = texto.split('\n')
  return (
    <figure className={clsx('rounded-[22px] bg-carbon/70 p-4 ring-1 ring-hueso/10', className)}>
      <figcaption className="flex items-center gap-3 border-b border-hueso/10 pb-3.5">
        <Foto id="perfil" alt="" sizes="40px" className="size-10 shrink-0 rounded-full ring-1 ring-laton/40" />
        <span className="min-w-0 flex-1 leading-tight">
          <span className="block text-[0.92rem] font-bold text-hueso">{BARBERIA.nombre}</span>
          <span className="mt-0.5 block text-[0.75rem] text-niebla">{BARBERIA.whatsapp.visible}</span>
        </span>
        <IconoWhatsApp className="size-5 shrink-0 text-laton" />
      </figcaption>
      <div className="mt-4 flex justify-end">
        <p className="relative max-w-[94%] rounded-2xl rounded-tr-[6px] bg-grafito-claro px-3.5 py-3 text-[0.9rem] leading-relaxed text-hueso ring-1 ring-laton/25">
          <span className="sr-only">{texto}</span>
          <span aria-hidden="true">
            <AnimatePresence initial={false}>
              {lineas.map((linea) => (
                <m.span
                  key={linea.slice(0, 12)}
                  className="block"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, transition: { duration: 0.15 } }}
                  transition={{ duration: 0.45, ease: EXPO }}
                >
                  {linea}
                </m.span>
              ))}
            </AnimatePresence>
          </span>
          <span className="mt-1.5 block text-right text-[0.68rem] text-niebla" aria-hidden="true">
            Así le llega a Rick
          </span>
        </p>
      </div>
    </figure>
  )
}
