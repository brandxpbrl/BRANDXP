export type MpeSourceProbe = {
  connected: boolean;
  mode: "remote-read-only" | "disconnected";
  checked_at: string;
  endpoint: string | null;
  state: unknown | null;
  error: string | null;
};

export async function probeMpeSource(endpoint: string | undefined): Promise<MpeSourceProbe> {
  const checkedAt = new Date().toISOString();
  const resolved = endpoint?.trim() || "";

  if (!resolved) {
    return {
      connected: false,
      mode: "disconnected",
      checked_at: checkedAt,
      endpoint: null,
      state: null,
      error: "Source endpoint is not configured",
    };
  }

  try {
    const response = await fetch(resolved, {
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
        endpoint: resolved,
        state: null,
        error: `Source returned HTTP ${response.status}`,
      };
    }

    return {
      connected: true,
      mode: "remote-read-only",
      checked_at: checkedAt,
      endpoint: resolved,
      state: await response.json(),
      error: null,
    };
  } catch (error) {
    return {
      connected: false,
      mode: "disconnected",
      checked_at: checkedAt,
      endpoint: resolved,
      state: null,
      error: error instanceof Error ? error.message : "Unknown source connection error",
    };
  }
}
