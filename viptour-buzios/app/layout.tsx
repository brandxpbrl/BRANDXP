import type { Metadata } from "next";
import "./globals.css";
import "./web-fonts.css";
import "./zapt.css";
import { portalConfig } from "@/config/portal";
import { ConditionalNavbar } from "@/components/layout/ConditionalNavbar";
import SelfObserverIdentity from "@/components/system/SelfObserverIdentity";
import { MaxPublicObserver } from "@/components/max/MaxPublicObserver";

export const metadata: Metadata = {
  metadataBase: new URL(portalConfig.url),
  title: {
    default: "ORBIS — Everything, Connected.",
    template: `%s | ${portalConfig.shortName}`,
  },
  description: "Un ecosistema conectado de marcas, servicios y experiencias independientes en un mismo lugar.",
  keywords: ["ORBIS", "Brand Experience", "MPE", "QUBIT", "ecosistema digital", "portal oficial"],
  authors: [{ name: portalConfig.name, url: portalConfig.url }],
  creator: portalConfig.name,
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: portalConfig.url,
    title: "ORBIS — Everything, Connected.",
    description: "Un ecosistema conectado de marcas, servicios y experiencias independientes en un mismo lugar.",
    siteName: "ORBIS",
    images: [
      {
        url: "/images/orbis/ecosystem/technology.png",
        width: 1200,
        height: 630,
        alt: "ORBIS — Everything, Connected.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ORBIS — Everything, Connected.",
    description: "Un ecosistema conectado de marcas, servicios y experiencias independientes en un mismo lugar.",
    images: ["/images/orbis/ecosystem/technology.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  alternates: { canonical: "/" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Manrope:wght@400;500;600;700&family=Michroma&family=Montserrat:wght@400;600;700;800&family=Playfair+Display:wght@400;500;600;700&display=swap"
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <ConditionalNavbar />
        {children}
        <SelfObserverIdentity />
        <MaxPublicObserver />
      </body>
    </html>
  );
}
