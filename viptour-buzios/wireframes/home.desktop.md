# WIREFRAME — HOME DESKTOP (1280px / 1440px)
# BELE — Rapid Wireframing Engine v1.0
# Desktop Adaptation | Sin colores | Sin imágenes | Solo estructura

---

## NAVBAR (1280px — Sticky Smart)
```
┌─────────────────────────────────────────────────────────────────────────────┐  h: 72px
│  [LOGO]        Passeios    Avaliações    FAQ    Contato      [Reservar ▶]   │
└─────────────────────────────────────────────────────────────────────────────┘
         ↑ logo left          ↑ nav links centered                ↑ CTA right
```
**Behavior:** Oculto al bajar, visible al subir. Fondo: blanco translúcido con blur (glassmorphism leve).

---

## 01 — HERO (1280px)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │  h: 100vh
│                  [ IMAGEN PLACEHOLDER FULLSCREEN ]                         │
│                  (buggy + personas + Búzios backdrop)                      │
│                                                                             │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │    │  gradient overlay
│  │                                                                    │    │  bottom 50%
│  │  [H1] Titular Principal — máx. 6 palabras               40% left  │    │  ExtraBold ~64px
│  │  [p]  Subtítulo en una línea                                       │    │  Regular ~20px
│  │                                                                    │    │
│  │  [BTN PRIMARY — Reservar Agora ▶]   [BTN SECONDARY — Ver Passeios]│    │  inline / row
│  │                                                                    │    │
│  │  ★★★★★  4.9 · +200 avaliações no Google                          │    │  social proof badge
│  └────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│                           [↓ scroll]                                        │  centered, animated
└─────────────────────────────────────────────────────────────────────────────┘
```
**Diferencia vs Mobile:** Texto posicionado en el tercio izquierdo. Dos CTAs en la misma fila. Social proof badge inline.

---

## 02 — QUICK ACTIONS BAR (1280px)
```
┌─────────────────────────────────────────────────────────────────────────────┐  h: 72px
│                                                                             │
│       [🟢 Falar no WhatsApp]    [🗺 Ver Passeios]    [📍 Nossa Localização] │  centrados
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```
**Diferencia vs Mobile:** En una sola fila horizontal. No se apila.

---

## 03 — EXPERIENCE HIGHLIGHTS (1280px)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    [H2] As melhores experiências em Búzios                  │  centered
│                         [p] Escolha a sua aventura                         │
│                                                                             │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐         │
│  │ [ IMG Placeholder│  │ [ IMG Placeholder │  │ [ IMG Placeholder│         │  3 col grid
│  │        ]         │  │        ]          │  │        ]         │         │  h: 280px
│  │  [⭐ POPULAR]    │  │                   │  │                  │         │  badge top-right
│  │──────────────────│  │───────────────────│  │──────────────────│         │
│  │ [H3] Passeio Comp│  │ [H3] Pás. Praias  │  │ [H3] Pôr do Sol │         │
│  │ [🕐] 4–5 horas   │  │ [🕐] 2–3 horas   │  │ [🕐] 2 horas    │         │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘         │
│                                                                             │
│                    [BTN — Ver Todos os Passeios]                            │  centered
└─────────────────────────────────────────────────────────────────────────────┘
```
**Diferencia vs Mobile:** 3 columnas simultáneas en lugar de 1.

---

