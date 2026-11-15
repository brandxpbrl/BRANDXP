import "server-only";
import domain from "./domain";
import { bridge } from "./bridge";
import { CrmError } from "./access";
import type { Member } from "./domain";

export async function searchPlaces(
  actor: Member,
  region: unknown,
  category: unknown,
) {
  if (
    typeof region !== "string" ||
    !domain.regions.includes(region) ||
    typeof category !== "string" ||
    !domain.categories.includes(category)
  )
    throw new CrmError("Choose an NZ region and category");
  const key = process.env.CRM_NZ_PLACES_API_KEY;
  if (!key) throw new CrmError("Places is not configured", 503);
  // Shared daily quota is reserved under Apps Script LockService before billing.
  await bridge(actor, "reserveSearch");
  const response = await fetch(
    "https://places.googleapis.com/v1/places:searchText",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask":
          "places.id,places.displayName,places.formattedAddress,places.googleMapsUri,places.attributions,places.addressComponents",
      },
      body: JSON.stringify({
        textQuery: `${category.replace(/_/g, " ")} in ${region}, New Zealand`,
        regionCode: "NZ",
        languageCode: "en",
        pageSize: 20,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(12000),
    },
  );
  if (!response.ok) throw new CrmError("Places service unavailable", 502);
  const result = await response.json();
  const places = (result.places || []).filter(
    (p: { addressComponents?: { types?: string[]; shortText?: string }[] }) =>
      p.addressComponents?.some(
        (c) => c.types?.includes("country") && c.shortText === "NZ",
      ),
  );
  return {
    places: places.map(
      ({
        id,
        displayName,
        formattedAddress,
        googleMapsUri,
        attributions,
      }: Record<string, unknown>) => ({
        id,
        displayName,
        formattedAddress,
        googleMapsUri,
        attributions,
      }),
    ),
    attribution: "Google Maps",
  };
}
