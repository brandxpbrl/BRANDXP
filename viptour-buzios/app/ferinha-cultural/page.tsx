import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ferinha } from "@/config/ferinha";
import ParticipationForm from "./participation-form";
import s from "./page.module.css";

export const metadata: Metadata = {
  title: { absolute: ferinha.title }, description: ferinha.description,
  alternates: { canonical: ferinha.canonical },
  openGraph: { title: ferinha.title, description: ferinha.description, url: ferinha.canonical, siteName: "FERINHA CULTURAL", locale: "es_AR", type: "website", images: [{url: "/ferinha-cultural/opengraph-image", width: 1200, height: 630, alt: "FERINHA CULTURAL — Mostrar, descubrir, conectar y disfrutar"}] },
  twitter: { card: "summary_large_image", title: ferinha.title, description: ferinha.description, images: ["/ferinha-cultural/opengraph-image"] },
};

const participation = [
  ["01", "Cabina abierta", "Para DJs que quieran compartir su música utilizando la estructura disponible."],
  ["02", "Escenario abierto", "Para bandas, músicos y artistas que quieran presentarse."],
  ["03", "Feria abierta", "Para emprendedores que quieran exponer y vender sus productos."],
  ["04", "Público abierto", "Para quienes quieran venir a disfrutar, conocer nuevos proyectos, escuchar música y formar parte."],
];
const layers = [
  ["FERINHA EVENTO", "El encuentro", "Encuentros presenciales con música, arte, gastronomía y emprendimientos. En la primera edición, también piscina y naturaleza."],
  ["FERINHA COMUNIDAD", "Lo que continúa", "Una red de personas y proyectos que permanecen conectados después de cada edición, compartiendo conocimientos y nuevas conexiones."],
  ["FERINHA LAB", "Lo que puede crecer", "Un espacio de observación, desarrollo y oportunidades para ayudar a los proyectos a encontrar sus próximos pasos."],
];
const ecosystem = [
  ["ORBIS", "La capa que conecta personas, proyectos, marcas, espacios y oportunidades. Everything connected.", "/"],
  ["Brand Experience", "Ayuda a revelar y organizar la identidad de cada proyecto: esencia, propósito, personalidad, mensaje y universo visual.", "/brandexperience"],
  ["MPE", "Una capa de observación y evolución para identificar patrones, conexiones, necesidades y posibilidades de cada proyecto.", "/mpe"],
  ["Qubit", "Una capa experimental para explorar escenarios, cruces de ideas y futuros posibles de los proyectos participantes.", "/qubit"],
];
const prizes = [
  ["Proyecto Visible", "Creación de una landing page o sitio web para un proyecto seleccionado."],
  ["Identidad Revelada", "Sesión de Brand Experience para ordenar la esencia, el mensaje y el posicionamiento del proyecto."],
  ["Proyecto en Movimiento", "Creación de contenido inicial para redes sociales."],
  ["MPE Insight", "Análisis conceptual del proyecto para identificar posibilidades, contradicciones y próximos pasos viables."],
  ["Conexión Estratégica", "Conexión con una marca, espacio, proveedor o posible cliente que pueda ayudar al proyecto a avanzar."],
];

