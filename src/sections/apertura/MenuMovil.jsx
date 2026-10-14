import clsx from 'clsx'
import { m } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import BotonWhatsApp from '../../components/BotonWhatsApp'
import { IconoInstagram } from '../../components/Iconos'
import Poste from '../../components/Poste'
import { BARBERIA } from '../../data/barberia.js'
import { ENLACES } from '../../data/secciones'
import { escalonar, useMenosMovimiento, variantes } from '../../lib/movimiento'

const CORTINA = [0.76, 0, 0.24, 1]

/**
 * Menú del teléfono a pantalla completa: se abre como un círculo que crece desde el botón del menú
 * (`origen`, en px) y los enlaces suben enormes, en Anton, escalonados. La sección en la que estás
 * sale en latón con un poste girando. Abajo, la dirección, WhatsApp e Instagram.
 * Lo monta Navegacion dentro de <AnimatePresence>; ella lleva el foco, Escape y el bloqueo del scroll.
 */
export default function MenuMovil({ activa, ir, origen }) {
  const menos = useMenosMovimiento()
  const radio = Math.ceil(Math.hypot(window.innerWidth, window.innerHeight)) + 60
  const telon = menos
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.25 } }
    : {
        initial: { clipPath: `circle(0px at ${origen})` },
        animate: { clipPath: `circle(${radio}px at ${origen})` },
        exit: { clipPath: `circle(0px at ${origen})`, transition: { duration: 0.6, ease: CORTINA } },
        transition: { duration: 0.85, ease: CORTINA },
      }
  const { ubicacion } = BARBERIA

  return (
    <m.div
      id="menu-movil"
      role="dialog"
      aria-modal="true"
      aria-label="Menú"
      className="fixed inset-0 z-menu flex flex-col overflow-hidden bg-carbon xl:hidden"
      {...telon}
    >
      {/* «RICK» hueco, enorme y en vertical, al fondo del menú. */}
      <m.div
        aria-hidden="true"
        className="texto-vertical texto-contorno pointer-events-none absolute -right-[0.16em] top-1/2 -translate-y-1/2 select-none font-display text-[min(64vh,58vw)] leading-[0.8] opacity-[0.1]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 1.2, delay: menos ? 0 : 0.35 }}
      >
        RICK
      </m.div>

      <m.nav
        aria-label="Secciones"
        data-lenis-prevent
        className="contenedor relative flex min-h-0 flex-1 flex-col overflow-y-auto pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[calc(var(--alto-nav)+0.75rem)]"
        initial="oculto"
        animate="visible"
        variants={escalonar(0.055, menos ? 0 : 0.2)}
      >
        <ul className="border-t border-hueso/10">
          {ENLACES.map((enlace) => {
            const actual = activa === enlace.id
            return (
              // Cada fila es UN hijo del escalonado (si no, framer cuenta sus tres piezas).
              <m.li key={enlace.id} variants={escalonar(0.04)} className="border-b border-hueso/10">
                <a
                  href={`#${enlace.id}`}
                  onClick={ir(`#${enlace.id}`)}
                  aria-current={actual ? 'true' : undefined}
                  className="group flex items-center gap-4 py-[0.55rem] [@media(max-height:700px)]:py-1"
                >
                  <m.span variants={variantes.fundido} className="etiqueta w-6 shrink-0 text-laton">
                    {enlace.numero}
                  </m.span>
                  <span className="mascara min-w-0 flex-1">
                    <m.span
                      variants={variantes.mascara}
                      className={clsx(
                        'block whitespace-nowrap font-display text-menu uppercase transition-colors duration-300 group-active:text-laton-claro [@media(max-height:700px)]:text-[2.4rem]',
                        actual ? 'text-laton' : 'text-hueso',
                      )}
                    >
                      {enlace.corto}
                    </m.span>
                  </span>
                  <m.span variants={variantes.fundido} aria-hidden="true" className="grid w-6 shrink-0 place-items-center">
                    {actual ? (
                      <Poste tapas={false} className="h-7 w-auto" />
                    ) : (
                      <ArrowUpRight className="size-5 text-niebla transition-colors group-active:text-laton" strokeWidth={1.4} />
                    )}
                  </m.span>
                </a>
              </m.li>
            )
          })}
        </ul>

        <m.div variants={variantes.aparecer} className="mt-auto pt-8">
          <p className="etiqueta leading-[1.7] text-niebla">
            {ubicacion.corto} · {ubicacion.nivel}
            <br />
            {ubicacion.zona}, {ubicacion.estado}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <BotonWhatsApp variante="hueso" className="px-3 tracking-[0.12em]" />
            <a
              href={BARBERIA.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="boton boton-linea px-3 tracking-[0.12em]"
            >
              <IconoInstagram className="size-[1.2em] shrink-0" />
              <span>Instagram</span>
            </a>
          </div>
        </m.div>
      </m.nav>
    </m.div>
  )
}
