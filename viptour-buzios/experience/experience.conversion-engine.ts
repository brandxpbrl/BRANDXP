/**
 * Conversion Engine
 * Documentación de la intención de conversión por sección.
 */
export const conversionEngine = [
  {
    section: "Hero",
    goal: "Capturar retención inmediata.",
    emotion: "Asombro",
    information: "Promesa de valor principal.",
    primaryCta: "Reservar Agora",
    secondaryCta: "Ver Passeios",
    maxReadingTime: "3 segundos",
    expectedAttention: "100%"
  },
  {
    section: "Experiencias",
    goal: "Mostrar catálogo de opciones.",
    emotion: "Deseo",
    information: "Fotos, duración, nombre del paseo.",
    primaryCta: "Saber mais no WhatsApp",
    secondaryCta: null,
    maxReadingTime: "15 segundos",
    expectedAttention: "80%"
  },
  {
    section: "Confianza / Reviews",
    goal: "Validar decisión de compra.",
    emotion: "Seguridad",
    information: "Testimonios reales.",
    primaryCta: null,
    secondaryCta: null,
    maxReadingTime: "10 segundos",
    expectedAttention: "60%"
  }
  // Se extenderá con más secciones según la arquitectura
] as const;
