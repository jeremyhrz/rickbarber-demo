import { HORARIO } from '../data/barberia.js'

/**
 * Días y turnos de la agenda, con el HORARIO de src/data/barberia.js y formato de Venezuela.
 *
 *   proximosDias(7)        → los próximos 7 días laborables desde hoy:
 *                            [{ clave: '2026-10-14', etiqueta: 'Hoy', corta: 'mar 14 oct',
 *                               largo: 'martes 14 de octubre', … }, …]
 *   turnosDelDia(dia)      → [{ clave: '15:00', etiqueta: '3:00 p. m.', momento: 'tarde', disponible }, …]
 *
 * «Hoy» y «ahora» son los de la barbería (America/Caracas), no los del teléfono de quien mira:
 * un turno que ya pasó en Naguanagua sale deshabilitado aunque el visitante esté en otro huso.
 * Las fechas que devuelve son Date con la hora de pared de Caracas: léelas siempre con los
 * métodos locales (getDate, getDay…), nunca con los UTC.
 *
 * Los nombres de días y meses y el «a. m./p. m.» van escritos a mano (no con Intl): así el texto
 * es idéntico en todos los navegadores, con espacios normales (el mensaje de WhatsApp lo usa).
 * JS puro: se prueba con node.
 */

export const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']
export const DIAS_CORTOS = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb']
export const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
export const MESES_CORTOS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sept', 'oct', 'nov', 'dic']

const dos = (n) => String(n).padStart(2, '0')

/** «Ahora» en la barbería: un Date local con la fecha y hora de pared de Caracas. */
export function ahoraEnLaBarberia(base = new Date()) {
  try {
    const partes = new Intl.DateTimeFormat('en-US', {
      timeZone: HORARIO.zonaHoraria,
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hourCycle: 'h23',
    }).formatToParts(base)
    const v = Object.fromEntries(partes.map((p) => [p.type, Number(p.value)]))
    return new Date(v.year, v.month - 1, v.day, v.hour % 24, v.minute, v.second)
  } catch {
    return new Date(base) // sin Intl con husos horarios: la hora del dispositivo
  }
}

/** Medianoche de ese día (copia; no toca la fecha recibida). */
export function inicioDelDia(fecha) {
  return new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate())
}

export function sumarDias(fecha, dias) {
  return new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate() + dias)
}

