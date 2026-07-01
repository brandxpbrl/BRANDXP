# WIREFRAME — HOME MOBILE (375px)
# BELE — Rapid Wireframing Engine v1.0
# Mobile First | Sin colores | Sin imágenes | Solo estructura

---

## NAVBAR (Fixed Top)
```
┌─────────────────────────────────────┐  h: 56px
│  [LOGO]                    [☰ MENU] │  sticky / smart hide
└─────────────────────────────────────┘
```
**Objetivo:** Orientación + acceso al menú móvil  
**CTA:** Hamburger → Drawer  
**Behavior:** Se oculta al bajar, reaparece al subir

---

## 01 — HERO
```
┌─────────────────────────────────────┐
│                                     │  h: 100vh
│         [ IMAGEN PLACEHOLDER ]      │  fullscreen
│         (experiencia en buggy)      │
│                                     │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │  ← gradient overlay
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │    (bottom 40%)
│                                     │
│  ┌───────────────────────────────┐  │
│  │ [H1] Titular principal        │  │  ExtraBold, ~36px
│  │      (máx. 6 palabras)        │  │  color: white
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │ [p] Subtítulo / slogan        │  │  Regular, ~16px
│  │     (1 línea)                 │  │  color: white/80
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │  [BTN PRIMARY]  Reservar ▶    │  │  h: 52px, full-width
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │  [BTN SECONDARY] Ver Passeios │  │  h: 44px, full-width
│  └───────────────────────────────┘  │
│                                     │
│              [↓ scroll]             │  animado
└─────────────────────────────────────┘
```
**Objetivo:** Retención en <3s. Asombro inmediato.  
**Emoción:** Asombro  
**CTA Primary:** "Reservar Agora" → WhatsApp deep link  
**CTA Secondary:** "Ver Passeios" → scroll anchor #passeios  
**Assets:** hero-photo.webp (1920×1080)  
**Prioridad:** Critical

---

## 02 — QUICK ACTIONS BAR
```
┌─────────────────────────────────────┐
│                                     │  h: 80px
│  [🟢 WhatsApp]  [🗺 Passeios]  [📍] │  3 iconos centrados
│   Falar agora    Ver passeios  Mapa  │  texto debajo, ~11px
│                                     │
└─────────────────────────────────────┘
```
**Objetivo:** Captura de usuarios de alta intención  
**Emoción:** Claridad  
**Behavior:** Sticky opcional — aparece justo bajo el Hero  
**Assets:** iconos SVG (WhatsApp, tours, location)

---

## 03 — EXPERIENCE HIGHLIGHTS
```
┌─────────────────────────────────────┐
│  [Section Label / Badge]            │  ~12px, caps
│  [H2] As melhores experiências      │  Bold, ~28px
│       em Búzios                     │
│  [p] Escolha a sua aventura         │  Regular, ~15px
│                                     │
│  ┌───────────────────────────────┐  │
│  │ [ IMG PLACEHOLDER ]           │  │  h: 200px
│  │                [⭐ POPULAR]   │  │  badge top-right
│  │───────────────────────────────│  │
│  │ [H3] Passeio Completo         │  │  SemiBold
│  │ [🕐 4–5 horas]               │  │  icon + texto
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │  card 2
│  │ [ IMG PLACEHOLDER ]           │  │
│  │───────────────────────────────│  │
│  │ [H3] Passeio das Praias       │  │
│  │ [🕐 2–3 horas]               │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │  card 3
│  │ [ IMG PLACEHOLDER ]           │  │
│  │───────────────────────────────│  │
│  │ [H3] Passeio Pôr do Sol       │  │
│  │ [🕐 2 horas]                  │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │  [BTN]  Ver Todos os Passeios │  │  full-width
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```
**Objetivo:** Despertar deseo con las 3 experiencias más atractivas  
**Emoción:** Deseo / Aventura  
**Layout Mobile:** 1 columna, cards apiladas  
**Assets:** highlight-1/2/3.webp

---

## 04 — SERVICES (PASSEIOS)
```
┌─────────────────────────────────────┐
│  [H2] Nossos Passeios               │  Bold, ~26px
│  [p] Cada experiência, uma          │  Regular, ~15px
│       aventura única                │
│                                     │
│  ╔═══════════════════════════════╗  │
│  ║ [ IMG ]   [H3] Passeio 1      ║  │  img: 120×90 left
│  ║           [p] Descrição curta ║  │  texto derecha
│  ║           [🕐] 4–5h           ║  │
│  ║           [💰] Desde R$ XXX   ║  │
│  ║  [BTN] Reservar via WhatsApp  ║  │  full-width bottom
│  ╚═══════════════════════════════╝  │
│                                     │
│  ╔═══════════════════════════════╗  │  card 2
│  ║ [ IMG ]   [H3] Passeio 2      ║  │
│  ║           [p] Descrição curta ║  │
│  ║           [🕐] 2–3h           ║  │
│  ║           [💰] Desde R$ XXX   ║  │
│  ║  [BTN] Reservar via WhatsApp  ║  │
│  ╚═══════════════════════════════╝  │
│                                     │
│  ╔═══════════════════════════════╗  │  card N
│  ║ ...                           ║  │
│  ╚═══════════════════════════════╝  │
└─────────────────────────────────────┘
```
**Objetivo:** Catálogo de decisión  
**Emoción:** Deseo + Comparación  
**CTA por card:** WhatsApp con mensaje prellenado ("Olá, tenho interesse no [Passeio X]")  
**Assets:** service-1..N.webp  
**Prioridad:** Critical

