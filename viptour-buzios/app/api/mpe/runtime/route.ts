import { NextResponse } from "next/server";
import { probeMpeRuntime } from "@/lib/mpe/runtime-adapter";

export const dynamic = "force-dynamic";

export async function GET() {
  const probe = await probeMpeRuntime();
  return NextResponse.json(probe, { status: probe.connected ? 200 : 503 });
}
