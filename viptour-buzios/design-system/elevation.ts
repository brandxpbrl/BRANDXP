/**
 * Design Token: Elevation
 * Tokens semánticos para elevación (combina Z-index y Shadows en concepto, 
 * aunque aquí solo mapea a niveles lógicos).
 */
export const elevation = {
  surface: 'var(--elevation-surface)', // Nivel base
  raised: 'var(--elevation-raised)',   // Ligeramente elevado (ej. Cards)
  overlay: 'var(--elevation-overlay)', // Superpuesto (ej. Modales, Dropdowns)
  floating: 'var(--elevation-floating)', // Flotante (ej. FABs, Tooltips)
} as const;
