/**
 * Design Token: Colors
 * Define el sistema de colores de la aplicación, mapeado a variables CSS.
 * Las variables CSS deben estar definidas en `globals.css`
 */
export const colors = {
  // Brand
  primary: 'var(--color-primary)',
  secondary: 'var(--color-secondary)',
  accent: 'var(--color-accent)',
  
  // Feedback & Status
  success: 'var(--color-success)',
  warning: 'var(--color-warning)',
  danger: 'var(--color-danger)',
  info: 'var(--color-info)',
  
  // Base
  neutral: 'var(--color-neutral)',
  background: 'var(--color-background)',
  surface: 'var(--color-surface)',
  overlay: 'var(--color-overlay)',
  border: 'var(--color-border)',
  
  // Typography
  typography: {
    primary: 'var(--color-text-primary)',
    secondary: 'var(--color-text-secondary)',
    inverse: 'var(--color-text-inverse)',
    disabled: 'var(--color-text-disabled)',
  },
  
  // Interactive States
  interactive: {
    hover: 'var(--color-interactive-hover)',
    focus: 'var(--color-interactive-focus)',
    disabled: 'var(--color-interactive-disabled)',
    active: 'var(--color-interactive-active)',
  },
  
  // Gray Scale (50 a 900)
  gray: {
    50: 'var(--color-gray-50)',
    100: 'var(--color-gray-100)',
    200: 'var(--color-gray-200)',
    300: 'var(--color-gray-300)',
    400: 'var(--color-gray-400)',
    500: 'var(--color-gray-500)',
    600: 'var(--color-gray-600)',
    700: 'var(--color-gray-700)',
    800: 'var(--color-gray-800)',
    900: 'var(--color-gray-900)',
  }
} as const;
