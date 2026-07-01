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

export default function Home() {
  return (
    <main>
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
