/**
 * Conversion Path
 * El "Golden Path" y las rutas alternativas hacia la conversión.
 */

export const conversionPath = {
  goldenPath: {
    name: 'Camino Óptimo',
    description: 'Usuario que entra, se inspira y convierte sin fricción.',
    steps: [
      { step: 1, section: 'hero', action: 'Ve la foto → siente asombro' },
      { step: 2, section: 'experience-highlights', action: 'Ve las experiencias → siente deseo' },
      { step: 3, section: 'google-reviews', action: 'Lee las reseñas → siente seguridad' },
      { step: 4, section: 'contact / floating-button', action: 'Hace clic en WhatsApp → CONVERSIÓN' },
    ],
  },
  alternativePaths: [
    {
      name: 'Camino del Curioso',
      description: 'El usuario quiere conocer todos los paseos antes de decidir.',
      steps: ['hero', 'experience-highlights', 'services', 'why-choose-us', 'reservation-process', 'contact'],
    },
    {
      name: 'Camino del Desconfiado',
      description: 'El usuario necesita mucha validación antes de actuar.',
      steps: ['hero', 'services', 'gallery', 'google-reviews', 'faq', 'location', 'contact'],
    },
    {
      name: 'Camino del Decidido',
      description: 'Ya sabe lo que quiere y va directo a la acción.',
      steps: ['hero', 'quick-actions → WhatsApp'],
    },
  ],
  floatingButton: {
    description: 'El botón flotante de WhatsApp es el comodín: intercepta la conversión en CUALQUIER punto del scroll.',
    trigger: 'Visible desde el 20% del scroll en adelante.',
  },
} as const;
