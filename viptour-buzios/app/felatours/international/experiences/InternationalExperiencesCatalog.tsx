import Link from "next/link";
import { ArrowLeft, ArrowRight, MessageCircle, MapPin, Sparkles } from "lucide-react";
import styles from "./experiences.module.css";

const whatsapp = "https://wa.me/5545999686381";
const ask = (service: string) =>
  `${whatsapp}?text=${encodeURIComponent(`Hello FELA TOURS International! I would like to check availability for ${service}.`)}`;

type Experience = {
  name: string;
  category: string;
  location: string;
  image: string;
  description: string;
  details?: string[];
};

const experiences: Experience[] = [
  { name: "One Day in Rio — Christ the Redeemer + Sugarloaf Mountain", category: "Iconic Rio", location: "Rio de Janeiro", image: "/fela/experiences/cristo-pan.jpg", description: "A complete day connecting Rio’s most famous landmarks, city scenery and panoramic views.", details: ["Transportation and guide according to the confirmed service", "Admission tickets according to the confirmed proposal"] },
  { name: "Tijuca Forest Jeep Tour", category: "Adventure & nature", location: "Rio de Janeiro", image: "/fela/experiences/jeep-tijuca.jpg", description: "Explore Rio’s urban rainforest in an open-top jeep, with selected viewpoints, nature stops and local guidance.", details: ["Open-top jeep route", "Wildlife sightings depend on natural conditions"] },
  { name: "Panoramic Helicopter Flight", category: "Premium experience", location: "Rio de Janeiro", image: "/fela/experiences/helicopter.jpg", description: "See Rio from the air on a panoramic flight, subject to availability and operating conditions." },
  { name: "AquaRio + Port Zone", category: "Culture & city", location: "Rio de Janeiro", image: "/fela/experiences/aquario.jpg", description: "Discover AquaRio and the leading cultural attractions of Rio’s renewed waterfront district." },
  { name: "Pedra do Telégrafo", category: "Hiking", location: "Rio de Janeiro", image: "/fela/experiences/pedra-telegrafo.jpg", description: "Hike to one of Rio’s best-known photo viewpoints, surrounded by coastal scenery and nature." },
  { name: "Rocinha Favela Tour", category: "Local culture", location: "Rio de Janeiro", image: "/fela/experiences/rocinha.jpg", description: "A respectful guided cultural experience focused on the community, its stories, viewpoints and daily life." },
  { name: "Sunrise in Vidigal", category: "Local experience", location: "Rio de Janeiro", image: "/fela/experiences/vidigal.jpg", description: "Begin the day above Rio from Vidigal, with memorable views and local assistance." },
  { name: "Stand-Up Paddle in Copacabana", category: "Water experience", location: "Copacabana", image: "/fela/experiences/standup.jpg", description: "Enjoy Copacabana from a different perspective on the water, subject to weather and sea conditions." },
  { name: "Arraial do Cabo", category: "Beaches & islands", location: "Lakes Region", image: "/fela/experiences/arraial.jpg", description: "Crystal-clear water, sailing and white-sand beaches in one of Brazil’s most sought-after coastal destinations." },
  { name: "Angra dos Reis + Ilha Grande", category: "Beaches & islands", location: "Green Coast", image: "/fela/experiences/angra-ilha-grande.jpg", description: "A day among islands, nature and calm waters, with the route subject to sailing and weather conditions." },
  { name: "Búzios Full Day", category: "Beaches", location: "Búzios", image: "/fela/experiences/buzios-full-day.jpg", description: "Discover the peninsula, its beaches and signature corners on a complete experience from Rio." },
  { name: "Búzios Boat Tour", category: "Sailing", location: "Búzios", image: "/fela/experiences/boat-buzios.jpg", description: "An approximately 2.5-hour cruise past Búzios beaches and islands, with swimming stops.", details: ["Usually departs from the downtown pier", "Route subject to sea conditions"] },
  { name: "Private Speedboat", category: "Private experience", location: "Búzios or Arraial", image: "/fela/experiences/private-boat.jpg", description: "An exclusive sailing experience designed for greater privacy, comfort and flexibility along the coast." },
  { name: "Moses Path — Arubinha", category: "Nature", location: "Arraial do Cabo", image: "/fela/experiences/arubinha.jpg", description: "A distinctive coastal experience in Arubinha, arranged around access, tide and weather conditions." },
  { name: "Buggy Tour", category: "Adventure", location: "Búzios", image: "/fela/experiences/buggy-tour.jpg", description: "Visit Búzios viewpoints, beaches and highlights with a local driver." },
  { name: "Buggy Rental", category: "Mobility", location: "Búzios", image: "/fela/experiences/buggy-rental.jpg", description: "Rent a buggy and explore Búzios at your own pace. Availability and requirements are confirmed when booking." },
  { name: "Scuba Diving", category: "Water experience", location: "Búzios", image: "/fela/experiences/diving.jpg", description: "Discover the underwater world of Búzios with an experience coordinated around your level and sea conditions." },
  { name: "Jet Ski", category: "Water adventure", location: "Búzios", image: "/fela/experiences/jetski.jpg", description: "A high-energy experience on the water, subject to availability, weather and operator requirements." },
  { name: "Private Transfer", category: "Transfers", location: "Rio · Búzios · Lakes Region", image: "/fela/experiences/transfer-private.jpg", description: "Exclusive door-to-door service with monitoring, assistance and a vehicle selected for your group and luggage.", details: ["Advance reservation required", "Up to one hour of waiting time according to the confirmed service"] },
  { name: "Shared Transfer", category: "Transfers", location: "Rio · Búzios", image: "/fela/experiences/transfer-shared.jpg", description: "A practical scheduled van service with pickup at eligible hotels and guesthouses.", details: ["Pickup time confirmed 24–48 hours in advance", "Private residences are not included"] },
];

