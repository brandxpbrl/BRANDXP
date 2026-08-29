"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type ComponentProps, type FormEvent } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  Clock3,
  Compass,
  Headphones,
  MapPin,
  MessageCircle,
  Plane,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import styles from "./international.module.css";

const whatsappNumber = "5545999686381";
const whatsappBase = `https://wa.me/${whatsappNumber}`;

const benefits = [
  [ShieldCheck, "Registered and verified drivers"],
  [LanguagesIcon, "English-speaking local assistance"],
  [Plane, "Flight monitoring"],
  [Clock3, "One-hour airport waiting grace"],
  [MapPin, "Door-to-door service"],
  [BadgeCheck, "Clear itineraries and secure booking"],
  [MessageCircle, "WhatsApp assistance throughout your stay"],
  [Sparkles, "International payment options, upon confirmation"],
] as const;

const experiences = [
  {
    title: "Rio de Janeiro",
    intro: "Iconic landmarks, local culture and the city’s essential rhythms.",
    items: [
      "One Day in Rio",
      "Christ the Redeemer",
      "Sugarloaf Mountain",
      "Maracanã Tour",
      "Maracanã Live Match",
      "Jeep Tour and Tijuca Forest",
      "Favela cultural experience",
      "Helicopter panoramic flight",
      "Rio Port Zone and cultural attractions",
    ],
  },
  {
    title: "Coast and Islands",
    intro: "Clear water, boat days and the landscapes beyond the city.",
    items: [
      "Búzios",
      "Arraial do Cabo",
      "Angra dos Reis",
      "Ilha Grande",
      "Boat tours",
      "Beaches and island experiences",
    ],
  },
  {
    title: "Adventure and Local Experiences",
    intro: "A more active or personal way to connect with Brazil.",
    items: [
      "Diving",
      "Stand-up paddle",
      "Buggy tours",
      "Gastronomic experiences",
      "Professional photography, when confirmed in the catalog",
    ],
  },
];

const serviceLevels = [
  {
    name: "Essential Experience",
    copy: "A clear, well-coordinated foundation for your Brazil trip.",
    items: ["Round-trip airport transfer", "Selected tours", "Local coordination"],
  },
  {
    name: "Complete Experience",
    copy: "A connected itinerary with support throughout your stay.",
    items: [
      "Round-trip airport transfer",
      "Tours and scheduled transportation",
      "Guides and entrance tickets where specified",
      "Assistance throughout the stay",
    ],
  },
  {
    name: "Signature Concierge Experience",
    copy: "A deeply personal journey shaped around your occasion and pace.",
    items: [
      "Everything in the Complete Experience",
      "Personalized itinerary",
      "Restaurant reservations",
      "Birthday or anniversary coordination",
      "Special requests and priority local assistance",
    ],
  },
];

const initialForm = {
  fullName: "",
  email: "",
  whatsapp: "",
  country: "",
  arrivalDate: "",
  departureDate: "",
  airport: "",
  flightNumber: "",
  accommodation: "",
  adults: "",
  children: "",
  childrenAges: "",
  destinations: "",
  experiences: "",
  pace: "Balanced",
  serviceType: "Private",
  occasion: "",
  notes: "",
};

function LanguagesIcon(props: ComponentProps<typeof Headphones>) {
  return <Headphones {...props} />;
}

