import clsx from 'clsx'
import Magnetico from './Magnetico'
import { IconoWhatsApp } from './Iconos'
import { enlaceWhatsApp, mensajeGeneral } from '../lib/whatsapp'

// Nombres de clase COMPLETOS: Tailwind solo emite las clases que ve escritas tal cual en el
// código, así que `boton-${variante}` las dejaría fuera del CSS.
const VARIANTES = { linea: 'boton-linea', laton: 'boton-laton', hueso: 'boton-hueso' }

/**
 * Botón que abre WhatsApp con el mensaje ya escrito (por defecto, mensajeGeneral()).
 *
 *   <BotonWhatsApp />                                                     «Escríbenos», borde fino
 *   <BotonWhatsApp variante="laton" mensaje={mensajeCita(cita)}>Confirmar por WhatsApp</BotonWhatsApp>
 *   <BotonWhatsApp mensaje={mensajeServicio('barba')} magnetico />        atraído por el cursor (escritorio)
 *
 * `variante`: 'linea' (secundaria, por defecto) · 'laton' (principal) · 'hueso' (sobre fotos).
 * `chico`: 40 px de alto. Las demás props van al <a> (onClick, aria-label…).
 */
export default function BotonWhatsApp({
  mensaje,
  children = 'Escríbenos',
  variante = 'linea',
  chico = false,
  icono = true,
  magnetico = false,
  className,
  ...resto
}) {
  const boton = (
    <a
      href={enlaceWhatsApp(mensaje ?? mensajeGeneral())}
      target="_blank"
      rel="noopener noreferrer"
      className={clsx('boton', VARIANTES[variante] ?? VARIANTES.linea, chico && 'boton-chico', className)}
      {...resto}
    >
      {icono && <IconoWhatsApp className="size-[1.25em] shrink-0" />}
      <span>{children}</span>
    </a>
  )
  return magnetico ? <Magnetico>{boton}</Magnetico> : boton
}
