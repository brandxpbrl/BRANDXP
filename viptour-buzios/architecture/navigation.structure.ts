/**
 * Navigation Structure
 * Navbar, anclas, botón flotante, menú móvil y footer navigation.
 */

export const navigationStructure = {
  navbar: {
    behavior: 'Sticky inteligente (ocultar al bajar, mostrar al subir).',
    items: [
      { label: 'Passeios', anchor: '#passeios' },
      { label: 'Avaliações', anchor: '#avaliacoes' },
      { label: 'FAQ', anchor: '#faq' },
      { label: 'Contato', anchor: '#contato' },
    ],
    primaryCta: { label: 'Reservar Agora', action: 'whatsapp-deep-link' },
    logo: { position: 'left', format: 'svg', colorMode: 'dark-on-light (default) / light-on-dark (scrolled)' },
  },
  mobileMenu: {
    type: 'Drawer / Hamburger',
    behavior: 'Slide desde la derecha. Fondo Dark Navy semi-transparente.',
    content: 'Mismos links que el Navbar + WhatsApp grande al final.',
  },
  floatingButton: {
    type: 'FAB (Floating Action Button)',
    platform: 'WhatsApp',
    position: 'fixed bottom-6 right-6',
    animation: 'Pulse sutil para llamar la atención',
    trigger: 'Aparece al superar el 20% del viewport height en scroll.',
    zIndex: 700,
  },
  scrollBehavior: 'smooth',
  anchors: ['#hero', '#experiencias', '#passeios', '#avaliacoes', '#faq', '#localizacao', '#contato'],
  footer: {
    links: ['Passeios', 'Avaliações', 'FAQ', 'Contato'],
    social: ['Instagram', 'WhatsApp'],
  },
} as const;
