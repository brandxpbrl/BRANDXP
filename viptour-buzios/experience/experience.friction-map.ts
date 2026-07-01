/**
 * Friction Map
 * Identificación de obstáculos a la conversión y sus soluciones UI/UX.
 */
export const frictionMap = [
  {
    friction: "No entiende los precios o le parecen confusos.",
    solution: "Mostrar un precio base 'Desde X' muy claro, y dejar los detalles para la conversación por WhatsApp."
  },
  {
    friction: "No sabe cuánto dura el paseo.",
    solution: "Usar badges o iconos rápidos con duración (ej. '⏳ 2 a 3 horas') debajo del título de la experiencia."
  },
  {
    friction: "No encuentra cómo contactar rápido.",
    solution: "Botón flotante de WhatsApp persistente en la esquina inferior derecha en Mobile y Desktop."
  },
  {
    friction: "Duda sobre el idioma (brasileños vs argentinos).",
    solution: "Mencionar explícitamente en el copy o en FAQ que los guías son bilingües / entienden 'portuñol'."
  },
  {
    friction: "Desconfianza sobre la empresa (miedo a estafas).",
    solution: "Mostrar widget o captura real de Google Reviews (5 estrellas) y enlace directo al perfil de negocio."
  },
  {
    friction: "No sabe el punto de encuentro.",
    solution: "Sección rápida explicando 'Te buscamos en tu Pousada' o mapa claro del local."
  },
  {
    friction: "No entiende cómo reservar.",
    solution: "Sección visual de 3 pasos: 1. Elige tu paseo, 2. Háblanos por WhatsApp, 3. Disfruta Búzios."
  }
] as const;
