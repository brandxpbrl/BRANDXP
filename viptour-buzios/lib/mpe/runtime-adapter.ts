export type MpeRuntimeProbe = {
  connected: boolean;
  mode: "remote-read-only" | "disconnected";
  checked_at: string;
  endpoint: string | null;
  state: unknown | null;
  error: string | null;
};

const STATE_PATH = "/api/state";

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
        error: `Runtime returned HTTP ${response.status}`,
      };
    }

    return {
      connected: true,
      mode: "remote-read-only",
      checked_at: checkedAt,
      endpoint,
      state: await response.json(),
      error: null,
    };
  } catch (error) {
    return {
      connected: false,
      mode: "disconnected",
      checked_at: checkedAt,
      endpoint,
      state: null,
      error: error instanceof Error ? error.message : "Unknown runtime connection error",
    };
  }
}
