/**
 * Design Token: Motion
 * Parámetros para animaciones y transiciones.
 */
export const motion = {
  duration: {
    fast: 'var(--motion-duration-fast)',
    normal: 'var(--motion-duration-normal)',
    slow: 'var(--motion-duration-slow)',
    ultra: 'var(--motion-duration-ultra)',
  },
  delay: {
    short: 'var(--motion-delay-short)',
    medium: 'var(--motion-delay-medium)',
    long: 'var(--motion-delay-long)',
  },
  easing: {
    linear: 'linear',
    in: 'var(--motion-ease-in)',
    out: 'var(--motion-ease-out)',
    inOut: 'var(--motion-ease-in-out)',
    spring: 'var(--motion-ease-spring)',
  },
  types: {
    hover: 'var(--motion-hover)',
    scale: 'var(--motion-scale)',
    reveal: 'var(--motion-reveal)',
    parallax: 'var(--motion-parallax)',
    fade: 'var(--motion-fade)',
    slide: 'var(--motion-slide)',
    zoom: 'var(--motion-zoom)',
  }
} as const;
