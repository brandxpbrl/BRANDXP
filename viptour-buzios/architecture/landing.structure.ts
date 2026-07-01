/**
 * Landing Structure
 * Define todas las secciones oficiales de la Landing Page.
 * Cada sección existe porque cumple una función específica
 * en el recorrido del usuario hacia la conversión.
 */

export type SectionId =
  | 'hero'
  | 'quick-actions'
  | 'experience-highlights'
  | 'services'
  | 'why-choose-us'
  | 'gallery'
  | 'google-reviews'
  | 'reservation-process'
  | 'faq'
  | 'location'
  | 'contact'
  | 'footer';

export interface LandingSection {
  id: SectionId;
  name: string;
  component: string; // Nombre del componente React futuro
  route: string; // ID para scroll anchor
  exists: boolean; // Fase 0-4: false. Fase 7+: true
}

export const landingStructure: LandingSection[] = [
  { id: 'hero', name: 'Hero', component: 'HeroSection', route: '#hero', exists: false },
  { id: 'quick-actions', name: 'Quick Actions', component: 'QuickActionsBar', route: '#accoes', exists: false },
  { id: 'experience-highlights', name: 'Experience Highlights', component: 'ExperienceHighlights', route: '#experiencias', exists: false },
  { id: 'services', name: 'Services', component: 'ServicesSection', route: '#passeios', exists: false },
  { id: 'why-choose-us', name: 'Why Choose Us', component: 'WhyChooseUs', route: '#diferenciais', exists: false },
  { id: 'gallery', name: 'Gallery', component: 'GallerySection', route: '#galeria', exists: false },
  { id: 'google-reviews', name: 'Google Reviews', component: 'ReviewsSection', route: '#avaliacoes', exists: false },
  { id: 'reservation-process', name: 'Reservation Process', component: 'ReservationProcess', route: '#como-reservar', exists: false },
  { id: 'faq', name: 'FAQ', component: 'FAQSection', route: '#faq', exists: false },
  { id: 'location', name: 'Location', component: 'LocationSection', route: '#localizacao', exists: false },
  { id: 'contact', name: 'Contact', component: 'ContactSection', route: '#contato', exists: false },
  { id: 'footer', name: 'Footer', component: 'SiteFooter', route: '#footer', exists: false },
];
