/**
 * CTA Strategy
 * Estrategia de Call To Actions.
 */
export const ctaStrategy = [
  {
    text: "Falar no WhatsApp",
    objective: "Conversión directa",
    location: "Botón Flotante (Global), Navbar (Desktop)",
    priority: "Primary",
    journeyMoment: "Cualquier momento"
  },
  {
    text: "Reservar Agora",
    objective: "Conversión por impulso",
    location: "Hero Section",
    priority: "Primary",
    journeyMoment: "Inicio"
  },
  {
    text: "Ver Passeios",
    objective: "Navegación / Scroll anchor",
    location: "Hero Section (Debajo de Reservar)",
    priority: "Secondary",
    journeyMoment: "Inicio (Si no está listo para reservar)"
  },
  {
    text: "Solicitar Informações",
    objective: "Consulta de dudas",
    location: "Debajo de las Experiencias o FAQ",
    priority: "Primary",
    journeyMoment: "Consideración profunda"
  },
  {
    text: "Como Chegar",
    objective: "Validación geográfica",
    location: "Footer / Sección de Mapa",
    priority: "Secondary",
    journeyMoment: "Confianza / Cierre"
  }
] as const;
