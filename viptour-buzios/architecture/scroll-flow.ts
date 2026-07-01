/**
 * Scroll Flow
 * La curva de interés a medida que el usuario hace scroll.
 * Cada etapa debe mantener o aumentar el interés.
 */

export const scrollFlow = [
  {
    stage: 'Inicio (0–20% del scroll)',
    sections: ['hero', 'quick-actions'],
    interestLevel: 'Máximo',
    strategy: 'Impacto visual total. Sin texto denso. Sin distracciones.',
  },
  {
    stage: 'Desarrollo (20–50% del scroll)',
    sections: ['experience-highlights', 'services', 'why-choose-us'],
    interestLevel: 'Alto',
    strategy: 'Revelar valor progresivamente. Mantener visual richness con imágenes y cards.',
  },
  {
    stage: 'Confianza (50–75% del scroll)',
    sections: ['gallery', 'google-reviews', 'reservation-process'],
    interestLevel: 'Medio-Alto',
    strategy: 'Validar la promesa con prueba social. Eliminar miedos antes del clímax.',
  },
  {
    stage: 'Conversión (75–90% del scroll)',
    sections: ['faq', 'location'],
    interestLevel: 'Medio',
    strategy: 'Resolver las últimas objeciones. Preparar psicológicamente para la acción.',
  },
  {
    stage: 'Cierre (90–100% del scroll)',
    sections: ['contact', 'footer'],
    interestLevel: 'Alto (reactivado)',
    strategy: 'CTA de alto contraste y enfoque único. El usuario que llegó aquí tiene alta intención.',
  },
] as const;
