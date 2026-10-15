/* Shared with Apps Script: copy this file verbatim as Domain.gs in the NZ project. */
var CrmNzDomain = (function () {
  "use strict";
  var roles = ["admin", "ben", "cassia"];
  var regions = [
    "Auckland",
    "Wellington",
    "Canterbury",
    "Otago",
    "Waikato",
    "Bay of Plenty",
    "Northland",
    "Hawke's Bay",
    "Taranaki",
    "Manawatū-Whanganui",
    "Tasman",
    "Nelson",
    "Marlborough",
    "West Coast",
    "Southland",
    "Gisborne",
  ];
  var categories = [
    "restaurant",
    "cafe",
    "lodging",
    "travel_agency",
    "beauty_salon",
    "store",
    "professional_services",
  ];
  function fail(message, status) {
    var e = new Error(message);
    e.status = status || 400;
    throw e;
  }
  function text(value, max, optional) {
    if (optional && (value === undefined || value === "")) return "";
    if (typeof value !== "string" || !value.trim() || value.length > max)
      fail("Invalid text field");
    return value.trim();
  }
  function one(value, list) {
    if (list.indexOf(value) < 0) fail("Invalid option");
    return value;
  }
  function url(value, optional) {
    var v = text(value, 1000, optional);
    if (!v) return v;
    if (!/^https?:\/\/[^\s/@]+(?:[/:?#]|$)/i.test(v))
      fail("Use an HTTP(S) source URL");
    return v;
  }
  function date(value, optional) {
    var v = text(value, 40, optional);
    if (!v) return v;
    if (!/^\d{4}-\d{2}-\d{2}T/.test(v) || !Number.isFinite(Date.parse(v)))
      fail("Invalid date");
    return new Date(v).toISOString();
  }
  function cents(value) {
    if (!Number.isSafeInteger(value) || value <= 0 || value > 100000000)
      fail("Invalid NZD amount in cents");
    return value;
  }
  function members(raw) {
    try {
      var list = JSON.parse(raw || "[]");
      if (!Array.isArray(list) || list.length > 20) return [];
      var emails = {};
      list.forEach(function (m) {
        if (
          !m ||
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m.email) ||
          roles.indexOf(m.role) < 0 ||
          (m.sub && typeof m.sub !== "string")
        )
          throw Error();
        m.email = m.email.toLowerCase();
        if (emails[m.email]) throw Error();
        emails[m.email] = true;
      });
      return list;
    } catch (_) {
      return [];
    }
  }
  function member(raw, email, sub) {
    return (
      members(raw).find(function (m) {
        return (
          typeof email === "string" &&
          m.email === email.toLowerCase() &&
          (!m.sub || m.sub === sub)
        );
      }) || null
    );
  }
  function googleAllowed(raw, profile) {
    // Non-Gmail accounts outside Workspace require a pinned Google subject.
    var m =
      profile &&
      profile.email_verified === true &&
      member(raw, profile.email, profile.sub);
    return !!(
      m &&
      (/@gmail\.com$/i.test(profile.email) || profile.hd || m.sub)
    );
  }
  function canRead(actor, lead) {
    return actor.role === "admin" || lead.owner === actor.role;
  }
  function finance(transactions) {
    var totals = {
      revenue: 0,
      cost: 0,
      founder_advance: 0,
      founder_repayment: 0,
      founder_distribution: 0,
      partner_distribution: 0,
    };
    transactions.forEach(function (t) {
      totals[t.kind] += t.amountCents;
    });
    var profit = totals.revenue - totals.cost,
      distributable = Math.max(0, profit);
    var founderShare = Math.floor((distributable * 55) / 100),
      partnerShare = distributable - founderShare;
    var advanceDue = totals.founder_advance - totals.founder_repayment;
    return {
      revenue: totals.revenue,
      cost: totals.cost,
      profit: profit,
      distributable: distributable,
      founderShare: founderShare,
      partnerShare: partnerShare,
      advanceDue: advanceDue,
      founderProfitDue: founderShare - totals.founder_distribution,
      founderBalance: advanceDue + founderShare - totals.founder_distribution,
      partnerDue: partnerShare - totals.partner_distribution,
      cash:
        totals.revenue +
        totals.founder_advance -
        totals.cost -
        totals.founder_repayment -
        totals.founder_distribution -
        totals.partner_distribution,
    };
  }
  function score(lead, now) {
    var weights = { web_missing: 40, web_redesign: 30, branding: 20 },
      seen = {},
      result = 0;
    lead.evidence.forEach(function (e) {
      var age = now - Date.parse(e.observedAt);
      if (age >= 0 && age <= 90 * 86400000 && !seen[e.kind]) {
        seen[e.kind] = true;
        result += weights[e.kind];
      }
    });
    // A missing website and a redesign are mutually exclusive hypotheses.
    if (seen.web_missing && seen.web_redesign) result -= 30;
    return {
      score: result,
      opportunities: Object.keys(seen),
      priority: result >= 40 ? "high" : result >= 20 ? "medium" : "unverified",
    };
  }
  function empty() {
    return { leads: [], activities: [], transactions: [] };
  }
  function state(events) {
    var s = empty();
    events.forEach(function (e) {
      var c = e.command;
      if (c.type === "createLead")
        s.leads.push(
          Object.assign({}, c.data, {
            id: e.id,
            revision: 1,
            createdAt: e.at,
            updatedAt: e.at,
          }),
        );
      if (c.type === "updateLead") {
        var l = s.leads.find(function (l) {
          return l.id === c.leadId;
        });
        if (!l) fail("Corrupt event history", 503);
        Object.assign(l, c.data, { revision: l.revision + 1, updatedAt: e.at });
      }
      if (c.type === "addActivity")
        s.activities.push(
          Object.assign({}, c.data, {
            id: e.id,
            leadId: c.leadId,
            actor: e.actor.email,
            at: e.at,
          }),
        );
      if (c.type === "recordTransaction")
        s.transactions.push(
          Object.assign({}, c.data, {
            id: e.id,
            actor: e.actor.email,
            at: e.at,
          }),
        );
    });
    return s;
  }
  function snapshot(events, actor, now) {
    var s = state(events);
    var leads = s.leads
      .filter(function (l) {
        return canRead(actor, l);
      })
      .map(function (l) {
        return Object.assign({}, l, score(l, now));
      });
    return {
      leads: leads,
      activities: s.activities.filter(function (a) {
        return leads.some(function (l) {
          return l.id === a.leadId;
        });
      }),
      transactions: actor.role === "admin" ? s.transactions : [],
      finance: actor.role === "admin" ? finance(s.transactions) : null,
    };
  }
  function leadData(d, actor, now) {
    var owner = d.owner === null ? null : one(d.owner, ["ben", "cassia"]);
    if (actor.role !== "admin" && owner !== actor.role)
      fail("Only administrators can assign another owner", 403);
    var evidence = d.evidence || [];
    if (!Array.isArray(evidence) || evidence.length > 12)
      fail("Invalid evidence");
    evidence = evidence.map(function (e) {
      var observedAt = date(e.observedAt);
      if (Date.parse(observedAt) > now) fail("Evidence date is in the future");
      return {
        kind: one(e.kind, ["web_missing", "web_redesign", "branding"]),
        url: url(e.url),
        note: text(e.note, 1500),
        observedAt: observedAt,
      };
    });
    var source = url(d.sourceUrl);
    if (
      /google\.[^/]+\/maps|maps\.google|places\.googleapis|googleusercontent/i.test(
        source,
      )
    )
      fail("Use a source independent of Google Places");
    if (
      evidence.some(function (e) {
        return /google\.[^/]+\/maps|maps\.google|places\.googleapis|googleusercontent/i.test(
          e.url,
        );
      })
    )
      fail("Use independent evidence sources");
    var sourceVerifiedAt = date(d.sourceVerifiedAt);
    if (Date.parse(sourceVerifiedAt) > now)
      fail("Source date is in the future");
    var email = text(d.contactEmail, 200, true);
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      fail("Invalid email");
    var proposal = d.proposalCents || 0;
    if (proposal !== 0) cents(proposal);
    return {
      placeId: text(d.placeId, 300, true),
      businessName: text(d.businessName, 200),
      website: url(d.website, true),
      contactEmail: email,
      phone: text(d.phone, 100, true),
      region: one(d.region, regions),
      category: one(d.category, categories),
      sourceUrl: source,
      sourceVerifiedAt: sourceVerifiedAt,
      owner: owner,
      stage: one(d.stage, [
        "new",
        "contacted",
        "meeting",
        "proposal",
        "won",
        "lost",
      ]),
      nextStep: text(d.nextStep, 1500, true),
      nextStepAt: date(d.nextStepAt, true),
      proposalCents: proposal,
      evidence: evidence,
    };
  }
  function duplicate(a, b) {
    var norm = function (s) {
      return (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
    };
    return !!(
      (a.placeId && a.placeId === b.placeId) ||
      (norm(a.businessName) === norm(b.businessName) &&
        a.region === b.region) ||
      (a.website &&
        norm(a.website.replace(/^https?:\/\//, "").replace(/\/$/, "")) ===
          norm(b.website.replace(/^https?:\/\//, "").replace(/\/$/, "")))
    );
  }
  function command(events, actor, input, now) {
    one(actor.role, roles);
    if (!input || typeof input !== "object") fail("Invalid command");
    var s = state(events),
      c = {
        type: one(input.type, [
          "createLead",
          "updateLead",
          "addActivity",
          "recordTransaction",
        ]),
        data: {},
      };
    if (c.type === "createLead" || c.type === "updateLead") {
      c.data = leadData(input.data || {}, actor, now);
      if (c.type === "updateLead") {
        c.leadId = text(input.leadId, 100);
        var lead = s.leads.find(function (l) {
          return l.id === c.leadId;
        });
        if (!lead || !canRead(actor, lead)) fail("Lead unavailable", 404);
        if (lead.revision !== input.revision)
          fail("Lead changed. Reload before saving.", 409);
      }
      if (
        s.leads.some(function (l) {
          return l.id !== c.leadId && duplicate(l, c.data);
        })
      )
        fail("Duplicate lead", 409);
    }
    if (c.type === "addActivity") {
      c.leadId = text(input.leadId, 100);
      var target = s.leads.find(function (l) {
        return l.id === c.leadId;
      });
      if (!target || !canRead(actor, target)) fail("Lead unavailable", 404);
      var d = input.data || {};
      c.data = {
        kind: one(d.kind, [
          "contact",
          "response",
          "meeting",
          "proposal",
          "note",
        ]),
        note: text(d.note, 3000),
        occurredAt: date(d.occurredAt),
      };
      if (Date.parse(c.data.occurredAt) > now)
        fail("Activity date is in the future");
    }
    if (c.type === "recordTransaction") {
      if (actor.role !== "admin") fail("Administrator required", 403);
      var t = input.data || {},
        amount = cents(t.amountCents),
        f = finance(s.transactions);
      var kind = one(t.kind, [
        "revenue",
        "cost",
        "founder_advance",
        "founder_repayment",
        "founder_distribution",
        "partner_distribution",
      ]);
      if (
        (kind === "founder_repayment" && amount > f.advanceDue) ||
        (kind === "founder_distribution" && amount > f.founderProfitDue) ||
        (kind === "partner_distribution" && amount > f.partnerDue)
      )
        fail("Payment exceeds balance");
      if (
        [
          "founder_repayment",
          "founder_distribution",
          "partner_distribution",
        ].indexOf(kind) >= 0 &&
        amount > f.cash
      )
        fail("Insufficient available cash");
      var occurred = date(t.occurredAt);
      if (Date.parse(occurred) > now) fail("Transaction date is in the future");
      var leadId = text(t.leadId, 100, true);
      if (
        leadId &&
        !s.leads.some(function (l) {
          return l.id === leadId;
        })
      )
        fail("Lead unavailable", 404);
      c.data = {
        kind: kind,
        amountCents: amount,
        note: text(t.note, 1500),
        occurredAt: occurred,
        leadId: leadId,
      };
    }
    return c;
  }
  return {
    regions: regions,
    categories: categories,
    members: members,
    member: member,
    googleAllowed: googleAllowed,
    canRead: canRead,
    finance: finance,
    score: score,
    state: state,
    snapshot: snapshot,
    command: command,
    fail: fail,
  };
})();
if (typeof module !== "undefined") module.exports = CrmNzDomain;
