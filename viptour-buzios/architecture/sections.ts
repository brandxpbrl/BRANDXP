/**
 * Sections
 * Definición base de los bloques lógicos de la Landing.
 * Importado por el resto de los archivos de arquitectura.
 */
import type { SectionId } from './landing.structure';

export interface Section {
  id: SectionId;
  name: string;
  description: string;
}

export const sections: Section[] = [
  {
    id: 'hero',
    name: 'Hero',
    description: 'Primera impresión absoluta. Fotografía de impacto + promesa de valor + CTAs principales.',
  },
  {
    id: 'quick-actions',
    name: 'Quick Actions Bar',
    description: 'Barra de acceso rápido para usuarios que llegan sabiendo lo que quieren (WhatsApp, Ver Passeios, Localización).',
  },
  {
    id: 'experience-highlights',
    name: 'Experience Highlights',
    description: 'Vistazo rápido (3–4 tarjetas) a las experiencias más populares con foto, nombre y duración.',
  },
  {
    id: 'services',
    name: 'Services (Passeios)',
    description: 'Catálogo detallado de cada paseo ofrecido: nombre, descripción breve, duración, precio base y CTA.',
  },
  {
    id: 'why-choose-us',
    name: 'Why Choose Us (Diferenciais)',
    description: 'Argumentos racionales y emocionales que justifican elegir VIPTOUR frente a cualquier alternativa.',
  },
  {
    id: 'gallery',
    name: 'Gallery',
    description: 'Prueba visual de la calidad de las experiencias: fotos reales de clientes en los paseos.',
  },
  {
    id: 'google-reviews',
    name: 'Google Reviews',
    description: 'Prueba social de terceros. Las reseñas reales de Google Business son el mayor generador de confianza.',
  },
  {
    id: 'reservation-process',
    name: 'Reservation Process',
    description: 'Proceso de 3 pasos ultra-simple: Elige → Habla → Disfruta. Elimina la fricción de cómo reservar.',
  },
  {
    id: 'faq',
    name: 'FAQ',
    description: 'Respuestas a las dudas más comunes (idioma, pago, seguridad, niños). Elimina objeciones finales.',
  },
  {
    id: 'location',
    name: 'Location',
    description: 'Mapa embed de Google Maps con la ubicación de la base + indicación de zona de encuentro.',
  },
  {
    id: 'contact',
    name: 'Contact',
    description: 'CTA final consolidado dirigido a WhatsApp, con info de horarios y respuesta rápida.',
  },
  {
    id: 'footer',
    name: 'Footer',
    description: 'Cierre profesional: logo, links secundarios, redes sociales, copyright y confianza final.',
  },
];
