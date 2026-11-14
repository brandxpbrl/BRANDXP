import domain from "./domain";
import type { Member } from "./domain";

export const CRM_PATH = "/brandexperience/crm-nz";
export function enabled() {
  return process.env.CRM_NZ_ENABLED === "true";
}
export function configured() {
  let validOrigin = false;
  try {
    const origin = new URL(process.env.CRM_NZ_ORIGIN || "");
    validOrigin =
      process.env.CRM_NZ_ORIGIN === origin.origin &&
      (origin.protocol === "https:" ||
        (origin.protocol === "http:" &&
          ["localhost", "127.0.0.1"].includes(origin.hostname)));
  } catch {
    /* Missing or malformed configuration denies access. */
  }
  return (
    validOrigin &&
    enabled() &&
    !!process.env.CRM_NZ_GOOGLE_CLIENT_ID &&
    !!process.env.CRM_NZ_GOOGLE_CLIENT_SECRET &&
    (process.env.CRM_NZ_AUTH_SECRET?.length ?? 0) >= 32 &&
    domain.members(process.env.CRM_NZ_USERS_JSON).length > 0
  );
}
export class CrmError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}
export function resolveMember(email?: string | null, sub?: string): Member {
  if (!configured()) throw new CrmError("CRM NZ is not configured", 503);
  const member = domain.member(process.env.CRM_NZ_USERS_JSON, email, sub);
  if (!member) throw new CrmError("Access denied", email ? 403 : 401);
  return { ...member, sub };
}
export function checkOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const expected = process.env.CRM_NZ_ORIGIN;
  if (
    !expected ||
    origin !== expected ||
    new URL(request.url).origin !== expected
  )
    throw new CrmError("Invalid request origin", 403);
}
export async function readBody(request: Request) {
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    throw new CrmError("JSON required", 415);
  if (!request.body) throw new CrmError("Missing request body");
  const reader = request.body.getReader();
  let size = 0;
  const parts: Uint8Array[] = [];
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 20000) {
      await reader.cancel();
      throw new CrmError("Request too large", 413);
    }
    parts.push(value);
  }
  try {
    return JSON.parse(Buffer.concat(parts).toString("utf8"));
  } catch {
    throw new CrmError("Invalid JSON");
  }
}
