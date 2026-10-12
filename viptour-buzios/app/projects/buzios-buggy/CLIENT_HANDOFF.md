# Buzios Buggy — handoff to client-owned infrastructure

## Objective
Deliver a fully independent website owned by the customer, with **no permanent dependency** on the Brand Experience Studio GitHub or Vercel accounts.

## Scope and current status
- Current temporary development route: `https://www.riovibestransfer.com/projects/buzios-buggy`.
- Source of truth during development: `brandxpbrl/BRANDXP`; do not delete or move this route before final acceptance.
- Customer-facing brand: **Buzios Buggy** (not VIP TOUR, not the original reference's Buggy Búzios).
- Temporary WhatsApp: `+55 45 99968-6381`, to be replaced only upon the customer's approval.
- Design/content inspiration: `buggybuzios.com`, provided by the customer as reference.
- Rates and promotional dates in current modules are **reference data pending customer verification**.

## Required before launch
1. Customer registers the new domain under their own name and provides DNS access, **without** transferring ownership to Studio.
2. Customer creates a personal GitHub account/org and a Vercel account/team.
3. Prepare a **new standalone Next.js repository** containing only Buzios Buggy's source, styles, local images, translations, legal/SEO metadata, and configuration.
4. Remove all ORBIS/other-project code, dependencies, references and shared services from the standalone repository. The existing monorepo should never be copied wholesale to the client's account.
5. Adapt routes from `/projects/buzios-buggy?tour=<slug>&lang=<language>` to the new domain's root or dedicated service paths, preserving navigation, sharing, canonical and indexing.
6. Replace remote `buggybuzios.com/__l5e/assets-v1/` photo links with copies the client is authorized to publish, **hosted in the customer-owned repository/storage**. No client project should hotlink another site's assets permanently.
7. Replace temporary placeholder buggy and fleet photographs with the client's own original vehicle photos, once provided. Do not represent another operator's vehicles as the customer's.
8. Validate offer prices, child rates, itineraries, boardings, schedules, taxes, weather policies and offer expiry with the customer before promoting sale. Transfer table and promotional fares are provisional.
9. Set contact, WhatsApp, social links, NAP and SEO to customer's real information. Keep client-specific assets and secrets in their accounts.
10. Connect the new GitHub repo to **the customer's own Vercel**; configure environment variables and deploy Preview; test 6 services + BR/US/ES + WhatsApp on mobile and desktop.
11. Add the purchased domain **only to the customer Vercel project**, apply DNS records provided by that Vercel project, wait for issuance of TLS certificate and test HTTPS + both www/apex + canonical.
12. Verify Search Console, sitemap, robots, structured data, mobile performance and redirects; only then announce launch.
13. Remove or redirect the temporary ORBIS project link **after** the customer accepts the independent production website. Keep a rollback snapshot.
14. Grant Studio temporary maintenance permissions only if agreed; customer retains owner/admin control of GitHub, Vercel, domain and billing.

## Separation acceptance check
- Customer can deploy after removing Studio access.
- No custom domain points to Studio Vercel.
- No project fetches content, fonts, assets or secrets from Studio.
- Studio GitHub changes do not trigger client builds.
- Production tests pass and client approves commercial conditions.
