import type { Metadata } from "next";
import Hero from "@/sections/Hero";
import QuickActions from "@/sections/QuickActions";
import ExperienceHighlights from "@/sections/ExperienceHighlights";
import Services from "@/sections/Services";
import WhyChooseUs from "@/sections/WhyChooseUs";
import GoogleReviews from "@/sections/GoogleReviews";
import ReservationProcess from "@/sections/ReservationProcess";
import Contact from "@/sections/Contact";
import FAQ from "@/sections/FAQ";
import Location from "@/sections/Location";
import Footer from "@/sections/Footer";
import { LocalBusinessSchema } from "@/seo/LocalBusinessSchema";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "VIPTOUR BÚZIOS",
  description: siteConfig.longDescription,
  alternates: { canonical: "/projects/viptour" },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.longDescription,
    url: `${siteConfig.url}/projects/viptour`,
  },
};

export default function ViptourPage() {
  return (
    <main>
      <LocalBusinessSchema />
      <Hero />
      <QuickActions />
      <ExperienceHighlights />
      <Services />
      <WhyChooseUs />
      <GoogleReviews />
      <ReservationProcess />
      <Contact />
      <FAQ />
      <Location />
      <Footer />
    </main>
  );
}
