import { motion } from './motion';

/**
 * Design Token: Animations
 * Animaciones predefinidas construidas con los tokens de Motion.
 */
export const animations = {
  fadeIn: `fade-in ${motion.duration.normal} ${motion.easing.out}`,
  fadeOut: `fade-out ${motion.duration.fast} ${motion.easing.in}`,
  slideUp: `slide-up ${motion.duration.normal} ${motion.easing.spring}`,
  slideDown: `slide-down ${motion.duration.normal} ${motion.easing.spring}`,
  zoomIn: `zoom-in ${motion.duration.normal} ${motion.easing.spring}`,
} as const;
