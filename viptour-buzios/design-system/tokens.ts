import { colors } from './colors';
import { spacing } from './spacing';
import { typography } from './typography';
import { radius } from './radius';
import { shadows } from './shadows';
import { animations } from './animations';
import { breakpoints } from './breakpoints';
import { grid } from './grid';
import { elevation } from './elevation';
import { motion } from './motion';
import { opacity } from './opacity';
import { zIndex } from './zindex';
import { icons } from './icons';
import { containers } from './containers';

/**
 * BELE Design Token Engine
 * Núcleo del sistema de diseño unificado.
 */
export const tokens = {
  colors,
  spacing,
  typography,
  radius,
  shadows,
  animations,
  breakpoints,
  grid,
  elevation,
  motion,
  opacity,
  zIndex,
  icons,
  containers,
} as const;

export type DesignTokens = typeof tokens;