export function mismoDia(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

/** '2026-10-18' (clave estable para un día: sirve de key y de valor de un input). */
export function claveDia(fecha) {
  return `${fecha.getFullYear()}-${dos(fecha.getMonth() + 1)}-${dos(fecha.getDate())}`
}

/** '09:00' → 540 (minutos desde la medianoche). */
export function aMinutos(hhmm) {
  const [h, m] = String(hhmm).split(':').map(Number)
  return h * 60 + (m || 0)
}

/** 900 → '3:00 p. m.' · 540 → '9:00 a. m.' · 720 → '12:00 p. m.' (también acepta '15:00'). */
export function formatearHora(minutos) {
  const total = typeof minutos === 'string' ? aMinutos(minutos) : minutos
  const h = Math.floor(total / 60) % 24
  const m = total % 60
  return `${h % 12 || 12}:${dos(m)} ${h < 12 ? 'a. m.' : 'p. m.'}`
}

/**
 * Todo lo que hace falta para pintar o nombrar un día.
 *   { fecha, clave: '2026-10-18', etiqueta: 'Hoy' | 'Mañana' | 'sáb 18 oct', corta: 'sáb 18 oct',
 *     largo: 'sábado 18 de octubre', diaSemana: 'sáb', diaSemanaLargo: 'sábado', numero: 18,
 *     mes: 'oct', mesLargo: 'octubre', esHoy, esManana }
 * `largo` es el que va en el mensaje de WhatsApp («• Día: sábado 18 de octubre»).
 */
export function describirDia(fecha, { ahora = ahoraEnLaBarberia() } = {}) {
  const dia = inicioDelDia(fecha)
  const hoy = inicioDelDia(ahora)
  const esHoy = mismoDia(dia, hoy)
  const esManana = mismoDia(dia, sumarDias(hoy, 1))
  const corta = `${DIAS_CORTOS[dia.getDay()]} ${dia.getDate()} ${MESES_CORTOS[dia.getMonth()]}`
  return {
    fecha: dia,
    clave: claveDia(dia),
    etiqueta: esHoy ? 'Hoy' : esManana ? 'Mañana' : corta,
    corta,
    largo: `${DIAS[dia.getDay()]} ${dia.getDate()} de ${MESES[dia.getMonth()]}`,
    diaSemana: DIAS_CORTOS[dia.getDay()],
    diaSemanaLargo: DIAS[dia.getDay()],
    numero: dia.getDate(),
    mes: MESES_CORTOS[dia.getMonth()],
    mesLargo: MESES[dia.getMonth()],
    esHoy,
    esManana,
  }
}

/** ¿La barbería trabaja ese día de la semana? */
export function esLaborable(fecha) {
  return HORARIO.dias.includes(fecha.getDay())
}

/** Acepta un Date, una clave '2026-10-18' o un día de proximosDias(). */
function aFecha(dia) {
  if (dia instanceof Date) return inicioDelDia(dia)
  if (typeof dia === 'string') {
    const [a, m, d] = dia.split('-').map(Number)
    return new Date(a, m - 1, d)
  }
  if (dia?.fecha instanceof Date) return inicioDelDia(dia.fecha)
  throw new TypeError('turnos.js: se esperaba un Date, una clave AAAA-MM-DD o un día de proximosDias()')
}

/**
 * Turnos de un día según el HORARIO: uno cada `intervaloMin`, de la apertura hasta un intervalo
 * antes del cierre. Hoy, los que ya pasaron (o empiezan dentro de menos de `anticipacionMin`)
 * salen con `disponible: false`; un día pasado o no laborable devuelve [].
 *   [{ clave: '09:00', minutos: 540, etiqueta: '9:00 a. m.', momento: 'mañana', disponible: true }, …]
 * `momento`: 'mañana' (antes de las 12:00) o 'tarde', para agruparlos.
 */
export function turnosDelDia(dia, { ahora = ahoraEnLaBarberia() } = {}) {
  const fecha = aFecha(dia)
  const hoy = inicioDelDia(ahora)
  if (!esLaborable(fecha) || fecha < hoy) return []
  const limite = mismoDia(fecha, hoy) ? ahora.getHours() * 60 + ahora.getMinutes() + HORARIO.anticipacionMin : -1
  const inicio = aMinutos(HORARIO.apertura)
  const fin = aMinutos(HORARIO.cierre)
  const turnos = []
  for (let m = inicio; m + HORARIO.intervaloMin <= fin; m += HORARIO.intervaloMin) {
    turnos.push({
      clave: `${dos(Math.floor(m / 60))}:${dos(m % 60)}`,
      minutos: m,
      etiqueta: formatearHora(m),
      momento: m < 12 * 60 ? 'mañana' : 'tarde',
      disponible: m >= limite,
    })
  }
  return turnos
}

/**
 * Los próximos `n` días laborables, desde hoy. Hoy entra solo si todavía le queda algún turno
 * (pasa `incluirHoySinTurnos: true` para que entre siempre).
 */
export function proximosDias(n = 7, { ahora = ahoraEnLaBarberia(), incluirHoySinTurnos = false } = {}) {
  const hoy = inicioDelDia(ahora)
  const dias = []
  for (let i = 0; dias.length < n && i < 62; i += 1) {
    const fecha = sumarDias(hoy, i)
    if (!esLaborable(fecha)) continue
    if (i === 0 && !incluirHoySinTurnos && !turnosDelDia(fecha, { ahora }).some((t) => t.disponible)) continue
    dias.push(describirDia(fecha, { ahora }))
  }
  return dias
}
