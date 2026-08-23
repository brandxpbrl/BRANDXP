import type { Metadata } from "next";
import { Michroma, Montserrat } from "next/font/google";
import "./globals.css";
import "./zapt.css";
import { portalConfig } from "@/config/portal";
import { ConditionalNavbar } from "@/components/layout/ConditionalNavbar";

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
    default: portalConfig.name,
    template: `%s | ${portalConfig.shortName}`,
  },
  description: portalConfig.description,
  keywords: ["Brand Experience", "MPE", "QUBIT", "ecosistema digital", "portal oficial"],
  authors: [{ name: portalConfig.name, url: portalConfig.url }],
  creator: portalConfig.name,
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: portalConfig.url,
    title: portalConfig.name,
    description: portalConfig.description,
    siteName: portalConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: portalConfig.name,
    description: portalConfig.description,
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
      </body>
    </html>
  );
}
