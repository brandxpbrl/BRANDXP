import { NextResponse } from "next/server";
import { probeMpeMind } from "@/lib/mpe/mind-adapter";

export const dynamic = "force-dynamic";

export async function GET() {
  const probe = await probeMpeMind();
  return NextResponse.json(probe, { status: probe.connected ? 200 : 503 });
}
