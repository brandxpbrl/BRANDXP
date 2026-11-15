import "server-only";
import { createHmac, randomUUID } from "node:crypto";
import type { Member, Snapshot } from "./domain";
import { CrmError } from "./access";

export async function bridge<T = Snapshot>(
  actor: Member,
  action: string,
  payload: unknown = {},
): Promise<T> {
  const endpoint = process.env.CRM_NZ_APPS_SCRIPT_URL;
  const secret = process.env.CRM_NZ_BRIDGE_SECRET;
  const sheetId = process.env.CRM_NZ_SHEET_ID;
  const sourceId = process.env.CRM_NZ_REFERENCE_SHEET_ID;
  if (
    !endpoint ||
    !/^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(
      endpoint,
    ) ||
    !sheetId ||
    !sourceId ||
    sheetId === sourceId ||
    (secret?.length ?? 0) < 32
  )
    throw new CrmError("NZ Sheets connection is not configured", 503);
  const body = JSON.stringify({
    timestamp: Date.now(),
    nonce: randomUUID(),
    sheetId,
    actor,
    action,
    payload,
  });
  const signature = createHmac("sha256", secret!).update(body).digest("base64");
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body, signature }),
      cache: "no-store",
      signal: AbortSignal.timeout(20000),
      redirect: "follow",
    });
    if (!response.ok) throw new CrmError("Sheets service unavailable", 502);
    const result = await response.json();
    if (!result.ok)
      throw new CrmError(
        result.error || "Sheets operation failed",
        result.status || 502,
      );
    return result.data as T;
  } catch (error) {
    if (error instanceof CrmError) throw error;
    throw new CrmError("NZ Sheets service unavailable", 502);
  }
}
