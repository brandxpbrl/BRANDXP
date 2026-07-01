# Wireframe Documentation
# BELE — Rapid Wireframing Engine v1.0

---

## Propósito

Los wireframes de esta carpeta representan la **estructura de baja fidelidad** de la Landing Page de VIPTOUR BÚZIOS. Son el puente entre la Arquitectura de Información (Fase 4) y el desarrollo visual (Fase 6).

**Los wireframes validan:**
- ✅ Jerarquía de contenido
- ✅ Flujo de usuario y conversión
- ✅ Escaneabilidad
- ✅ Distribución responsive

**Los wireframes NO definen:**
- ❌ Colores finales
- ❌ Fotografías reales
- ❌ Tipografía definitiva
- ❌ Animaciones y motion

---

## Archivos de esta Carpeta

| Archivo | Descripción |
|---------|-------------|
| `home.mobile.md` | Wireframes de todas las secciones en 375px (Mobile First) |
| `home.desktop.md` | Adaptaciones en 768px / 1280px / 1440px |
| `wireframe.components.md` | Registro de todos los componentes React identificados |
| `wireframe.assets.md` | Inventario de fotografías, SVGs, iconos e integraciones |
| `scroll.blueprint.md` | Mapa de scroll: curva de interés, emociones y puntos de conversión |
| `wireframe.documentation.md` | Este archivo |

---

## Convenciones de los Wireframes (ASCII)

| Símbolo | Significado |
|---------|-------------|
| `[ IMG PLACEHOLDER ]` | Imagen / fotografía |
| `[H1]` `[H2]` `[H3]` | Jerarquía tipográfica |
| `[p]` | Párrafo de texto |
| `[BTN]` | Botón interactivo |
| `[ICON]` | Ícono de Lucide React |
| `█` `░` | Área rellena / overlay |
| `┌─┐ └─┘` | Bordes de sección/card |
| `╔═╗ ╚═╝` | Card con mayor prominencia |
| `↓ →` | Indicadores de dirección |
| `[★ POPULAR]` | Badge / etiqueta |

---

## Breakpoints Documentados

| Breakpoint | Nombre | Estado |
|---|---|---|
| 375px | Mobile (Primary) | ✅ Documentado en home.mobile.md |
| 768px | Tablet | ✅ Cubierto en home.desktop.md (notas) |
| 1024px | Desktop Small | ✅ Cubierto |
| 1280px | Desktop (Primary) | ✅ Documentado en home.desktop.md |
| 1440px | Desktop Large | ✅ Cubierto |
| 1920px | UltraWide | 🔜 Fase 9 — Responsive |

---

## Secciones y Estado

| Sección | Mobile | Desktop | Prioridad |
|---------|--------|---------|-----------|
| Navbar | ✅ | ✅ | Critical |
| Hero | ✅ | ✅ | Critical |
| Quick Actions | ✅ | ✅ | High |
| Experience Highlights | ✅ | ✅ | Critical |
| Services | ✅ | ✅ | Critical |
| Why Choose Us | ✅ | ✅ | High |
| Gallery | ✅ | ✅ | High |
| Reviews | ✅ | ✅ | Critical |
| Reservation Process | ✅ | ✅ | High |
| FAQ | ✅ | ✅ | High |
| Location | ✅ | ✅ | Medium |
| Contact | ✅ | ✅ | Critical |
| Footer | ✅ | ✅ | Medium |
| Floating WhatsApp | ✅ | ✅ | Critical |
| Mobile Drawer | ✅ | n/a | High |

---

## Checklist de Validación

Antes de pasar a la Fase 6, verificar:

- [ ] Toda sección crítica tiene al menos un CTA visible
- [ ] El Botón Flotante de WhatsApp no interfiere con otros CTAs
- [ ] Ningún bloque rompe el Visual Rhythm (alternancia de fondos)
- [ ] La sección Hero comunica la propuesta de valor en <5 segundos
- [ ] El scroll de Reviews y Gallery reactivan visualmente el interés
- [ ] El Contact final tiene un CTA único de alto contraste
- [ ] El FAQ responde las 6 objeciones principales del Friction Map

---

> **Próximo paso: FASE 6 — Visual Experience System (VES)**
> Aquí comienza la construcción visual: Hero cinematográfico, cards premium,
> animaciones con Framer Motion, y toda la identidad de VIPTOUR aplicada.
