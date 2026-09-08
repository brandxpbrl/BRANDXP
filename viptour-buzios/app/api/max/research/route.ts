import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const FALLBACK = {
  source: "mpe_probability_statistics",
  provenance: "MPE_MARKET_RESEARCH_STATE_URL no configurado",
  timestamp: new Date(0).toISOString(),
  metric_namespace: "mpe.market_research",
  status: "UNKNOWN",
  validation: "UNVALIDATED",
  availability: "UNAVAILABLE",
  lineage: ["MAX_PUBLIC_OBSERVER", "MCOS_UNAVAILABLE"],
  message: "MCOS_UNAVAILABLE: no hay contexto de investigación conectado.",
};

function responseBody(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store, max-age=0" } });
}

export async function GET() {
  const sourceUrl = process.env.MPE_MARKET_RESEARCH_STATE_URL;
  if (!sourceUrl) return responseBody(FALLBACK, 503);

  let parsedUrl: URL;
  try { parsedUrl = new URL(sourceUrl); } catch { return responseBody({ ...FALLBACK, message: "MPE_MARKET_RESEARCH_STATE_URL inválido." }, 503); }
  if (!["http:", "https:"].includes(parsedUrl.protocol)) return responseBody({ ...FALLBACK, message: "La fuente MPE debe usar HTTP(S)." }, 503);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const upstream = await fetch(parsedUrl, { cache: "no-store", signal: controller.signal, headers: { Accept: "application/json" } });
    if (!upstream.ok) return responseBody({ ...FALLBACK, message: `MPE_UNAVAILABLE: upstream respondió ${upstream.status}.` }, 503);
    const raw = (await upstream.json()) as Record<string, unknown>;
    const availability = raw.availability === "AVAILABLE" ? "AVAILABLE" : "NO_EVIDENCE";
    const lineage = Array.isArray(raw.lineage) ? raw.lineage.filter((item): item is string => typeof item === "string").slice(0, 8) : ["MAX_PUBLIC_OBSERVER", "MPE_MARKET_RESEARCH"];
    return responseBody({
      source: typeof raw.source === "string" ? raw.source : "mpe_probability_statistics",
      provenance: typeof raw.provenance === "string" ? raw.provenance : "MPE read-only projection",
      timestamp: typeof raw.timestamp === "string" ? raw.timestamp : new Date().toISOString(),
      metric_namespace: "mpe.market_research", status: "PROPOSED", validation: "UNVALIDATED", availability, lineage,
      message: availability === "AVAILABLE" ? "Contexto MPE disponible; no constituye evidencia predictiva." : "No hay evidencia MPE utilizable en este momento.",
    });
  } catch { return responseBody({ ...FALLBACK, message: "MPE_UNAVAILABLE: no fue posible consultar la fuente." }, 503); }
  finally { clearTimeout(timeout); }
}
