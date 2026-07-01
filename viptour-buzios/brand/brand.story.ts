/**
 * Brand Story & Customer Journey
 * La narrativa que la Landing Page debe seguir estructuralmente.
 */
export const brandStory = {
  narrativeArc: [
    {
      phase: "Inicio",
      goal: "Capturar atención emocional",
      content: "Hero section con paisaje espectacular, buggy y promesa clara."
    },
    {
      phase: "Descubrimiento",
      goal: "Despertar el deseo",
      content: "Mostrar las experiencias posibles (playas secretas, miradores) y la libertad del viaje."
    },
    {
      phase: "Experiencia",
      goal: "Tangibilizar el valor",
      content: "Detallar qué incluye, cómo es el vehículo (premium), cómo es el día a día."
    },
    {
      phase: "Confianza",
      goal: "Eliminar fricciones y miedos",
      content: "Prueba social, reviews reales, certificados, atención personalizada, FAQ."
    },
    {
      phase: "Reserva",
      goal: "Conversión sin fricción",
      content: "CTA directos a WhatsApp, claros y amigables."
    },
    {
      phase: "Recuerdo",
      goal: "Conexión a largo plazo",
      content: "Footer, redes sociales (Instagram) para seguir soñando con el viaje."
    }
  ]
} as const;