function InternationalRequestForm() {
  const [form, setForm] = useState(initialForm);

  const updateField = (field: keyof typeof initialForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const labels: Record<keyof typeof initialForm, string> = {
      fullName: "Full name",
      email: "Email",
      whatsapp: "WhatsApp number",
      country: "Country of residence",
      arrivalDate: "Arrival date",
      departureDate: "Departure date",
      airport: "Arrival airport",
      flightNumber: "Flight number",
      accommodation: "Hotel or accommodation",
      adults: "Number of adults",
      children: "Number of children",
      childrenAges: "Children’s ages",
      destinations: "Preferred destinations",
      experiences: "Experiences of interest",
      pace: "Preferred travel pace",
      serviceType: "Service type",
      occasion: "Special occasion",
      notes: "Additional notes",
    };
    const message = Object.entries(form)
      .filter(([, value]) => value.trim() !== "")
      .map(([key, value]) => `${labels[key as keyof typeof initialForm]}: ${value}`)
      .join("\n");
    window.open(`${whatsappBase}?text=${encodeURIComponent(`Hello FELA TOURS International! I would like to design my Brazil experience.\n\n${message}`)}`, "_blank", "noopener,noreferrer");
  };

  const field = (name: keyof typeof initialForm, label: string, type = "text", required = false) => (
    <label className={styles.field}>
      <span>{label}{required ? " *" : ""}</span>
      <input
        type={type}
        value={form[name]}
        onChange={(event) => updateField(name, event.target.value)}
        required={required}
      />
    </label>
  );

  return (
    <form className={styles.requestForm} onSubmit={submit}>
      <div className={styles.formIntro}>
        <p className={styles.eyebrow}>Custom trip request</p>
        <h2>Tell us what your Brazil should feel like.</h2>
        <p>Share the essentials. We will turn your plans into a clear, personalized proposal.</p>
      </div>
      <div className={styles.formGrid}>
        {field("fullName", "Full name", "text", true)}
        {field("email", "Email", "email", true)}
        {field("whatsapp", "WhatsApp number with country code", "tel", true)}
        {field("country", "Country of residence", "text", true)}
        {field("arrivalDate", "Arrival date", "date", true)}
        {field("departureDate", "Departure date", "date", true)}
        {field("airport", "Arrival airport", "text", true)}
        {field("flightNumber", "Flight number (optional)")}
        {field("accommodation", "Hotel or accommodation", "text", true)}
        {field("adults", "Number of adults", "number", true)}
        {field("children", "Number of children", "number")}
        {field("childrenAges", "Children’s ages (optional)")}
      </div>
      <div className={styles.formGrid}>
        <label className={`${styles.field} ${styles.fieldWide}`}>
          <span>Preferred destinations *</span>
          <input value={form.destinations} onChange={(event) => updateField("destinations", event.target.value)} placeholder="Rio, Búzios, Angra dos Reis..." required />
        </label>
        <label className={`${styles.field} ${styles.fieldWide}`}>
          <span>Experiences of interest *</span>
          <textarea value={form.experiences} onChange={(event) => updateField("experiences", event.target.value)} placeholder="Tell us what caught your attention." required />
        </label>
        <label className={styles.field}>
          <span>Preferred travel pace</span>
          <select value={form.pace} onChange={(event) => updateField("pace", event.target.value)}>
            <option>Relaxed</option><option>Balanced</option><option>Full Experience</option>
          </select>
        </label>
        <label className={styles.field}>
          <span>Private or shared service</span>
          <select value={form.serviceType} onChange={(event) => updateField("serviceType", event.target.value)}>
            <option>Private</option><option>Shared</option>
          </select>
        </label>
        {field("occasion", "Special occasion (optional)")}
        <label className={`${styles.field} ${styles.fieldWide}`}>
          <span>Additional notes</span>
          <textarea value={form.notes} onChange={(event) => updateField("notes", event.target.value)} placeholder="Dietary needs, mobility considerations, birthdays, preferences..." />
        </label>
      </div>
      <div className={styles.formFooter}>
        <p>We do not store this form. Your request opens WhatsApp with the details you entered.</p>
        <button className={styles.primaryButton} type="submit"><MessageCircle size={17} /> Send request on WhatsApp <ArrowRight size={16} /></button>
      </div>
    </form>
  );
}

