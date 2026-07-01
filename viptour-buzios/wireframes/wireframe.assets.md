# Wireframe Assets Registry
# BELE — Rapid Wireframing Engine v1.0
# Inventario completo de assets requeridos para el desarrollo de la Landing.

---

## FOTOGRAFÍAS (WebP, optimizadas)

| Asset | Sección | Dimensiones mín. | Peso máx. | Descripción |
|---|---|---|---|---|
| `hero-photo.webp` | Hero | 1920×1080 | 200 KB | Buggy con turistas + paisaje de Búzios. Luz dorada (golden hour). |
| `highlight-1.webp` | Highlights | 800×600 | 100 KB | Foto principal del Passeio Completo. |
| `highlight-2.webp` | Highlights | 800×600 | 100 KB | Foto del Passeio das Praias. |
| `highlight-3.webp` | Highlights | 800×600 | 100 KB | Foto del Passeio Pôr do Sol. |
| `service-1.webp` | Services | 800×600 | 100 KB | Foto representativa Passeio 1. |
| `service-2.webp` | Services | 800×600 | 100 KB | Foto representativa Passeio 2. |
| `service-N.webp` | Services | 800×600 | 100 KB | (Repetir por cada passeio adicional) |
| `gallery-1.webp` | Gallery | 800×800 | 80 KB | Foto real de clientes 1. |
| `gallery-2.webp` | Gallery | 800×800 | 80 KB | Foto real de clientes 2. |
| `gallery-3.webp` | Gallery | 1200×800 | 80 KB | Foto panorámica (card wide). |
| `gallery-4.webp` | Gallery | 1200×800 | 80 KB | Foto panorámica (card wide). |
| `gallery-5.webp` | Gallery | 800×800 | 80 KB | Foto real de clientes 5. |
| `gallery-6.webp` | Gallery | 800×800 | 80 KB | Foto real de clientes 6. |
| `og-image.jpg` | SEO / Social | 1200×630 | 150 KB | Imagen Open Graph para compartir en redes. |

> ⚠️ **Regla de Fotografía (brand.photography.ts):**
> NUNCA usar fotos de bancos de imágenes. Siempre personas reales, luz natural, emociones auténticas.

---

## ASSETS DE MARCA (SVG / PNG)

| Asset | Uso | Versiones |
|---|---|---|
| `logo.svg` | Navbar (tema claro) | Color original |
| `logo-white.svg` | Footer / Contact (fondo oscuro) | Blanco |
| `favicon.ico` | Browser tab | 32×32 |
| `apple-touch-icon.png` | iOS | 180×180 |
| `og-logo.png` | Open Graph | 200×200 |

---

## DATOS DE INTEGRACIÓN

| Variable | Uso | Valor |
|---|---|---|
| `WHATSAPP_NUMBER` | Botón flotante, CTAs | `+55 22 XXXXX-XXXX` |
| `WHATSAPP_DEFAULT_MSG` | Deep link genérico | `"Olá! Gostaria de saber mais sobre os passeios"` |
| `GOOGLE_MAPS_EMBED_URL` | LocationSection | URL del iframe |
| `GOOGLE_BUSINESS_URL` | Reviews → "Ver no Google" | URL del perfil |
| `INSTAGRAM_URL` | Footer | URL del perfil |
| `GA_MEASUREMENT_ID` | Google Analytics | `G-XXXXXXXXXX` |
| `GSC_VERIFICATION_TOKEN` | Search Console | (meta tag) |

> 📋 Todos los valores de integración deben guardarse en `.env.local` y no hardcodearse en el código.

---

## ICONOGRAFÍA (Lucide React)

Los siguientes iconos han sido identificados en los wireframes:

| Icono Lucide | Uso | Sección |
|---|---|---|
| `MessageCircle` / `PhoneCall` | WhatsApp CTA | Global |
| `MapPin` | Localización | Quick Actions, Location |
| `Clock` | Duración passeio | Services, Highlights |
| `DollarSign` | Precio | Services |
| `Star` | Rating | Reviews, Hero badge |
| `ChevronDown` | Scroll indicator | Hero |
| `ChevronLeft/Right` | Slider nav | Reviews |
| `Plus` / `X` | Accordion | FAQ |
| `Menu` | Hamburger | Navbar mobile |
| `Shield` | Seguridad | Why Choose Us |
| `Users` | Guías | Why Choose Us |
| `Car` / `Truck` | Flota | Why Choose Us |
| `Globe` | Bilingüe | Why Choose Us |
| `CheckCircle` | Steps proceso | Reservation |
