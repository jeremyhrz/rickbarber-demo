import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { buscarServicio } from '../data/barberia.js'
import { irA } from './scroll'

/**
 * Estado compartido de la agenda: qué servicio está elegido y cómo llevar a alguien a #agenda
 * con un servicio ya marcado, desde cualquier sección (Servicios, Trabajos, Barbas, la
 * navegación o el botón flotante).
 *
 *   const { servicioId, servicio, elegirServicio, irAAgenda, peticion } = useAgenda()
 *   <button onClick={() => irAAgenda('barba')}>Agendar este</button>    marca «Barba» y baja a #agenda
 *   <button onClick={() => irAAgenda()}>Agendar</button>                 solo baja a #agenda
 *
 * - `servicioId`: id de SERVICIOS o null · `servicio`: el objeto completo o null.
 * - `elegirServicio(id)`: marca un servicio (o null para desmarcar), sin mover el scroll.
 *   Es lo que usa el paso 1 del asistente.
 * - `irAAgenda(id?)`: con id, lo marca y además sube `peticion`; luego lleva el scroll a #agenda.
 * - `peticion`: número que sube cada vez que otra sección pide agendar un servicio concreto.
 *   El asistente lo escucha (useEffect sobre `peticion`) para saltar directo al paso «día».
 */

const ContextoAgenda = createContext(null)

export function ProveedorAgenda({ children }) {
  const [servicioId, setServicioId] = useState(null)
  const [peticion, setPeticion] = useState(0)

  const elegirServicio = useCallback((id) => {
    setServicioId(typeof id === 'string' && buscarServicio(id) ? id : null)
  }, [])

  const irAAgenda = useCallback(
    (id) => {
      // Si alguien pasa la función directo a onClick, `id` es el evento: se ignora.
      if (typeof id === 'string' && buscarServicio(id)) {
        setServicioId(id)
        setPeticion((n) => n + 1)
      }
      irA('#agenda')
    },
    [],
  )

  const valor = useMemo(
    () => ({ servicioId, servicio: servicioId ? buscarServicio(servicioId) : null, elegirServicio, irAAgenda, peticion }),
    [servicioId, elegirServicio, irAAgenda, peticion],
  )

  return <ContextoAgenda.Provider value={valor}>{children}</ContextoAgenda.Provider>
}

/** Ver arriba. Fuera de <ProveedorAgenda> avisa en desarrollo y solo sabe bajar a #agenda. */
export function useAgenda() {
  const contexto = useContext(ContextoAgenda)
  if (contexto) return contexto
  if (import.meta.env?.DEV) console.warn('useAgenda(): falta <ProveedorAgenda> (está en src/Proveedores.jsx)')
  return SIN_PROVEEDOR
}

const SIN_PROVEEDOR = {
  servicioId: null,
  servicio: null,
  elegirServicio: () => {},
  irAAgenda: () => irA('#agenda'),
  peticion: 0,
}
