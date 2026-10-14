import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import Grano from '../components/Grano'
import Revelar from '../components/Revelar'
import Rotulo from '../components/Rotulo'
import TextoDividido from '../components/TextoDividido'
import { BARBERIA, TEXTOS } from '../data/barberia.js'
import { useAgenda } from '../lib/agenda'
import { EXPO, useMenosMovimiento } from '../lib/movimiento'
import { irA } from '../lib/scroll'
import { proximosDias, turnosDelDia } from '../lib/turnos.js'
import { mensajeCita } from '../lib/whatsapp.js'
import AlturaSuave from './agenda/AlturaSuave'
import { Migas, PASOS, PasoConfirmar, PasoDia, PasoHora, PasoServicio, Progreso } from './agenda/Pasos'
import VistaMensaje from './agenda/VistaMensaje'
import './agenda/agenda.css'

/** Entre pasos: el nuevo entra desde el lado hacia el que se avanza (o se vuelve). */
const VARIANTES = {
  entrar: (direccion) => ({ opacity: 0, x: direccion * 56 }),
  centro: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: EXPO, staggerChildren: 0.022, delayChildren: 0.04 },
  },
  salir: (direccion) => ({ opacity: 0, x: direccion * -36, transition: { duration: 0.2, ease: [0.4, 0, 1, 1] } }),
}

const mayuscula = (texto) => texto.charAt(0).toUpperCase() + texto.slice(1)

/**
 * #agenda — la estrella de la página (brief §6.8). Asistente por pasos: servicio → día → hora →
 * nombre (opcional) y un ticket que se «imprime» con la cita; «Confirmar por WhatsApp» abre el
 * chat de Rick con mensajeCita() ya escrito. Si otra sección pide un servicio (irAAgenda(id)),
 * llega con ese servicio marcado y salta al paso «día».
 */
