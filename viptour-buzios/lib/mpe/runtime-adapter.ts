import { normalizeRuntimeState, type NormalizedRuntimeState } from "./runtime-normalizer";

export type MpeRuntimeProbe = {
  connected: boolean;
  mode: "remote-read-only" | "disconnected";
  checked_at: string;
  endpoint: string | null;
  state: unknown | null;
  normalized: NormalizedRuntimeState;
  error: string | null;
};

const STATE_PATH = "/api/state";
const EMPTY = normalizeRuntimeState(null);

export async function probeMpeRuntime(): Promise<MpeRuntimeProbe> {
  const baseUrl = process.env.MPE_RUNTIME_BASE_URL?.replace(/\/$/, "") || "";
  const checkedAt = new Date().toISOString();

  if (!baseUrl) {
    return {
      connected: false,
      mode: "disconnected",
      checked_at: checkedAt,
      endpoint: null,
      state: null,
      normalized: EMPTY,
      error: "MPE_RUNTIME_BASE_URL is not configured",
    };
  }

  const endpoint = `${baseUrl}${STATE_PATH}`;

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      cache: "no-store",
      signal: AbortSignal.timeout(2500),
      headers: { accept: "application/json" },
    });

    if (!response.ok) {
      return {
        connected: false,
        mode: "disconnected",
        checked_at: checkedAt,
        endpoint,
        state: null,
        normalized: EMPTY,
        error: `Runtime returned HTTP ${response.status}`,
      };
    }

    const state = await response.json();
    return {
      connected: true,
      mode: "remote-read-only",
      checked_at: checkedAt,
      endpoint,
      state,
      normalized: normalizeRuntimeState(state),
      error: null,
    };
  } catch (error) {
    return {
      connected: false,
      mode: "disconnected",
      checked_at: checkedAt,
      endpoint,
      state: null,
      normalized: EMPTY,
      error: error instanceof Error ? error.message : "Unknown runtime connection error",
    };
  }
}
