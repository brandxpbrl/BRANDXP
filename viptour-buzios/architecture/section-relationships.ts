/**
 * Section Relationships
 * Mapa de dependencias narrativas entre secciones.
 * Define por qué cada sección sigue a la anterior.
 */
import type { SectionId } from './landing.structure';

export interface SectionRelationship {
  from: SectionId;
  to: SectionId;
  bridge: string; // La transición narrativa que conecta ambas secciones
}

export const sectionRelationships: SectionRelationship[] = [
  {
    from: 'hero',
    to: 'quick-actions',
    bridge: 'El usuario sintió el impacto → ahora necesita un acceso rápido si ya está listo para actuar.',
  },
  {
    from: 'quick-actions',
    to: 'experience-highlights',
    bridge: 'Si no accionó inmediatamente, se le muestran las experiencias más atractivas para despertar deseo.',
  },
  {
    from: 'experience-highlights',
    to: 'services',
    bridge: 'El usuario quiere saber más sobre cada opción → se presenta el catálogo completo.',
  },
  {
    from: 'services',
    to: 'why-choose-us',
    bridge: 'Ya conoce los servicios → ahora necesita razones para elegir VIPTOUR sobre cualquier alternativa.',
  },
  {
    from: 'why-choose-us',
    to: 'gallery',
    bridge: 'Los argumentos racionales se validan visualmente con fotografías reales de la experiencia.',
  },
  {
    from: 'gallery',
    to: 'google-reviews',
    bridge: 'La galería generó deseo visual → las reseñas confirman que esas experiencias son reales y consistentes.',
  },
  {
    from: 'google-reviews',
    to: 'reservation-process',
    bridge: 'La confianza está consolidada → se elimina la fricción final de "¿cómo reservo?".',
  },
  {
    from: 'reservation-process',
    to: 'faq',
    bridge: 'El proceso es claro, pero quedan dudas específicas (idioma, niños, pago) → FAQ las responde.',
  },
  {
    from: 'faq',
    to: 'location',
    bridge: 'Dudas resueltas → el usuario valida que la empresa existe físicamente y es accesible.',
  },
  {
    from: 'location',
    to: 'contact',
    bridge: 'Todo validado → CTA final de alta conversión para el usuario completamente preparado.',
  },
  {
    from: 'contact',
    to: 'footer',
    bridge: 'Cierre de la narrativa. Proporciona accesos secundarios y transmite solidez profesional.',
  },
];
