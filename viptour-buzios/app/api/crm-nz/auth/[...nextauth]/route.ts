import type { NextRequest } from "next/server";
import { handlers } from "@/lib/crm-nz/auth";
import { configured } from "@/lib/crm-nz/access";
import { privateHeaders } from "@/lib/crm-nz/http";
export const runtime = "nodejs";
function unavailable() {
  return Response.json(
    { error: "CRM NZ is not configured" },
    { status: 503, headers: privateHeaders },
  );
}
function validHost(request: NextRequest) {
  return new URL(request.url).origin === process.env.CRM_NZ_ORIGIN;
}
export function GET(request: NextRequest) {
  return configured() && validHost(request)
    ? handlers.GET(request)
    : unavailable();
}
export function POST(request: NextRequest) {
  return configured() && validHost(request)
    ? handlers.POST(request)
    : unavailable();
}
