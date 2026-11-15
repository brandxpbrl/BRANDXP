import { endpoint } from "@/lib/crm-nz/http";
import { readBody } from "@/lib/crm-nz/access";
import { searchPlaces } from "@/lib/crm-nz/places";
export const runtime = "nodejs";
export function POST(request: Request) {
  return endpoint(request, async (actor) => {
    const body = await readBody(request);
    return searchPlaces(actor, body.region, body.category);
  });
}
