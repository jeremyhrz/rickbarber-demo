import { useId } from 'react'
import clsx from 'clsx'

/**
 * Poste de barbero animado, en SVG + CSS puro: tapas de latón, tubo de vidrio con sombra
 * cilíndrica y franjas roja, hueso y azul que suben en bucle (clase .poste__franjas de index.css).
 * Con «reducir movimiento» las franjas quedan quietas.
 *
 *   <Poste className="h-10 w-auto" />                      con tapas (proporción 1:3)
 *   <Poste tapas={false} className="h-[0.8em] w-auto" />   solo el tubo (proporción 13:46), para ir en línea con texto
 *   <Poste animado={false} />  ·  <Poste duracion={1.2} /> (segundos por vuelta; 1,8 por defecto)
 *   <Poste titulo="Poste de barbero" />                    con nombre accesible; sin él es decorativo (aria-hidden)
 *
 * Dale el tamaño con className (alto + w-auto): el ancho sale de la proporción del SVG.
 * El rojo y el azul de la paleta son SOLO para este poste.
 */

const ANCHO_TUBO = 13
const X_TUBO = 5.5
const Y_TUBO = 12.5
const ALTO_TUBO = 46
const BANDA = 4 // alto de cada franja; rojo + hueso + azul + hueso = 16 = periodo de la animación
const SUBIDA = 9 // cuánto sube una franja al cruzar el tubo (la diagonal)
const COLORES = ['#B3262D', '#F2EDE4', '#1E3A8A', '#F2EDE4']

// Franjas suficientes para cubrir el tubo más el recorrido de la animación (un periodo) y la diagonal.
const FRANJAS = []
for (let y = Y_TUBO - 4 * BANDA - SUBIDA, k = 0; y < Y_TUBO + ALTO_TUBO + 4 * BANDA; y += BANDA, k += 1) {
  const x0 = X_TUBO
  const x1 = X_TUBO + ANCHO_TUBO
  // +0,35 de solape: sin hilos claros entre franja y franja por el antialias.
  FRANJAS.push({
    color: COLORES[k % 4],
    puntos: `${x0},${y + SUBIDA} ${x1},${y} ${x1},${y + BANDA + 0.35} ${x0},${y + SUBIDA + BANDA + 0.35}`,
  })
}

export default function Poste({ tapas = true, animado = true, duracion = 1.8, titulo, className, style }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const id = (nombre) => `poste-${nombre}-${uid}`
  const accesible = titulo ? { role: 'img', 'aria-label': titulo } : { 'aria-hidden': true, focusable: 'false' }

  return (
    <svg
      viewBox={tapas ? '0 0 24 72' : `${X_TUBO} ${Y_TUBO} ${ANCHO_TUBO} ${ALTO_TUBO}`}
      className={clsx('poste', !animado && 'poste--quieto', className)}
      style={{ '--poste-duracion': `${duracion}s`, overflow: 'visible', ...style }}
      {...accesible}
    >
      <defs>
        <clipPath id={id('tubo')}>
          <rect x={X_TUBO} y={Y_TUBO} width={ANCHO_TUBO} height={ALTO_TUBO} rx={tapas ? 0.6 : 2} />
        </clipPath>
        <linearGradient id={id('vidrio')} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0.5" />
          <stop offset="0.2" stopColor="#fff" stopOpacity="0.3" />
          <stop offset="0.34" stopColor="#fff" stopOpacity="0.06" />
          <stop offset="0.7" stopColor="#000" stopOpacity="0.08" />
          <stop offset="1" stopColor="#000" stopOpacity="0.55" />
        </linearGradient>
        {tapas && (
          <>
            <linearGradient id={id('laton')} x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#6B4E20" />
              <stop offset="0.3" stopColor="#E3C88E" />
              <stop offset="0.55" stopColor="#C9A15B" />
              <stop offset="1" stopColor="#5E4419" />
            </linearGradient>
            <radialGradient id={id('bola')} cx="0.36" cy="0.32" r="0.75">
              <stop offset="0" stopColor="#F4E3BC" />
              <stop offset="0.45" stopColor="#C9A15B" />
              <stop offset="1" stopColor="#5E4419" />
            </radialGradient>
          </>
        )}
      </defs>

      {tapas && (
        <g>
          <circle cx="12" cy="4.2" r="3" fill={`url(#${id('bola')})`} />
          <rect x="10.6" y="6.6" width="2.8" height="1.2" fill="#6B4E20" />
          <rect x="3.5" y="7.4" width="17" height="5.1" rx="2.2" fill={`url(#${id('laton')})`} />
          <rect x="3.5" y="58.5" width="17" height="5.1" rx="2.2" fill={`url(#${id('laton')})`} />
          <path d="M8.6 63.6h6.8l-1.5 4.6a2 2 0 0 1-3.8 0Z" fill={`url(#${id('laton')})`} />
        </g>
      )}

      <g clipPath={`url(#${id('tubo')})`}>
        <rect x={X_TUBO} y={Y_TUBO} width={ANCHO_TUBO} height={ALTO_TUBO} fill="#F2EDE4" />
        <g className="poste__franjas">
          {FRANJAS.map((f) => (
            <polygon key={f.puntos} points={f.puntos} fill={f.color} />
          ))}
        </g>
        <rect x={X_TUBO} y={Y_TUBO} width={ANCHO_TUBO} height={ALTO_TUBO} fill={`url(#${id('vidrio')})`} />
        <rect x={X_TUBO + 2.4} y={Y_TUBO + 1.5} width="1.1" height={ALTO_TUBO - 3} rx="0.55" fill="#fff" opacity="0.32" />
      </g>

      {tapas && (
        <g fill="none" stroke="#0E0E0F" strokeOpacity="0.45" strokeWidth="0.4">
          <line x1={X_TUBO} x2={X_TUBO + ANCHO_TUBO} y1={Y_TUBO} y2={Y_TUBO} />
          <line x1={X_TUBO} x2={X_TUBO + ANCHO_TUBO} y1={Y_TUBO + ALTO_TUBO} y2={Y_TUBO + ALTO_TUBO} />
        </g>
      )}
    </svg>
  )
}
