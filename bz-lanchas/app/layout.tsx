import type { Metadata } from "next";
import "./globals.css";

const title = "BZ Lanchas | Passeio Privativo de Lancha em Búzios";
const description =
  "Passeio privativo de lancha em Armação dos Búzios / RJ a bordo da FÊNIX 27.5, Gratidão. Lancha cabinada para até 10 pessoas. Consulte disponibilidade.";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["BZ Lanchas", "FÊNIX 27.5", "Gratidão", "Passeio privativo de lancha em Búzios", "Armação dos Búzios", "RJ"],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "BZ Lanchas",
    title,
    description,
  },
  twitter: { card: "summary", title, description },
  icons: { icon: { url: "/bz-lanchas-logo-oficial.png", type: "image/png" } },
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
