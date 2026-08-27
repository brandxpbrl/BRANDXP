import Link from "next/link";
import {
  ArrowRight,
  BusFront,
  Check,
  Clock3,
  Languages,
  MapPin,
  MessageCircle,
  Plane,
  ShieldCheck,
  Ship,
  Sparkles,
  Waves,
} from "lucide-react";
import styles from "./fela.module.css";

const whatsappBase = "https://wa.me/5545999686381";
const ask = (service: string) =>
  `${whatsappBase}?text=${encodeURIComponent(`Hola FELA TOURS! Quiero consultar disponibilidad para ${service}.`)}`;

const services = [
  {
    icon: Plane,
    title: "Traslados",
    copy: "Aeropuertos, Río de Janeiro, Búzios, Arraial do Cabo, Angra dos Reis e Ilha Grande.",
    image: "/images/orbis/ecosystem/travel.png",
  },
  {
    icon: Ship,
    title: "Tours de playa",
    copy: "Arraial do Cabo, Angra + Ilha Grande y las mejores playas de Búzios.",
    image: "/images/hero-buggy.png",
  },
  {
    icon: MapPin,
    title: "Río de Janeiro",
    copy: "Cristo Redentor, Pan de Azúcar, Maracanã, Selarón y experiencias completas por la ciudad.",
    image: "/images/buziosama-retiros.jpg",
  },
  {
    icon: Waves,
    title: "Experiencias",
    copy: "Buggy, buceo, stand up paddle, favela tour y propuestas especiales para vivir Río de otra manera.",
    image: "/images/orbis/ecosystem/lifestyle.png",
  },
];

const benefits = [
  "Atención personalizada en español y portugués",
  "Choferes y operadores registrados",
  "Seguimiento del vuelo antes de tu llegada",
  "Una hora de espera de cortesía ante demoras",
  "Opciones privadas y compartidas",
  "Asistencia antes, durante y después de la experiencia",
];

export default function FelaLanding() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <img
          className={styles.heroImage}
          src="/images/orbis/ecosystem/travel.png"
          alt="Experiencias turísticas en Río de Janeiro y Búzios"
        />
        <div className={styles.heroOverlay} />
        <div className={styles.orbOne} />
        <div className={styles.orbTwo} />
        <div className={styles.heroContent}>
          <div className={styles.brandLockup}>
            <img src="/fela/logo.webp" alt="FELA TOURS — Río de Janeiro, Brasil" />
          </div>
          <p className={styles.eyebrow}>
            <Sparkles size={15} /> Tu experiencia empieza antes de viajar
          </p>
          <h1>
            Viví Río.
            <br />
            <em>Sentí Búzios.</em>
            <br />
            Recordá todo.
          </h1>
          <p className={styles.lede}>
            Traslados, excursiones y experiencias diseñadas para que disfrutes
            Brasil con confianza, cercanía y acompañamiento real.
          </p>
          <div className={styles.actions}>
            <a
              className={styles.primaryButton}
              href={ask("mi viaje a Brasil")}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={19} /> Consultar disponibilidad{" "}
              <ArrowRight size={17} />
            </a>
            <a className={styles.secondaryButton} href="#experiencias">
              Explorar experiencias
            </a>
          </div>
          <div className={styles.quickTrust}>
            <span>
              <Languages size={16} /> Español y portugués
            </span>
            <span>
              <ShieldCheck size={16} /> Operación verificada
            </span>
            <span>
              <MapPin size={16} /> Río · Búzios · Costa Verde
            </span>
          </div>
        </div>
      </section>

      <section className={styles.intro}>
        <p className={styles.eyebrow}>FELA TOURS · EXPERIENCIAS CONECTADAS</p>
        <h2>
          No vendemos solamente un destino.
          <br />
          <em>Te acompañamos a vivirlo.</em>
        </h2>
        <p>
          Desde el momento en que aterrizás hasta esa experiencia que vas a
          recordar por años, coordinamos cada detalle para que viajes tranquilo
          y aproveches cada día.
        </p>
      </section>

      <section id="experiencias" className={styles.services}>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>Elegí cómo vivir Brasil</p>
            <h2>
              Todo tu viaje,
              <br />
              <em>en un mismo lugar.</em>
            </h2>
          </div>
          <p>
            Las fechas, cupos y condiciones pueden variar. Consultanos y armamos
            la mejor opción según tu viaje.
          </p>
        </div>
        <div className={styles.serviceGrid}>
          {services.map(({ icon: Icon, title, copy, image }) => (
            <article className={styles.serviceCard} key={title}>
              <img src={image} alt="" />
              <div className={styles.cardOverlay} />
              <div className={styles.cardContent}>
                <Icon size={27} />
                <h3>{title}</h3>
                <p>{copy}</p>
                <a href={ask(title)} target="_blank" rel="noreferrer">
                  Consultar disponibilidad <ArrowRight size={15} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.transfer}>
        <div className={styles.transferVisual}>
          <img
            src="/images/orbis/ecosystem/travel.png"
            alt="Traslados privados y compartidos de FELA TOURS"
          />
          <div className={styles.transferBadge}>
            <BusFront size={25} />
            <span>Puerta a puerta</span>
          </div>
        </div>
        <div className={styles.transferCopy}>
          <p className={styles.eyebrow}>Llegá con tranquilidad</p>
          <h2>
            Tu traslado también
            <br />
            <em>es parte del viaje.</em>
          </h2>
          <p>
            Coordinamos horario, punto de salida y destino. En aeropuerto
            hacemos seguimiento del vuelo y te damos una hora de espera de
            cortesía si se demora.
          </p>
          <div className={styles.transferFacts}>
            <span>
              <Clock3 size={18} /> 1 hora de espera de cortesía
            </span>
            <span>
              <Plane size={18} /> Seguimiento de vuelo
            </span>
            <span>
              <ShieldCheck size={18} /> Conductores registrados
            </span>
          </div>
          <a
            className={styles.primaryButton}
            href={ask("un traslado")}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={19} /> Consultar traslado
          </a>
        </div>
      </section>

      <section className={styles.trust}>
        <div>
          <p className={styles.eyebrow}>Viajar acompañado cambia todo</p>
          <h2>
            Confianza en cada
            <br />
            <em>parte del recorrido.</em>
          </h2>
        </div>
        <div className={styles.benefitGrid}>
          {benefits.map((item) => (
            <div key={item}>
              <Check size={18} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.finalCta}>
        <p className={styles.eyebrow}>TU PRÓXIMA AVENTURA EMPIEZA ACÁ</p>
        <h2>
          Contanos cuándo viajás.
          <br />
          <em>Nosotros conectamos el resto.</em>
        </h2>
        <p>
          Escribinos por WhatsApp para consultar disponibilidad y recibir una
          propuesta adaptada a tu itinerario.
        </p>
        <a
          className={styles.primaryButton}
          href={ask("tours y traslados")}
          target="_blank"
          rel="noreferrer"
        >
          <MessageCircle size={19} /> Hablar con FELA TOURS{" "}
          <ArrowRight size={17} />
        </a>
      </section>

      <footer className={styles.footer}>
        <div className={styles.brandLockup}>
          <img src="/fela/logo.webp" alt="FELA TOURS" />
        </div>
        <p>Río de Janeiro · Búzios · Brasil</p>
        <Link href="/">Volver a ORBIS</Link>
      </footer>
    </main>
  );
}
