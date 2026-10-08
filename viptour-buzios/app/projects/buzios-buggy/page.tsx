import type { Metadata } from "next";
import "./buzios-buggy.css";

export const metadata: Metadata = {
  title: "Búzios Buggy | Passeio de Buggy Privativo em Búzios",
  description: "Passeio de buggy privativo em Búzios: 8 praias e 3 mirantes em cerca de 1h30. Consulte disponibilidade e reserve pelo WhatsApp.",
  alternates: { canonical: "/projects/buzios-buggy" },
  openGraph: { title: "Búzios Buggy", description: "Conheça 8 praias e 3 mirantes em um passeio privativo por Búzios.", url: "https://www.riovibestransfer.com/projects/buzios-buggy" },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Passeio de Buggy Privativo em Búzios",
  description: "Passeio de buggy privativo pela península de Armação dos Búzios, passando por oito praias e três mirantes, com duração aproximada de 1h30.",
  serviceType: "Passeio turístico privativo de buggy",
  provider: {
    "@type": "Organization",
    name: "Búzios Buggy",
    url: "https://www.riovibestransfer.com/projects/buzios-buggy",
    telephone: "+5545999686381",
  },
  areaServed: { "@type": "Place", name: "Armação dos Búzios, Rio de Janeiro, Brasil" },
  offers: {
    "@type": "Offer",
    price: "100",
    priceCurrency: "BRL",
    priceValidUntil: "2026-10-31",
    url: "https://www.riovibestransfer.com/projects/buzios-buggy",
    description: "Tarifa promocional por pessoa sujeita à disponibilidade e condições publicadas.",
  },
};

