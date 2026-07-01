/**
 * Design Token: Typography
 * Escala fluida y semántica tipográfica de BELE.
 */
export const typography = {
  fontFamily: {
    primary: 'var(--font-primary)',
    secondary: 'var(--font-secondary)',
  },
  size: {
    'display-xl': 'var(--text-display-xl)',
    'display-l': 'var(--text-display-l)',
    'display-m': 'var(--text-display-m)',
    'h1': 'var(--text-h1)',
    'h2': 'var(--text-h2)',
    'h3': 'var(--text-h3)',
    'h4': 'var(--text-h4)',
    'h5': 'var(--text-h5)',
    'h6': 'var(--text-h6)',
    'body-xl': 'var(--text-body-xl)',
    'body-l': 'var(--text-body-l)',
    'body': 'var(--text-body)',
    'body-small': 'var(--text-body-small)',
    'caption': 'var(--text-caption)',
  },
  weight: {
    regular: 'var(--font-weight-regular)',
    medium: 'var(--font-weight-medium)',
    semibold: 'var(--font-weight-semibold)',
    bold: 'var(--font-weight-bold)',
    extrabold: 'var(--font-weight-extrabold)',
  },
  semantics: {
    label: 'var(--text-label)',
    button: 'var(--text-button)',
    navigation: 'var(--text-navigation)',
    hero: 'var(--text-hero)',
  }
} as const;
