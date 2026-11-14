/* Deploy only in a NEW standalone Apps Script project owned by the NZ sheet owner.
 * Add lib/crm-nz/domain.js verbatim as Domain.gs. Do not paste into the original CRM.
 */
var CrmNzBridge = (function () {
  function json(value) {
    return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(
      ContentService.MimeType.JSON,
    );
  }
  function properties() {
    return PropertiesService.getScriptProperties();
  }
  function sheet() {
    var p = properties(),
      id = p.getProperty("CRM_NZ_SHEET_ID"),
      source = p.getProperty("CRM_NZ_REFERENCE_SHEET_ID");
    if (!id || !source || id === source)
      CrmNzDomain.fail("Independent NZ sheet required", 503);
    return SpreadsheetApp.openById(id);
  }
  function table() {
    if (properties().getProperty("CRM_NZ_READY") !== "true")
      CrmNzDomain.fail("NZ setup incomplete", 503);
    var tab = sheet().getSheetByName("NZ_EVENTS");
    if (
      !tab ||
      tab.getRange(1, 1, 1, 5).getValues()[0].join("|") !==
        "id|at|type|actor|event_json"
    )
      CrmNzDomain.fail("Invalid NZ event schema", 503);
    return tab;
  }
  function events(tab) {
    var count = tab.getLastRow() - 1;
    if (count > 20000)
      CrmNzDomain.fail("Pilot event capacity reached; archive or migrate", 503);
    return count > 0
      ? tab
          .getRange(2, 5, count, 1)
          .getValues()
          .map(function (r) {
            return JSON.parse(r[0]);
          })
      : [];
  }
  function verify(envelope) {
    var p = properties(),
      secret = p.getProperty("CRM_NZ_BRIDGE_SECRET");
    if (
      !secret ||
      secret.length < 32 ||
      typeof envelope.body !== "string" ||
      envelope.body.length > 25000 ||
      typeof envelope.signature !== "string"
    )
      CrmNzDomain.fail("Unauthorized", 401);
    var expected = Utilities.base64Encode(
      Utilities.computeHmacSha256Signature(envelope.body, secret),
    );
    var difference = expected.length ^ envelope.signature.length;
    for (var i = 0; i < expected.length; i++)
      difference |=
        expected.charCodeAt(i) ^ (envelope.signature.charCodeAt(i) || 0);
    if (difference) CrmNzDomain.fail("Unauthorized", 401);
    var body = JSON.parse(envelope.body);
    if (
      !Number.isSafeInteger(body.timestamp) ||
      Math.abs(Date.now() - body.timestamp) > 300000 ||
      !/^[\da-f-]{36}$/i.test(body.nonce || "")
    )
      CrmNzDomain.fail("Expired request", 401);
    var source = p.getProperty("CRM_NZ_REFERENCE_SHEET_ID");
    if (
      !source ||
      body.sheetId !== p.getProperty("CRM_NZ_SHEET_ID") ||
      body.sheetId === source
    )
      CrmNzDomain.fail("Invalid NZ target", 403);
    var actor = body.actor || {},
      member = CrmNzDomain.member(
        p.getProperty("CRM_NZ_USERS_JSON"),
        actor.email,
        actor.sub,
      );
    if (!member || member.role !== actor.role)
      CrmNzDomain.fail("Access denied", 403);
    body.actor = { email: member.email, role: member.role, sub: actor.sub };
    return body;
  }
  function handle(e) {
    var lock;
    try {
      if (!e || !e.postData || e.postData.contents.length > 40000)
        CrmNzDomain.fail("Invalid request");
      var body = verify(JSON.parse(e.postData.contents));
      lock = LockService.getScriptLock();
      if (!lock.tryLock(15000)) CrmNzDomain.fail("NZ CRM busy; retry", 503);
      var cache = CacheService.getScriptCache(),
        nonceKey = "nonce:" + body.nonce;
      if (cache.get(nonceKey)) CrmNzDomain.fail("Replayed request", 409);
      cache.put(nonceKey, "1", 600);
      var tab = table(),
        history = events(tab),
        actor = body.actor,
        now = Date.now();
      if (body.action === "snapshot")
        return json({
          ok: true,
          data: CrmNzDomain.snapshot(history, actor, now),
        });
      if (body.action === "reserveSearch" || body.action === "reserveGemini") {
        var limit = body.action === "reserveSearch" ? 30 : 10,
          today = new Date(now).toISOString().slice(0, 10);
        var used = history.filter(function (event) {
          return (
            event.command.type === body.action &&
            event.actor.email === actor.email &&
            event.at.slice(0, 10) === today
          );
        }).length;
        if (used >= limit) CrmNzDomain.fail("Daily request limit reached", 429);
        var reservation = {
          id: Utilities.getUuid(),
          at: new Date(now).toISOString(),
          actor: actor,
          command: { type: body.action },
        };
        tab.appendRow([
          reservation.id,
          reservation.at,
          reservation.command.type,
          actor.email,
          JSON.stringify(reservation),
        ]);
        return json({ ok: true, data: { reserved: true } });
      }
      if (body.action !== "command") CrmNzDomain.fail("Unsupported action");
      var payload = body.payload || {};
      if (!/^[\da-f-]{36}$/i.test(payload.requestId || ""))
        CrmNzDomain.fail("Invalid operation identifier");
      var inputHash = Utilities.base64Encode(
        Utilities.computeDigest(
          Utilities.DigestAlgorithm.SHA_256,
          JSON.stringify(payload.command),
        ),
      );
      var prior = history.find(function (event) {
        return event.requestId === payload.requestId;
      });
      if (prior) {
        if (prior.actor.email !== actor.email || prior.inputHash !== inputHash)
          CrmNzDomain.fail("Operation identifier conflict", 409);
        return json({
          ok: true,
          data: CrmNzDomain.snapshot(history, actor, now),
        });
      }
      var command = CrmNzDomain.command(history, actor, payload.command, now);
      var event = {
        id: Utilities.getUuid(),
        requestId: payload.requestId,
        inputHash: inputHash,
        at: new Date(now).toISOString(),
        actor: actor,
        command: command,
      };
      // One append commits business data and its audit trail together under the lock.
      // JSON begins with '{', so user values cannot become spreadsheet formulas.
      tab.appendRow([
        event.id,
        event.at,
        command.type,
        actor.email,
        JSON.stringify(event),
      ]);
      SpreadsheetApp.flush();
      history.push(event);
      return json({
        ok: true,
        data: CrmNzDomain.snapshot(history, actor, now),
      });
    } catch (error) {
      return json({
        ok: false,
        error: error.status ? error.message : "NZ Sheets operation failed",
        status: error.status || 500,
      });
    } finally {
      if (lock && lock.hasLock()) lock.releaseLock();
    }
  }
  function setup() {
    var book = sheet(),
      tab = book.getSheetByName("NZ_EVENTS");
    if (!tab) {
      tab = book.insertSheet("NZ_EVENTS");
      tab.appendRow(["id", "at", "type", "actor", "event_json"]);
      tab.setFrozenRows(1);
      tab.getRange(1, 1, 1, 5).setFontWeight("bold");
    }
    if (
      tab.getRange(1, 1, 1, 5).getValues()[0].join("|") !==
      "id|at|type|actor|event_json"
    )
      throw new Error(
        "Existing NZ_EVENTS schema differs. No changes made to data.",
      );
    properties().setProperty("CRM_NZ_READY", "true");
  }
  return { handle: handle, setup: setup };
})();
function doPost(e) {
  return CrmNzBridge.handle(e);
}
function crmNzSetup() {
  CrmNzBridge.setup();
}