export default function FerinhaPage() {
  return <div className={s.page}>
    <a className={s.skip} href="#contenido">Saltar al contenido</a>
    <header className={s.header}><Link href="/" className={s.orbis}>◎ ORBIS</Link><span>CULTURA EN COMUNIDAD</span><a href="#participar">Sumate <span aria-hidden="true">↗</span></a></header>
    <main id="contenido">
      <section className={s.hero} aria-labelledby="titulo">
        <div className={s.heroLayout}><div className={s.heroCopy}>
        <p className={s.eyebrow}>Una comunidad abierta · Un proyecto itinerante</p>
        <h1 id="titulo">FERINHA<br/><span>CULTURAL</span></h1>
        <div className={s.heroBottom}><h2>Un espacio para mostrar,<br/>descubrir, conectar y disfrutar.</h2><div><p>Una comunidad abierta para personas, proyectos y marcas que quieren compartir lo que hacen y crear nuevas posibilidades.</p><div className={s.actions}><a className={s.button} href="#participar">Quiero participar ↗</a><a href="#manifiesto">Quiero conocer el proyecto ↓</a></div></div></div>
        <p className={s.sunLabel}>Buena gente. Más cultura.</p>
        </div><figure className={s.heroPoster}><Image src="/ferinha/proyecto.png" alt="Pieza de campaña: ¿Tenés un proyecto? ¿Querés mostrarlo? Una invitación entre música, vegetación y piscina." width={1122} height={1402} sizes="(max-width: 760px) 100vw, 45vw" preload/><figcaption>Universo visual de FERINHA · Imagen conceptual</figcaption></figure></div>
        <div className={s.heroFoot}><span>Música / Arte / Emprendimientos / Encuentros</span><span>Todo comienza con una conexión.</span></div>
      </section>
      <section className={s.campaign} aria-labelledby="invitacion"><div><p className={s.eyebrow}>La invitación está abierta</p><h2 id="invitacion">Vení a mostrar lo que hacés.<br/><em>O vení a curtir el día.</em></h2><p>Compartí tu música, tu arte o tu emprendimiento. Descubrí nuevas propuestas y disfrutá de un encuentro en comunidad.</p></div><div className={s.campaignGrid}><a href="#participar"><Image src="/ferinha/participar.png" alt="¿Querés participar? DJs, bandas, artistas y emprendedores. Espacio gratuito para artistas y expositores en la primera edición." width={1122} height={1402} sizes="(max-width: 760px) 88vw, 42vw"/><span>Quiero compartir mi proyecto ↗</span></a><a href="#participar"><Image src="/ferinha/disfrutar.png" alt="Vení a curtir: música, piscina y parrilla. Conocé nuevos proyectos y disfrutá el día. Abierto al público." width={1122} height={1402} sizes="(max-width: 760px) 88vw, 42vw"/><span>Quiero conocer la comunidad ↗</span></a></div><p className={s.note}>Piezas conceptuales de campaña. La sede y los detalles de la primera edición se anunciarán próximamente.</p></section>
      <section id="manifiesto" className={s.editorial}><p className={s.eyebrow}>01 / El manifiesto</p><div><h2>Cuando algo se comparte,<br/><em>algo nuevo comienza.</em></h2><p>FERINHA CULTURAL nace de una idea simple:</p><p>cuando las personas tienen un espacio para mostrar lo que hacen, algo nuevo comienza a circular.</p><p className={s.poem}>Una canción.<br/>Un producto.<br/>Una obra.<br/>Un emprendimiento.<br/>Una historia.<br/>Una manera distinta de crear.</p><p>Creemos en los espacios que abren sus puertas y en las personas que se animan a ocuparlos.</p><p>Por eso creamos FERINHA CULTURAL: una comunidad abierta que conecta emprendimientos, artistas, marcas, productores, espacios y personas a través de encuentros culturales, experiencias y momentos compartidos.</p><p>Aquí no se trata solamente de vender, comprar o entretenerse.</p><p>Se trata de encontrarse.<br/>De descubrir nuevas propuestas.<br/>De dar visibilidad a quienes están creando.<br/>De compartir conocimientos, talentos y oportunidades.</p></div></section>
      <section className={s.section}><p className={s.eyebrow}>02 / Las formas de participar</p><h2>Hay un lugar para<br/><em>lo que hacés.</em></h2><div className={s.rows}>{participation.map(([n,title,body])=><article key={n}><span>{n}</span><h3>{title}</h3><p>{body}</p></article>)}</div><p className={s.note}>La participación de artistas y expositores será gratuita en la primera edición. Cupos limitados.</p></section>
      <section className={`${s.section} ${s.tinted}`}><p className={s.eyebrow}>03 / Un ecosistema vivo</p><h2>El encuentro es el comienzo.<br/><em>La comunidad sigue.</em></h2><div className={s.columns}>{layers.map(([label,title,body])=><article key={label}><p className={s.eyebrow}>{label}</p><h3>{title}</h3><p>{body}</p></article>)}</div><div className={s.edition}><h3>Primera edición</h3><p>Nos encontraremos en una posada con piscina, área verde, parrilla y bebidas. FERINHA es independiente de su sede: cada espacio puede abrir una nueva edición.</p><p>{ferinha.edition.host || "Posada anfitriona por anunciar"} · {ferinha.edition.date || "Fecha por anunciar"} · {ferinha.edition.time || "Horario por anunciar"}</p><p>{ferinha.edition.address || "La dirección se comunicará junto con los detalles de la edición."}</p></div></section>
      <section className={s.editorial}><p className={s.eyebrow}>04 / Todo conectado</p><div><h2>Ideas que se encuentran.<br/><em>Herramientas que acompañan.</em></h2><p>Estas capas describen cómo buscamos acompañar a la comunidad. El alcance de cada acompañamiento se acordará con el proyecto; no implica resultados garantizados ni análisis automáticos.</p>{ecosystem.map(([title,body,href])=><article className={s.partner} key={title}><h3><Link href={href}>{title} ↗</Link></h3><p>{body}</p></article>)}</div></section>
      <section id="participar" className={`${s.section} ${s.tinted}`}><p className={s.eyebrow}>05 / Tu lugar en la comunidad</p><div className={s.formIntro}><h2>Contanos qué hacés.<br/><em>Empecemos por ahí.</em></h2><p>No hace falta tener todo resuelto. Nos interesa conocer tu propuesta y lo que te gustaría compartir.</p></div><ParticipationForm/></section>
      <section className={s.section}><p className={s.eyebrow}>06 / Premios y oportunidades</p><h2>Mostrá tu proyecto. Podés llevarte<br/><em>herramientas para hacerlo crecer.</em></h2><p className={s.lead}>Quienes participen podrán acceder a oportunidades de desarrollo, no solamente a premios materiales. Estas son las propuestas previstas, sujetas a condiciones finales.</p><div className={s.rows}>{prizes.map(([title,body],i)=><article key={title}><span>0{i+1}</span><h3><small>Premio</small>{title}</h3><p>{body}</p></article>)}</div><ul className={s.terms}><li>Los premios estarán sujetos a evaluación.</li><li>La primera edición tendrá cupos limitados.</li><li>Las condiciones finales se comunicarán antes de la selección.</li><li>La participación no garantiza automáticamente la obtención de un premio.</li><li>Los datos se utilizarán únicamente para organizar la comunidad y las oportunidades informadas en el formulario.</li></ul></section>
      <section className={`${s.section} ${s.vote}`}><p className={s.eyebrow}>07 / La voz de la comunidad · Próximamente</p><h2>Elegí el proyecto<br/><em>que más te inspiró.</em></h2><p>Durante una futura edición podrás descubrir los proyectos y votar mediante QR. La votación todavía no está habilitada. Publicaremos las reglas y el acceso cuando el sistema esté disponible.</p></section>
      <section className={s.section}><p className={s.eyebrow}>08 / Marcas fundadoras y colaboradoras</p><h2>Una comunidad también<br/><em>se construye acompañando.</em></h2><p>El ecosistema que impulsa esta propuesta. Las colaboraciones de cada edición se comunicarán al confirmarse.</p><div className={s.brands}>{ferinha.collaborators.map(name=><span key={name}>{name}</span>)}</div><p className={s.note}>{ferinha.edition.host || "Posada anfitriona por anunciar"} · Un espacio abierto a otras marcas que se sumen.</p><a href="#participar">Quiero aportar desde mi marca o espacio ↗</a></section>
      <section className={s.closing}><p className={s.eyebrow}>Un lugar cambia. Lo que construimos, continúa.</p><h2>FERINHA CULTURAL no pertenece a un único lugar.<br/><em>Pertenece a la comunidad que la construye.</em></h2><div className={s.actions}><a className={s.button} href="#participar">Sumate a la comunidad ↗</a><a href="#participar">Presentá tu proyecto ↗</a><a href="#participar">Sé parte de la próxima edición ↗</a></div></section>
    </main><footer className={s.footer}><Link href="/">◎ ORBIS <span>Everything connected.</span></Link><span>FERINHA CULTURAL · Cultura en movimiento.</span><a href="#titulo">Volver arriba ↑</a></footer>
  </div>;
}
