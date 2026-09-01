export type MpeMindProbe = {
  connected: boolean;
  mode: "remote-read-only" | "disconnected";
  checked_at: string;
  endpoint: string | null;
  snapshot: unknown | null;
  error: string | null;
};

export async function probeMpeMind(): Promise<MpeMindProbe> {
  const endpoint = process.env.MPE_MIND_STATE_URL?.trim() || "";
  const checkedAt = new Date().toISOString();

  if (!endpoint) {
    return {
      connected: false,
      mode: "disconnected",
      checked_at: checkedAt,
      endpoint: null,
      snapshot: null,
      error: "MPE_MIND_STATE_URL is not configured",
    };
  }

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
        snapshot: null,
        error: `MPE Mind endpoint returned HTTP ${response.status}`,
      };
    }

    return {
      connected: true,
      mode: "remote-read-only",
      checked_at: checkedAt,
      endpoint,
      snapshot: await response.json(),
      error: null,
    };
  } catch (error) {
    return {
      connected: false,
      mode: "disconnected",
      checked_at: checkedAt,
      endpoint,
      snapshot: null,
      error: error instanceof Error ? error.message : "Unknown MPE Mind connection error",
    };
  }
}
