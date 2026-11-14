import "server-only";
import { requireMember } from "./auth";
import { checkOrigin } from "./access";
import type { Member } from "./domain";

export const privateHeaders = {
  "Cache-Control": "private, no-store, max-age=0",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
  Vary: "Cookie",
  "X-Content-Type-Options": "nosniff",
};
export async function endpoint(
  request: Request,
  work: (actor: Member) => Promise<unknown>,
) {
  try {
    const actor = await requireMember();
    if (request.method !== "GET") checkOrigin(request);
    return Response.json(await work(actor), { headers: privateHeaders });
  } catch (error) {
    const e = error as Error & { status?: number };
    const status = e.status || 500;
    return Response.json(
      {
        error:
          status >= 500
            ? "Service unavailable. Check the private configuration."
            : e.message,
      },
      { status, headers: privateHeaders },
    );
  }
}
