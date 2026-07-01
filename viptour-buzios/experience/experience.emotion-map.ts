/**
 * Conversion Emotion Map (CEM)
 * Mapeo estricto de emociones por sección de la Landing.
 */
export const conversionEmotionMap = [
  { section: "Hero", expectedEmotion: "Asombro / Impacto" },
  { section: "Experiencias", expectedEmotion: "Deseo / Aventura" },
  { section: "Beneficios (Por qué nosotros)", expectedEmotion: "Confianza / Exclusividad" },
  { section: "Galería", expectedEmotion: "Inspiración" },
  { section: "Reviews", expectedEmotion: "Seguridad / Validación Social" },
  { section: "FAQ", expectedEmotion: "Tranquilidad / Alivio" },
  { section: "CTA Final", expectedEmotion: "Decisión / Urgencia sutil" },
  { section: "Footer", expectedEmotion: "Profesionalismo" }
] as const;
