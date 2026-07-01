/**
 * Brand Color Psychology
 * Justificación emocional de la paleta de colores del Design Token Engine.
 */
export const brandColorPsychology = {
  colors: [
    {
      name: "Ocean Blue (Primary)",
      emotion: "Confianza, frescura, amplitud.",
      usage: "Acciones principales (CTAs), highlights, elementos de seguridad y reserva.",
      avoid: "No usar en fondos masivos que ahoguen la lectura."
    },
    {
      name: "Buggy Yellow (Secondary)",
      emotion: "Alegría, sol, energía, aventura.",
      usage: "Acentos dinámicos, insignias (badges), detalles que deben captar atención rápida.",
      avoid: "No usar para textos legibles o grandes bloques, ya que cansa la vista."
    },
    {
      name: "Turquoise (Accent)",
      emotion: "Naturaleza, aguas cristalinas de Búzios, tranquilidad tropical.",
      usage: "Gradientes, fondos sutiles, iconografía secundaria.",
      avoid: "No competir con el Ocean Blue en acciones críticas."
    },
    {
      name: "Dark Navy (Typography & Headers)",
      emotion: "Elegancia, solidez, profesionalismo premium.",
      usage: "Títulos principales, fondos en modo oscuro, footers.",
      avoid: "No usar negro puro (#000000)."
    },
    {
      name: "Sand (Backgrounds)",
      emotion: "Calidez, playas, relax.",
      usage: "Fondos de secciones alternas (surface) para dar respiro al blanco.",
      avoid: "No usarlo junto con textos muy claros por falta de contraste."
    }
  ]
} as const;