const groups = ["Rio de Janeiro", "Beaches & Islands", "Búzios Experiences", "Transfers"];

const inGroup = (item: Experience, group: string) => {
  if (group === "Rio de Janeiro") return ["Rio de Janeiro", "Copacabana"].includes(item.location);
  if (group === "Beaches & Islands") return ["Lakes Region", "Green Coast", "Arraial do Cabo"].includes(item.location) || item.name === "Búzios Full Day";
  if (group === "Transfers") return item.category === "Transfers";
  return item.location === "Búzios" || item.location === "Búzios or Arraial";
};

export default function InternationalExperiencesCatalog() {
  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroGlow} />
        <Link href="/felatours/international" className={styles.back}><ArrowLeft size={16} /> Back to FELA TOURS International</Link>
        <img src="/fela/logo.webp" alt="FELA TOURS" className={styles.logo} />
        <p className={styles.eyebrow}><Sparkles size={15} /> 20 curated experiences</p>
        <h1>Choose how you want to <em>experience Brazil.</em></h1>
        <p className={styles.lead}>Tours, beaches, adventures and transfers with local English-speaking assistance. Share your dates, group size and accommodation, and we will design your proposal.</p>
        <a className={styles.primary} href={ask("a personalized Brazil itinerary")} target="_blank" rel="noreferrer"><MessageCircle size={18} /> Design my experience</a>
      </header>

      {groups.map((group, groupIndex) => (
        <section className={styles.section} key={group}>
          <div className={styles.sectionHead}><span>{String(groupIndex + 1).padStart(2, "0")}</span><h2>{group}</h2></div>
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
                  <a href={ask(item.name)} target="_blank" rel="noreferrer">Check availability <ArrowRight size={15} /></a>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}

      <footer className={styles.footer}>
        <img src="/fela/logo.webp" alt="FELA TOURS" />
        <div><h2>Not sure what to choose?</h2><p>Tell us about your trip and we will create a personalized proposal.</p></div>
        <a href={ask("a personalized Brazil itinerary")} target="_blank" rel="noreferrer"><MessageCircle size={18} /> Talk to FELA TOURS</a>
      </footer>
    </main>
  );
}
