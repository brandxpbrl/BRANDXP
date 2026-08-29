import Link from "next/link";
import { ArrowLeft, ArrowRight, MessageCircle, MapPin, Sparkles } from "lucide-react";
import styles from "./experiences.module.css";

const whatsapp = "https://wa.me/5545999686381";
const ask = (service: string) =>
  `${whatsapp}?text=${encodeURIComponent(`Hola FELA TOURS! Quiero consultar disponibilidad para ${service}.`)}`;

type Experience = {
  name: string;
  category: string;
  location: string;
  image: string;
  description: string;
  details?: string[];
};

const experiences: Experience[] = [
  { name: "Cristo Redentor + Pan de Azúcar", category: "Río icónico", location: "Río de Janeiro", image: "/fela/experiences/cristo-pan.jpg", description: "Un recorrido completo por los grandes símbolos de Río, combinando ciudad, paisajes y vistas panorámicas.", details: ["Traslado y guía según modalidad", "Entradas según propuesta confirmada"] },
  { name: "Jeep Tour Floresta da Tijuca", category: "Aventura y naturaleza", location: "Río de Janeiro", image: "/fela/experiences/jeep-tijuca.jpg", description: "Explorá la selva urbana de Río en un jeep abierto, con miradores, naturaleza y paradas seleccionadas.", details: ["Recorrido en jeep", "Avistamientos sujetos a condiciones naturales"] },
  { name: "Vuelo panorámico en helicóptero", category: "Experiencia premium", location: "Río de Janeiro", image: "/fela/experiences/helicopter.jpg", description: "Contemplá Río desde el aire en una experiencia panorámica sujeta a disponibilidad y condiciones operativas." },
  { name: "AquaRio + Zona Portuaria", category: "Cultura y ciudad", location: "Río de Janeiro", image: "/fela/experiences/aquario.jpg", description: "Una jornada para descubrir AquaRio y los principales atractivos culturales de la renovada zona portuaria." },
  { name: "Pedra do Telégrafo", category: "Senderismo", location: "Río de Janeiro", image: "/fela/experiences/pedra-telegrafo.jpg", description: "Caminata hacia uno de los miradores fotográficos más conocidos de Río, rodeado de naturaleza y costa." },
  { name: "Favela Tour Rocinha", category: "Cultura local", location: "Río de Janeiro", image: "/fela/experiences/rocinha.jpg", description: "Una experiencia cultural guiada para conocer la comunidad, sus historias, miradores y vida cotidiana con respeto." },
  { name: "Amanecer en Vidigal", category: "Favela experience", location: "Río de Janeiro", image: "/fela/experiences/vidigal.jpg", description: "Viví el comienzo del día desde Vidigal, con vistas inolvidables y acompañamiento local." },
  { name: "Stand Up Paddle Copacabana", category: "Experiencia acuática", location: "Copacabana", image: "/fela/experiences/standup.jpg", description: "Una experiencia sobre el mar para disfrutar Copacabana desde otra perspectiva, sujeta a condiciones climáticas." },
  { name: "Arraial do Cabo", category: "Playas e islas", location: "Región dos Lagos", image: "/fela/experiences/arraial.jpg", description: "Aguas cristalinas, navegación y playas de arena blanca en uno de los destinos costeros más buscados de Brasil." },
  { name: "Angra dos Reis + Ilha Grande", category: "Playas e islas", location: "Costa Verde", image: "/fela/experiences/angra-ilha-grande.jpg", description: "Un día entre islas, naturaleza y aguas tranquilas, con itinerario sujeto a navegación y clima." },
  { name: "Búzios Full Day", category: "Playas", location: "Búzios", image: "/fela/experiences/buzios-full-day.jpg", description: "Descubrí la península, sus playas y rincones más emblemáticos en una experiencia completa desde Río." },
  { name: "Paseo en barco por Búzios", category: "Navegación", location: "Búzios", image: "/fela/experiences/boat-buzios.jpg", description: "Navegación de aproximadamente 2:30 horas por playas e islas de Búzios, con paradas para nadar.", details: ["Salida habitual desde el muelle del centro", "Itinerario sujeto a condiciones marítimas"] },
  { name: "Lancha privada", category: "Experiencia privada", location: "Búzios o Arraial", image: "/fela/experiences/private-boat.jpg", description: "Una experiencia de navegación exclusiva para disfrutar la costa con mayor privacidad y flexibilidad." },
  { name: "Caminho de Moisés — Arubinha", category: "Naturaleza", location: "Arraial do Cabo", image: "/fela/experiences/arubinha.jpg", description: "Una experiencia costera singular en Arubinha, organizada según condiciones de acceso, marea y clima." },
  { name: "Paseo en buggy", category: "Aventura", location: "Búzios", image: "/fela/experiences/buggy-tour.jpg", description: "Recorré miradores, playas y puntos destacados de Búzios acompañado por un conductor local." },
  { name: "Alquiler de buggy", category: "Movilidad", location: "Búzios", image: "/fela/experiences/buggy-rental.jpg", description: "Alquilá un buggy para recorrer Búzios con libertad. Disponibilidad y requisitos se confirman al reservar." },
  { name: "Buceo", category: "Experiencia acuática", location: "Búzios", image: "/fela/experiences/diving.jpg", description: "Descubrí el mundo submarino de Búzios con una experiencia coordinada según nivel y condiciones del mar." },
  { name: "Jet Ski", category: "Aventura acuática", location: "Búzios", image: "/fela/experiences/jetski.jpg", description: "Una experiencia de velocidad sobre el agua, sujeta a disponibilidad, clima y requisitos del operador." },
  { name: "Traslado privado", category: "Traslados", location: "Río · Búzios · Región dos Lagos", image: "/fela/experiences/transfer-private.jpg", description: "Servicio exclusivo puerta a puerta, con seguimiento, asistencia y vehículo elegido según pasajeros y equipaje.", details: ["Reserva con anticipo", "Hasta una hora de espera según servicio"] },
  { name: "Traslado compartido", category: "Traslados", location: "Río · Búzios", image: "/fela/experiences/transfer-shared.jpg", description: "Una alternativa práctica en van con horarios coordinados y recogidas en hoteles o posadas habilitadas.", details: ["Horario confirmado entre 24 y 48 horas antes", "No incluye domicilios particulares"] },
];

