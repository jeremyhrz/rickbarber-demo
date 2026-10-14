import { m } from 'framer-motion'
import { ArrowUp, ArrowUpRight } from 'lucide-react'
import Wordmark from '../components/Wordmark'
import BotonWhatsApp from '../components/BotonWhatsApp'
import Magnetico from '../components/Magnetico'
import { IconoFacebook, IconoInstagram, IconoWhatsApp } from '../components/Iconos'
import { BARBERIA, CREDITO, DERECHOS, HORARIO } from '../data/barberia.js'
import { ENLACES } from '../data/secciones.js'
import { useAgenda } from '../lib/agenda'
import { irA } from '../lib/scroll'
import { enlaceCredito, enlaceWhatsApp, mensajeGeneral } from '../lib/whatsapp'
import { EXPO, VISTA } from '../lib/movimiento'
import './vitrina/vitrina.css'

/**
 * Pie: una última llamada a agendar, el wordmark gigante que sube desde una máscara, enlaces
 * (secciones, contacto, dónde y horario), los derechos y el crédito discreto de la demo
 * («Demo de diseño · Jeremy Heras» → WhatsApp de Jeremy, brief §1.5). El botón flotante se
 * aparta solo en cuanto el pie asoma (AgendarFlotante), así que abajo basta el aire normal más
 * la zona segura del iPhone.
 */
export default function Pie() {
  const { irAAgenda } = useAgenda()
  const u = BARBERIA.ubicacion
  const externo = { target: '_blank', rel: 'noopener noreferrer' }
  const claseEnlace = 'inline-flex min-h-[32px] items-center gap-2 transition-colors duration-300 hover:text-laton-claro'

  return (
    <footer
      className="relative overflow-hidden border-t border-hueso/10 pt-20 lg:pt-28"
      style={{ background: 'radial-gradient(70% 45% at 50% 100%, rgb(201 161 91 / 0.09), transparent 70%)' }}
    >
      <div className="contenedor pb-[calc(env(safe-area-inset-bottom)+2.5rem)] md:pb-10">
        {/* Última llamada */}
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <p className="font-display text-[clamp(2.75rem,12vw,6rem)] uppercase leading-[0.9]">
            ¿Te toca
            <br />
            <span className="text-laton">corte</span>?
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Magnetico className="w-full sm:w-auto">
              <button type="button" onClick={() => irAAgenda()} className="boton boton-laton w-full sm:w-auto">
                Agenda tu cita
              </button>
            </Magnetico>
            <BotonWhatsApp className="w-full sm:w-auto" />
          </div>
        </div>

        <span aria-hidden="true" className="filete-degradado mt-16 lg:mt-20" />

        {/* Wordmark gigante */}
        <a
          href="#inicio"
          onClick={(evento) => {
            if (!document.querySelector('#inicio')) return
            evento.preventDefault()
            irA('#inicio')
          }}
          aria-label={`${BARBERIA.nombre}: volver al inicio`}
          className="mt-12 block overflow-hidden pb-2 lg:mt-16"
        >
          <m.span
            className="block"
            initial={{ y: '45%', opacity: 0 }}
            whileInView={{ y: '0%', opacity: 1 }}
            viewport={VISTA}
            transition={{ duration: 1.2, ease: EXPO }}
          >
            <span className="block md:hidden">
              <Wordmark variante="apilada" titulo={null} className="text-[22.5vw]" />
            </span>
            <span className="hidden md:block">
              <Wordmark titulo={null} className="text-[16.2vw] min-[1440px]:text-[14.6rem]" />
            </span>
          </m.span>
          <span className="etiqueta mt-4 block text-niebla">{BARBERIA.rubro} · {u.zona}</span>
        </a>

        {/* Enlaces */}
        <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 text-sm text-hueso/85 md:grid-cols-4 lg:mt-20">
          <nav aria-label="Secciones">
            <p className="etiqueta text-laton">Secciones</p>
            <ul className="mt-4 space-y-1">
              {ENLACES.map((enlace) => (
                <li key={enlace.id}>
                  <a
                    href={`#${enlace.id}`}
                    onClick={(evento) => {
                      // Como la barra y el menú: sin el salto del navegador, con el scroll de irA().
                      evento.preventDefault()
                      irA(`#${enlace.id}`)
                    }}
                    className={claseEnlace}
                  >
                    {enlace.nombre}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="etiqueta text-laton">Contacto</p>
            <ul className="mt-4 space-y-1">
              <li>
                <a href={enlaceWhatsApp(mensajeGeneral())} {...externo} className={claseEnlace}>
                  <IconoWhatsApp className="size-4 shrink-0 text-laton" />
                  {BARBERIA.whatsapp.visible}
                </a>
              </li>
              <li>
                <a href={BARBERIA.instagram.url} {...externo} className={claseEnlace}>
                  <IconoInstagram className="size-4 shrink-0 text-laton" />@{BARBERIA.instagram.usuario}
                </a>
              </li>
              <li>
                <a href={BARBERIA.facebook.url} {...externo} className={claseEnlace}>
                  <IconoFacebook className="size-4 shrink-0 text-laton" />
                  {BARBERIA.facebook.usuario}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="etiqueta text-laton">Dónde</p>
            <address className="mt-4 not-italic leading-relaxed">
              {u.corto}, {u.nivel.toLowerCase()}
              <br />
              {u.zona}, {u.estado}
            </address>
            <a href={u.mapa} {...externo} className={`${claseEnlace} mt-2 text-laton`}>
              Cómo llegar
              <ArrowUpRight className="size-4" strokeWidth={1.75} />
            </a>
          </div>

          <div>
            <p className="etiqueta text-laton">Horario</p>
            <dl className="mt-4 space-y-2 leading-snug">
              {HORARIO.filas.map((fila) => (
                <div key={fila.dias}>
                  <dt className="text-niebla">{fila.dias}</dt>
                  <dd>{fila.horas}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-xs text-niebla">Por confirmar.</p>
          </div>
        </div>

        {/* Derechos, crédito y volver arriba */}
        <div className="mt-16 flex flex-col gap-5 border-t border-hueso/10 pt-6 text-sm text-niebla md:flex-row md:items-center md:justify-between">
          <p>{DERECHOS}</p>
          <a href={enlaceCredito()} {...externo} className="transition-colors duration-300 hover:text-laton-claro">
            {CREDITO.texto}
          </a>
          <button
            type="button"
            onClick={() => irA(document.querySelector('#inicio') ?? 0)}
            className="etiqueta inline-flex min-h-[44px] items-center gap-2 self-start text-hueso/80 transition-colors hover:text-laton-claro md:self-auto"
          >
            Volver arriba
            <ArrowUp className="size-4" strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </footer>
  )
}
