/**
 * Brand Energy Profile (BEP) & Personality
 * Puntuación de dimensiones de personalidad (escala 1-10).
 * Este perfil determinará automáticamente decisiones de UI.
 */
export const brandPersonality = {
  // Brand Energy Profile (BEP)
  bep: {
    confianza: 10,     // Prioridad Máxima: Seguridad y profesionalismo
    exclusividad: 8,   // Premium pero accesible
    aventura: 9,       // El core de la experiencia en buggy
    cercania: 8,       // Trato humano, anfitrión local
    innovacion: 6,     // Moderno y fácil de reservar
    elegancia: 7,      // Estética cuidada sin perder lo natural
    dinamismo: 8,      // Interfaz viva y responsiva
  },
  
  // Atributos base
  attributes: [
    "Aventurera",
    "Premium",
    "Confiable",
    "Amigable",
    "Elegante",
    "Natural",
    "Internacional",
    "Profesional"
  ],

  // UI Translation Logic (Concepto para el motor)
  getDominantTrait: function() {
    return "Confianza y Aventura"; // Dictará colores y peso de tipografía
  }
} as const;
