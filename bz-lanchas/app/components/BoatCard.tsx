"use client";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import type { Boat } from "../boats";
import { WHATSAPP } from "../content";

export function BoatCard({ boat }: { boat: Boat }) {
  const [index, setIndex] = useState(0);
  const photo = boat.photos[index];
  const move = (delta: number) => setIndex((index + delta + boat.photos.length) % boat.photos.length);
  return <article className="fleet-card">
    <div className="fleet-photo">
      <Image src={photo} alt={boat.title} fill sizes="(max-width: 800px) 100vw, 48vw" quality={88} />
      {boat.photos.length > 1 && <>
        <button className="gallery-arrow gallery-prev" onClick={() => move(-1)} aria-label="Foto anterior"><ChevronLeft /></button>
        <button className="gallery-arrow gallery-next" onClick={() => move(1)} aria-label="Próxima foto"><ChevronRight /></button>
        <span className="photo-count">{index + 1}/{boat.photos.length}</span>
      </>}
    </div>
    <div className="fleet-info">
      <div><h3>{boat.title}</h3><p>{boat.description}</p><div className="fleet-tags">{boat.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div>
      <div className="fleet-bottom">
        <div className="fleet-price"><small>{boat.price.startsWith("R$") ? "Valor" : ""}</small><strong>{boat.price}</strong></div>
        <div className="fleet-actions"><Link className="fleet-secondary" href={`/lanchas/${boat.slug}`}>CONHEÇA NOSSA LANCHA</Link><a className="button button-turquoise" href={WHATSAPP}>INFORMAÇÕES &amp; RESERVAS <ArrowUpRight aria-hidden="true" /></a></div>
      </div>
    </div>
  </article>;
}
