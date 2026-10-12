export type TourId = "buggy" | "combo" | "barco" | "arubinha" | "arraial" | "transfer";
type DetailId = Exclude<TourId, "buggy">;
type Language = "br" | "us" | "es";
type TourCopy = { title: string; subtitle: string; intro: string; highlights: string[]; callout: string; imageAlt: string };
type LocalCopy = Record<Language, TourCopy>;

const tours: Record<DetailId, { icon: string; image: string; imagePosition?: string; copy: LocalCopy }> = {
  combo: {
    icon: "⛴",
    // Imagem da parte marítima do combo. Fotos dos buggies reais serão adicionadas pelo cliente.
    image: "https://buggybuzios.com/__l5e/assets-v1/f248ff38-06a7-4305-a8b6-598fff085d3f/boat-g1-praia-azeda-aerea.jpg",
    copy: {
      br: { title: "Combo Búzios — Buggy + Barco", subtitle: "Búzios por terra e por mar", intro: "Uma experiência que combina o passeio de buggy pelos mirantes e praias de Búzios com um passeio de barco pelas paisagens do litoral. Consulte a programação para aproveitar as duas experiências no mesmo dia.", highlights: ["Passeio guiado de buggy de aproximadamente 1h30", "Passeio de barco com paradas de banho, conforme as condições do mar", "Experiências de terra e mar no mesmo dia"], callout: "Consulte valores, horários e disponibilidade pelo WhatsApp.", imageAlt: "Vista aérea da Praia Azeda, Búzios, com barcos no mar" },
      us: { title: "Búzios Combo — Buggy + Boat", subtitle: "Discover Búzios by land and sea", intro: "Combine a guided buggy experience around the scenic viewpoints and beaches of Búzios with a boat trip along the coast. Ask about scheduling both experiences on the same day.", highlights: ["Guided buggy tour lasting approximately 90 minutes", "Boat trip with swimming stops, subject to sea conditions", "Land and sea experiences on the same day"], callout: "Ask for pricing, departure details and availability on WhatsApp.", imageAlt: "Aerial view of Praia Azeda, Búzios, with boats" },
      es: { title: "Combo Búzios — Buggy + Barco", subtitle: "Descubrí Búzios por tierra y mar", intro: "Combiná un paseo guiado en buggy por las playas y los miradores de Búzios con un paseo en barco por la costa. Consultá cómo disfrutar de ambas experiencias el mismo día.", highlights: ["Paseo guiado en buggy de aproximadamente 1h30", "Paseo en barco con paradas para bañarse, según el estado del mar", "Experiencias por tierra y mar el mismo día"], callout: "Consultá precios, horarios y disponibilidad por WhatsApp.", imageAlt: "Vista aérea de Praia Azeda, Búzios, con barcos" },
    },
  },
  barco: {
    icon: "⛵",
    image: "https://buggybuzios.com/__l5e/assets-v1/f248ff38-06a7-4305-a8b6-598fff085d3f/boat-g1-praia-azeda-aerea.jpg",
    copy: {
      br: { title: "Passeio de Barco em Búzios", subtitle: "3 horas pelas praias e ilhas", intro: "Conheça a península de Búzios pelo mar. O roteiro tradicional passa por praias e ilhas com paisagens de águas claras e paradas para banho, conforme as condições de navegação.", highlights: ["Duração aproximada de 3 horas", "Paisagens de praias e ilhas de Búzios", "Paradas para banho e snorkel, conforme as condições do mar"], callout: "Consulte embarque, valores e disponibilidade antes de reservar.", imageAlt: "Passeio de barco em Búzios: vista aérea de Praia Azeda" },
      us: { title: "Boat Tour in Búzios", subtitle: "3 hours of beaches and islands", intro: "Explore the Búzios peninsula from the sea. The traditional route passes coastal beaches and islands with clear water and swimming stops when sea conditions allow.", highlights: ["Approximately 3 hours", "Views of beaches and islands around Búzios", "Swimming and snorkelling stops, subject to sea conditions"], callout: "Confirm departure details, pricing and availability before booking.", imageAlt: "Aerial view of Praia Azeda on the Búzios boat tour" },
      es: { title: "Paseo en Barco por Búzios", subtitle: "3 horas entre playas e islas", intro: "Conocé la península de Búzios desde el mar. El paseo tradicional recorre playas e islas, con paisajes de aguas claras y paradas para bañarse cuando el clima lo permite.", highlights: ["Duración aproximada de 3 horas", "Vistas de las playas e islas de Búzios", "Paradas para baño y snorkel, según las condiciones del mar"], callout: "Confirmá embarque, precios y disponibilidad antes de reservar.", imageAlt: "Vista aérea de Praia Azeda durante el paseo en barco" },
    },
  },
  arubinha: {
    icon: "🌴",
    image: "https://buggybuzios.com/__l5e/assets-v1/b5bdaabf-609d-424a-bcce-c03ffe921825/arubinha-aerial-path.jpg",
    copy: {
      br: { title: "Arubinha — Caminho de Moisés", subtitle: "Excursão saindo de Búzios", intro: "Visite a paisagem singular de Ponta da Alcaíra, também conhecida como Arubinha ou Caminho de Moisés. Uma experiência para conhecer o banco de areia e as águas da região.", highlights: ["Excursão saindo de Búzios", "Visita ao Caminho de Moisés, na região de Arubinha", "A aparência do banco de areia depende da maré"], callout: "Consulte as condições da maré, o transporte e a programação pelo WhatsApp.", imageAlt: "Vista aérea do banco de areia do Caminho de Moisés em Arubinha" },
      us: { title: "Arubinha — Path of Moses", subtitle: "Day trip from Búzios", intro: "Visit the distinctive landscape of Ponta da Alcaíra, also known as Arubinha or the Path of Moses, and enjoy the coastal sandbank and surrounding waters.", highlights: ["Excursion departing from Búzios", "Visit to the Path of Moses sandbank in Arubinha", "The sandbank's appearance depends on the tide"], callout: "Confirm tide conditions, transfers and the daily itinerary on WhatsApp.", imageAlt: "Aerial view of the Path of Moses sandbank in Arubinha" },
      es: { title: "Arubinha — Camino de Moisés", subtitle: "Excursión desde Búzios", intro: "Visitá el paisaje de Ponta da Alcaíra, conocido como Arubinha o Camino de Moisés, y disfrutá del banco de arena y las aguas de la región.", highlights: ["Excursión saliendo desde Búzios", "Visita al banco de arena del Camino de Moisés", "La apariencia del banco de arena depende de la marea"], callout: "Consultá las mareas, el traslado y el recorrido por WhatsApp.", imageAlt: "Vista aérea del banco de arena del Camino de Moisés en Arubinha" },
    },
  },
  arraial: {
    icon: "🐠",
    image: "https://buggybuzios.com/__l5e/assets-v1/3ce1ccfc-ba37-467e-b887-072419918330/arraial-boat-aerial-turquoise.jpg",
    copy: {
      br: { title: "Arraial do Cabo saindo de Búzios", subtitle: "Mar turquesa e paisagens inesquecíveis", intro: "Conheça Arraial do Cabo em uma excursão de dia inteiro, com paisagens de praias, embarcações e águas transparentes. Confirme o transporte, o roteiro do barco e o almoço no momento da reserva.", highlights: ["Excursão saindo de Búzios", "Paisagens costeiras e passeio de barco, conforme a programação", "Atividades e horários sujeitos ao clima e às condições do mar"], callout: "Peça o roteiro atualizado, valores e disponibilidade pelo WhatsApp.", imageAlt: "Passeio de barco nas águas turquesa de Arraial do Cabo" },
      us: { title: "Arraial do Cabo from Búzios", subtitle: "Turquoise water and stunning coastlines", intro: "Discover Arraial do Cabo on a full-day excursion with beautiful beaches, boats and crystal-clear water. Confirm transfer arrangements, boat itinerary and lunch when booking.", highlights: ["Day trip departing from Búzios", "Coastal scenery and boat touring subject to the programme", "Activities and times depend on weather and sea conditions"], callout: "Ask for the latest itinerary, pricing and availability on WhatsApp.", imageAlt: "Tour boat in the turquoise water of Arraial do Cabo" },
      es: { title: "Arraial do Cabo desde Búzios", subtitle: "Mar turquesa y paisajes increíbles", intro: "Descubrí Arraial do Cabo en una excursión de día completo entre playas y aguas transparentes. Confirmá el traslado, el recorrido en barco y el almuerzo antes de reservar.", highlights: ["Excursión desde Búzios", "Paisajes costeros y paseo en barco según el programa", "Actividades y horarios sujetos al clima y al estado del mar"], callout: "Pedí el recorrido actualizado, precios y disponibilidad por WhatsApp.", imageAlt: "Paseo en barco sobre aguas turquesas de Arraial do Cabo" },
    },
  },
  transfer: {
    icon: "✈",
    image: "/fela/transfers/private-premium.webp",
    imagePosition: "center center",
    copy: {
      br: { title: "Transfer Privado Búzios ⇄ Rio", subtitle: "Traslado particular com conforto", intro: "Organize seu traslado entre Búzios e o Rio de Janeiro, incluindo o Aeroporto Internacional do Galeão (GIG). Fale conosco para confirmar trajeto, tipo de veículo e disponibilidade.", highlights: ["Transfer privado sob consulta", "Opções para Búzios e Rio de Janeiro (GIG)", "Horários e valores confirmados antes da viagem"], callout: "Envie a data, o número de passageiros e os endereços pelo WhatsApp.", imageAlt: "Veículo ilustrativo de serviço de transfer privado" },
      us: { title: "Private Transfer Búzios ⇄ Rio", subtitle: "Comfortable private transportation", intro: "Arrange a private transfer between Búzios and Rio de Janeiro, including Galeão International Airport (GIG). Contact us to confirm route, vehicle and availability.", highlights: ["Private transfers by request", "Routes between Búzios and Rio de Janeiro (GIG)", "Departure details and pricing confirmed before travel"], callout: "Send your date, passenger count and pickup/drop-off addresses on WhatsApp.", imageAlt: "Illustrative vehicle for a private transfer service" },
      es: { title: "Transfer Privado Búzios ⇄ Río", subtitle: "Traslado privado con comodidad", intro: "Organizá tu traslado entre Búzios y Río de Janeiro, incluido el Aeropuerto Internacional Galeão (GIG). Consultanos por el recorrido, el vehículo y la disponibilidad.", highlights: ["Traslado privado bajo consulta", "Rutas entre Búzios y Río de Janeiro (GIG)", "Horarios y precios confirmados antes del viaje"], callout: "Enviá fecha, número de pasajeros y direcciones por WhatsApp.", imageAlt: "Vehículo ilustrativo de servicio de transfer privado" },
    },
  },
};

