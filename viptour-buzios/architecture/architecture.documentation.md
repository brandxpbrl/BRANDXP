# VIPTOUR BÚZIOS — Architecture Blueprint

> Documento maestro de la **FASE 4: Layout Intelligence Engine**
> Fuente de verdad estructural para Wireframes (F5), Component Library (F6) y Landing Development (F7).

---

## 1. Estructura de la Landing (Orden Definitivo)

El orden de las secciones no es negociable. Fue determinado por el **Conversion Emotion Map** y el **Experience Journey** definidos en las Fases 2 y 3.

| # | Sección | Emoción objetivo | Prioridad | CTA |
|---|---------|-----------------|-----------|-----|
| 1 | Hero | Asombro | Critical | Reservar Agora |
| 2 | Quick Actions | Claridad | High | Falar no WhatsApp |
| 3 | Experience Highlights | Deseo | Critical | Ver Todos os Passeios |
| 4 | Services (Passeios) | Deseo + Comparación | Critical | Saber mais no WhatsApp |
| 5 | Why Choose Us | Confianza | High | — |
| 6 | Gallery | Inspiración | High | — |
| 7 | Google Reviews | Seguridad | Critical | Ver no Google |
| 8 | Reservation Process | Facilidad | High | Começar minha reserva |
| 9 | FAQ | Tranquilidad | High | Fale conosco |
| 10 | Location | Confianza | Medium | Como Chegar |
| 11 | Contact | Decisión | Critical | Reservar pelo WhatsApp |
| 12 | Footer | Profesionalismo | Medium | — |

---

## 2. La Curva de Interés (Scroll Flow)

```
100% │▓▓▓▓▓
 85% │     ▓▓▓▓
 70% │         ▓▓▓▓▓
 55% │              ▓▓▓▓
 40% │                  ▓▓
 35% │                    ▓▓▓ ← Reactivación en Contact
     └─────────────────────────▶ SCROLL
     Hero Quick Highlights Svcs Why Gal Rev Resv FAQ Loc Contact Footer
```
La atención baja naturalmente con el scroll, pero se **reactiva** en Contact gracias al CTA de alto contraste.

---

## 3. Caminos de Conversión

| Tipo de Usuario | Ruta | Punto de Conversión |
|-----------------|------|---------------------|
| **Decidido** | Hero → Quick Actions | Botón WhatsApp inmediato |
| **Curioso** | Hero → Highlights → Services → Contact | CTA al final del catálogo |
| **Desconfiado** | Hero → Reviews → FAQ → Location → Contact | CTA tras validación total |
| **Cualquier usuario** | Cualquier sección | Botón flotante de WhatsApp |

---

## 4. Navegación

- **Navbar Smart**: Sticky, se oculta al bajar, reaparece al subir. CTA "Reservar" en el extremo derecho.
- **Botón Flotante**: FAB de WhatsApp, aparece tras scrollear el 20% de la página. `z-index: 700`.
- **Smooth Scroll**: Todos los anchors navegan con transición suave.
- **Mobile Menu**: Drawer lateral (hamburger) con los mismos links + WhatsApp grande.

---

## 5. Reglas de Oro

1. Máximo **una acción principal** por viewport visible.
2. Toda sección debe responder: **"¿Aumenta el deseo o elimina una fricción?"**
3. Las **4 secciones Critical** sin datos son bloqueantes del deploy: Hero, Services, Reviews y Contact.
4. El visual **siempre precede** al texto denso.
5. Alternar fondos (claro/oscuro/imagen) para evitar fatiga visual.

---

## 6. Assets Requeridos para Desarrollo

| Asset | Sección | Especificación |
|-------|---------|----------------|
| `hero-photo.webp` | Hero | Mín. 1920×1080, <200KB |
| `highlight-[1-3].webp` | Highlights | Mín. 800×600, <100KB c/u |
| `service-[1-N].webp` | Services | Mín. 800×600, <100KB c/u |
| `gallery-[1-9].webp` | Gallery | Mín. 600×600, <80KB c/u |
| `logo.svg` | Navbar/Footer | Versión color y blanca |
| `google-maps-embed-url` | Location | URL del negocio en Maps |
| `whatsapp-deep-link` | Global | `https://wa.me/55XXXXXXXXXXX` |

---

> **Instrucción para Fases Siguientes:**
> Todo wireframe (F5) y todo componente (F6) debe poder justificarse consultando este documento.
> Si una decisión de diseño o desarrollo no está respaldada por este Blueprint, debe ser reconsiderada.
