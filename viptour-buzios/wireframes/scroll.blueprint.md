# Scroll Blueprint
# BELE — Rapid Wireframing Engine v1.0
# Mapa de scroll completo: emoción, atención y CTA por sección.

---

## Curva de Interés (Scroll completo)

```
ATENCIÓN
  100% │███ HERO
       │███ (asombro total)
   85% │    ███ QUICK ACTIONS
       │        (claridad, alta intención)
   80% │            ███ HIGHLIGHTS
       │                (deseo despertado)
   70% │                    ███ SERVICES
       │                        (evaluación)
   60% │                            ███ WHY US
       │                                (confianza racional)
   65% │                                    ███ GALLERY
       │                                        (reactivación visual)
   55% │                                            ███ REVIEWS
       │                                                (validación social)
   50% │                                                    ███ PROCESO
       │                                                        (tranquilidad)
   45% │                                                            ███ FAQ
       │                                                                (alivio final)
   40% │                                                                    ███ LOCATION
   35% │                                                                        ███ CONTACT
       │                                                                            ▲
       │                                                                 (reactivación —
       │                                                                  alta intención)
       └──────────────────────────────────────────────────────────────────────────────▶ SCROLL
```

> ⚠️ **Regla de Scroll (architecture.rules.ts #10):**
> Ninguna sección puede interrumpir la curva de narrativa ascendente de deseo → confianza → decisión.
> Gallery (posición 6) reactivará visualmente la atención que empieza a decaer en §5 (Why Us).

---

## Mapa detallado sección a sección

| # | Sección | Scroll % | Emoción | Atención | CTA activo | Botón flotante |
|---|---------|----------|---------|----------|-----------|----------------|
| 1 | Hero | 0% | Asombro | 100% | ✅ Reservar / Ver Passeios | ❌ Oculto |
| 2 | Quick Actions | ~12% | Claridad | 85% | ✅ WhatsApp | ❌ Oculto |
| — | *Trigger flotante* | **20%** | — | — | — | ✅ **APARECE** |
| 3 | Highlights | ~20% | Deseo | 80% | ✅ Ver Todos | ✅ Visible |
| 4 | Services | ~35% | Comparación | 70% | ✅ Reservar (por card) | ✅ Visible |
| 5 | Why Us | ~50% | Confianza | 60% | ❌ Sin CTA principal | ✅ Visible |
| 6 | Gallery | ~57% | Inspiración | 65% | ❌ Sin CTA | ✅ Visible |
| 7 | Reviews | ~65% | Seguridad | 55% | ✅ Ver no Google | ✅ Visible |
| 8 | Reservation | ~72% | Facilidad | 50% | ✅ Começar reserva | ✅ Visible |
| 9 | FAQ | ~80% | Tranquilidad | 45% | ✅ Fale conosco | ✅ Visible |
| 10 | Location | ~87% | Confianza | 40% | ✅ Como Chegar | ✅ Visible |
| 11 | Contact | ~93% | Decisión | 35%→HIGH | ✅ Reservar WhatsApp | ✅ Visible |
| 12 | Footer | 100% | Profesional | 30% | ❌ Links secundarios | ✅ Visible |

---

## Puntos Críticos de Conversión

```
┌─────────────────────────────────────────────────────┐
│  PUNTO DE CONVERSIÓN 1: Hero CTA (0% scroll)        │
│  → Usuario impulsivo / de alta intención previa.    │
│  → Acción: Clic en "Reservar Agora"                 │
├─────────────────────────────────────────────────────┤
│  PUNTO DE CONVERSIÓN 2: Quick Actions (12% scroll)  │
│  → Usuario que bajó del Hero pero aún está caliente.│
│  → Acción: Clic en "Falar no WhatsApp"              │
├─────────────────────────────────────────────────────┤
│  PUNTO DE CONVERSIÓN 3: Services CTAs (35% scroll)  │
│  → Usuario que evaluó opciones y eligió un passeio. │
│  → Acción: Clic en "Reservar" de la card.           │
├─────────────────────────────────────────────────────┤
│  PUNTO DE CONVERSIÓN 4: Contact Final (93% scroll)  │
│  → Usuario que recorrió todo el journey.            │
│  → Acción: Clic en "Reservar pelo WhatsApp"         │
├─────────────────────────────────────────────────────┤
│  COMODÍN: Botón Flotante (20%–100% scroll)          │
│  → Intercepta conversiones en CUALQUIER sección.   │
│  → Alta visibilidad, sin interrumpir narrativa.     │
└─────────────────────────────────────────────────────┘
```

---

## Comportamiento de Fondos (Visual Rhythm)

```
§01 Hero         → IMAGEN fullscreen (dark overlay)
§02 Quick Actions → BLANCO
§03 Highlights    → ARENA / SAND (#f3f4f6)
§04 Services      → BLANCO
§05 Why Choose Us → SAND (#f3f4f6)
§06 Gallery       → DARK NAVY (para contraste máximo de fotos)
§07 Reviews       → BLANCO
§08 Reservation   → SAND (#f3f4f6)
§09 FAQ           → BLANCO
§10 Location      → SAND (#f3f4f6)
§11 Contact       → DARK NAVY (fondo oscuro, CTA destacado)
§12 Footer        → DARK NAVY (continuación visual)
```

> **Regla:** Nunca 2 secciones blancas consecutivas (excepción: §07 Reviews y §09 FAQ separadas por §08 Reservation en SAND).
