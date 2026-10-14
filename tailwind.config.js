import defaultTheme from 'tailwindcss/defaultTheme'

/**
 * Tailwind 3.4 compilado al construir (no el CDN), por compatibilidad con iPhones viejos.
 * Los colores viven AQUÍ; src/index.css los expone también como variables CSS (--carbon, …).
 * Las clases se leen de `content`: no armes nombres por partes (`bg-${color}`), Tailwind no los ve.
 *
 * Contraste (WCAG) sobre carbón #0E0E0F: hueso 16,5:1 · latón-claro 11,9:1 · latón 8:1 ·
 * latón-oscuro 4,8:1 · niebla 5,5:1 (sobre grafito 5:1, sobre grafito-claro 4,7:1).
 * Texto carbón sobre latón: 8:1. El rojo y el azul son SOLO del poste de barbero.
 */
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    // xs va primero: con `extend` quedaría al final del CSS y pisaría a sm/md/lg.
    screens: { xs: '380px', ...defaultTheme.screens },
    extend: {
      colors: {
        carbon: '#0E0E0F', // fondo de la página
        grafito: {
          DEFAULT: '#18181A', // superficies (tarjetas, hoja de la agenda)
          claro: '#1F1F22', // superficie realzada (hover, chips)
        },
        hueso: '#F2EDE4', // texto principal
        niebla: '#8C8880', // texto secundario
        laton: {
          DEFAULT: '#C9A15B', // acento dorado: botones, filetes, numeración
          claro: '#E3C88E', // brillo, hover
          oscuro: '#9C7A3C', // pulsado, bordes
        },
        poste: {
          rojo: '#B3262D', // SOLO en el poste de barbero
          azul: '#1E3A8A', // SOLO en el poste de barbero
        },
      },
      fontFamily: {
        display: ['Anton', 'Impact', '"Arial Narrow Bold"', '"Arial Narrow"', 'sans-serif'],
        sans: ['"Manrope Variable"', 'system-ui', '-apple-system', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        // Anton en mayúsculas: el titular gigante de la portada y los títulos de sección.
        portada: ['clamp(3.2rem, 17vw, 11rem)', { lineHeight: '0.86', letterSpacing: '0.005em' }],
        seccion: ['clamp(2.75rem, 12vw, 7.5rem)', { lineHeight: '0.9', letterSpacing: '0.005em' }],
        menu: ['clamp(2.75rem, 13vw, 5.5rem)', { lineHeight: '0.95', letterSpacing: '0.01em' }],
      },
      letterSpacing: {
        etiqueta: '0.24em',
      },
      transitionTimingFunction: {
        expo: 'cubic-bezier(0.16, 1, 0.3, 1)',
        suave: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      zIndex: {
        grano: '30',
        nav: '40',
        progreso: '41',
        flotante: '45',
        menu: '50',
        velo: '55',
        hoja: '60',
        modal: '60',
        intro: '100',
        cursor: '110',
      },
      maxWidth: {
        contenedor: '1320px',
      },
      boxShadow: {
        laton: '0 18px 40px -18px rgb(201 161 91 / 0.55)',
        profunda: '0 30px 60px -28px rgb(0 0 0 / 0.85)',
      },
      keyframes: {
        girar: { to: { transform: 'rotate(360deg)' } },
        flotar: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '50%': { transform: 'translate3d(0, -8px, 0)' },
        },
      },
      animation: {
        // Úsalas con motion-safe: (motion-safe:animate-girar) para respetar «reducir movimiento».
        girar: 'girar 22s linear infinite',
        flotar: 'flotar 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
