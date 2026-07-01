/**
 * Design Token: Grid
 * Configuración del sistema de grilla basado en CSS Grid.
 */
export const grid = {
  columns: 12,
  gap: {
    sm: 'var(--spacing-16)',
    md: 'var(--spacing-24)',
    lg: 'var(--spacing-32)',
  },
} as const;
