/**
 * Behavior Engine
 * Análisis de qué hace, qué compara y qué necesita el usuario en cada etapa.
 */
export const behaviorEngine = {
  stage1_landing: {
    userDoes: "Escanea la imagen buscando validación de calidad.",
    userDoubts: "¿Esto es lo que busco? ¿Es premium?",
    userNeeds: "Validación visual en menos de 3 segundos."
  },
  stage2_exploration: {
    userDoes: "Hace scroll, lee títulos, ignora párrafos densos.",
    userDoubts: "¿Cuánto dura? ¿A dónde me llevan?",
    userNeeds: "Viñetas rápidas (Bullet points), íconos."
  },
  stage3_evaluation: {
    userDoes: "Busca estrellas de Google o testimonios.",
    userDoubts: "¿Cumplen lo que prometen? ¿Me van a dejar tirado?",
    userNeeds: "Prueba social (Social Proof)."
  },
  stage4_action: {
    userDoes: "Busca cómo contactar sin compromiso rígido.",
    userDoubts: "¿Me contestarán rápido?",
    userNeeds: "Botón de WhatsApp claro."
  }
} as const;
