import clsx from 'clsx'
import Foto from '../../components/Foto'
import Grano from '../../components/Grano'

/**
 * Foto enmarcada de la vitrina: filete de latón por dentro (paspartú), viñeta y grano propio.
 * Las fotos son de resolución media: el marco las presenta como láminas, nunca a sangre.
 *
 *   <Marco id="rick-cortando" sizes="(min-width: 1024px) 330px, 62vw" />
 *   <Marco id="barba-navaja" className="aspect-[4/3]" rellenar />     el padre pone la proporción
 */
export default function Marco({ id, alt, sizes, posicion, rellenar = false, grano = 0.1, className, fotoClassName, imgClassName, children }) {
  return (
    <div className={clsx('marco', className)}>
      <Foto
        id={id}
        alt={alt}
        sizes={sizes}
        posicion={posicion}
        rellenar={rellenar}
        vineta
        className={fotoClassName}
        imgClassName={imgClassName}
      />
      <Grano fijo={false} opacidad={grano} />
      {children}
    </div>
  )
}