## 04 — SERVICES / PASSEIOS (1280px)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  [H2] Nossos Passeios                                                       │
│  [p] Cada experiência, uma aventura única                                   │
│                                                                             │
│  ┌────────────────────────────┐  ┌────────────────────────────┐            │
│  │ [ IMG — 100% w ]           │  │ [ IMG — 100% w ]           │            │  2 col layout
│  │ [H3] Passeio Completo      │  │ [H3] Passeio das Praias    │            │
│  │ [p] Descubra as melhores…  │  │ [p] As praias mais lindas… │            │
│  │ [🕐] 4–5h  [📍] 12 praias │  │ [🕐] 2–3h  [📍] 8 praias  │            │
│  │ [💰] Desde R$ XXX          │  │ [💰] Desde R$ XXX          │            │
│  │ [BTN] Reservar no WhatsApp │  │ [BTN] Reservar no WhatsApp │            │
│  └────────────────────────────┘  └────────────────────────────┘            │
│                                                                             │
│  ┌────────────────────────────┐  ┌────────────────────────────┐            │
│  │ [ IMG ]                    │  │ [ IMG ]                    │            │
│  │ ...                        │  │ ...                        │            │
│  └────────────────────────────┘  └────────────────────────────┘            │
└─────────────────────────────────────────────────────────────────────────────┘
```
**Diferencia vs Mobile:** Grid 2 columnas. Cada card tiene imagen completa en la parte superior.

---

## 05 — WHY CHOOSE US (1280px)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│              [H2] Por que a VIPTOUR?                                        │  centered
│              [p] Mais do que um passeio, uma experiência completa           │
│                                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │  [ICON lg]  │  │  [ICON lg]  │  │  [ICON lg]  │  │  [ICON lg]  │       │  4 col grid
│  │ [H4] Flotil │  │ [H4] Guías  │  │ [H4] Bilin. │  │ [H4] Segur. │       │
│  │ [p] desc    │  │ [p] desc    │  │ [p] desc    │  │ [p] desc    │       │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘       │
└─────────────────────────────────────────────────────────────────────────────┘
```
**Diferencia vs Mobile:** 4 columnas en 1 fila.

---

## 06 — GALLERY (1280px)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  [H2] Momentos reais, experiências inesquecíveis                            │
│                                                                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────────────────┐  │
│  │             │ │             │ │                                     │  │
│  │  [ IMG 1 ]  │ │  [ IMG 2 ]  │ │          [ IMG 3 — wide ]          │  │  masonry row 1
│  │   h: 280px  │ │   h: 280px  │ │              h: 280px               │  │
│  └─────────────┘ └─────────────┘ └─────────────────────────────────────┘  │
│                                                                             │
│  ┌─────────────────────────────────────────┐ ┌─────────────┐ ┌──────────┐ │
│  │          [ IMG 4 — wide ]               │ │  [ IMG 5 ]  │ │ [ IMG 6] │ │  masonry row 2
│  │              h: 280px                   │ │   h: 280px  │ │ h: 280px │ │
│  └─────────────────────────────────────────┘ └─────────────┘ └──────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```
**Diferencia vs Mobile:** Masonry asimétrico de 3 columnas con variedad de tamaños.

---

## 07 — GOOGLE REVIEWS (1280px)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│           [Google Logo]  ★★★★★ 4.9 · +200 avaliações                       │  centered badge
│                [H2] O que dizem nossos clientes                             │
│                                                                             │
│  ┌───────────────────────┐ ┌───────────────────────┐ ┌──────────────────┐  │
│  │ [Avatar] [Nome] [★5]  │ │ [Avatar] [Nome] [★5]  │ │ [Avatar] [Nome]  │  │  3 cards visibles
│  │ "Texto do depoimento  │ │ "Melhor passeio de…"  │ │ "Guia super     │  │  en simultáneo
│  │  incrível…"           │ │                        │ │  atencioso"     │  │
│  └───────────────────────┘ └───────────────────────┘ └──────────────────┘  │
│                                                                             │
│                  [← PREV]    ● ● ○ ○ ○    [NEXT →]                         │  nav del slider
│                                                                             │
│                    [BTN — Ver todas as avaliações]                          │
└─────────────────────────────────────────────────────────────────────────────┘
```
**Diferencia vs Mobile:** 3 testimonios visibles a la vez en el slider.

---

