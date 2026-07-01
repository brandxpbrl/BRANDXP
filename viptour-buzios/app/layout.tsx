import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { Navbar } from "@/components/layout";
import { LocalBusinessSchema } from "@/seo/LocalBusinessSchema";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"], // Regular, SemiBold, Bold, ExtraBold
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.shortName}`,
  },
  description: siteConfig.longDescription,
  keywords: [
    "Búzios",
    "buggy",
    "excursiones",
    "alquiler de buggy",
    "guías bilingües",
    "WhatsApp",
  ],
  authors: [
    {
      name: "VIPTOUR BÚZIOS",
      url: siteConfig.url,
    },
  ],
  creator: "VIPTOUR BÚZIOS",
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.longDescription,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.longDescription,
    images: [siteConfig.ogImage],
    creator: "@viptourbuzios",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
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
      <head>
        <LocalBusinessSchema />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