const translations = {
  "br": {
    "heroKicker": "EXPERIÊNCIAS EM BÚZIOS",
    "heroTitle": "Passeio de Buggy Privativo em Búzios – 8 Praias e 3 Mirantes",
    "risk": "RESERVA",
    "noRisk": "SEM RISCO",
    "noDeposit": "SEM PAGAMENTO ANTECIPADO",
    "noSignal": "SEM SINAL PARA RESERVAR",
    "freeCancel": "ALTERE OU CANCELE GRÁTIS*",
    "lead": "Descubra 8 praias e 3 mirantes em apenas 1h30 com uma experiência exclusiva, pensada para quem valoriza conforto, privacidade e atenção aos detalhes. Paradas estratégicas para fotos e banho nos cenários mais deslumbrantes da região.",
    "promo": "PROMOÇÃO ESPECIAL 2026",
    "popular": "Mais reservado",
    "person": "/pessoa",
    "kids": "Crianças: 0–5 anos grátis · 6–10 anos meia · 11+ inteira",
    "terms": "Promoção válida para reservas até 31/10/2026 · Pagamento no dia",
    "reserve": "Reservar pelo WhatsApp",
    "benefits": [
      "Duração média: 1h30",
      "Tour 100% privativo",
      "Busca na hospedagem",
      "Saídas das 08h às 16h30"
    ],
    "infoTitle": "Reserva Segura e Sem Compromisso",
    "info": [
      "Zero pagamento antecipado: reserve sem sinal e pague no dia ao guia.",
      "Busca inclusa: buscamos você no hotel, pousada ou Airbnb.",
      "Segurança e atendimento com confirmação pelo WhatsApp."
    ],
    "galleryTitle": "Galeria do Passeio de Buggy em Búzios",
    "gallerySub": "Uma prévia da experiência que espera por você.",
    "routeTitle": "Roteiro Tradicional de Buggy em Búzios",
    "routeFeatures": [
      "8 praias & 3 mirantes",
      "Paradas flexíveis para fotos e banho"
    ],
    "mapIntro": "Roteiro pela península de Armação dos Búzios",
    "mapPending": "Mapa ilustrativo detalhado: aguardando o arquivo original autorizado para publicação.",
    "beaches": "8 Praias",
    "viewpoints": "3 Mirantes",
    "history": "Pontos Históricos no Caminho",
    "extraTitle": "Quer Descobrir Ainda Mais de Búzios?",
    "extraDesc": "Além do passeio tradicional, também oferecemos uma experiência estendida com mais tempo e roteiro personalizado.",
    "extraBoxTitle": "Uma Experiência 100% Personalizada",
    "extraBoxDesc": "Converse com a gente para adaptar o percurso ao seu ritmo e aos pontos que deseja conhecer.",
    "quote": "Solicitar orçamento no WhatsApp",
    "other": "Outras Experiências",
    "consult": "Consultar disponibilidade →",
    "faq": "Perguntas Frequentes",
    "location": "Onde Atuamos em Búzios",
    "blog": "Guia de Viagem",
    "blogDesc": "Explore praias, passeios e experiências inesquecíveis em Búzios.",
    "footer": "Reservas e informações pelo WhatsApp",
    "faqItems": [
      [
        "Quantas pessoas cabem em cada buggy?",
        "Até quatro passageiros, além do motorista. Para grupos maiores, consulte mais de um buggy."
      ],
      [
        "Preciso pagar antecipado?",
        "Não. A reserva é consultada pelo WhatsApp e o pagamento é feito no dia, conforme confirmação."
      ],
      [
        "O buggy busca no meu local?",
        "A busca em hotel, pousada ou Airbnb de Búzios está incluída nas regiões atendidas."
      ],
      [
        "Quanto tempo dura o passeio?",
        "Aproximadamente 1h30, incluindo paradas para fotos e banho."
      ],
      [
        "Qual o horário das saídas?",
        "Entre 8h e 16h30, conforme disponibilidade."
      ],
      [
        "Qual a diferença entre o passeio tradicional e o estendido?",
        "O estendido permite mais tempo e personalização do roteiro. Consulte condições e preço."
      ]
    ],
    "nav": [
      "Passeio Buggy",
      "Combo Búzios",
      "Passeio de Barco",
      "Arubinha",
      "Arraial do Cabo",
      "Transfer Privado"
    ],
    "navSub": [
      "1h30m • Búzios",
      "Terra/Mar",
      "3h • Búzios",
      "Saindo de Búzios",
      "Saindo de Búzios",
      "Búzios ⇄ Rio (GIG)"
    ]
  },
  "us": {
    "heroKicker": "EXPERIENCES IN BÚZIOS",
    "heroTitle": "Private Buggy Tour in Búzios – 8 Beaches and 3 Viewpoints",
    "risk": "BOOK WITH",
    "noRisk": "NO RISK",
    "noDeposit": "NO ADVANCE PAYMENT",
    "noSignal": "NO DEPOSIT TO BOOK",
    "freeCancel": "CHANGE OR CANCEL FREE*",
    "lead": "Discover 8 beaches and 3 viewpoints in about 90 minutes on a private experience designed for travelers who value comfort, privacy and thoughtful service. Enjoy scenic stops for photos and swimming along Búzios's spectacular coastline.",
    "promo": "SPECIAL OFFER 2026",
    "popular": "Most booked",
    "person": "/person",
    "kids": "Children: ages 0–5 free · 6–10 half price · 11+ full price",
    "terms": "Offer valid for bookings through Oct 31, 2026 · Pay on the day",
    "reserve": "Book via WhatsApp",
    "benefits": [
      "Approx. duration: 90 min",
      "100% private tour",
      "Hotel pickup included",
      "Departures 8:00–16:30"
    ],
    "infoTitle": "Secure Booking, No Commitment",
    "info": [
      "No advance payment: reserve without a deposit and pay the guide on the day.",
      "Pickup included: we collect you from your hotel, guesthouse or Airbnb.",
      "Availability and service details confirmed by WhatsApp."
    ],
    "galleryTitle": "Búzios Buggy Tour Photo Gallery",
    "gallerySub": "A preview of the experience awaiting you.",
    "routeTitle": "Traditional Buggy Tour Route in Búzios",
    "routeFeatures": [
      "8 beaches & 3 viewpoints",
      "Flexible stops for photos and swimming"
    ],
    "mapIntro": "Tour route around the Búzios peninsula",
    "mapPending": "Detailed illustrated route map: original asset pending transfer.",
    "beaches": "8 Beaches",
    "viewpoints": "3 Viewpoints",
    "history": "Historic Sights Along the Way",
    "extraTitle": "Want to Discover Even More of Búzios?",
    "extraDesc": "Alongside the traditional tour, we offer an extended private experience with more time and a flexible itinerary.",
    "extraBoxTitle": "A Fully Personalized Experience",
    "extraBoxDesc": "Talk to us about adapting the route to your preferred pace and places.",
    "quote": "Request a quote on WhatsApp",
    "other": "More Experiences",
    "consult": "Check availability →",
    "faq": "Frequently Asked Questions",
    "location": "Where We Operate in Búzios",
    "blog": "Travel Guide",
    "blogDesc": "Discover beaches, tours and unforgettable experiences in Búzios.",
    "footer": "Reservations and information on WhatsApp",
    "faqItems": [
      [
        "How many guests fit in each buggy?",
        "Up to four passengers plus the driver. Larger groups can request additional buggies."
      ],
      [
        "Do I need to pay in advance?",
        "No. Book by WhatsApp and pay on the day, as confirmed with the provider."
      ],
      [
        "Will the buggy pick me up?",
        "Pickup at hotels, guesthouses and Airbnbs in serviced areas of Búzios is included."
      ],
      [
        "How long does the tour take?",
        "About 90 minutes, including photo and swimming stops."
      ],
      [
        "When do tours depart?",
        "Between 8:00 and 16:30, subject to availability."
      ],
      [
        "What is the difference between the regular and extended tours?",
        "The extended tour offers more time and itinerary flexibility. Please ask for pricing and conditions."
      ]
    ],
    "nav": [
      "Buggy Tour",
      "Búzios Combo",
      "Boat Tour",
      "Arubinha",
      "Arraial do Cabo",
      "Private Transfer"
    ],
    "navSub": [
      "90 min • Búzios",
      "Land/Sea",
      "3h • Búzios",
      "From Búzios",
      "From Búzios",
      "Búzios ⇄ Rio (GIG)"
    ]
  },
  "es": {
    "heroKicker": "EXPERIENCIAS EN BÚZIOS",
    "heroTitle": "Paseo Privado en Buggy por Búzios – 8 Playas y 3 Miradores",
    "risk": "RESERVA",
    "noRisk": "SIN RIESGO",
    "noDeposit": "SIN PAGO ANTICIPADO",
    "noSignal": "SIN SEÑA PARA RESERVAR",
    "freeCancel": "MODIFICA O CANCELA GRATIS*",
    "lead": "Descubrí 8 playas y 3 miradores en aproximadamente 1 hora y media con una experiencia privada, pensada para quienes valoran la comodidad, la privacidad y la atención personalizada. Paradas especiales para fotos y baño en los paisajes más increíbles de Búzios.",
    "promo": "PROMOCIÓN ESPECIAL 2026",
    "popular": "Más reservado",
    "person": "/persona",
    "kids": "Niños: 0–5 años gratis · 6–10 mitad de precio · 11+ tarifa completa",
    "terms": "Promoción válida para reservas hasta el 31/10/2026 · Pagás el día del paseo",
    "reserve": "Reservar por WhatsApp",
    "benefits": [
      "Duración aproximada: 1h30",
      "Paseo 100% privado",
      "Traslado desde alojamiento",
      "Salidas de 08:00 a 16:30"
    ],
    "infoTitle": "Reserva Segura y Sin Compromiso",
    "info": [
      "Sin pago anticipado: reservá sin seña y pagá al guía el día del paseo.",
      "Búsqueda incluida: te pasamos a buscar por tu hotel, posada o Airbnb.",
      "Disponibilidad y detalles confirmados por WhatsApp."
    ],
    "galleryTitle": "Galería del Paseo en Buggy por Búzios",
    "gallerySub": "Un adelanto de la experiencia que te espera.",
    "routeTitle": "Recorrido Tradicional en Buggy por Búzios",
    "routeFeatures": [
      "8 playas y 3 miradores",
      "Paradas flexibles para fotos y baño"
    ],
    "mapIntro": "Recorrido por la península de Armação dos Búzios",
    "mapPending": "Mapa ilustrativo detallado: pendiente de incorporar el original.",
    "beaches": "8 Playas",
    "viewpoints": "3 Miradores",
    "history": "Lugares Históricos en el Camino",
    "extraTitle": "¿Querés Descubrir Todavía Más de Búzios?",
    "extraDesc": "Además del paseo tradicional, ofrecemos una experiencia privada extendida con más tiempo y un recorrido personalizado.",
    "extraBoxTitle": "Una Experiencia 100% Personalizada",
    "extraBoxDesc": "Hablemos para adaptar el recorrido a tu ritmo y los lugares que más te interesan.",
    "quote": "Pedir presupuesto por WhatsApp",
    "other": "Otras Experiencias",
    "consult": "Consultar disponibilidad →",
    "faq": "Preguntas Frecuentes",
    "location": "Dónde Trabajamos en Búzios",
    "blog": "Guía de Viaje",
    "blogDesc": "Descubrí playas, paseos y experiencias inolvidables en Búzios.",
    "footer": "Reservas e información por WhatsApp",
    "faqItems": [
      [
        "¿Cuántas personas entran en cada buggy?",
        "Hasta cuatro pasajeros, además del conductor. Para grupos más grandes, consultanos por varios buggies."
      ],
      [
        "¿Tengo que pagar por adelantado?",
        "No. Reservás por WhatsApp y pagás el día del paseo, según las condiciones confirmadas."
      ],
      [
        "¿El buggy me busca en el alojamiento?",
        "Incluimos la búsqueda en hoteles, posadas y Airbnbs de las zonas atendidas en Búzios."
      ],
      [
        "¿Cuánto dura el paseo?",
        "Aproximadamente 1 hora y media, incluyendo paradas para fotos y baño."
      ],
      [
        "¿Cuáles son los horarios de salida?",
        "Entre las 08:00 y las 16:30, según disponibilidad."
      ],
      [
        "¿Qué diferencia hay entre el paseo tradicional y el extendido?",
        "El extendido permite disfrutar más tiempo y personalizar el recorrido. Consultá precio y condiciones."
      ]
    ],
    "nav": [
      "Paseo en Buggy",
      "Combo Búzios",
      "Paseo en Barco",
      "Arubinha",
      "Arraial do Cabo",
      "Transfer Privado"
    ],
    "navSub": [
      "1h30 • Búzios",
      "Tierra/Mar",
      "3h • Búzios",
      "Desde Búzios",
      "Desde Búzios",
      "Búzios ⇄ Río (GIG)"
    ]
  }
} as const;
type Language = keyof typeof translations;

