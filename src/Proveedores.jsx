import { LazyMotion, MotionConfig, domAnimation } from 'framer-motion'
import { ProveedorAgenda } from './lib/agenda'
import { ProveedorScroll } from './lib/scroll'

/**
 * Todo lo que las secciones comparten. Lo usan App.jsx y el modo aislado (?solo=) de main.jsx.
 * reducedMotion="user": con «reducir movimiento», framer-motion apaga los desplazamientos.
 *
 * LazyMotion + domAnimation: los componentes animados son `m.div`, `m.span`… (NO `motion.*`).
 * Así el bundle trae animaciones, variantes, exit, whileInView y gestos, pero no el código de
 * layout ni de arrastre (~10 KB gzip menos), que la página no usa. `strict`: en desarrollo,
 * un `motion.*` olvidado revienta con un aviso claro en vez de inflar el bundle sin avisar.
 */
export default function Proveedores({ children }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <ProveedorScroll>
          <ProveedorAgenda>{children}</ProveedorAgenda>
        </ProveedorScroll>
      </MotionConfig>
    </LazyMotion>
  )
}
