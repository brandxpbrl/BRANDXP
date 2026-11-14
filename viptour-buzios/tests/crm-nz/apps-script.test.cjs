const test = require("node:test");
const assert = require("node:assert/strict");
const vm = require("node:vm");
const fs = require("node:fs");
const crypto = require("node:crypto");
const path = require("node:path");
const root = path.resolve(__dirname, "../..");
const secret = "synthetic-secret-used-only-for-tests-000";
const admin = { email: "admin@example.test", role: "admin" },
  ben = { email: "ben@example.test", role: "ben" },
  cassia = { email: "cassia@example.test", role: "cassia" };
function harness() {
  const rows = [["id", "at", "type", "actor", "event_json"]];
  const cache = new Map();
  let locked = false,
    openIds = [];
  const props = new Map(
    Object.entries({
      CRM_NZ_SHEET_ID: "synthetic-nz",
      CRM_NZ_REFERENCE_SHEET_ID: "synthetic-original",
      CRM_NZ_BRIDGE_SECRET: secret,
      CRM_NZ_READY: "true",
      CRM_NZ_USERS_JSON: JSON.stringify([admin, ben, cassia]),
    }),
  );
  const tab = {
    getLastRow: () => rows.length,
    getRange: (r, c, h, w) => ({
      getValues: () =>
        rows.slice(r - 1, r - 1 + h).map((row) => row.slice(c - 1, c - 1 + w)),
    }),
    appendRow: (row) => {
      assert.equal(locked, true);
      rows.push(row);
    },
  };
  const ctx = {
    console,
    PropertiesService: {
      getScriptProperties: () => ({
        getProperty: (key) => props.get(key),
        setProperty: (k, v) => props.set(k, v),
      }),
    },
    ContentService: {
      MimeType: { JSON: "json" },
      createTextOutput: (value) => ({ setMimeType: () => value }),
    },
    SpreadsheetApp: {
      openById: (id) => {
        openIds.push(id);
        return { getSheetByName: () => tab };
      },
      flush() {},
    },
    CacheService: {
      getScriptCache: () => ({
        get: (k) => cache.get(k),
        put: (k, v) => cache.set(k, v),
      }),
    },
    LockService: {
      getScriptLock: () => ({
        tryLock: () => {
          locked = true;
          return true;
        },
        hasLock: () => locked,
        releaseLock: () => {
          locked = false;
        },
      }),
    },
    Utilities: {
      getUuid: () => crypto.randomUUID(),
      base64Encode: (data) => Buffer.from(data).toString("base64"),
      computeHmacSha256Signature: (body, key) =>
        crypto.createHmac("sha256", key).update(body).digest(),
      DigestAlgorithm: { SHA_256: "sha256" },
      computeDigest: (_, body) =>
        crypto.createHash("sha256").update(body).digest(),
    },
  };
  vm.createContext(ctx);
  vm.runInContext(
    fs.readFileSync(path.join(root, "lib/crm-nz/domain.js"), "utf8"),
    ctx,
  );
  vm.runInContext(
    fs.readFileSync(path.join(root, "integrations/crm-nz/Code.gs"), "utf8"),
    ctx,
  );
  function packet(actor, action, payload = {}, extra = {}) {
    const body = JSON.stringify({
      actor,
      action,
      payload,
      sheetId: "synthetic-nz",
      timestamp: Date.now(),
      nonce: crypto.randomUUID(),
      ...extra,
    });
    return {
      body,
      signature: crypto
        .createHmac("sha256", secret)
        .update(body)
        .digest("base64"),
    };
  }
  function send(packet) {
    const result = JSON.parse(
      ctx.doPost({ postData: { contents: JSON.stringify(packet) } }),
    );
    assert.equal(locked, false);
    return result;
  }
  return {
    rows,
    props,
    packet,
    send,
    openIds,
    call: (actor, action, payload, extra) =>
      send(packet(actor, action, payload, extra)),
  };
}
const lead = {
  businessName: "Synthetic only",
  placeId: "synthetic-id",
  website: "https://example.test",
  contactEmail: "",
  phone: "",
  sourceUrl: "https://example.test",
  sourceVerifiedAt: "2026-01-01T00:00:00Z",
  region: "Auckland",
  category: "cafe",
  owner: "ben",
  stage: "new",
  evidence: [],
};
test("HMAC rejects altered bodies, expired requests, unauthorized roles and the original target before any Sheet read", () => {
  const h = harness();
  const p = h.packet(admin, "snapshot");
  p.body += " ";
  assert.equal(h.send(p).status, 401);
  assert.equal(h.call(admin, "snapshot", {}, { timestamp: 1 }).status, 401);
  assert.equal(h.call({ ...ben, role: "admin" }, "snapshot").status, 403);
  assert.equal(
    h.call(admin, "snapshot", {}, { sheetId: "synthetic-original" }).status,
    403,
  );
  assert.equal(h.openIds.length, 0);
  h.props.set("CRM_NZ_REFERENCE_SHEET_ID", "synthetic-nz");
  assert.equal(h.call(admin, "snapshot").status, 403);
  assert.equal(h.openIds.length, 0);
});
test("full signed lead → assignment → contact → proposal → revenue flow; duplicate retries commit once", () => {
  const h = harness();
  const command = { type: "createLead", data: lead },
    requestId = crypto.randomUUID();
  const saved = h.call(admin, "command", { command, requestId });
  assert.equal(saved.ok, true);
  const id = saved.data.leads[0].id;
  assert.equal(h.call(admin, "command", { command, requestId }).ok, true);
  assert.equal(h.rows.length, 2);
  assert.equal(
    h.call(admin, "command", {
      command: { ...command, data: { ...lead, businessName: "Changed" } },
      requestId,
    }).status,
    409,
  );
  assert.equal(h.call(cassia, "snapshot").data.leads.length, 0);
  assert.equal(
    h.call(ben, "command", {
      requestId: crypto.randomUUID(),
      command: {
        type: "addActivity",
        leadId: id,
        data: {
          kind: "contact",
          note: '=IMPORTXML("https://example.test")',
          occurredAt: "2026-01-01T00:00:00Z",
        },
      },
    }).ok,
    true,
  );
  const updated = h.call(ben, "command", {
    requestId: crypto.randomUUID(),
    command: {
      type: "updateLead",
      leadId: id,
      revision: 1,
      data: { ...lead, stage: "proposal", proposalCents: 10000 },
    },
  });
  assert.equal(updated.data.leads[0].stage, "proposal");
  const txId = crypto.randomUUID();
  const tx = {
    type: "recordTransaction",
    data: {
      kind: "revenue",
      amountCents: 10000,
      note: "Synthetic",
      occurredAt: "2026-01-01T00:00:00Z",
    },
  };
  assert.equal(
    h.call(admin, "command", { requestId: txId, command: tx }).data.finance
      .founderShare,
    5500,
  );
  assert.equal(
    h.call(admin, "command", { requestId: txId, command: tx }).data.transactions
      .length,
    1,
  );
  assert.equal(h.call(ben, "snapshot").data.finance, null);
  assert.deepEqual(h.call(ben, "snapshot").data.transactions, []);
  assert.ok(h.rows.slice(1).every((row) => row[4].startsWith("{")));
  assert.ok(h.openIds.every((id) => id === "synthetic-nz"));
});
test("replay prevention, shared quotas and schema mismatch reject writes", () => {
  const h = harness(),
    packet = h.packet(ben, "snapshot");
  assert.equal(h.send(packet).ok, true);
  assert.equal(h.send(packet).status, 409);
  for (let i = 0; i < 30; i++)
    assert.equal(h.call(ben, "reserveSearch").ok, true);
  assert.equal(h.call(ben, "reserveSearch").status, 429);
  assert.equal(h.call(cassia, "reserveSearch").ok, true);
  h.rows[0][0] = "wrong";
  assert.equal(h.call(admin, "snapshot").status, 503);
});
module.exports = { harness, admin, ben, cassia, lead };
