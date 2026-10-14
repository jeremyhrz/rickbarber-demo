/**
 * Iconos propios. Toman el color del texto; dales tamaño con className («size-6»). Son
 * decorativos (aria-hidden): el texto del botón o un aria-label dice qué hacen.
 *
 * Oficio (línea, 24×24, trazo 1,5 que cambia con `grosor`):
 *   <IconoTijera /> · <IconoNavaja /> · <IconoPeine /> · <IconoMaquina /> · <IconoPincel />
 *   <Icono nombre="navaja" className="size-7" />     por clave (las de SERVICIOS[].icono)
 * Marcas (relleno): <IconoWhatsApp /> · <IconoFacebook />; Instagram en línea: <IconoInstagram />.
 * Para lo demás (flechas, reloj, mapa…) usa lucide-react.
 */

function Linea({ className, grosor = 1.5, children }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={grosor}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  )
}

/** Tijera de barbero, abierta, con apoyadedo. */
export function IconoTijera(props) {
  return (
    <Linea {...props}>
      <circle cx="5.6" cy="7.4" r="2.6" />
      <circle cx="5.6" cy="16.6" r="2.6" />
      <path d="M7.9 8.7 21 16.2" />
      <path d="M7.9 15.3 21 7.8" />
      <path d="M3.2 17.9c-.7.7-1 1.6-.8 2.6" />
      <circle cx="12.1" cy="12" r="0.45" fill="currentColor" />
    </Linea>
  )
}

/** Navaja de afeitar abierta, en diagonal: cacha fina, perno, hoja recta de punta roma y la cola. */
export function IconoNavaja(props) {
  return (
    <Linea {...props}>
      <g transform="rotate(-38 12 12)">
        <rect x="1" y="12.6" width="9.6" height="2.4" rx="1.2" />
        <path d="M11.6 10.4h9.6a1.3 1.3 0 0 1 1.3 1.3v.6c0 1.6-1.3 2.9-2.9 2.9h-6a2 2 0 0 1-2-2Z" />
        <path d="M11.6 10.4c-1.1-.1-1.9-.7-2.2-1.6" />
        <circle cx="11.9" cy="13.8" r="0.5" fill="currentColor" stroke="none" />
      </g>
    </Linea>
  )
}

/** Peine: púas anchas a un lado y finas al otro. */
export function IconoPeine(props) {
  return (
    <Linea {...props}>
      <rect x="2.5" y="6.5" width="19" height="4" rx="1.4" />
      <path d="M5 10.5v7.5M7.6 10.5v7.5M10.2 10.5v7.5M12.8 10.5v7.5M15.2 10.5v5M17.2 10.5v5M19.2 10.5v5" />
    </Linea>
  )
}

/** Máquina de cortar: cabezal con dientes, cuerpo y cable. */
export function IconoMaquina(props) {
  return (
    <Linea {...props}>
      <path d="M6.6 3.2h10.8v3.4H6.6z" />
      <path d="M8.4 3.2V1.9M10.6 3.2V1.9M12.8 3.2V1.9M15 3.2V1.9" />
      <path d="M7.2 6.6 8.3 18.8a2 2 0 0 0 2 1.8h3.4a2 2 0 0 0 2-1.8l1.1-12.2" />
      <rect x="10.8" y="9.4" width="2.4" height="4.4" rx="1.2" />
      <path d="M12 20.6v2" />
    </Linea>
  )
}

/** Pincel de tinte y una gota: color. */
export function IconoPincel(props) {
  return (
    <Linea {...props}>
      <g transform="rotate(32 12 12)">
        <path d="M8.6 1.8h6.8l-.5 6H9.1Z" />
        <path d="M10.5 2.4v3.8M12 2.4v3.8M13.5 2.4v3.8" />
        <rect x="9" y="7.8" width="6" height="3.2" rx="0.8" />
        <path d="m10.4 11 .6 9.4a1 1 0 0 0 2 0l.6-9.4" />
      </g>
      <path d="M5.4 3.6S3.4 6 3.4 7.2a2 2 0 0 0 4 0c0-1.2-2-3.6-2-3.6Z" />
    </Linea>
  )
}

/** Clave → componente (las claves de SERVICIOS[].icono en src/data/barberia.js). */
export const ICONOS = {
  tijera: IconoTijera,
  navaja: IconoNavaja,
  peine: IconoPeine,
  maquina: IconoMaquina,
  pincel: IconoPincel,
}

/** <Icono nombre="tijera" className="size-6" grosor={1.25} /> */
export function Icono({ nombre, ...props }) {
  const Componente = ICONOS[nombre]
  if (!Componente) {
    if (import.meta.env.DEV) console.warn(`<Icono>: no existe «${nombre}». Hay: ${Object.keys(ICONOS).join(', ')}`)
    return null
  }
  return <Componente {...props} />
}

export function IconoWhatsApp({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M12.04 2C6.57 2 2.13 6.43 2.13 11.9c0 1.75.46 3.45 1.33 4.95L2.05 22l5.3-1.39a9.9 9.9 0 0 0 4.69 1.19h.01c5.46 0 9.9-4.43 9.9-9.9 0-2.64-1.03-5.13-2.9-7A9.83 9.83 0 0 0 12.04 2Zm0 18.13h-.01a8.22 8.22 0 0 1-4.19-1.15l-.3-.18-3.14.83.84-3.06-.2-.31a8.2 8.2 0 0 1-1.26-4.37c0-4.54 3.7-8.23 8.26-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.7 8.23-8.23 8.23Zm4.52-6.16c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.55.12-.17.25-.64.8-.78.97-.14.17-.29.19-.54.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.23-1.46-1.37-1.7-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.17-.25.25-.41.08-.17.04-.31-.02-.44-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42h-.47a.9.9 0 0 0-.65.31c-.23.25-.86.84-.86 2.05s.88 2.38 1 2.55c.12.16 1.74 2.65 4.2 3.72.59.25 1.05.4 1.4.52.59.19 1.13.16 1.55.1.47-.07 1.46-.6 1.66-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.47-.29Z" />
    </svg>
  )
}

export function IconoInstagram({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" focusable="false">
      <rect x="3" y="3" width="18" height="18" rx="5.2" />
      <circle cx="12" cy="12" r="4.1" />
      <circle cx="17.4" cy="6.6" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function IconoFacebook({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M13.4 21.5v-7.7h2.6l.4-3h-3V8.9c0-.9.3-1.5 1.5-1.5h1.6V4.7c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.7v3h2.6v7.7h3.1Z" />
    </svg>
  )
}
