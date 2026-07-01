/**
 * Section Order
 * Orden secuencial estricto de las secciones en la Landing.
 * El orden NO es arbitrario: sigue el Conversion Emotion Map (CEM)
 * y el Customer Journey definidos en la Fase 3.
 */
import type { SectionId } from './landing.structure';

export interface OrderedSection {
  position: number;
  id: SectionId;
  rationale: string; // Por qué está en esta posición
}

export const sectionOrder: OrderedSection[] = [
  {
    position: 1,
    id: 'hero',
    rationale: 'Primer contacto visual. Debe generar impacto y retención en menos de 3 segundos.',
  },
  {
    position: 2,
    id: 'quick-actions',
    rationale: 'Inmediatamente después del Hero, captura a los usuarios con alta intención de conversión.',
  },
  {
    position: 3,
    id: 'experience-highlights',
    rationale: 'Mientras la atención aún es alta (>80%), muestra las experiencias clave para despertar el deseo.',
  },
  {
    position: 4,
    id: 'services',
    rationale: 'Detalla el catálogo completo para usuarios que quieren comparar opciones.',
  },
  {
    position: 5,
    id: 'why-choose-us',
    rationale: 'Cuando el usuario ya conoce los servicios, responde por qué VIPTOUR es la mejor opción.',
  },
  {
    position: 6,
    id: 'gallery',
    rationale: 'Prueba visual de la calidad prometida. Aumenta el deseo con imágenes reales.',
  },
  {
    position: 7,
    id: 'google-reviews',
    rationale: 'Prueba social de terceros para validar la decisión cuando el deseo ya existe.',
  },
  {
    position: 8,
    id: 'reservation-process',
    rationale: 'Elimina la fricción de "¿Cómo reservo?" justo antes de la fase de acción.',
  },
  {
    position: 9,
    id: 'faq',
    rationale: 'Responde las últimas objeciones. El usuario que llega aquí está casi listo para reservar.',
  },
  {
    position: 10,
    id: 'location',
    rationale: 'Valida la existencia física del negocio. Elimina la última desconfianza.',
  },
  {
    position: 11,
    id: 'contact',
    rationale: 'CTA final. El usuario que scrolló hasta aquí tiene alta intención. No dejar escapar.',
  },
  {
    position: 12,
    id: 'footer',
    rationale: 'Cierre profesional. Proporciona contexto adicional y accesos secundarios.',
  },
];