export default function InternationalLanding() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <Image className={styles.heroImage} src="/fela/transfers/passengers.webp" alt="Travelers arriving in Brazil with their luggage" fill priority sizes="100vw" />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <Link href="/felatours" className={styles.backLink}>← FELA TOURS</Link>
          <div className={styles.brandLine}><Image src="/fela/logo.webp" alt="FELA TOURS" width={245} height={78} /></div>
          <p className={styles.eyebrow}><Sparkles size={15} /> FELA TOURS INTERNATIONAL</p>
          <p className={styles.descriptor}>Private tours, airport transfers &amp; personalized travel assistance.</p>
          <h1>Experience Brazil <em>with confidence.</em></h1>
          <p className={styles.lede}>Private airport transfers, curated tours and personalized local assistance in Rio de Janeiro, Búzios and beyond. From your arrival to your final departure, we take care of every detail.</p>
          <div className={styles.actions}><a className={styles.primaryButton} href="#request"><Compass size={18} /> Design My Brazil Experience <ArrowRight size={16} /></a><a className={styles.secondaryButton} href="#services">Explore Our Services</a></div>
          <div className={styles.heroTrust}><span><UserRound size={15} /> Families, couples &amp; small groups</span><span><Headphones size={15} /> English-speaking support</span></div>
        </div>
      </section>

      <section className={styles.intro}><p className={styles.eyebrow}>CUSTOM BRAZIL EXPERIENCES</p><h2>Your journey, <em>designed around you.</em></h2><p>FELA TOURS International connects the details of your trip into one calm, local experience: airport arrival, transportation, tours, reservations and assistance, coordinated around the way you want to travel.</p></section>

      <section className={styles.benefits}><div className={styles.sectionHeading}><p className={styles.eyebrow}>Why travel with us</p><h2>Local knowledge.<br /><em>International clarity.</em></h2></div><div className={styles.benefitGrid}>{benefits.map(([Icon, text]) => <article key={text}><Icon size={21} /><p>{text}</p></article>)}</div></section>

      <section className={styles.airport}><div className={styles.airportVisual}><Image src="/fela/transfers/passengers.webp" alt="Passengers walking with luggage after arriving in Brazil" fill sizes="(max-width: 900px) 100vw, 48vw" /></div><div className={styles.airportCopy}><p className={styles.eyebrow}>Complete airport experience</p><h2>Arrive feeling <em>looked after.</em></h2><p>We can integrate your airport–hotel–airport transfer into every personalized proposal, so your journey has a clear beginning and a calm return.</p><div className={styles.checkList}>{["Airport pickup and driver identification", "Flight monitoring and one-hour waiting grace", "Luggage assistance and direct hotel transfer", "Return transfer coordinated with your departure", "Vehicles selected for passengers and luggage"].map((item) => <span key={item}><Check size={16} /> {item}</span>)}</div><a className={styles.textLink} href={whatsappBase + "?text=" + encodeURIComponent("Hello FELA TOURS International! I would like to ask about an airport transfer.")} target="_blank" rel="noreferrer">Ask about airport transfers <ArrowRight size={15} /></a></div></section>

      <section id="services" className={styles.experiences}><div className={styles.sectionHeading}><p className={styles.eyebrow}>Curated experiences</p><h2>See Brazil<br /><em>your way.</em></h2><p>Every experience is confirmed individually. No generic prices, no one-size-fits-all itinerary.</p><Link className={styles.primaryButton} href="/felatours/international/experiences"><Compass size={18} /> Explore all 20 experiences <ArrowRight size={16} /></Link></div><div className={styles.experienceGrid}>{experiences.map((group) => <article key={group.title} className={styles.experienceCard}><div className={styles.cardNumber}>{String(experiences.indexOf(group) + 1).padStart(2, "0")}</div><h3>{group.title}</h3><p>{group.intro}</p><div className={styles.itemList}>{group.items.map((item) => <a key={item} href={whatsappBase + "?text=" + encodeURIComponent(`Hello FELA TOURS International! I would like to ask about ${item}.`)} target="_blank" rel="noreferrer"><span>{item}</span><ArrowRight size={14} /></a>)}</div></article>)}</div></section>

      <section className={styles.levels}><div className={styles.sectionHeading}><p className={styles.eyebrow}>Choose your level of support</p><h2>From essential<br /><em>to signature.</em></h2></div><div className={styles.levelGrid}>{serviceLevels.map((level, index) => <article key={level.name} className={index === 2 ? styles.levelFeatured : ""}><p className={styles.cardNumber}>{String(index + 1).padStart(2, "0")}</p><h3>{level.name}</h3><p>{level.copy}</p><div className={styles.checkList}>{level.items.map((item) => <span key={item}><Check size={15} /> {item}</span>)}</div><small>Details depend on each proposal.</small></article>)}</div></section>

      <section className={styles.proposalReference}><div className={styles.proposalCopy}><p className={styles.eyebrow}>Proposal example</p><h2>See how a custom journey <em>comes together.</em></h2><p>This sample shows the visual rhythm we use for personalized proposals: selected experiences, optional additions, concierge support, included services, and clear per-person and group totals.</p><p className={styles.proposalNote}>The dates, prices, availability, and contact details shown belong to this specific sample and are not a current quote.</p><a className={styles.textLink} href="#request">Request a proposal for your trip <ArrowRight size={15} /></a></div><figure className={styles.proposalVisual}><Image src="/fela/international/family-proposal-example.png" alt="Example FELA TOURS international proposal flyer showing Rio de Janeiro experiences and a package summary" width={1024} height={1536} /></figure></section>

      <section className={styles.process}><p className={styles.eyebrow}>A simple process</p><h2>From first message<br /><em>to first memory.</em></h2><div className={styles.processGrid}>{["Tell us about your trip.", "Receive your personalized proposal.", "Confirm your booking.", "Enjoy Brazil with local support."].map((step, index) => <article key={step}><span>{String(index + 1).padStart(2, "0")}</span><h3>{step}</h3></article>)}</div></section>

      <section id="request" className={styles.request}><InternationalRequestForm /></section>

      <section className={styles.finalCta}><p className={styles.eyebrow}>Start before you arrive</p><h2>Your Brazil experience starts <em>before you arrive.</em></h2><p>Share your travel plans and let our local team design a personalized journey for you.</p><a className={styles.primaryButton} href="#request"><MessageCircle size={17} /> Request My Personalized Proposal</a></section>
      <footer className={styles.footer}><Image src="/fela/logo.webp" alt="FELA TOURS" width={175} height={56} /><p>FELA TOURS International · Rio de Janeiro · Brazil</p><a href="mailto:admin@riovibestransfer.com">admin@riovibestransfer.com</a><Link href="/felatours">Back to FELA TOURS</Link></footer>
    </main>
  );
}
