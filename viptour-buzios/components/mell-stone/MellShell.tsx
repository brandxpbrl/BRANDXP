import type { ReactNode } from "react";
import Link from "next/link";
import { mellStoneBrand } from "@/config/mell-stone.content";

const navItems = [
  { label: "Shop", href: "/mell-stone/shop" },
  { label: "Coleções", href: "/mell-stone/collections" },
  { label: "Materiais", href: "/mell-stone/materials" },
  { label: "Sobre", href: "/mell-stone/about" },
  { label: "Contato", href: "/mell-stone/contact" },
];

export function MellShell({ children }: { children: ReactNode }) {
  return (
    <div className="mell-surface">
      <header className="mell-header">
        <div className="mell-header-inner">
          <Link className="mell-brand" href="/mell-stone" aria-label="Mell & Stone home">
            <span>MELL & STONE</span>
            <small>Handcrafted natural jewelry</small>
          </Link>

          <nav className="mell-nav" aria-label="Navegação Mell & Stone">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mell-header-actions">
            <Link className="mell-platform-link" href="/">
              ORBit
            </Link>
            <Link className="mell-cart-link" href="/mell-stone/cart">
              Carrinho
            </Link>
            <a className="mell-button mell-button-dark" href={mellStoneBrand.whatsapp}>
              Consultar
            </a>
          </div>
        </div>
      </header>

      {children}

      <footer className="mell-footer">
        <div>
          <Link className="mell-brand mell-brand-footer" href="/mell-stone">
            <span>MELL & STONE</span>
            <small>{mellStoneBrand.tagline}</small>
          </Link>
          <p>{mellStoneBrand.manifesto}</p>
        </div>
        <div className="mell-footer-grid">
          <div>
            <strong>Universo</strong>
            <Link href="/mell-stone/collections">Coleções</Link>
            <Link href="/mell-stone/materials">Materiais</Link>
            <Link href="/mell-stone/about">Sobre</Link>
          </div>
          <div>
            <strong>Atendimento</strong>
            <Link href="/mell-stone/shop">Shop</Link>
            <Link href="/mell-stone/contact">Contato</Link>
            <a href={mellStoneBrand.whatsapp}>WhatsApp</a>
          </div>
          <div>
            <strong>Plataforma</strong>
            <Link href="/">Voltar para ORBit</Link>
            <Link href="/fragma-brand-experience">Fragma</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
