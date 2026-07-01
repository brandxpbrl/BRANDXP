/**
 * Mobile Flow
 * Reglas estructurales específicas para viewports mobile (hasta 767px).
 */

export const mobileFlow = {
  philosophy: 'Mobile First. El usuario móvil es el cliente principal. No adaptar Desktop a Mobile, sino diseñar Mobile desde cero.',
  rules: [
    'Botón flotante de WhatsApp siempre visible en posición fixed bottom-right.',
    'Hero: fullscreen, CTA grande, texto mínimo.',
    'Quick Actions: íconos verticales apilados o slider horizontal.',
    'Cards de Experiencias: 1 columna, ancho completo.',
    'Gallery: grid 1×n o slider horizontal.',
    'FAQ: accordion vertical, padding generoso para touch.',
    'Fuentes: mínimo 16px para body text (evitar zoom automático de Safari).',
    'Mapa: reducido a 300px de alto para no ocupar toda la pantalla.',
    'CTA principal siempre con mínimo 48px de altura (touch target).',
  ],
  breakpointRange: '320px – 767px',
} as const;
