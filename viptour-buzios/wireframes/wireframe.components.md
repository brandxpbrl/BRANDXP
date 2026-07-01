# Wireframe Components Registry
# BELE — Rapid Wireframing Engine v1.0
# Lista de todos los componentes React identificados en los wireframes.

---

Cada componente identificado es independiente, documentado y reutilizable.
Esta lista alimenta directamente la FASE 6 — VISUAL EXPERIENCE SYSTEM.

---

## COMPONENTES GLOBALES

| Componente | Tipo | Wireframe | Fase 6 |
|---|---|---|---|
| `Navbar` | Layout | home.mobile + desktop | ✅ Requerido |
| `MobileDrawer` | Overlay | home.mobile | ✅ Requerido |
| `FloatingWhatsApp` | FAB | Global | ✅ Requerido |
| `Footer` | Layout | home.mobile + desktop | ✅ Requerido |

## COMPONENTES DE SECCIÓN

| Componente | Tipo | Wireframe | Prioridad |
|---|---|---|---|
| `HeroSection` | Section | §01 | Critical |
| `QuickActionsBar` | Section | §02 | High |
| `ExperienceHighlights` | Section | §03 | Critical |
| `ServicesSection` | Section | §04 | Critical |
| `WhyChooseUs` | Section | §05 | High |
| `GallerySection` | Section | §06 | High |
| `ReviewsSection` | Section | §07 | Critical |
| `ReservationProcess` | Section | §08 | High |
| `FAQSection` | Section | §09 | High |
| `LocationSection` | Section | §10 | Medium |
| `ContactSection` | Section | §11 | Critical |

## COMPONENTES ATÓMICOS (UI Atoms)

| Componente | Uso | Reutilizable |
|---|---|---|
| `Button` | CTAs, Drawer, Quick Actions | ✅ |
| `SectionTitle` | Título + subtítulo de cada sección | ✅ |
| `ServiceCard` | Cards de passeios (§04) | ✅ |
| `HighlightCard` | Cards pequeñas (§03) | ✅ |
| `ReviewCard` | Testimonios (§07) | ✅ |
| `FAQItem` | Acordeón individual (§09) | ✅ |
| `FeatureItem` | Icon + Título + Desc (§05) | ✅ |
| `StepItem` | Paso de proceso (§08) | ✅ |
| `Badge` | Etiquetas "Popular", duración, precio | ✅ |
| `GoogleMapEmbed` | Iframe wrapper de Maps (§10) | ✅ |
| `Lightbox` | Overlay de galería (§06) | ✅ |
| `SliderNav` | Prev / Next + Dots (§07) | ✅ |
| `ScrollIndicator` | Flecha animada del Hero (§01) | ✅ |

---

## NOTAS DE IMPLEMENTACIÓN

- Todos los componentes deben ser **Server Components** por defecto (Next.js 15).
- Solo marcar como `'use client'` cuando requieren interactividad (Drawer, Lightbox, Slider, FloatingButton).
- Cada componente consumirá tokens de `/design-system` y reglas de `/brand`.
- Las props de cada componente serán tipadas con interfaces exportadas desde `/types`.
