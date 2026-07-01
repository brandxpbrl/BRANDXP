/**
 * Experience Personas
 * Perfiles de usuarios con sus necesidades, miedos y capacidades técnicas.
 */
export const experiencePersonas = [
  {
    type: "Turistas Brasileños",
    goals: "Descubrir playas secretas, relax total, buenas fotos.",
    fears: "Pagar de más, tours aburridos, vehículos en mal estado.",
    questions: ["¿Aceptan Pix?", "¿Tienen disponibilidad hoy?", "¿El guía conoce lugares sin multitudes?"],
    language: "Portugués (PT-BR)",
    device: "Mobile (iOS/Android)",
    techLevel: "Alto (uso constante de WhatsApp e Instagram)",
    decisionTime: "Rápido (1-2 días antes o en el mismo destino)"
  },
  {
    type: "Turistas Argentinos",
    goals: "Sentir la aventura, aprovechar el dinero, conocer el Búzios clásico.",
    fears: "Problemas con el idioma, ser engañados con el tipo de cambio, falta de seguridad.",
    questions: ["¿Hablan español?", "¿Cómo puedo pagar?", "¿Es seguro para mi familia?"],
    language: "Español (ES-AR)",
    device: "Mobile (Android mayormente)",
    techLevel: "Medio/Alto",
    decisionTime: "Medio (Planifican semanas antes del viaje)"
  },
  {
    type: "Familias",
    goals: "Paseo divertido y seguro para niños y adultos.",
    fears: "Peligro en el buggy, sol extremo sin protección, guías imprudentes.",
    questions: ["¿Los buggys tienen cinturones?", "¿Podemos llevar niños de 5 años?", "¿Hay sombra?"],
    language: "Multilingüe",
    device: "Desktop / Mobile",
    techLevel: "Medio",
    decisionTime: "Lento (Mucha comparación y búsqueda de seguridad)"
  }
] as const;
