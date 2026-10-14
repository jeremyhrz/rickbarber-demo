/**
 * Datos de Rickbarber: el ÚNICO lugar con información del negocio.
 * Fuente: su Instagram @rickbarberv y su WhatsApp Business, al 14 de octubre de 2026.
 * Es una demo pública de un negocio real: NO se inventan precios, reseñas, cifras ni servicios.
 * Lo que no sabemos con certeza lleva «// POR CONFIRMAR». Sin precio, la UI dice «Precio a consultar».
 *
 * Este archivo, src/lib/turnos.js y src/lib/whatsapp.js son JS puro (sin JSX ni nada de Vite) e
 * importan con extensión «.js»: así se pueden probar con node. Mantenlo así.
 *
 * *asteriscos* en un texto = énfasis: <TextoDividido> y <Enfasis> los pintan en latón;
 * textoPlano() (src/lib/texto.js) los quita.
 */

export const BARBERIA = {
  nombre: 'Rickbarber',
  marca: 'RICKBARBER', // el wordmark
  nombreCompleto: 'RICKBARBER | barbería y estilismo', // su nombre en Instagram
  rubro: 'Barbería y estilismo',
  barbero: { nombre: 'Ricardo', apodo: 'Rick' },
  lema: 'Barbería de élite',
  bio: 'Barbería de Élite 💈 Cortes actuales · Especialistas en barbas · Cirugía capilar', // su bio
  especialidades: ['Cortes actuales', 'Especialistas en barbas', 'Cirugía capilar'], // de su bio, en su orden
  instagram: {
    usuario: 'rickbarberv',
    url: 'https://www.instagram.com/rickbarberv/',
    seguidores: 1492, // al 14-oct-2026
    publicaciones: 95, // al 14-oct-2026
  },
  facebook: {
    usuario: 'rickbarber.ve',
    url: 'https://www.facebook.com/rickbarber.ve', // POR CONFIRMAR: armada con su usuario, no se abrió
  },
  whatsapp: {
    numero: '584125098443', // formato wa.me: sin «+», espacios ni guiones
    visible: '+58 412-5098443',
    enlaceCorto: 'https://wa.me/message/D6PCEVNUK6KSI1', // el de sus publicaciones; no admite mensaje prellenado
  },
  ubicacion: {
    lugar: 'Centro Comercial Cristal',
    corto: 'C.C. Cristal',
    nivel: 'Planta baja',
    zona: 'Naguanagua',
    ciudad: 'Valencia',
    estado: 'Carabobo',
    direccion: 'Av. 95 A, Naguanagua 2005', // la de su WhatsApp Business
    instagramCentro: 'centrocomercialcristal',
    mapa: 'https://www.google.com/maps/search/?api=1&query=Centro%20Comercial%20Cristal%20Naguanagua',
  },
}

/**
 * Horario de atención y de los turnos de la agenda (src/lib/turnos.js lo usa tal cual).
 * POR CONFIRMAR: su WhatsApp Business dice «abierto 24 horas» (casi seguro mal configurado).
 * Mientras tanto: lunes a sábado, de 9:00 a. m. a 7:00 p. m. Si cambias apertura o cierre,
 * actualiza también `resumen` y `filas`.
 */
export const HORARIO = {
  dias: [1, 2, 3, 4, 5, 6], // Date#getDay(): 0 = domingo, 1 = lunes … 6 = sábado
  apertura: '09:00', // 24 h
  cierre: '19:00', // 24 h; el último turno empieza un intervalo antes (6:30 p. m.)
  intervaloMin: 30, // POR CONFIRMAR: un turno cada 30 minutos
  anticipacionMin: 30, // hoy no se ofrecen turnos que empiecen dentro de menos de 30 minutos
  zonaHoraria: 'America/Caracas', // «hoy» y la hora actual se calculan con la hora de la barbería
  resumen: 'Lunes a sábado · 9:00 a. m. a 7:00 p. m.', // POR CONFIRMAR
  filas: [
    { dias: 'Lunes a sábado', horas: '9:00 a. m. – 7:00 p. m.' }, // POR CONFIRMAR
    { dias: 'Domingo', horas: 'Cerrado' }, // POR CONFIRMAR
  ],
}