const labels = {
  br: { service: "EXPERIÊNCIA", highlights: "Destaques do passeio", schedule: "Planeje seu passeio", cta: "Consultar disponibilidade pelo WhatsApp", back: "Voltar ao passeio de buggy", note: "Fotos ilustrativas do destino. Veículos do cliente serão mostrados somente com imagens originais." },
  us: { service: "EXPERIENCE", highlights: "Experience highlights", schedule: "Plan your tour", cta: "Check availability on WhatsApp", back: "Back to the buggy tour", note: "Destination photos are illustrative. The client's vehicles will be shown only using original photographs." },
  es: { service: "EXPERIENCIA", highlights: "Destacados del paseo", schedule: "Planificá tu paseo", cta: "Consultar disponibilidad por WhatsApp", back: "Volver al paseo de buggy", note: "Las fotos de los destinos son ilustrativas. Los vehículos del cliente se mostrarán únicamente con fotografías originales." },
} as const;

export default function TourDetail({ tour, lang, bookingUrl }: { tour: DetailId; lang: Language; bookingUrl: string }) {
  const data = tours[tour];
  const copy = data.copy[lang];
  const l = labels[lang];

  return (
    <section id="inicio" className="bb-tour-detail">
      <div className="bb-tour-hero">
        <img className="bb-tour-cover" src={data.image} alt={copy.imageAlt} style={{ objectPosition: data.imagePosition ?? "center 48%" }} />
        <div className="bb-tour-shade" />
        <div className="bb-tour-title">
          <span className="bb-tour-eyebrow">{data.icon} {l.service}</span>
          <h1>{copy.title}</h1>
          <p>{copy.subtitle}</p>
        </div>
      </div>
      <div className="bb-wrap bb-tour-content">
        <p className="bb-tour-lead">{copy.intro}</p>
        <div className="bb-tour-highlights">
          <h2>{l.highlights}</h2>
          <ul>{copy.highlights.map(line => <li key={line}><span aria-hidden="true">✓</span>{line}</li>)}</ul>
        </div>
        <div className="bb-tour-cta">
          <h2>{l.schedule}</h2>
          <p>{copy.callout}</p>
          <a className="bb-button" href={bookingUrl} target="_blank" rel="noopener noreferrer">{l.cta}</a>
        </div>
        <p className="bb-tour-image-note">{l.note}</p>
        <a className="bb-tour-back" href={"/projects/buzios-buggy?lang=" + lang + "&tour=buggy"}>← {l.back}</a>
      </div>
    </section>
  );
}
