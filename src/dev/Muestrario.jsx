import BotonWhatsApp from '../components/BotonWhatsApp'
import Contador from '../components/Contador'
import Foto from '../components/Foto'
import Grano from '../components/Grano'
import { ICONOS, IconoFacebook, IconoInstagram, IconoWhatsApp } from '../components/Iconos'
import Poste from '../components/Poste'
import Rotulo from '../components/Rotulo'
import TextoDividido from '../components/TextoDividido'
import Wordmark, { WORDMARK_TEXTO } from '../components/Wordmark'
import { SERVICIOS, textoPrecio } from '../data/barberia.js'
import fotos from '../data/fotos.json'

/**
 * Muestrario de la base (SOLO desarrollo, nunca lo importa App.jsx): /?solo=Muestrario
 * Enseña de un vistazo los tokens y piezas compartidas para revisarlas en una captura.
 */
export default function Muestrario() {
  return (
    <div className="contenedor space-y-16 py-12">
      <section className="space-y-6">
        <Rotulo texto="Wordmark" />
        <div>
          <Wordmark className="text-[1.65rem]" />
        </div>
        <div>
          <Wordmark subtitulo className="text-[3.5rem] md:text-[5rem]" />
        </div>
        <div>
          <Wordmark variante="apilada" className="text-[24vw] md:text-[9rem]" />
        </div>
        <TextoDividido como="p" texto={WORDMARK_TEXTO} por="letra" alVer={false} className="font-display text-6xl" />
      </section>

      <section className="space-y-6">
        <Rotulo texto="Poste" />
        <div className="flex items-end gap-8">
          <Poste className="h-40 w-auto" />
          <Poste className="h-24 w-auto" />
          <Poste className="h-12 w-auto" />
          <Poste tapas={false} className="h-16 w-auto" />
          <Poste animado={false} className="h-24 w-auto" />
        </div>
      </section>

      <section className="space-y-6">
        <Rotulo texto="Iconos" />
        <div className="flex flex-wrap items-center gap-8 text-laton">
          {Object.entries(ICONOS).map(([nombre, Icono]) => (
            <figure key={nombre} className="flex flex-col items-center gap-2">
              <Icono className="size-16" grosor={1.25} />
              <Icono className="size-6" />
              <figcaption className="etiqueta text-niebla">{nombre}</figcaption>
            </figure>
          ))}
          <IconoWhatsApp className="size-10 text-hueso" />
          <IconoInstagram className="size-10 text-hueso" />
          <IconoFacebook className="size-10 text-hueso" />
        </div>
      </section>

      <section className="space-y-6">
        <Rotulo id="servicios" />
        <TextoDividido como="h2" texto="Barbería de *élite*" alVer={false} className="titulo-display" />
        <h3 className="titulo-seccion">
          Especialistas <span className="texto-contorno">en barbas</span>
        </h3>
        <p className="max-w-xl text-lg">
          Texto en Manrope: cortes actuales, perfilado y afeitado con navaja. <span className="text-niebla">Secundario en niebla.</span>{' '}
          <span className="enfasis">Énfasis en latón.</span>
        </p>
        <p className="etiqueta text-niebla">Etiqueta · {textoPrecio(SERVICIOS[0])}</p>
        <span className="filete w-40" />
        <div className="flex flex-wrap gap-3">
          <a href="#agenda" className="boton boton-laton">
            Agenda tu cita
          </a>
          <BotonWhatsApp />
          <BotonWhatsApp variante="hueso">Sobre foto</BotonWhatsApp>
          <button type="button" className="boton boton-laton boton-chico">
            Agendar
          </button>
        </div>
        <p className="font-display text-7xl text-laton">
          <Contador valor={1492} />
        </p>
      </section>

      <section className="space-y-6">
        <Rotulo texto="Fotos" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Object.keys(fotos)
            .filter((id) => !id.startsWith('historia') && id !== 'perfil')
            .map((id) => (
              <figure key={id} className="relative">
                <Foto id={id} vineta sizes="(min-width: 768px) 25vw, 50vw" />
                <Grano fijo={false} opacidad={0.12} />
                <figcaption className="etiqueta mt-2 text-niebla">
                  {id} · {fotos[id].proporcion}
                </figcaption>
              </figure>
            ))}
        </div>
      </section>
    </div>
  )
}
