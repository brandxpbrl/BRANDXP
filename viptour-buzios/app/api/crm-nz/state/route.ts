import { bridge } from "@/lib/crm-nz/bridge";
import { endpoint } from "@/lib/crm-nz/http";
import { readBody, CrmError } from "@/lib/crm-nz/access";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export function GET(request: Request) {
  return endpoint(request, (actor) => bridge(actor, "snapshot"));
}
export function POST(request: Request) {
  return endpoint(request, async (actor) => {
    const body = await readBody(request);
    if (!/^[0-9a-f-]{36}$/i.test(body.requestId || ""))
      throw new CrmError("Invalid operation identifier");
    return bridge(actor, "command", body);
  });
}