const groups = ["Río de Janeiro", "Playas e islas", "Búzios y experiencias", "Traslados"];

const inGroup = (item: Experience, group: string) => {
  if (group === "Río de Janeiro") return ["Río de Janeiro", "Copacabana"].includes(item.location);
  if (group === "Playas e islas") return ["Región dos Lagos", "Costa Verde", "Arraial do Cabo"].includes(item.location) || item.name === "Búzios Full Day";
  if (group === "Traslados") return item.category === "Traslados";
  return item.location === "Búzios" || item.location === "Búzios o Arraial";
};

export default function ExperiencesCatalog() {
  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroGlow} />
        <Link href="/felatours" className={styles.back}><ArrowLeft size={16} /> Volver a FELA TOURS</Link>
        <img src="/fela/logo.webp" alt="FELA TOURS" className={styles.logo} />
        <p className={styles.eyebrow}><Sparkles size={15} /> Catálogo de experiencias</p>
        <h1>Elegí cómo querés <em>vivir Brasil.</em></h1>
        <p className={styles.lead}>Tours, playas, aventura y traslados organizados con atención local. Consultanos con tus fechas, cantidad de viajeros y hospedaje.</p>
        <a className={styles.primary} href={ask("una propuesta personalizada")} target="_blank" rel="noreferrer"><MessageCircle size={18} /> Diseñar mi experiencia</a>
      </header>

      {groups.map((group) => (
        <section className={styles.section} key={group}>
          <div className={styles.sectionHead}><span>{String(groups.indexOf(group) + 1).padStart(2, "0")}</span><h2>{group}</h2></div>
          <div className={styles.grid}>
            {experiences.filter((item) => inGroup(item, group)).map((item) => (
              <article className={styles.card} key={item.name}>
                <div className={styles.imageWrap}><img src={item.image} alt={item.name} loading="lazy" /></div>
                <div className={styles.cardBody}>
                  <p className={styles.category}>{item.category}</p>
                  <h3>{item.name}</h3>
                  <p className={styles.location}><MapPin size={14} /> {item.location}</p>
                  <p className={styles.description}>{item.description}</p>
                  {item.details && <ul>{item.details.map((detail) => <li key={detail}>{detail}</li>)}</ul>}
                  <a href={ask(item.name)} target="_blank" rel="noreferrer">Consultar disponibilidad <ArrowRight size={15} /></a>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}

      <footer className={styles.footer}>
        <img src="/fela/logo.webp" alt="FELA TOURS" />
        <div><h2>¿No sabés qué elegir?</h2><p>Contanos tu viaje y armamos una propuesta personalizada.</p></div>
        <a href={ask("una propuesta personalizada")} target="_blank" rel="noreferrer"><MessageCircle size={18} /> Hablar con FELA TOURS</a>
      </footer>
    </main>
  );
}