const whatsapp = "5545999686381";
const book = (service = "Passeio de Buggy Privativo") =>
  `https://wa.me/${whatsapp}?text=${encodeURIComponent(`Olá! Gostaria de consultar disponibilidade para ${service} com a Búzios Buggy.`)}`;

const services = [
  ["🚙", "Passeio Buggy", "1h30m • Búzios", "buggy"],
  ["⛴", "Combo Búzios", "Terra/Mar", "combo"],
  ["⛵", "Passeio de Barco", "3h • Búzios", "barco"],
  ["🌴", "Arubinha", "Saindo de Búzios", "arubinha"],
  ["🐠", "Arraial do Cabo", "Saindo de Búzios", "arraial"],
  ["✈", "Transfer Privado", "Búzios ⇄ Rio (GIG)", "transfer"],
] as const;

// Fotografias da galeria original do cliente; migrar para assets locais antes do lançamento.\nconst gallery = [\n  ["Mirante de João Fernandes em Búzios", "https://buggybuzios.com/__l5e/assets-v1/fd52298f-b9b1-4835-95b5-03745cedcf9d/gallery-mirante-joao-fernandes-buzios.jpg"],
  ["Praia de areia rosada em Búzios", "https://buggybuzios.com/__l5e/assets-v1/28b522b7-f456-4386-8b20-5082d72c45bb/gallery-praia-areia-rosa-buzios.jpg"],
  ["Mirante da Praia do Forno", "https://buggybuzios.com/__l5e/assets-v1/afdb1be5-a7d6-413b-a032-e3201d742517/gallery-mirante-praia-forno-buzios.jpg"],
  ["Casal em buggy amarelo com vista para Búzios", "https://buggybuzios.com/__l5e/assets-v1/895573eb-db66-40d5-83c5-1b92ab52e766/gallery-buggy-amarelo-casal-buzios.jpg"],
  ["Passeio romântico em buggy amarelo", "https://buggybuzios.com/__l5e/assets-v1/2abba5c4-84e7-4c9e-9fbe-8c10efb17ae2/gallery-casal-buggy-amarelo-mirante-buzios.jpg"],
  ["Casal em passeio de buggy rosa", "https://buggybuzios.com/__l5e/assets-v1/691e737e-a0fa-452a-b96d-7d17f705a26c/gallery-casal-buggy-rosa-mar-buzios.jpg"],
  ["Mergulho e natureza em Búzios", "https://buggybuzios.com/__l5e/assets-v1/44107ff9-3c96-48c4-b08a-9ce9d781163a/gallery-mergulho-snorkel-buzios.jpg"],
  ["Buggy vermelho em mirante de Búzios", "https://buggybuzios.com/__l5e/assets-v1/b1fee9ce-4bf6-4c34-ba56-207c1e0559b8/gallery-buggy-vermelho-mirante-buzios.jpg"],
  ["Buggy rosa em Búzios", "https://buggybuzios.com/__l5e/assets-v1/7dec06cb-fc14-4e62-a0d1-f28a62fe1a45/gallery-buggy-rosa-buzios.jpg"],
  ["Vista aérea da Praia da Ferradura", "https://buggybuzios.com/__l5e/assets-v1/f38111f3-8bf8-4729-93ce-0414798561df/gallery-praia-ferradura-aerea-buzios.jpg"],
];
const beaches = [
  ["Praia da Armação", "Orla histórica com barcos, esculturas e o charme da cidade."],
  ["Praia dos Ossos", "Pequena praia tradicional perto do centro histórico."],
  ["Praia Brava", "Natureza exuberante e uma das paisagens mais bonitas da península."],
  ["Praia do Olho de Boi", "Enseada escondida e vista panorâmica no roteiro."],
  ["Praia do Forno", "Conhecida pela areia rosada e águas transparentes."],
  ["Praia de João Fernandes", "Mar azul e pontos especiais para fotografar."],
  ["Praia de João Fernandinho", "Enseada tranquila e natureza preservada."],
  ["Praia da Ferradura", "Águas calmas e uma das praias favoritas das famílias."],
];
const viewpoints = ["Mirante de João Fernandes", "Mirante do Forno", "Ponta da Lagoinha"];
const faq = [
  ["Quantas pessoas cabem em cada buggy?", "Até quatro passageiros, além do motorista. Para grupos maiores, consulte mais de um buggy."],
  ["Preciso pagar antecipado?", "Não. A reserva é consultada pelo WhatsApp e o pagamento é feito no dia, conforme confirmação."],
  ["O buggy busca no meu local?", "A busca em hotel, pousada ou Airbnb de Búzios está incluída nas regiões atendidas."],
  ["Quanto tempo dura o passeio?", "Aproximadamente 1h30, incluindo paradas para fotos e banho."],
  ["Qual o horário das saídas?", "Entre 8h e 16h30, conforme disponibilidade."],
  ["Qual a diferença entre o passeio tradicional e o estendido?", "O estendido permite mais tempo e personalização do roteiro. Consulte condições e preço."],
];
export default async function BuziosBuggyPage({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const query = await searchParams;
  const lang: Language = query.lang === "us" || query.lang === "es" ? query.lang : "br";
  const t = translations[lang];
  return <main className="bb">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    <header className="bb-header">
      <div className="bb-top"><a className="bb-logo" href="#inicio"><span>Búzios</span> Buggy</a><div className="bb-toplinks"><a href="#blog">Blog</a>{(["br","us","es"] as const).map(code => <a key={code} href={`/projects/buzios-buggy?lang=${code}#inicio`} lang={code === "br" ? "pt-BR" : code === "us" ? "en" : "es"} aria-current={lang === code ? "page" : undefined} className={`bb-lang ${lang === code ? "bb-selected" : ""}`}>{code.toUpperCase()}</a>)}</div></div>
      <nav className="bb-services" aria-label="Passeios e serviços">{services.map(([icon, title, sub, id], i)=><a key={id} className={i===0?"bb-service active":"bb-service"} href={i===0?"#inicio":`#${id}`}><span className="bb-icon">{icon}</span><span><strong>{t.nav[i]}</strong><small>{t.navSub[i]}</small></span></a>)}</nav>
    </header>
    <section id="inicio" className="bb-hero"><div className="bb-heroshade"/><div className="bb-hero-inner"><p>{t.heroKicker}</p><h1>{t.heroTitle}</h1></div></section>
    <section className="bb-intro bb-wrap"><div className="bb-risk"><strong>✓</strong><h3>{t.risk}<br/><em>{t.noRisk}</em></h3><p>{t.noDeposit}</p><p>{t.noSignal}</p><p>{t.freeCancel}</p></div><p className="bb-lead">{t.lead}</p>
      <div className="bb-price"><div className="bb-pill">{t.promo}</div><p>{t.popular}</p><div className="bb-price-line"><del>R$ 130</del><strong>R$ 100</strong><span>{t.person}</span></div><hr/><p>{t.kids}</p><p>{t.terms}</p></div>
      <a className="bb-button" href={book()} target="_blank" rel="noopener noreferrer">☏ {t.reserve}</a>
      <div className="bb-benefits">{t.benefits.map((item,i)=><div key={item}>{["◷","♙","⌖","▣"][i]} {item}</div>)}</div>
      <div className="bb-info"><h3>♧ {t.infoTitle}</h3>{t.info.map(line=><p key={line}>✓ {line}</p>)}</div>
    </section>
    <section id="galeria" className="bb-section bb-wrap"><h2>{t.galleryTitle}</h2><p className="bb-subtitle">{t.gallerySub}</p><div className="bb-gallery">{gallery.map(([name,img],i)=><div key={i} className={i===0?"bb-gallery-tall":""}><img src={img} alt={name} loading="lazy"/></div>)}</div></section>
    <section id="roteiro" className="bb-section bb-wrap"><h2>{t.routeTitle}</h2><div className="bb-route"><p>✓ {t.routeFeatures[0]}</p><p>✓ {t.routeFeatures[1]}</p><p>⌖ Orla Bardot → Armação → Ossos → Brava → Forno → João Fernandes → Ferradura</p></div><div className="bb-mapnote"><strong>{t.mapIntro}</strong><p>{t.mapPending}</p></div><h3>{t.beaches}</h3><div className="bb-placegrid">{beaches.map(([name,desc],i)=><article key={name}><img src="/images/hero-buggy.png" alt={name} loading="lazy"/><div><strong>{i+1}. {name}</strong><p>{desc}</p></div></article>)}</div><h3>{t.viewpoints}</h3><div className="bb-placegrid">{viewpoints.map((name,i)=><article key={name}><img src="/images/hero-buggy.png" alt={name} loading="lazy"/><div><strong>{i+1}. {name}</strong><p>Parada especial para contemplar e fotografar a paisagem.</p></div></article>)}</div><h3>{t.history}</h3><div className="bb-placegrid">{["Orla Bardot & Estátua de Brigitte Bardot","Monumento dos Três Pescadores","Igreja de Sant’Anna (1740)"].map(name=><article key={name}><div><strong>{name}</strong><p>Um encontro com a história e a cultura de Búzios.</p></div></article>)}</div></section>
    <section id="combo" className="bb-extended"><div className="bb-wrap"><h2>{t.extraTitle}</h2><img src="/images/hero-buggy.png" alt="Paisagens de Búzios" loading="lazy"/><p>{t.extraDesc}</p><div className="bb-info"><h3>{t.extraBoxTitle}</h3><p>{t.extraBoxDesc}</p></div><a className="bb-button" href={book("Passeio Estendido de Buggy")} target="_blank" rel="noopener noreferrer">{t.quote}</a></div></section>
    <section id="barco" className="bb-extra bb-wrap"><h2>{t.other}</h2><div className="bb-other">{services.slice(2).map(([,name,desc,id])=><article id={id} key={id}><strong>{t.nav[services.findIndex(service => service[3] === id)]}</strong><p>{t.navSub[services.findIndex(service => service[3] === id)]}</p><a href={book(name)} target="_blank" rel="noopener noreferrer">{t.consult}</a></article>)}</div></section>
    <section className="bb-section bb-wrap"><h2>{t.faq}</h2><div className="bb-faq">{t.faqItems.map(([q,a])=><details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div></section>
    <section className="bb-section bb-wrap"><h2>{t.location}</h2><iframe title="Mapa de Búzios" src="https://www.google.com/maps?q=Arma%C3%A7%C3%A3o%20dos%20B%C3%BAzios%2C%20RJ&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade"/></section>
    <section id="blog" className="bb-section bb-wrap"><h2>{t.blog}</h2><p className="bb-subtitle">{t.blogDesc}</p></section>
    <footer className="bb-footer"><div className="bb-wrap"><strong><span>Búzios</span> Buggy</strong><p>Armação dos Búzios · Rio de Janeiro · Brasil</p><p>{t.footer}: +55 45 99968-6381</p><small>© {new Date().getFullYear()} Búzios Buggy</small></div></footer>
    <a className="bb-floating" aria-label="Reservar por WhatsApp" href={book()} target="_blank" rel="noopener noreferrer">☏</a>
  </main>;
}
