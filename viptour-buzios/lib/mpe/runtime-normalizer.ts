export type NormalizedRuntimeEvent = {
  id: string;
  timestamp: string | null;
  type: string;
  source: string;
  subject: string | null;
  raw: unknown;
};

export type NormalizedRuntimeArtifact = {
  id: string;
  name: string;
  type: string;
  producer: string | null;
  source_ref: string | null;
  path: string | null;
  raw: unknown;
};

export type NormalizedRuntimeState = {
  services: unknown[];
  events: NormalizedRuntimeEvent[];
  artifacts: NormalizedRuntimeArtifact[];
};

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

function arrayFrom(record: Record<string, unknown>, keys: string[]): unknown[] {
  for (const key of keys) {
    if (Array.isArray(record[key])) return record[key] as unknown[];
  }
  return [];
}

function text(record: Record<string, unknown> | null, keys: string[]): string | null {
  if (!record) return null;
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value;
    if (typeof value === "number") return String(value);
  }
  return null;
}

export function normalizeRuntimeState(state: unknown): NormalizedRuntimeState {
  const root = asRecord(state);
  if (!root) return { services: [], events: [], artifacts: [] };

  const services = arrayFrom(root, ["services", "service_health", "nodes"]);
  const rawEvents = arrayFrom(root, ["events", "recent_events", "kernel_events", "earth_events"]);
  const rawArtifacts = arrayFrom(root, ["artifacts", "recent_artifacts", "outputs"]);

  const events = rawEvents.map((raw, index) => {
    const record = asRecord(raw);
    return {
      id: text(record, ["id", "event_id", "lineage_id"]) || `runtime-event-${index}`,
      timestamp: text(record, ["timestamp", "time", "created_at", "ts"]),
      type: text(record, ["event_type", "type", "kind", "label"]) || "UNKNOWN_EVENT",
      source: text(record, ["source_organ", "source_service", "source", "node_id", "producer"]) || "runtime",
      subject: text(record, ["subject_id", "subject", "entity_id", "artifact_id"]),
      raw,
    };
  });

  const artifacts = rawArtifacts.map((raw, index) => {
    const record = asRecord(raw);
    return {
      id: text(record, ["artifact_id", "id", "lineage_id"]) || `runtime-artifact-${index}`,
      name: text(record, ["artifact_name", "name", "filename", "path"]) || `artifact-${index}`,
      type: text(record, ["type", "artifact_type", "format"]) || "UNKNOWN_ARTIFACT",
      producer: text(record, ["producer", "linked_service", "source_service", "service"]),
      source_ref: text(record, ["source_event_ref", "source_ref", "event_id", "derived_from", "lineage_ref"]),
      path: text(record, ["path", "uri", "source_path", "file"]),
      raw,
    };
  });

  return { services, events, artifacts };
}