/**
 * Servicios, en el orden en que se muestran. Los tres primeros salen de su bio; el combo y
 * «Color y diseños» están por confirmar.
 * - `nombre`: el que va en el asistente y en el mensaje de WhatsApp («• Servicio: Corte + Barba»).
 * - `precio`: número en dólares o null («Precio a consultar», ver textoPrecio()).
 * - `duracionMin`: minutos o null (si es null, no se muestra).
 * - `foto`: id de src/data/fotos.json · `icono`: clave de ICONOS en src/components/Iconos.jsx.
 */
export const SERVICIOS = [
  {
    id: 'corte',
    numero: '01',
    nombre: 'Corte',
    titulo: 'Cortes actuales', // de su bio
    descripcion: 'Fade, taper o texturizado: cortes actuales, hechos a tu medida.',
    etiquetas: ['Fade', 'Taper', 'Texturizado'],
    precio: null, // POR CONFIRMAR
    duracionMin: null, // POR CONFIRMAR
    foto: 'rubio-textura',
    icono: 'tijera',
  },
  {
    id: 'barba',
    numero: '02',
    nombre: 'Barba',
    titulo: 'Especialistas en barbas', // de su bio
    descripcion: 'Perfilado y afeitado con navaja. Tu barba, en manos de especialistas.',
    etiquetas: ['Perfilado', 'Navaja'],
    precio: null, // POR CONFIRMAR
    duracionMin: null, // POR CONFIRMAR
    foto: 'barba-navaja',
    icono: 'navaja',
  },
  {
    id: 'corte-barba',
    numero: '03',
    nombre: 'Corte + Barba',
    titulo: 'Corte + Barba',
    descripcion: 'Corte y barba en la misma cita, para salir listo de una vez.',
    etiquetas: ['Combo'],
    precio: null, // POR CONFIRMAR (y si lo ofrece como combo)
    duracionMin: null, // POR CONFIRMAR
    foto: 'rick-cortando',
    icono: 'maquina',
  },
  {
    id: 'color-disenos',
    numero: '04',
    nombre: 'Color y diseños',
    titulo: 'Color y diseños',
    descripcion: 'Color de fantasía y diseños para cuando quieras atreverte con algo distinto.',
    etiquetas: ['Color', 'Diseños'],
    precio: null, // POR CONFIRMAR
    duracionMin: null, // POR CONFIRMAR
    foto: 'fade-verde',
    icono: 'pincel',
    // POR CONFIRMAR: sale de la foto del fade verde menta; no está en su bio.
  },
  {
    id: 'cirugia-capilar',
    numero: '05',
    nombre: 'Cirugía capilar',
    titulo: 'Cirugía capilar', // de su bio
    descripcion: 'Pregúntanos y te asesoramos.', // POR CONFIRMAR qué incluye: no se describe a propósito
    etiquetas: ['Asesoría'],
    precio: null, // POR CONFIRMAR
    duracionMin: null, // POR CONFIRMAR
    foto: 'rick-sonrie',
    icono: 'peine',
  },
]

/** El servicio con ese id (o undefined). */
export function buscarServicio(id) {
  return SERVICIOS.find((s) => s.id === id)
}

/** «Precio a consultar» si no hay precio; si lo hay, «15 $». */
export function textoPrecio(servicio) {
  const precio = servicio?.precio
  return typeof precio === 'number' ? `${precio.toLocaleString('es-VE')} $` : 'Precio a consultar'
}

/** Lo que dice la portada. */
export const PORTADA = {
  titulo: 'Barbería de élite',
  bajada: ['Cortes actuales', 'Especialistas en barbas', 'Cirugía capilar'], // su bio
  sello: 'C.C. Cristal · Naguanagua · Rickbarber', // el sello circular giratorio
}