export default function Agenda() {
  const { servicio, elegirServicio, peticion } = useAgenda()
  const menos = useMenosMovimiento()
  const dias = useMemo(() => proximosDias(7), [])
  const [paso, setPaso] = useState(0)
  const [direccion, setDireccion] = useState(1)
  const [diaClave, setDiaClave] = useState(null)
  const [horaClave, setHoraClave] = useState(null)
  const [nombre, setNombre] = useState('')
  const tarjeta = useRef(null)
  const reloj = useRef(0)
  const enfocar = useRef(false)

  const dia = dias.find((d) => d.clave === diaClave) ?? null
  // Se recalcula también al cambiar de paso: un turno que pasó mientras elegían sale deshabilitado.
  const turnos = useMemo(() => (dia ? turnosDelDia(dia) : []), [dia, paso])
  const turno = turnos.find((t) => t.clave === horaClave && t.disponible) ?? null

  // El paso que se puede mostrar con lo elegido (nunca uno al que le falten los datos de antes).
  const actual = !servicio ? 0 : paso >= 2 && !dia ? 1 : paso >= 3 && !turno ? 2 : paso
  const mensaje = mensajeCita({ servicio, dia, hora: turno, nombre })

  const ir = useCallback((destino, sentido) => {
    window.clearTimeout(reloj.current)
    enfocar.current = true
    setDireccion(sentido)
    setPaso(destino)
  }, [])

  // Tras elegir, una pausa corta para ver la marca y se pasa solo al siguiente paso.
  const avanzar = (destino) => {
    window.clearTimeout(reloj.current)
    reloj.current = window.setTimeout(() => ir(destino, 1), menos ? 140 : 340)
  }

  useEffect(() => () => window.clearTimeout(reloj.current), [])

  // Otra sección pidió agendar un servicio concreto («Agendar este»): directo al paso «día».
  useEffect(() => {
    if (peticion) ir(1, 1)
  }, [peticion, ir])

  // Al mostrar un paso nuevo: el foco a su título (teclado y lectores de pantalla) y, si la
  // tarjeta quedó por encima de la vista (se eligió abajo del todo), se sube a buscarla.
  const alMostrarPaso = useCallback((titulo) => {
    if (!enfocar.current) return
    enfocar.current = false
    titulo?.focus({ preventScroll: true })
    const caja = tarjeta.current?.getBoundingClientRect()
    const altoNav = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--alto-nav')) || 64
    if (caja && caja.top < altoNav) irA(tarjeta.current)
  }, [])

  const elegirDelServicio = (id) => {
    elegirServicio(id)
    avanzar(1)
  }
  const elegirDelDia = (clave) => {
    setDiaClave(clave)
    avanzar(2)
  }
  const elegirDeHora = (clave) => {
    setHoraClave(clave)
    avanzar(3)
  }
  const reiniciar = () => {
    elegirServicio(null)
    setDiaClave(null)
    setHoraClave(null)
    setNombre('')
    ir(0, -1)
  }

  const ayuda = [
    'Toca uno y seguimos. Si tienes dudas, Rick te asesora.',
    'Elige el día que mejor te quede.',
    dia ? (dia.esHoy ? `Hoy, ${dia.largo}.` : dia.esManana ? `Mañana, ${dia.largo}.` : `${mayuscula(dia.largo)}.`) : '',
    'Pon tu nombre si quieres y envíaselo a Rick.',
  ][actual]

  const contenido = [
    <PasoServicio key="servicio" elegido={servicio?.id} alElegir={elegirDelServicio} />,
    <PasoDia key="dia" dias={dias} elegido={diaClave} alElegir={elegirDelDia} />,
    <PasoHora key="hora" turnos={turnos} elegido={horaClave} alElegir={elegirDeHora} />,
    <PasoConfirmar
      key="confirmar"
      servicio={servicio}
      dia={dia}
      turno={turno}
      nombre={nombre}
      mensaje={mensaje}
      alCambiarNombre={setNombre}
      alReiniciar={reiniciar}
    />,
  ][actual]

  return (
    <section id="agenda" aria-labelledby="agenda-titulo" className="seccion relative border-t border-hueso/10">
      {/* Un resplandor de latón detrás de la tarjeta (estático, sin filtros). */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-[30%] top-[22%] aspect-square w-[110%] bg-[radial-gradient(closest-side,rgb(201_161_91/0.11),rgb(201_161_91/0))] lg:-right-[8%] lg:top-[8%] lg:w-[62%]" />
      </div>

      <div className="contenedor relative grid gap-10 lg:grid-cols-12 lg:gap-x-16">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-[calc(var(--alto-nav)+3rem)]">
            <Rotulo id="agenda" />
            <TextoDividido como="h2" id="agenda-titulo" texto="Agenda tu *cita*" className="titulo-seccion mt-6" />
            <Revelar como="p" retraso={0.1} y={20} className="mt-6 max-w-md text-[1.05rem] leading-relaxed text-hueso/80">
              Elige servicio, día y hora: te dejamos el mensaje listo y lo envías por WhatsApp en un toque.
            </Revelar>
            <Revelar como="blockquote" retraso={0.18} y={20} className="mt-8 hidden max-w-md border-l border-laton/50 pl-5 lg:block">
              <p className="text-[1.02rem] italic leading-relaxed text-hueso/85">«{TEXTOS.reuniones}»</p>
              <p className="etiqueta mt-3 text-niebla">@{BARBERIA.instagram.usuario}</p>
            </Revelar>
            <Revelar retraso={0.26} y={20} className="mt-10 hidden max-w-md lg:block">
              <p className="etiqueta mb-3 text-laton">Así le llega a Rick</p>
              <VistaMensaje texto={mensaje} />
            </Revelar>
          </div>
        </div>

        <div className="lg:col-span-7">
          <Revelar y={40} retraso={0.05}>
            <div
              ref={tarjeta}
              className="relative scroll-mt-[calc(var(--alto-nav)+0.75rem)] overflow-hidden rounded-[28px] bg-grafito p-4 shadow-profunda ring-1 ring-hueso/10 xs:p-5 sm:rounded-[32px] sm:p-8 xl:p-10"
            >
              <Grano fijo={false} opacidad={0.06} />
              <div className="relative">
                <Progreso paso={actual} alVolver={() => ir(Math.max(0, actual - 1), -1)} />
                <p className="sr-only" aria-live="polite">
                  {`Paso ${actual + 1} de ${PASOS.length}: ${PASOS[actual].corto}`}
                </p>
                {/* pt: las tildes de Anton (¿QUÉ…?) sobresalen por encima de la línea y el contenedor recorta. */}
                <AlturaSuave className="-mx-2 mt-4" claseInterior="px-2 pb-2 pt-3">
                  <AnimatePresence mode="wait" initial={false} custom={direccion}>
                    <m.div key={actual} custom={direccion} variants={VARIANTES} initial="entrar" animate="centro" exit="salir">
                      <TituloPaso alMontar={alMostrarPaso}>{PASOS[actual].titulo}</TituloPaso>
                      <p className="mt-2.5 text-pretty text-[0.95rem] leading-snug text-niebla">{ayuda}</p>
                      {actual > 0 && actual < 3 && <Migas servicio={servicio} dia={dia} paso={actual} alIr={(n) => ir(n, -1)} />}
                      <div className="mt-6">{contenido}</div>
                    </m.div>
                  </AnimatePresence>
                </AlturaSuave>
              </div>
            </div>
          </Revelar>
          <Revelar como="blockquote" y={16} className="mt-8 border-l border-laton/50 pl-5 lg:hidden">
            <p className="italic leading-relaxed text-hueso/85">«{TEXTOS.reuniones}»</p>
            <p className="etiqueta mt-2.5 text-niebla">@{BARBERIA.instagram.usuario}</p>
          </Revelar>
        </div>
      </div>
    </section>
  )
}

/** Título del paso. Al montarse avisa (para llevarle el foco si se llegó navegando). */
function TituloPaso({ alMontar, children }) {
  const ref = useRef(null)
  useEffect(() => {
    alMontar(ref.current)
  }, [alMontar])
  return (
    <h3 ref={ref} tabIndex={-1} className="font-display text-[clamp(1.95rem,8vw,2.75rem)] uppercase leading-[0.95] text-hueso outline-none">
      {children}
    </h3>
  )
}
