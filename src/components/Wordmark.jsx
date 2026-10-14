import clsx from 'clsx'
import Poste from './Poste'

/** El texto del wordmark para <TextoDividido>: «RICK» en hueso y «BARBER» en latón (énfasis). */
export const WORDMARK_TEXTO = 'RICK*BARBER*'

/**
 * Wordmark de la barbería: el poste de barbero y «RICKBARBER» en Anton, con «BARBER» en latón.
 * El tamaño sale del font-size (className="text-2xl", "text-[18vw]"…): el poste mide ~1 em.
 *
 *   <Wordmark className="text-[1.7rem]" />                         barra de navegación
 *   <Wordmark variante="apilada" className="text-[22vw]" />        pie: RICK / BARBER en dos líneas, poste al lado
 *   <Wordmark subtitulo className="text-5xl" />                    + «Barbería y estilismo» debajo
 *   <Wordmark poste={false} />  ·  <Wordmark animado={false} />  ·  <Wordmark bicolor={false} />
 *
 * Accesible por defecto (role="img", «Rickbarber»). Dentro de un enlace con su propio
 * aria-label, pasa titulo={null}: queda decorativo.
 */
export default function Wordmark({
  variante = 'linea',
  poste = true,
  animado = true,
  bicolor = true,
  subtitulo = false,
  titulo = 'Rickbarber',
  como: Elemento = 'span',
  className,
}) {
  const accesible = titulo ? { role: 'img', 'aria-label': titulo } : { 'aria-hidden': true }
  const barber = <span className={bicolor ? 'text-laton' : undefined}>BARBER</span>
  const apilada = variante === 'apilada'

  return (
    <Elemento
      className={clsx('inline-flex font-display uppercase leading-none', apilada ? 'items-stretch gap-[0.12em]' : 'items-center gap-[0.26em]', className)}
      {...accesible}
    >
      {poste && (
        <Poste
          animado={animado}
          className={clsx('w-auto shrink-0', apilada ? 'h-auto max-h-[1.9em] self-center' : 'h-[1.06em]')}
          style={apilada ? { height: '1.9em' } : undefined}
        />
      )}
      <span className="flex flex-col">
        {apilada ? (
          <span className="flex flex-col tracking-[0.01em]">
            <span className="block leading-[0.9]">RICK</span>
            <span className="block leading-[0.9]">{barber}</span>
          </span>
        ) : (
          <span className="block translate-y-[0.03em] tracking-[0.03em]">
            RICK{barber}
          </span>
        )}
        {subtitulo && (
          <span className="mt-[0.5em] block font-sans text-[0.18em] font-semibold tracking-[0.42em] text-niebla">
            Barbería y estilismo
          </span>
        )}
      </span>
    </Elemento>
  )
}
