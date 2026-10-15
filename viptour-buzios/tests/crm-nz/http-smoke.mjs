// Runs only against a disposable local process with synthetic users and secrets.
// No Google credentials, Sheets IDs or commercial data are used.
import { spawn, spawnSync } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import assert from "node:assert/strict";
import { encode } from "next-auth/jwt";
const origin = "http://localhost:3100";
const secret = "synthetic-local-test-secret-00000000000000000";
const child = spawn(
  process.execPath,
  [
    "node_modules/next/dist/bin/next",
    "start",
    "--hostname",
    "127.0.0.1",
    "--port",
    "3100",
  ],
  {
    windowsHide: true,
    stdio: ["ignore", "pipe", "pipe"],
    env: {
      ...process.env,
      CRM_NZ_ENABLED: "true",
      CRM_NZ_AUTH_SECRET: secret,
      CRM_NZ_ORIGIN: origin,
      CRM_NZ_GOOGLE_CLIENT_ID: "synthetic",
      CRM_NZ_GOOGLE_CLIENT_SECRET: "synthetic",
      CRM_NZ_USERS_JSON: JSON.stringify([
        { email: "ben@example.test", role: "ben", sub: "synthetic-ben" },
      ]),
      CRM_NZ_SHEET_ID: "",
      CRM_NZ_APPS_SCRIPT_URL: "",
      CRM_NZ_BRIDGE_SECRET: "",
      CRM_NZ_PLACES_API_KEY: "",
      CRM_NZ_GEMINI_ENABLED: "false",
      CRM_NZ_GEMINI_API_KEY: "",
    },
  },
);
let log = "";
child.stdout.on("data", (data) => {
  log += data;
});
child.stderr.on("data", (data) => {
  log += data;
});
async function token(email, sub) {
  return encode({
    secret,
    salt: "crm-nz.session-token",
    token: { email, sub },
    maxAge: 3600,
  });
}
async function check(path, status, options = {}) {
  const r = await fetch(origin + path, options);
  const body = await r.text();
  assert.equal(r.status, status, `${path}: ${body.slice(0, 300)}`);
  assert.match(r.headers.get("cache-control"), /no-store/);
  return body;
}
try {
  let ready = false;
  for (let i = 0; i < 90; i++) {
    try {
      const r = await fetch(origin + "/api/crm-nz/auth/csrf");
      if (r.ok) {
        ready = true;
        break;
      }
    } catch {}
    await delay(1000);
  }
  assert.ok(ready, log.slice(-2500));
  const login = await check("/brandexperience/crm-nz", 200);
  assert.match(login, /Continuar con Google/);
  assert.ok(!login.includes("ben@example.test"));
  await check("/api/crm-nz/state", 401);
  await check("/api/crm-nz/state", 401, {
    headers: { cookie: "crm-nz.session-token=forged" },
  });
  await check("/api/crm-nz/state", 403, {
    headers: {
      cookie:
        "crm-nz.session-token=" +
        (await token("outsider@example.test", "outsider")),
    },
  });
  await check("/api/crm-nz/state", 403, {
    headers: {
      cookie:
        "crm-nz.session-token=" +
        (await token("ben@example.test", "wrong-subject")),
    },
  });
  const cookie =
    "crm-nz.session-token=" +
    (await token("ben@example.test", "synthetic-ben"));
  // Authorized session reaches the Sheet boundary; deliberately unconfigured.
  await check("/api/crm-nz/state", 503, { headers: { cookie } });
  await check("/api/crm-nz/state", 403, {
    method: "POST",
    headers: {
      cookie,
      origin: "https://evil.test",
      "Content-Type": "application/json",
    },
    body: "{}",
  });
  await check("/api/crm-nz/places", 503, {
    method: "POST",
    headers: { cookie, origin, "Content-Type": "application/json" },
    body: JSON.stringify({ region: "Auckland", category: "cafe" }),
  });
  await check("/api/crm-nz/gemini", 503, {
    method: "POST",
    headers: { cookie, origin, "Content-Type": "application/json" },
    body: "{}",
  });
  console.log(
    "HTTP smoke passed: private page, unauthenticated/forged/unauthorized/pinned identity, valid session boundary, CSRF, disabled integrations.",
  );
} finally {
  if (process.platform === "win32" && child.pid)
    spawnSync("taskkill", ["/PID", String(child.pid), "/T", "/F"], {
      windowsHide: true,
      stdio: "ignore",
    });
  else child.kill();
}
