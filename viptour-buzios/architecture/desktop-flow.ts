/**
 * Desktop Flow
 * Reglas estructurales específicas para viewports desktop (1024px+).
 */

export const desktopFlow = {
  philosophy: 'En Desktop, el usuario tiene más espacio cognitivo. Se puede mostrar más información en paralelo sin sobrecargar.',
  rules: [
    'Hero: fullscreen con overlay de texto en el tercio izquierdo.',
    'Quick Actions: barra horizontal de una sola línea.',
    'Experience Highlights: grid de 3–4 columnas.',
    'Services: cards en 2–3 columnas con suficiente padding lateral.',
    'Why Choose Us: grid de 3 columnas de features.',
    'Gallery: masonry de 3–4 columnas con hover efectos.',
    'Reviews: slider visible de 3 testimonios simultáneos.',
    'Reservation Process: timeline horizontal de 3 pasos.',
    'FAQ: dos columnas de acordeones (A y B) para aprovechar el ancho.',
    'Contact: centrado con padding amplio. El botón de WhatsApp debe ser el elemento más prominente de la pantalla.',
    'Navbar sticky inteligente: desaparece al bajar, reaparece al subir.',
    'Max-width del contenido: 1280px (container-default), centrado.',
  ],
  breakpointRange: '1024px – 2560px',
} as const;
