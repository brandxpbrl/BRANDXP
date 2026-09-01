import { NextResponse } from "next/server";
import { probeMpeSource } from "@/lib/mpe/source-probe";

export const dynamic = "force-dynamic";

export async function GET() {
  const probe = await probeMpeSource(process.env.MPE_EVOLUTION_STATE_URL);
  return NextResponse.json(probe, { status: probe.connected ? 200 : 503 });
}
