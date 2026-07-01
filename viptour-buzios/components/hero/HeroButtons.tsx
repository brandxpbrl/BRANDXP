import { siteConfig } from "@/config/site";

export default function HeroButtons() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mt-8">

      <a
        href={siteConfig.links.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="px-8 py-4 rounded-full bg-yellow-400 text-black font-bold"
      >
        Reservar pelo WhatsApp
      </a>

      <a
        href="#passeios"
        className="px-8 py-4 rounded-full border border-white text-white"
      >
        Ver Passeios
      </a>

    </div>
  );
}