---

## 05 — WHY CHOOSE US
```
┌─────────────────────────────────────┐
│  [H2] Por que a VIPTOUR?            │  Bold
│  [p] Mais do que um passeio,        │  Regular
│       uma experiência completa      │
│                                     │
│  ┌──────────┐  ┌──────────────────┐ │
│  │  [ICON]  │  │ [H4] Flotilla    │ │  grid 2 col
│  │          │  │ Premium          │ │
│  │          │  │ [p] desc corta   │ │
│  └──────────┘  └──────────────────┘ │
│                                     │
│  ┌──────────┐  ┌──────────────────┐ │
│  │  [ICON]  │  │ [H4] Guías       │ │
│  │          │  │ Locales          │ │
│  │          │  │ [p] desc corta   │ │
│  └──────────┘  └──────────────────┘ │
│                                     │
│  ┌──────────┐  ┌──────────────────┐ │
│  │  [ICON]  │  │ [H4] Bilingüe   │ │
│  │          │  │ PT/ES            │ │
│  │          │  │ [p] desc corta   │ │
│  └──────────┘  └──────────────────┘ │
│                                     │
│  ┌──────────┐  ┌──────────────────┐ │
│  │  [ICON]  │  │ [H4] Segurança   │ │
│  │          │  │ Total            │ │
│  │          │  │ [p] desc corta   │ │
│  └──────────┘  └──────────────────┘ │
└─────────────────────────────────────┘
```
**Objetivo:** Diferenciación racional + emocional  
**Emoción:** Confianza / Exclusividad  
**Layout Mobile:** 2 col (icono + texto por feature)

---

## 06 — GALLERY
```
┌─────────────────────────────────────┐
│  [H2] Momentos reais,               │  Bold
│       experiências inesquecíveis    │
│                                     │
│  ┌───────────────────────────────┐  │
│  │       [ IMG  1 ]              │  │  h: 220px, full-w
│  └───────────────────────────────┘  │
│  ┌──────────────┐ ┌───────────────┐ │
│  │  [ IMG 2 ]   │ │   [ IMG 3 ]  │ │  2 col, h: 160px
│  └──────────────┘ └───────────────┘ │
│  ┌───────────────────────────────┐  │
│  │       [ IMG  4 ]              │  │  h: 220px, full-w
│  └───────────────────────────────┘  │
│  ┌──────────────┐ ┌───────────────┐ │
│  │  [ IMG 5 ]   │ │   [ IMG 6 ]  │ │  2 col
│  └──────────────┘ └───────────────┘ │
└─────────────────────────────────────┘
```
**Objetivo:** Prueba visual de calidad  
**Emoción:** Inspiración  
**Behavior:** Toque en imagen → lightbox fullscreen  
**Assets:** gallery-1..9.webp

---

## 07 — GOOGLE REVIEWS
```
┌─────────────────────────────────────┐
│  [Google Logo] ★★★★★ 4.9           │  badge top
│  [H2] O que dizem nossos clientes   │  Bold
│  [p] +200 avaliações no Google      │  Regular
│                                     │
│  ┌───────────────────────────────┐  │
│  │  [Avatar] [Nome] [★★★★★]      │  │  card 1
│  │  "Texto do depoimento real... │  │
│  │   experiência incrível!"      │  │
│  └───────────────────────────────┘  │
│                                     │  ← slider (swipe)
│  ┌───────────────────────────────┐  │
│  │  [Avatar] [Nome] [★★★★★]      │  │  card 2
│  │  "Melhor passeio de Búzios..." │  │
│  └───────────────────────────────┘  │
│                                     │
│       ● ○ ○ ○                       │  dots indicator
│                                     │
│  ┌───────────────────────────────┐  │
│  │ [BTN] Ver todas as avaliações │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```
**Objetivo:** Validación social de terceros  
**Emoción:** Seguridad  
**Behavior:** Swipe horizontal en mobile  
**Prioridad:** Critical

---

## 08 — RESERVATION PROCESS
```
┌─────────────────────────────────────┐
│  [H2] Como reservar em 3 passos     │  Bold
│  [p] Simples, rápido e sem          │  Regular
│       complicações                  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │  [①]  [ICON grande]           │  │  step 1
│  │        [H3] Escolha           │  │
│  │        [p] Veja nossos        │  │
│  │             passeios          │  │
│  └───────────────────────────────┘  │
│               │                     │  conector vertical
│               ▼                     │
│  ┌───────────────────────────────┐  │
│  │  [②]  [ICON grande]           │  │  step 2
│  │        [H3] Fale Conosco      │  │
│  │        [p] Via WhatsApp,      │  │
│  │             em segundos       │  │
│  └───────────────────────────────┘  │
│               │                     │
│               ▼                     │
│  ┌───────────────────────────────┐  │
│  │  [③]  [ICON grande]           │  │  step 3
│  │        [H3] Aproveite!        │  │
│  │        [p] Nós cuidamos       │  │
│  │             do resto          │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │  [BTN] Começar minha reserva  │  │  full-width
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```
**Objetivo:** Eliminar fricción de "¿cómo reservo?"  
**Emoción:** Tranquilidad / Facilidad  
**Layout Mobile:** Timeline vertical con conectores

