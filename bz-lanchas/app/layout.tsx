import type { Metadata } from "next";
import "./globals.css";

const title = "BZ Lanchas | Lanchas em Búzios";
const description =
  "Passeios privativos de lancha em Búzios. Consulte disponibilidade e reserve pelo WhatsApp.";
const deploymentHost =
  process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;

export const metadata: Metadata = {
  ...(deploymentHost && { metadataBase: new URL(`https://${deploymentHost}`) }),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "BZ Lanchas",
    title,
    description,
  },
  twitter: { card: "summary", title, description },
  icons: { icon: { url: "/logolancha.jpeg", type: "image/jpeg" } },
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
