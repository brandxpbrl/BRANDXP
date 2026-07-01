/**
 * Section Hierarchy
 * Clasificación de importancia y contingencias por ausencia de datos.
 */
import type { SectionId } from './landing.structure';

export type HierarchyLevel = 'critical' | 'high' | 'medium' | 'low';

export interface SectionHierarchy {
  id: SectionId;
  level: HierarchyLevel;
  /** Qué ocurre si esta sección se elimina o no tiene datos */
  impactIfRemoved: string;
  canBeHidden: boolean;
}

export const sectionHierarchy: SectionHierarchy[] = [
  {
    id: 'hero',
    level: 'critical',
    impactIfRemoved: 'Pérdida inmediata del 100% de retención. Sin Hero no hay Landing.',
    canBeHidden: false,
  },
  {
    id: 'quick-actions',
    level: 'high',
    impactIfRemoved: 'Se pierde la captura de usuarios de alta intención. Puede omitirse en Mobile si afecta CLS.',
    canBeHidden: true,
  },
  {
    id: 'experience-highlights',
    level: 'critical',
    impactIfRemoved: 'El usuario no sabe qué ofrece la empresa. Cae el deseo y el tiempo de sesión.',
    canBeHidden: false,
  },
  {
    id: 'services',
    level: 'critical',
    impactIfRemoved: 'Sin catálogo detallado, el usuario no puede evaluar opciones. Impacta directamente conversiones.',
    canBeHidden: false,
  },
  {
    id: 'why-choose-us',
    level: 'high',
    impactIfRemoved: 'La marca pierde diferenciación frente a la competencia.',
    canBeHidden: true,
  },
  {
    id: 'gallery',
    level: 'high',
    impactIfRemoved: 'Sin prueba visual, el deseo disminuye. Puede reemplazarse con imágenes dentro de Services.',
    canBeHidden: true,
  },
  {
    id: 'google-reviews',
    level: 'critical',
    impactIfRemoved: 'Sin prueba social de terceros, la tasa de conversión cae significativamente.',
    canBeHidden: false,
  },
  {
    id: 'reservation-process',
    level: 'high',
    impactIfRemoved: 'Aumenta la fricción de "¿cómo reservo?". Puede integrarse dentro de Contact si es necesario.',
    canBeHidden: true,
  },
  {
    id: 'faq',
    level: 'high',
    impactIfRemoved: 'Las objeciones no respondidas se transforman en abandonos silenciosos.',
    canBeHidden: true,
  },
  {
    id: 'location',
    level: 'medium',
    impactIfRemoved: 'Reduce la confianza en clientes que valoran la verificación física. Puede integrarse en Footer.',
    canBeHidden: true,
  },
  {
    id: 'contact',
    level: 'critical',
    impactIfRemoved: 'El usuario motivado al final del scroll no tiene una puerta de salida clara hacia la reserva.',
    canBeHidden: false,
  },
  {
    id: 'footer',
    level: 'medium',
    impactIfRemoved: 'Se pierde acceso a redes sociales y contactos secundarios. Afecta la percepción profesional.',
    canBeHidden: false,
  },
];
