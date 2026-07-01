/**
 * Navigation Strategy
 * Define el orden, anclas y botones flotantes para que el usuario nunca se pierda.
 */
export const navigationStrategy = {
  header: {
    behavior: "Sticky / Oculto al bajar, visible al subir (smart header).",
    items: ["Passeios", "Avaliações", "FAQ", "Contato"]
  },
  floating: {
    type: "Botón de WhatsApp pulsante",
    visibility: "Aparece después de scrollear el 20% de la página (fuera del Hero) para no ensuciar la primera impresión."
  },
  scroll: {
    behavior: "Smooth scroll (scroll-behavior: smooth).",
    anchors: "Los enlaces de la navegación apuntarán a los IDs semánticos de cada sección."
  }
} as const;
