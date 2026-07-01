/**
 * Brand Typography
 * Qué comunica la fuente seleccionada y sus reglas de uso.
 */
export const brandTypography = {
  family: "Montserrat",
  communication: "Modernidad, legibilidad geométrica, y una estética premium internacional pero accesible.",
  emotions: "Claridad, confianza, apertura.",
  hierarchy: [
    {
      weight: "ExtraBold / Bold",
      usage: "H1, Títulos principales, CTAs. Transmite solidez y llama a la acción con seguridad."
    },
    {
      weight: "SemiBold",
      usage: "Subtítulos, nombres de paquetes, precios. Transmite información importante sin gritar."
    },
    {
      weight: "Regular",
      usage: "Párrafos, descripciones largas, FAQs. Transmite transparencia y confort al leer."
    }
  ]
} as const;
