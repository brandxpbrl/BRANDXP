/**
 * Section Content Map
 * Wireframe lógico de cada sección: qué texto, imágenes, componentes
 * e interacciones necesita cada bloque. Sin copias finales.
 */
import type { SectionId } from './landing.structure';

export interface SectionContent {
  id: SectionId;
  heading: string;       // Placeholder del titular
  subheading: string;    // Placeholder del subtitular
  body: string;          // Descripción del tipo de contenido
  visualElements: string[];
  interactiveElements: string[];
  cta: string | null;
  requiredAssets: string[];
}

export const sectionContent: SectionContent[] = [
  {
    id: 'hero',
    heading: '[Slogan / Titular de impacto — máx. 6 palabras]',
    subheading: '[Promesa de valor en 1 línea]',
    body: 'Sin párrafos. Solo la promesa y los CTAs.',
    visualElements: ['Foto hero fullscreen (experiencia en buggy, paisaje)', 'Overlay de gradiente oscuro en la parte inferior'],
    interactiveElements: ['Botón CTA Principal', 'Botón CTA Secundario', 'Scroll indicator animado'],
    cta: 'Reservar Agora',
    requiredAssets: ['hero-photo.webp (mínimo 1920×1080)', 'logo-white.svg'],
  },
  {
    id: 'quick-actions',
    heading: '',
    subheading: '',
    body: 'Barra horizontal de íconos + texto. Sin titular.',
    visualElements: ['3 iconos de acción (WhatsApp, Passeios, Mapa)'],
    interactiveElements: ['Link WhatsApp', 'Scroll anchor a #passeios', 'Scroll anchor a #localizacao'],
    cta: null,
    requiredAssets: ['icon-whatsapp.svg', 'icon-tours.svg', 'icon-map.svg'],
  },
  {
    id: 'experience-highlights',
    heading: 'As melhores experiências em Búzios',
    subheading: 'Escolha a sua aventura',
    body: '3–4 cards en grid. Cada card: foto, nombre del paseo, duración.',
    visualElements: ['Grid 3 o 4 columnas (mobile: 1 columna, tablet: 2)', 'Badge "Mais Popular" en la destacada'],
    interactiveElements: ['Cards con hover effect', 'Botón "Ver Todos"'],
    cta: 'Ver Todos os Passeios',
    requiredAssets: ['highlight-1.webp', 'highlight-2.webp', 'highlight-3.webp'],
  },
  {
    id: 'services',
    heading: 'Nossos Passeios',
    subheading: 'Cada experiência, uma aventura única',
    body: 'Lista vertical o grid de cards detalladas. Cada card: foto, título, descripción corta, duración, precio base, puntos de visita.',
    visualElements: ['Cards individuales por paseo', 'Ícono de reloj para duración', 'Badge de precio'],
    interactiveElements: ['Botón "Reservar" en cada card → WhatsApp con mensaje prellenado'],
    cta: 'Saber mais no WhatsApp',
    requiredAssets: ['service-1.webp', 'service-2.webp', 'service-3.webp'],
  },
  {
    id: 'why-choose-us',
    heading: 'Por que a VIPTOUR?',
    subheading: 'Mais do que um passeio, uma experiência completa',
    body: 'Grid de 4–6 features con ícono, título y descripción corta.',
    visualElements: ['Íconos Lucide (1.5px stroke)', 'Foto lateral del equipo o del buggy (opcional)'],
    interactiveElements: [],
    cta: null,
    requiredAssets: ['team-photo.webp (opcional)'],
  },
  {
    id: 'gallery',
    heading: 'Momentos reais, experiências inesquecíveis',
    subheading: '',
    body: 'Masonry grid o slider de fotos de clientes. Sin pies de foto largos.',
    visualElements: ['Grid asimétrico de imágenes', 'Hover para ver en grande (lightbox)'],
    interactiveElements: ['Lightbox modal', 'Navegación por flechas'],
    cta: null,
    requiredAssets: ['gallery-1.webp a gallery-9.webp mínimo'],
  },
  {
    id: 'google-reviews',
    heading: 'O que dizem nossos clientes',
    subheading: '★★★★★ — Mais de [X] avaliações no Google',
    body: 'Slider de tarjetas de testimonios con avatar, nombre, puntuación y texto.',
    visualElements: ['Estrellas de rating (★)', 'Avatar circular (placeholder si no hay foto)', 'Badge de Google'],
    interactiveElements: ['Slider / carousel de testimonios', 'Botón "Ver no Google" → abre perfil'],
    cta: 'Ver todas as avaliações',
    requiredAssets: ['google-logo.svg', 'avatars opcionales'],
  },
  {
    id: 'reservation-process',
    heading: 'Como reservar em 3 passos',
    subheading: 'Simples, rápido e sem complicações',
    body: 'Timeline horizontal (desktop) o vertical (mobile) de 3 pasos numerados.',
    visualElements: ['3 íconos grandes (1. Mano eligiendo, 2. WhatsApp, 3. Buggy)', 'Conector visual entre pasos'],
    interactiveElements: ['CTA al final'],
    cta: 'Começar minha reserva',
    requiredAssets: [],
  },
  {
    id: 'faq',
    heading: 'Perguntas frequentes',
    subheading: 'Temos as respostas',
    body: 'Acordeón (accordion) expandible. 6–10 preguntas máximo.',
    visualElements: ['Íconos + / × para expandir'],
    interactiveElements: ['Accordion animado'],
    cta: 'Ainda tem dúvidas? Fale conosco',
    requiredAssets: [],
  },
  {
    id: 'location',
    heading: 'Onde estamos',
    subheading: 'Saímos do coração de Búzios',
    body: 'Google Maps embed (iframe) + dirección + indicación de pickup en pousada.',
    visualElements: ['Mapa embed responsive', 'Card de dirección sobrepuesto'],
    interactiveElements: ['Botón "Como Chegar" → Google Maps con ruta'],
    cta: 'Como Chegar',
    requiredAssets: ['google-maps-embed-url'],
  },
  {
    id: 'contact',
    heading: 'Pronto para viver a experiência?',
    subheading: 'Fale com a gente agora — respondemos em minutos',
    body: 'CTA final centrado con CTA único y horario de atención.',
    visualElements: ['Fondo oscuro (Dark Navy o foto con overlay)', 'Icono de WhatsApp grande'],
    interactiveElements: ['Botón principal de WhatsApp'],
    cta: 'Reservar pelo WhatsApp',
    requiredAssets: ['whatsapp-icon-white.svg'],
  },
  {
    id: 'footer',
    heading: '',
    subheading: '',
    body: 'Barra inferior con logo, links secundarios, redes sociales, copyright.',
    visualElements: ['Logo footer (claro sobre fondo oscuro)', 'Íconos redes sociales'],
    interactiveElements: ['Links a Instagram', 'Link WhatsApp', 'Link Google'],
    cta: null,
    requiredAssets: ['logo-white.svg'],
  },
];
