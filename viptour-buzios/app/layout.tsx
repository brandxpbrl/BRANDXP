import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { portalConfig } from "@/config/portal";
import { Navbar } from "@/components/layout";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"], // Regular, SemiBold, Bold, ExtraBold
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(portalConfig.url),
  title: {
    default: portalConfig.name,
    template: `%s | ${portalConfig.shortName}`,
  },
  description: portalConfig.description,
  keywords: [
    "Brand Experience",
    "MPE",
    "QUBIT",
    "ecosistema digital",
    "portal oficial",
  ],
  authors: [
    {
      name: portalConfig.name,
      url: portalConfig.url,
    },
  ],
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
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${montserrat.variable} scroll-smooth`}>
      <body className="antialiased min-h-screen flex flex-col">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
