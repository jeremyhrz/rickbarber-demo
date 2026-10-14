import { BARBERIA, CREDITO, buscarServicio } from '../data/barberia.js'
import { describirDia, formatearHora } from './turnos.js'

/**
 * Mensajes de WhatsApp de la barbería. Todos se abren como https://wa.me/584125098443?text=…
 * con el texto ya escrito (encodeURIComponent), listo para que el cliente solo pulse «Enviar».
 * JS puro: se prueba con node (los textos tienen que salir EXACTOS, ver API_RICK.md).
 *
 *   <a href={enlaceWhatsApp(mensajeCita({ servicio, dia, hora, nombre }))} target="_blank" rel="noopener noreferrer">
 */

const SALUDO = 'Hola, Rick 💈'

/** Enlace wa.me con el mensaje. `numero` en formato internacional sin «+» (por defecto, el de Rick). */
export function enlaceWhatsApp(texto = '', numero = BARBERIA.whatsapp.numero) {
  return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`
}

/** Nombre del servicio: acepta el objeto de SERVICIOS, su id o el nombre ya escrito. */
function nombreServicio(servicio) {
  if (!servicio) return ''
  if (typeof servicio === 'string') return buscarServicio(servicio)?.nombre ?? servicio
  return servicio.nombre ?? ''
}

/** Día en palabras: acepta un día de proximosDias(), un Date, una clave '2026-10-18' o un texto. */
function textoDia(dia) {
  if (!dia) return ''
  if (typeof dia === 'string') {
    if (/^\d{4}-\d{2}-\d{2}$/.test(dia)) {
      const [a, m, d] = dia.split('-').map(Number)
      return describirDia(new Date(a, m - 1, d)).largo
    }
    return dia
  }
  if (dia instanceof Date) return describirDia(dia).largo
  return dia.largo ?? ''
}

/** Hora en palabras: acepta un turno de turnosDelDia(), '15:00', minutos (900) o '3:00 p. m.'. */
function textoHora(hora) {
  if (hora == null || hora === '') return ''
  if (typeof hora === 'number') return formatearHora(hora)
  if (typeof hora === 'string') return /^\d{1,2}:\d{2}$/.test(hora) ? formatearHora(hora) : hora
  return hora.etiqueta ?? ''
}

/** El nombre tal como lo escribió, sin espacios de más y con 40 caracteres como máximo. */
export function limpiarNombre(nombre) {
  return String(nombre ?? '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 40)
    .trim()
}

/**
 * La cita armada en el asistente de la Agenda:
 *   Hola, Rick 💈 Quiero agendar una cita:
 *   • Servicio: Corte + Barba
 *   • Día: sábado 18 de octubre
 *   • Hora: 3:00 p. m.
 *   • A nombre de: Carlos            ← solo si escribió un nombre
 *   ¿Me confirmas si hay cupo?
 * Las líneas sin dato (servicio, día u hora vacíos) se omiten.
 */
export function mensajeCita({ servicio, dia, hora, nombre } = {}) {
  const lineas = [`${SALUDO} Quiero agendar una cita:`]
  const s = nombreServicio(servicio)
  const d = textoDia(dia)
  const h = textoHora(hora)
  const n = limpiarNombre(nombre)
  if (s) lineas.push(`• Servicio: ${s}`)
  if (d) lineas.push(`• Día: ${d}`)
  if (h) lineas.push(`• Hora: ${h}`)
  if (n) lineas.push(`• A nombre de: ${n}`)
  lineas.push('¿Me confirmas si hay cupo?')
  return lineas.join('\n')
}

/** «Hola, Rick 💈 Vi tu página y quiero información sobre *Barba*.» (objeto, id o nombre). */
export function mensajeServicio(servicio) {
  return `${SALUDO} Vi tu página y quiero información sobre *${nombreServicio(servicio)}*.`
}

/** «Hola, Rick 💈 Vi tu página y quiero agendar una cita.» (botón general «Escríbenos»). */
export function mensajeGeneral() {
  return `${SALUDO} Vi tu página y quiero agendar una cita.`
}

/** Enlace del crédito del pie («Demo de diseño · Jeremy Heras»). */
export function enlaceCredito() {
  return enlaceWhatsApp(CREDITO.mensaje, CREDITO.whatsapp)
}
