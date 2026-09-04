import type { Metadata } from "next";
import { Michroma, Montserrat } from "next/font/google";
import "./globals.css";
import "./zapt.css";
import { portalConfig } from "@/config/portal";
import { ConditionalNavbar } from "@/components/layout/ConditionalNavbar";
import SelfObserverIdentity from "@/components/system/SelfObserverIdentity";
import SelfObserverMind from "@/components/system/SelfObserverMind";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

const orbisDisplay = Michroma({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-orbis",
  display: "swap",
});

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
    <html lang="es" className={`${montserrat.variable} ${orbisDisplay.variable} scroll-smooth`}>
      <body className="antialiased min-h-screen flex flex-col">
        <ConditionalNavbar />
        {children}
        <SelfObserverMind />
        <SelfObserverIdentity />
      </body>
    </html>
  );
}
