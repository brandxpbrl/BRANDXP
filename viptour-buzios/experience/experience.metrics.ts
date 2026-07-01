/**
 * Experience Metrics (BELE Custom Metrics)
 * Sistema de evaluación propio del framework BELE.
 */
export const experienceMetrics = {
  brandScore: "Evaluación (1-100) de qué tanto la UI respeta el Brand Energy Profile (BEP).",
  experienceScore: "Medición de fricción (menos pasos para llegar al WhatsApp = mayor puntaje).",
  trustScore: "Densidad de elementos de confianza (Google, FAQs, equipo). Meta: > 3 elementos visibles en toda la página.",
  emotionScore: "Cumplimiento del Conversion Emotion Map (¿La sección Hero causa asombro real?).",
  conversionScore: "Tasa teórica de usuarios que harían clic en el CTA basado en su prominencia y color.",
  seoScore: "Auditoría de Metadata, H1-H6, Schema y Web Vitals (Automático en Lighthouse).",
  performanceScore: "Lighthouse LCP, CLS, FCP (Meta: > 95)."
} as const;
