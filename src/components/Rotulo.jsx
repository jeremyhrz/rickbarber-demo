import clsx from 'clsx'
import { rotulo } from '../data/secciones'

/**
 * Numeración editorial de una sección, con su filete dorado: «—— 01 — SERVICIOS».
 * Sale de src/data/secciones.js, así todas las secciones numeran igual.
 *
 *   <Rotulo id="servicios" />
 *   <Rotulo id="agenda" className="justify-center" filete={false} />
 *   <Rotulo texto="El de la silla" />          un rótulo libre con el mismo estilo
 */
export default function Rotulo({ id, texto, filete = true, como: Elemento = 'p', className }) {
  return (
    <Elemento className={clsx('etiqueta flex items-center gap-3 text-laton', className)}>
      {filete && <span aria-hidden="true" className="h-px w-8 shrink-0 bg-laton/70 md:w-12" />}
      <span>{texto ?? rotulo(id)}</span>
    </Elemento>
  )
}