/** La marquesina (sección Cinta), en este orden. */
export const CINTA = ['Fade', 'Taper', 'Texturizado', 'Barba con navaja', 'Cirugía capilar', 'Naguanagua']

/** Galería de Trabajos: los cortes de sus fotos. `servicio`: el que se preselecciona al agendar. */
export const ESTILOS = [
  {
    id: 'fade-verde',
    foto: 'fade-verde',
    nombre: 'Fade con color',
    detalle: 'Fade y el tope teñido verde menta.',
    servicio: 'color-disenos',
  },
  {
    id: 'rubio-textura',
    foto: 'rubio-textura',
    nombre: 'Texturizado rubio',
    detalle: 'Taper bajo con el tope rubio y texturizado.',
    servicio: 'corte',
  },
  {
    id: 'largo-textura',
    foto: 'largo-textura',
    nombre: 'Largo con textura',
    detalle: 'Largo, con capas y textura.',
    servicio: 'corte',
  },
]

/**
 * Textos reales de sus publicaciones, con la ortografía corregida (signos de apertura, tildes)
 * y sin cambiar su voz. Los emojis van tal cual; sinEmojis() (src/lib/texto.js) los quita.
 */
export const TEXTOS = {
  // Pies de foto
  agendaDM: 'Agenda tu cita al DM‼️ Estamos ubicados en el C.C. Cristal, en planta baja.',
  citasDM: 'Citas al DM‼️‼️',
  diaUno: 'Día 1 de mi nueva vida, cuéntame qué es más difícil de dejar.',
  reuniones: '¡¡Ah, no!! Para citas en tus reuniones importantes, puedes agendar aquí.',
  ex: '¿Por qué será? Aunque aún te duela tu ex, aquí estamos para atenderte siempre.',
  // Textos escritos sobre sus videos
  cercana: 'No deberías ser tan cercana con los clientes', // así, «cercana», sale sobre el video de Rick riéndose con un cliente
  pecho: 'Mi cliente: ¿por qué me dolerá el pecho si solo me están haciendo la barba?',
  musica: 'La música de fondo…',
}

/**
 * Sus 6 últimas publicaciones (son videos; la foto es la portada, 9:16, con sus textos).
 * La sección Instagram enlaza al perfil; `url` es la publicación, por si se quiere usar.
 */
export const HISTORIAS = [
  { id: 'historia-1', foto: 'historia-1', url: 'https://www.instagram.com/p/DeISiv5O8PN/', texto: 'Agenda tu cita al DM‼️ Estamos ubicados en el C.C. Cristal, en planta baja.' },
  { id: 'historia-2', foto: 'historia-2', url: 'https://www.instagram.com/p/DeDFtnyOXEP/', texto: 'Citas al DM‼️‼️😌😌😌' },
  { id: 'historia-3', foto: 'historia-3', url: 'https://www.instagram.com/p/Dd97LsnJBG_/', texto: 'Día 1 de mi nueva vida, cuéntame qué es más difícil de dejar.' },
  { id: 'historia-4', foto: 'historia-4', url: 'https://www.instagram.com/p/DdmozORuoFG/', texto: '¡¡Ah, no!! Para citas en tus reuniones importantes, puedes agendar aquí.' },
  { id: 'historia-5', foto: 'historia-5', url: 'https://www.instagram.com/p/DdkYuFPN8Bj/', texto: '¿Por qué será? Aunque aún te duela tu ex, aquí estamos para atenderte siempre.' },
  { id: 'historia-6', foto: 'historia-6', url: 'https://www.instagram.com/p/Ddfh6jFtGmj/', texto: 'Citas al WhatsApp. Recuerden que estamos ubicados en el C.C. Cristal.' },
]

/** Pie de página: derechos y crédito discreto de la demo. */
export const DERECHOS = '© 2026 Rickbarber · Naguanagua, Carabobo'

export const CREDITO = {
  texto: 'Demo de diseño · Jeremy Heras',
  whatsapp: '584127162731',
  mensaje: 'Hola Jeremy, vi la demo de Rickbarber',
}
