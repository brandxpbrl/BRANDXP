/**
 * Architecture Rules
 * Principios de oro para la construcción de toda la Landing.
 */

export const architectureRules = [
  'Máximo una (1) acción principal visible por "pantalla" de viewport.',
  'Cada sección debe aportar valor único. Si repite información de otra sección, debe ser eliminada o fusionada.',
  'No interrumpir la narrativa con secciones desconectadas del Experience Journey (Fase 3).',
  'No generar fatiga visual: alternar fondos claros/oscuros/imagen entre secciones.',
  'Cada CTA debe tener un objetivo explícito documentado en experience.cta.ts.',
  'El botón flotante de WhatsApp es sagrado. Nunca interferir con él.',
  'Las secciones Critical (hierarchy.ts) nunca pueden ser eliminadas por decisión estética.',
  'Toda nueva sección propuesta debe superar el test: "¿Aumenta el deseo o elimina una fricción?".',
  'El contenido Visual siempre precede al contenido textual denso.',
  'Ninguna sección puede romper el Scroll Flow definido en scroll-flow.ts.',
] as const;
