"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, ArrowRight, Maximize2, MessageCircle, X } from "lucide-react";
import styles from "./catalogViewer.module.css";

const pages = [1, 2, 3, 4, 5];
const whatsappUrl =
  "https://wa.me/5545999686381?text=" +
  encodeURIComponent(
    "Hola FELA TOURS! Vi el catálogo completo y quiero consultar disponibilidad para una experiencia.",
  );

export default function CatalogViewer() {
  const [current, setCurrent] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [target, setTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setTarget(document.getElementById("catalogo"));
  }, []);

  const previous = () =>
    setCurrent((value) => (value === 0 ? pages.length - 1 : value - 1));
  const next = () =>
    setCurrent((value) => (value === pages.length - 1 ? 0 : value + 1));

  if (!target) return null;

  return createPortal(
    <div className={styles.mount}>
      <div className={styles.fullCatalog}>
        <div className={styles.catalogViewer}>
          <button className={`${styles.catalogArrow} ${styles.catalogArrowLeft}`} type="button" onClick={previous} aria-label="Página anterior del catálogo"><ArrowLeft size={20} /></button>
          <button className={styles.catalogImageButton} type="button" onClick={() => setExpanded(true)} aria-label={`Ampliar página ${current + 1} del catálogo`}>
            <img className={styles.catalogPageImage} src={`/fela/catalog/${pages[current]}.png`} alt={`Catálogo FELA TOURS — página ${current + 1} de ${pages.length}`} />
            <span className={styles.catalogZoomHint}><Maximize2 size={15} /> Ampliar</span>
          </button>
          <button className={`${styles.catalogArrow} ${styles.catalogArrowRight}`} type="button" onClick={next} aria-label="Página siguiente del catálogo"><ArrowRight size={20} /></button>
        </div>

        <div className={styles.catalogControls}>
          <button type="button" onClick={previous} aria-label="Página anterior"><ArrowLeft size={17} /></button>
          <div className={styles.catalogDots} aria-label="Páginas del catálogo">
            {pages.map((page, index) => (
              <button type="button" key={page} className={index === current ? styles.catalogDotActive : undefined} onClick={() => setCurrent(index)} aria-label={`Ir a página ${page}`} aria-current={index === current ? "page" : undefined} />
            ))}
          </div>
          <span>{current + 1} / {pages.length}</span>
          <button type="button" onClick={next} aria-label="Página siguiente"><ArrowRight size={17} /></button>
        </div>

        <p className={styles.catalogDisclaimer}>Valores, cupos, horarios y condiciones pueden actualizarse. Confirmá siempre la disponibilidad vigente con nuestro equipo antes de reservar.</p>

        <a className={styles.primaryButton} href={whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle size={19} /> Consultar disponibilidad</a>

        {expanded && (
          <div className={styles.catalogLightbox} role="dialog" aria-modal="true">
            <button className={styles.catalogClose} type="button" onClick={() => setExpanded(false)} aria-label="Cerrar catálogo ampliado"><X size={22} /></button>
            <button className={`${styles.catalogArrow} ${styles.catalogArrowLeft}`} type="button" onClick={previous} aria-label="Página anterior"><ArrowLeft size={21} /></button>
            <img src={`/fela/catalog/${pages[current]}.png`} alt={`Catálogo FELA TOURS ampliado — página ${current + 1}`} />
            <button className={`${styles.catalogArrow} ${styles.catalogArrowRight}`} type="button" onClick={next} aria-label="Página siguiente"><ArrowRight size={21} /></button>
          </div>
        )}
      </div>
    </div>,
    target,
  );
}
