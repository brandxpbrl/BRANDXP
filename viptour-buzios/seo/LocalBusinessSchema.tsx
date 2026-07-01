import { siteConfig } from "@/config/site";

export function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: siteConfig.name,
    image: siteConfig.ogImage,
    "@id": siteConfig.url,
    url: siteConfig.url,
    telephone: siteConfig.contacts.phoneE164,
    email: siteConfig.contacts.email,
    description: siteConfig.longDescription,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Rua Luiz Joaquim Pereira 192 - Centro",
      addressLocality: "Armação dos Búzios",
      addressRegion: "RJ",
      addressCountry: "BR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -22.7538,
      longitude: -41.8808,
    },
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Monday", opens: "09:00", closes: "21:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Tuesday", opens: "00:00", closes: "00:00", description: "Cerrada" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Wednesday", opens: "09:00", closes: "22:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Thursday", opens: "09:00", closes: "22:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Friday", opens: "09:00", closes: "22:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "09:00", closes: "22:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Sunday", opens: "00:00", closes: "23:59" },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
