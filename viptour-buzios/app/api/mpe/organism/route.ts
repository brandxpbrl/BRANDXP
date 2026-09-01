import { NextResponse } from "next/server";
import { epistemicLegend, organismFlow, organismNodes, organismViews } from "@/app/mpe/mpe-organism.data";

export const dynamic = "force-static";

export function GET() {
  return NextResponse.json({
    organism: "MPE ORGANISM",
    version: "0.1",
    mode: "read-only-integration-spike",
    generated_from: "audited MPE runtime/core/source architecture",
    nodes: organismNodes,
    views: organismViews,
    event_flow: organismFlow,
    epistemic_statuses: epistemicLegend,
    guarantees: {
      production_control: false,
      source_required: true,
      provenance_required: true,
      metric_namespace_required: true,
      evidence_status_required: true,
    },
  });
}
