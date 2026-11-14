import test from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { bridge } from "../../lib/crm-nz/bridge";
import { searchPlaces } from "../../lib/crm-nz/places";
import {
  configured,
  resolveMember,
  checkOrigin,
  readBody,
} from "../../lib/crm-nz/access";
import { encode, decode } from "next-auth/jwt";
const actor = {
  email: "ben@example.test",
  role: "ben" as const,
  sub: "synthetic-sub",
};
test("configuration fails closed; member revocation, subject pinning, CSRF and body limits", async () => {
  process.env.CRM_NZ_ENABLED = "false";
  assert.equal(configured(), false);
  assert.throws(() => resolveMember(actor.email), /configured/);
  Object.assign(process.env, {
    CRM_NZ_ENABLED: "true",
    CRM_NZ_GOOGLE_CLIENT_ID: "synthetic",
    CRM_NZ_GOOGLE_CLIENT_SECRET: "synthetic",
    CRM_NZ_AUTH_SECRET: "test-only-secret-00000000000000000000000",
    CRM_NZ_USERS_JSON: JSON.stringify([actor]),
    CRM_NZ_ORIGIN: "http://localhost:3000",
  });
  assert.equal(resolveMember(actor.email, actor.sub).role, "ben");
  assert.throws(() => resolveMember(actor.email, "wrong"), /denied/);
  assert.throws(() => resolveMember("unknown@example.test"), /denied/);
  assert.throws(
    () =>
      checkOrigin(
        new Request("http://localhost:3000/api/crm-nz/state", {
          method: "POST",
          headers: { origin: "https://evil.test" },
        }),
      ),
    /origin/,
  );
  checkOrigin(
    new Request("http://localhost:3000/api/crm-nz/state", {
      method: "POST",
      headers: { origin: "http://localhost:3000" },
    }),
  );
  await assert.rejects(
    readBody(
      new Request("http://localhost:3000", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: '"' + "x".repeat(20001) + '"',
      }),
    ),
    /large/,
  );
  process.env.CRM_NZ_USERS_JSON = "[]";
  assert.equal(configured(), false);
});
test("Auth.js encrypted sessions reject tampering and expired tokens", async () => {
  const secret = "synthetic-only-00000000000000000000000",
    salt = "crm-nz.session-token";
  const token = await encode({
    secret,
    salt,
    token: { email: actor.email, sub: actor.sub },
    maxAge: 3600,
  });
  assert.equal((await decode({ secret, salt, token }))?.sub, actor.sub);
  await assert.rejects(
    decode({ secret, salt, token: token.slice(0, -8) + "tampered" }),
  );
  const expired = await encode({
    secret,
    salt,
    token: { email: actor.email },
    maxAge: -3600,
  });
  await assert.rejects(decode({ secret, salt, token: expired }));
});
test("backend signs requests, sends no key to clients, validates independent targets, and filters Places to NZ", async () => {
  Object.assign(process.env, {
    CRM_NZ_SHEET_ID: "synthetic-nz",
    CRM_NZ_REFERENCE_SHEET_ID: "synthetic-original",
    CRM_NZ_APPS_SCRIPT_URL: "https://script.google.com/macros/s/synthetic/exec",
    CRM_NZ_BRIDGE_SECRET: "synthetic-only-0000000000000000000000",
    CRM_NZ_PLACES_API_KEY: "synthetic-place-key",
  });
  const previousFetch = globalThis.fetch;
  const calls: { url: string; init?: RequestInit }[] = [];
  globalThis.fetch = async (url, init) => {
    calls.push({ url: String(url), init });
    assert.equal(init?.cache, "no-store");
    if (String(url).includes("script.google.com")) {
      const packet = JSON.parse(String(init?.body));
      assert.equal(
        packet.signature,
        createHmac("sha256", process.env.CRM_NZ_BRIDGE_SECRET!)
          .update(packet.body)
          .digest("base64"),
      );
      return Response.json({ ok: true, data: { reserved: true } });
    }
    return Response.json({
      places: [
        {
          id: "nz",
          displayName: { text: "Synthetic NZ" },
          addressComponents: [{ types: ["country"], shortText: "NZ" }],
        },
        {
          id: "au",
          addressComponents: [{ types: ["country"], shortText: "AU" }],
        },
        { id: "unknown" },
      ],
    });
  };
  try {
    const result = await searchPlaces(actor, "Auckland", "cafe");
    assert.equal(result.places.length, 1);
    assert.equal(result.places[0].id, "nz");
    assert.equal(result.places[0].addressComponents, undefined);
    assert.equal(calls.length, 2);
    assert.equal(
      JSON.parse(JSON.parse(String(calls[0].init?.body)).body).action,
      "reserveSearch",
    );
    assert.ok(!JSON.stringify(result).includes("synthetic-place-key"));
    await assert.rejects(searchPlaces(actor, "Sydney", "cafe"), /NZ region/);
    process.env.CRM_NZ_SHEET_ID = "synthetic-original";
    await assert.rejects(bridge(actor, "snapshot"), /configured/);
  } finally {
    globalThis.fetch = previousFetch;
  }
});
