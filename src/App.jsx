import Proveedores from './Proveedores'
import { HAY_INTRO } from './lib/intro'
import BarraProgreso from './components/BarraProgreso'
import Cursor from './components/Cursor'
import Grano from './components/Grano'
import Intro from './sections/Intro'
import Navegacion from './sections/Navegacion'
import Portada from './sections/Portada'
import Cinta from './sections/Cinta'
import Servicios from './sections/Servicios'
import Trabajos from './sections/Trabajos'
import Barbas from './sections/Barbas'
import Agenda from './sections/Agenda'
import Rick from './sections/Rick'
import Ubicacion from './sections/Ubicacion'
import Instagram from './sections/Instagram'
import Pie from './sections/Pie'
import AgendarFlotante from './sections/AgendarFlotante'

/** La página completa, en el orden del brief (§6). Cuándo sale la intro lo decide src/lib/intro.js. */
export default function App() {
  return (
    <Proveedores>
      {HAY_INTRO && <Intro />}
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-modal focus:rounded-full focus:bg-laton focus:px-5 focus:py-3 focus:text-carbon"
      >
        Saltar al contenido
      </a>
      <BarraProgreso />
      <Navegacion />
      <main id="contenido">
        <Portada />
        <Cinta />
        <Servicios />
        <Trabajos />
        <Barbas />
        <Agenda />
        <Rick />
        <Ubicacion />
        <Instagram />
      </main>
      <Pie />
      <AgendarFlotante />
      <Grano />
      <Cursor />
    </Proveedores>
  )
}
