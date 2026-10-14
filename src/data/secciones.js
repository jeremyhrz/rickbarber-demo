/**
 * Las anclas de la página, en orden. Una sola fuente para la navegación, el menú del teléfono y
 * la numeración editorial de cada sección («01 — Servicios»: <Rotulo id="servicios" />).
 * `menu`: si sale en el menú. `corto`: el nombre para la barra de escritorio.
 */
export const SECCIONES = [
  { id: 'inicio', nombre: 'Inicio', corto: 'Inicio', numero: null, menu: false },
  { id: 'servicios', nombre: 'Servicios', corto: 'Servicios', numero: '01', menu: true },
  { id: 'trabajos', nombre: 'Trabajos', corto: 'Trabajos', numero: '02', menu: true },
  { id: 'barbas', nombre: 'Barbas', corto: 'Barbas', numero: '03', menu: true },
  { id: 'agenda', nombre: 'Agenda tu cita', corto: 'Agenda', numero: '04', menu: true },
  { id: 'rick', nombre: 'Rick', corto: 'Rick', numero: '05', menu: true },
  { id: 'ubicacion', nombre: 'Ubicación', corto: 'Ubicación', numero: '06', menu: true },
  { id: 'instagram', nombre: 'Instagram', corto: 'Instagram', numero: '07', menu: true },
]

/** Las que van en el menú, en orden. */
export const ENLACES = SECCIONES.filter((s) => s.menu)

/** La sección con ese id (o undefined). */
export function seccion(id) {
  return SECCIONES.find((s) => s.id === id)
}

/** «01 — Servicios» (con raya, como en el brief). Sin número, solo el nombre. */
export function rotulo(id) {
  const s = seccion(id)
  if (!s) return ''
  return s.numero ? `${s.numero} — ${s.nombre}` : s.nombre
}