## 08 — RESERVATION PROCESS (1280px)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│            [H2] Como reservar em 3 passos                                   │
│            [p] Simples, rápido e sem complicações                           │
│                                                                             │
│  ┌─────────────────┐    ────────    ┌─────────────────┐    ────────    ┌───────────────────┐
│  │   [ICON ①]      │      →         │   [ICON ②]      │      →         │   [ICON ③]        │
│  │  [H3] Escolha   │               │  [H3] Fale      │               │  [H3] Aproveite!  │
│  │  [p] Veja nossos│               │  Conosco        │               │  [p] Nós cuidamos  │
│  │      passeios   │               │  [p] WhatsApp   │               │      do resto      │
│  └─────────────────┘               └─────────────────┘               └───────────────────┘
│                                                                             │
│                          [BTN — Começar minha reserva]                      │  centered
└─────────────────────────────────────────────────────────────────────────────┘
```
**Diferencia vs Mobile:** Timeline horizontal con flechas/conectores entre pasos.

---

## 09 — FAQ (1280px)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  [H2] Perguntas frequentes         [p] Ainda tem dúvidas? [BTN Fale]       │  h2 + CTA en misma fila
│                                                                             │
│  ┌──────────────────────────────────────┐  ┌─────────────────────────────┐  │
│  │ [Q] É seguro para crianças?       [+]│  │ [Q] Vocês falam español? [+]│  │  2 columnas
│  │ [Q] Quais formas de pagamento?    [+]│  │ [Q] Onde nos encontramos? [+]│  │  de accordion
│  │ [Q] Como cancelar?                [+]│  │ [Q] O buggy é coberto?    [+]│  │
│  └──────────────────────────────────────┘  └─────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```
**Diferencia vs Mobile:** 2 columnas de acordeón lado a lado.

---

## 10 — LOCATION (1280px)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  ┌────────────────────────────────────────┐  ┌────────────────────────────┐│
│  │                                        │  │  [H2] Onde estamos         ││
│  │        [ GOOGLE MAPS EMBED ]           │  │                            ││
│  │              h: 400px                  │  │  [📍] Armação dos Búzios   ││
│  │                                        │  │  [🕐] 8h às 20h           ││
│  │                                        │  │  [🏠] Buscamos em sua      ││
│  │                                        │  │       pousada              ││
│  │                                        │  │                            ││
│  │                                        │  │  [BTN] Como Chegar         ││
│  └────────────────────────────────────────┘  └────────────────────────────┘│
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```
**Diferencia vs Mobile:** Mapa a la izquierda (60%), info a la derecha (40%) en split layout.

---

## 11 — CONTACT / CTA FINAL (1280px)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │  fondo oscuro
│                  [H2] Pronto para viver a experiência?                     │  centered, white
│                  [p] Fale com a gente agora — respondemos em minutos       │
│                                                                             │
│                   ┌──────────────────────────────────────┐                 │
│                   │  🟢  Reservar pelo WhatsApp           │                 │  max-w: 480px
│                   └──────────────────────────────────────┘                 │  h: 64px
│                                                                             │
│                   [p] Seg–Dom  |  8h às 20h                                │  centered, small
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 12 — FOOTER (1280px)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  [LOGO]          Passeios                  [IG icon]  [WA icon]            │
│  [p] Slogan      Avaliações                                                 │
│                  FAQ                                                        │
│                  Contato                                                    │
│                                                                             │
│  ─────────────────────────────────────────────────────────────────────     │
│                                                                             │
│  © 2025 VIPTOUR BÚZIOS · Todos os direitos reservados                      │
└─────────────────────────────────────────────────────────────────────────────┘
```
**Diferencia vs Mobile:** Layout multi-columna (Logo + Slogan / Links / Socials).

---

## FLOATING WHATSAPP (Desktop)
```
                              ┌───────────────────────────────┐
                              │  🟢  Falar no WhatsApp         │  ← tooltip visible en hover
                              └───────────────────────────────┘
                                            │
                                      ┌─────────┐
                                      │  [🟢 WA]│  fixed bottom-right (24px, 24px)
                                      └─────────┘  64×64px
```
