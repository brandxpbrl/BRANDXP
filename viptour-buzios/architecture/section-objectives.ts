/**
 * Section Objectives
 * Para cada sección: objetivo, emoción, info principal, CTA,
 * tiempo estimado de lectura, prioridad y nivel de atención.
 */
import type { SectionId } from './landing.structure';

export interface SectionObjective {
  id: SectionId;
  goal: string;
  emotion: string;
  mainInfo: string;
  primaryCta: string | null;
  secondaryCta: string | null;
  readingTimeSeconds: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
  attentionLevel: number; // % de usuarios que llegan y permanecen
}

export const sectionObjectives: SectionObjective[] = [
  {
    id: 'hero',
    goal: 'Retener al usuario en los primeros 3 segundos y orientarlo visualmente.',
    emotion: 'Asombro',
    mainInfo: 'Quiénes somos + Qué ofrecemos + Slogan',
    primaryCta: 'Reservar Agora',
    secondaryCta: 'Ver Passeios',
    readingTimeSeconds: 5,
    priority: 'critical',
    attentionLevel: 100,
  },
  {
    id: 'quick-actions',
    goal: 'Capturar conversiones de usuarios con alta intención de inmediato.',
    emotion: 'Claridad',
    mainInfo: 'WhatsApp directo, Ver Passeios, Ver Mapa',
    primaryCta: 'Falar no WhatsApp',
    secondaryCta: null,
    readingTimeSeconds: 3,
    priority: 'high',
    attentionLevel: 85,
  },
  {
    id: 'experience-highlights',
    goal: 'Despertar el deseo mostrando las 3–4 experiencias más atractivas.',
    emotion: 'Deseo / Aventura',
    mainInfo: 'Foto, nombre, duración, badge de popularidad',
    primaryCta: 'Ver Todos os Passeios',
    secondaryCta: null,
    readingTimeSeconds: 12,
    priority: 'critical',
    attentionLevel: 80,
  },
  {
    id: 'services',
    goal: 'Presentar el catálogo completo de paseos con suficiente detalle para decidir.',
    emotion: 'Deseo + Comparación',
    mainInfo: 'Nombre, descripción, duración, precio base, puntos de visita',
    primaryCta: 'Saber mais no WhatsApp',
    secondaryCta: null,
    readingTimeSeconds: 30,
    priority: 'critical',
    attentionLevel: 70,
  },
  {
    id: 'why-choose-us',
    goal: 'Diferenciarse de la competencia con argumentos concretos.',
    emotion: 'Confianza / Exclusividad',
    mainInfo: 'Flotilla premium, experiencia, atención personalizada, bilingüe',
    primaryCta: null,
    secondaryCta: 'Falar no WhatsApp',
    readingTimeSeconds: 15,
    priority: 'high',
    attentionLevel: 60,
  },
  {
    id: 'gallery',
    goal: 'Validar visualmente la promesa de calidad con fotografías reales.',
    emotion: 'Inspiración',
    mainInfo: 'Grid masonry de imágenes reales de clientes en los paseos',
    primaryCta: null,
    secondaryCta: null,
    readingTimeSeconds: 10,
    priority: 'high',
    attentionLevel: 65,
  },
  {
    id: 'google-reviews',
    goal: 'Generar confianza con prueba social de terceros verificada.',
    emotion: 'Seguridad / Validación',
    mainInfo: 'Rating 4.9/5, testimonios seleccionados, cantidad de reseñas, link Google',
    primaryCta: 'Ver Todas as Avaliações',
    secondaryCta: null,
    readingTimeSeconds: 20,
    priority: 'critical',
    attentionLevel: 55,
  },
  {
    id: 'reservation-process',
    goal: 'Eliminar la fricción de "¿cómo reservo?" con un proceso visual de 3 pasos.',
    emotion: 'Tranquilidad / Facilidad',
    mainInfo: 'Paso 1: Elige → Paso 2: Habla → Paso 3: Disfruta',
    primaryCta: 'Iniciar Reserva',
    secondaryCta: null,
    readingTimeSeconds: 10,
    priority: 'high',
    attentionLevel: 50,
  },
  {
    id: 'faq',
    goal: 'Eliminar las últimas objeciones antes de la conversión final.',
    emotion: 'Tranquilidad / Alivio',
    mainInfo: 'Preguntas sobre seguridad, idioma, pago, niños, punto de encuentro',
    primaryCta: 'Ainda tem dúvidas? Fale conosco',
    secondaryCta: null,
    readingTimeSeconds: 25,
    priority: 'high',
    attentionLevel: 45,
  },
  {
    id: 'location',
    goal: 'Confirmar la existencia física y accesibilidad del negocio.',
    emotion: 'Confianza',
    mainInfo: 'Mapa interactivo embed, dirección, indicación de zona de encuentro',
    primaryCta: 'Como Chegar',
    secondaryCta: null,
    readingTimeSeconds: 8,
    priority: 'medium',
    attentionLevel: 40,
  },
  {
    id: 'contact',
    goal: 'CTA final de máxima conversión para el usuario que scrolló hasta el final.',
    emotion: 'Decisión',
    mainInfo: 'Resumen de propuesta de valor + CTA destacado WhatsApp + horarios',
    primaryCta: 'Reservar pelo WhatsApp',
    secondaryCta: null,
    readingTimeSeconds: 8,
    priority: 'critical',
    attentionLevel: 35,
  },
  {
    id: 'footer',
    goal: 'Cierre profesional que transmite solidez y facilita accesos secundarios.',
    emotion: 'Profesionalismo',
    mainInfo: 'Logo, links secundarios, redes sociales, copyright, WhatsApp link',
    primaryCta: null,
    secondaryCta: 'Instagram',
    readingTimeSeconds: 5,
    priority: 'medium',
    attentionLevel: 30,
  },
];
