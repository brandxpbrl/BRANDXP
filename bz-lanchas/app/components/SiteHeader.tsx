"use client";

import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { LOGO, WHATSAPP } from "../content";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !header.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [open]);

  return (
    <header className="site-header shell" ref={header} onKeyDown={(event) => {
      if (event.key === "Escape" && open) { setOpen(false); toggle.current?.focus(); }
    }}>
      <a className="header-logo" href="#inicio" aria-label="BZ Lanchas — início" onClick={() => setOpen(false)}>
        <Image src={LOGO} alt="BZ Lanchas" width={1536} height={1024} unoptimized />
      </a>
      <button ref={toggle} className="menu-toggle" type="button" aria-label={open ? "Fechar menu" : "Abrir menu"} aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(!open)}>
        {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>
      <nav id="main-navigation" className={`main-navigation${open ? " is-open" : ""}`} aria-label="Navegação principal" onClick={(event) => { if ((event.target as HTMLElement).closest("a")) setOpen(false); }}>
        <a href="#inicio">INÍCIO</a>
        <a href="#lancha">NOSSA LANCHA</a>
        <a href="#reserva">RESERVAS</a>
        <a href="/trabalhe-conosco">TRABALHE CONOSCO</a>
        <a className="header-whatsapp" href={WHATSAPP} aria-label="Fale com a BZ Lanchas pelo WhatsApp">
          <Image src="/icons/whatsapp.svg" alt="" aria-hidden="true" width={20} height={20} unoptimized /> WhatsApp
        </a>
      </nav>
    </header>
  );
}
