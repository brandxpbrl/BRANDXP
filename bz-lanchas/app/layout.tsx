import type { Metadata } from "next";
import "./globals.css";

const title = "BZ Lanchas | Passeios de Lancha em Búzios";
const description =
  "Viva Búzios pelo mar. Experiências privativas a bordo da FÊNIX 27.5 — Gratidão.";
const socialImage = "https://www.bzlanchas.com/IMG-20261017-WA0134.jpg";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.bzlanchas.com"),
  title,
  description,
  keywords: ["BZ Lanchas", "FÊNIX 27.5", "Gratidão", "Passeio privativo de lancha em Búzios", "Armação dos Búzios", "RJ"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://www.bzlanchas.com/",
    siteName: "BZ Lanchas",
    title,
    description,
    images: [{ url: socialImage, alt: "FÊNIX 27.5 Gratidão — BZ Lanchas em Búzios" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [socialImage],
  },
  icons: { icon: { url: "/bz-lanchas-logo.png", type: "image/png" } },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
