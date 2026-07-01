/**
 * Architecture Metrics (Layout Intelligence Scores)
 * Métricas propias para evaluar la calidad de la arquitectura de información.
 */

export const architectureMetrics = {
  navigationScore: {
    description: 'Facilidad con la que un usuario puede orientarse y llegar a cualquier sección en <2 clics.',
    target: '> 90 / 100',
    measureBy: 'Cantidad de clics hasta el CTA principal desde cualquier punto.',
  },
  sectionEfficiencyScore: {
    description: 'Porcentaje de secciones que cumplen el test: "¿Aumenta el deseo o elimina una fricción?"',
    target: '100%',
    measureBy: 'Revisión manual contra section-objectives.ts.',
  },
  scrollFlowScore: {
    description: 'Si la curva de interés nunca desciende bruscamente entre secciones.',
    target: 'Sin caídas abruptas de atención > 20%.',
    measureBy: 'Validación contra scroll-flow.ts y mapas de calor (Hotjar).',
  },
  conversionDensity: {
    description: 'Proporción de secciones que tienen al menos un CTA visible.',
    target: '> 60% de las secciones críticas.',
    measureBy: 'Contar CTAs en section-objectives.ts.',
  },
  contentBalance: {
    description: 'Equilibrio entre secciones visuales (foto-led) y textuales (copy-led).',
    target: '60% visual, 40% textual.',
    measureBy: 'Revisión de section-content.ts.',
  },
  informationClarity: {
    description: 'Tiempo para que un usuario entienda qué vende la empresa.',
    target: '< 5 segundos.',
    measureBy: 'Test de usuario en Hero.',
  },
  visualRhythm: {
    description: 'Alternancia de secciones claras/oscuras para evitar fatiga visual.',
    target: 'Nunca más de 2 secciones de mismo fondo consecutivas.',
    measureBy: 'Revisión visual del scroll completo.',
  },
} as const;
