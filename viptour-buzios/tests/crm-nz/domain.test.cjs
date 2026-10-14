const test = require("node:test");
const assert = require("node:assert/strict");
const d = require("../../lib/crm-nz/domain.js");
const now = Date.parse("2026-10-14T12:00:00Z");
const admin = { email: "admin@example.test", role: "admin" },
  ben = { email: "ben@example.test", role: "ben" },
  cassia = { email: "cassia@example.test", role: "cassia" };
const data = (extra = {}) => ({
  placeId: "synthetic-place",
  businessName: "Synthetic business",
  website: "https://example.test",
  contactEmail: "hello@example.test",
  phone: "",
  region: "Auckland",
  category: "cafe",
  sourceUrl: "https://example.test/about",
  sourceVerifiedAt: "2026-10-14T10:00:00Z",
  owner: "ben",
  stage: "new",
  nextStep: "",
  nextStepAt: "",
  proposalCents: 0,
  evidence: [],
  ...extra,
});
const event = (input, events = [], actor = admin, id = "lead-1") => ({
  id,
  at: new Date(now).toISOString(),
  actor,
  command: d.command(events, actor, input, now),
});
test("allowlist fails closed; verified Google identity and pinned third party subject required", () => {
  const users = JSON.stringify([
    { email: "ben@gmail.com", role: "ben" },
    { email: "cassia@example.test", role: "cassia", sub: "123" },
  ]);
  assert.equal(
    d.googleAllowed(users, {
      email: "ben@gmail.com",
      email_verified: true,
      sub: "456",
    }),
    true,
  );
  assert.equal(
    d.googleAllowed(users, {
      email: "ben@gmail.com",
      email_verified: false,
      sub: "456",
    }),
    false,
  );
  assert.equal(
    d.googleAllowed(users, {
      email: "stranger@gmail.com",
      email_verified: true,
    }),
    false,
  );
  assert.equal(
    d.googleAllowed(users, {
      email: "cassia@example.test",
      email_verified: true,
      sub: "wrong",
    }),
    false,
  );
  assert.equal(
    d.googleAllowed(users, {
      email: "cassia@example.test",
      email_verified: true,
      sub: "123",
    }),
    true,
  );
  assert.equal(
    d.googleAllowed(
      JSON.stringify([{ email: "x@example.test", role: "admin" }]),
      { email: "x@example.test", email_verified: true, sub: "1" },
    ),
    false,
  );
  assert.deepEqual(d.members("invalid JSON"), []);
  assert.deepEqual(
    d.members(
      JSON.stringify([{ email: "b@example.test", role: "superadmin" }]),
    ),
    [],
  );
  assert.deepEqual(
    d.members(
      JSON.stringify([
        { email: "b@example.test", role: "admin" },
        { email: "B@example.test", role: "ben" },
      ]),
    ),
    [],
  );
});
test("Ben and Cassia see only assigned leads and activities; finance and global totals remain private", () => {
  const first = event({ type: "createLead", data: data() });
  const second = event(
    {
      type: "createLead",
      data: data({
        businessName: "Other synthetic",
        website: "https://other.test",
        placeId: "other-place",
        owner: "cassia",
      }),
    },
    [first],
    admin,
    "lead-2",
  );
  const activity = event(
    {
      type: "addActivity",
      leadId: "lead-1",
      data: {
        kind: "contact",
        note: "Synthetic contact",
        occurredAt: new Date(now).toISOString(),
      },
    },
    [first, second],
    ben,
    "activity-1",
  );
  const transaction = event(
    {
      type: "recordTransaction",
      data: {
        kind: "revenue",
        amountCents: 10000,
        note: "Synthetic",
        occurredAt: new Date(now).toISOString(),
      },
    },
    [first, second, activity],
    admin,
    "tx-1",
  );
  const history = [first, second, activity, transaction];
  assert.equal(d.snapshot(history, ben, now).leads.length, 1);
  assert.equal(d.snapshot(history, cassia, now).activities.length, 0);
  assert.equal(d.snapshot(history, ben, now).finance, null);
  assert.deepEqual(d.snapshot(history, ben, now).transactions, []);
  assert.equal(d.snapshot(history, admin, now).leads.length, 2);
  assert.equal(d.snapshot(history, admin, now).finance.revenue, 10000);
  assert.throws(
    () =>
      d.command(
        history,
        cassia,
        { type: "addActivity", leadId: "lead-1", data: {} },
        now,
      ),
    /unavailable/,
  );
  assert.throws(
    () =>
      d.command(
        history,
        ben,
        { type: "updateLead", leadId: "lead-2", revision: 1, data: data() },
        now,
      ),
    /unavailable/,
  );
  assert.throws(
    () => d.command(history, ben, { type: "recordTransaction", data: {} }, now),
    /Administrator/,
  );
  assert.throws(
    () =>
      d.command(
        [],
        ben,
        { type: "createLead", data: data({ owner: "cassia" }) },
        now,
      ),
    /administrators/,
  );
});
test("deduplicates globally by Place ID, independent website and normalized name/region", () => {
  const first = event({ type: "createLead", data: data() });
  assert.throws(
    () =>
      d.command(
        [first],
        cassia,
        {
          type: "createLead",
          data: data({
            owner: "cassia",
            businessName: "Changed",
            website: "https://other.test",
          }),
        },
        now,
      ),
    /Duplicate/,
  );
  assert.throws(
    () =>
      d.command(
        [first],
        admin,
        { type: "createLead", data: data({ placeId: "different" }) },
        now,
      ),
    /Duplicate/,
  );
});
test("optimistic revisions prevent overwriting another update", () => {
  const first = event({ type: "createLead", data: data() });
  const update = event(
    {
      type: "updateLead",
      leadId: "lead-1",
      revision: 1,
      data: data({
        stage: "proposal",
        proposalCents: 30000,
        nextStep: "Review",
      }),
    },
    [first],
  );
  const updated = d.snapshot([first, update], ben, now).leads[0];
  assert.equal(updated.revision, 2);
  assert.equal(updated.stage, "proposal");
  assert.throws(
    () =>
      d.command(
        [first, update],
        ben,
        { type: "updateLead", leadId: "lead-1", revision: 1, data: data() },
        now,
      ),
    /changed/,
  );
});
test("evidence expires, excludes future dates, and missing-site/redesign evidence is not double-counted", () => {
  const evidence = ["web_missing", "web_redesign", "branding"].map((kind) => ({
    kind,
    url: "https://example.test",
    note: "Observed on independent source",
    observedAt: new Date(now).toISOString(),
  }));
  const lead = data({ evidence });
  assert.equal(d.score(lead, now).score, 60);
  assert.equal(d.score(lead, now + 91 * 86400000).score, 0);
  assert.throws(
    () =>
      d.command(
        [],
        admin,
        {
          type: "createLead",
          data: data({
            evidence: [{ ...evidence[0], observedAt: "2026-10-15T00:00:00Z" }],
          }),
        },
        now,
      ),
    /future/,
  );
  assert.throws(
    () =>
      d.command(
        [],
        admin,
        {
          type: "createLead",
          data: data({ sourceUrl: "https://google.com/maps/place/Synthetic" }),
        },
        now,
      ),
    /independent/,
  );
  assert.throws(
    () =>
      d.command(
        [],
        admin,
        {
          type: "createLead",
          data: data({ sourceUrl: "javascript:alert(1)" }),
        },
        now,
      ),
    /HTTP/,
  );
});
test("finance: 55/45 in integer cents, advances distinct from profit, losses and overpayments handled", () => {
  const ledger = [
    { kind: "revenue", amountCents: 10001 },
    { kind: "cost", amountCents: 2000 },
    { kind: "founder_advance", amountCents: 3000 },
    { kind: "founder_repayment", amountCents: 1000 },
    { kind: "founder_distribution", amountCents: 1000 },
  ];
  const f = d.finance(ledger);
  assert.equal(f.profit, 8001);
  assert.equal(f.founderShare, 4400);
  assert.equal(f.partnerShare, 3601);
  assert.equal(f.founderBalance, 5400);
  assert.equal(f.cash, 9001);
  assert.equal(
    d.finance([{ kind: "cost", amountCents: 1000 }]).distributable,
    0,
  );
  assert.throws(
    () =>
      d.command(
        [],
        admin,
        {
          type: "recordTransaction",
          data: { kind: "founder_distribution", amountCents: 1 },
        },
        now,
      ),
    /balance/,
  );
  assert.throws(
    () =>
      d.command(
        [],
        admin,
        {
          type: "recordTransaction",
          data: { kind: "revenue", amountCents: 1.5 },
        },
        now,
      ),
    /cents/,
  );
});
test("unknown input fields including Google ratings and user-supplied audit identity are discarded", () => {
  const command = d.command(
    [],
    ben,
    {
      type: "createLead",
      data: data({
        rating: 4.9,
        reviews: ["Do not persist"],
        actor: "admin@example.test",
        score: 999,
      }),
    },
    now,
  );
  assert.equal(command.data.rating, undefined);
  assert.equal(command.data.reviews, undefined);
  assert.equal(command.data.actor, undefined);
  assert.equal(command.data.score, undefined);
});