---

## 09 — FAQ
```
┌─────────────────────────────────────┐
│  [H2] Perguntas frequentes          │  Bold
│  [p] Temos as respostas             │  Regular
│                                     │
│  ┌───────────────────────────────┐  │
│  │ [Q] É seguro para crianças? [+]│  │  accordion
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │ [Q] Vocês falam español?   [+]│  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │ [Q] Quais formas de pagamento?[+]│  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │ [Q] Onde nos encontramos?  [+]│  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │ [Q] Como cancelar?         [+]│  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │ [Q] O buggy é coberto?      [+]│  │
│  └───────────────────────────────┘  │
│                                     │
│  [p] Ainda tem dúvidas?             │
│  ┌───────────────────────────────┐  │
│  │  [BTN] Fale conosco           │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```
**Objetivo:** Eliminar las últimas objeciones  
**Emoción:** Tranquilidad / Alivio  
**Behavior:** Accordion (expandir/colapsar con animación)

---

## 10 — LOCATION
```
┌─────────────────────────────────────┐
│  [H2] Onde estamos                  │  Bold
│  [p] Saímos do coração de Búzios    │  Regular
│                                     │
│  ┌───────────────────────────────┐  │
│  │                               │  │  h: 280px
│  │    [ GOOGLE MAPS EMBED ]      │  │  iframe responsive
│  │                               │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │  card sobre el mapa
│  │  [📍] Armação dos Búzios, RJ  │  │
│  │  [🕐] Atendimento: 8h–20h    │  │
│  │  [🏠] Buscamos em sua pousada │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │  [BTN] Como Chegar            │  │  → Google Maps ruta
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```
**Objetivo:** Validar existencia física del negocio  
**Emoción:** Confianza  
**Assets:** Google Maps embed URL

---

## 11 — CONTACT (CTA Final)
```
┌─────────────────────────────────────┐
│                                     │  fondo oscuro (dark navy
│                                     │  o foto con overlay)
│  ┌───────────────────────────────┐  │
│  │ [H2] Pronto para viver        │  │  ExtraBold, white
│  │       a experiência?          │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │ [p] Fale com a gente agora —  │  │  white/70
│  │     respondemos em minutos    │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │  🟢  [BTN GRANDE] Reservar   │  │  h: 64px, accent color
│  │      pelo WhatsApp            │  │  full-width
│  └───────────────────────────────┘  │
│                                     │
│  [p] Seg–Dom  |  8h às 20h          │  small, white/50
│                                     │
└─────────────────────────────────────┘
```
**Objetivo:** Conversión final de alta intención  
**Emoción:** Decisión  
**Prioridad:** Critical  
**CTA:** WhatsApp deep link (único en esta sección)

---

## 12 — FOOTER
```
┌─────────────────────────────────────┐
│  [LOGO blanco]                      │  fondo dark
│                                     │
│  [p] O melhor jeito de conhecer     │
│       Búzios                        │
│                                     │
│  ─────────────────────────────────  │  divider
│                                     │
│  Passeios   Avaliações   FAQ        │  links centrados
│  Contato    Instagram    WhatsApp   │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  © 2025 VIPTOUR BÚZIOS              │  caption, centered
│  Todos os direitos reservados       │
└─────────────────────────────────────┘
```
**Objetivo:** Cierre profesional  
**Emoción:** Profesionalismo

---

## FLOATING WHATSAPP BUTTON
```
                       ┌─────────┐
                       │  🟢 WA  │  ← fixed bottom-right
                       │  [puls] │     56×56px
                       └─────────┘     z-index: 700
```
**Trigger:** Aparece al 20% del scroll  
**Animación:** Pulse ring verde sutil (3s loop)  
**CTA:** "Falar no WhatsApp" (tooltip en hover / desktop)

---

## MOBILE DRAWER MENU
```
┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐  overlay oscuro
│ ┌───────────────────────────────┐  │
│ │  [LOGO]               [✕]    │  │  header drawer
│ │───────────────────────────────│  │
│ │                               │  │
│ │  Passeios                     │  │  link
│ │  Avaliações                   │  │  link
│ │  FAQ                          │  │  link
│ │  Contato                      │  │  link
│ │                               │  │
│ │  ─────────────────────────── │  │
│ │                               │  │
│ │  [BTN] Falar no WhatsApp 🟢  │  │  CTA full-width
│ └───────────────────────────────┘  │
 ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
```
**Behavior:** Slide desde la derecha. Overlay izquierdo clickeable cierra el drawer.
