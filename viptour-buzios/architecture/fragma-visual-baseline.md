# FRAGMA Brand Experience: Visual Baseline

Date: 2026-08-20
Scope: `/fragma-brand-experience`
Status: documented before Fase 1 foundations

## Current structure

The route renders Hero, Why, CaseStudy, Services, Gallery, Manifesto, Method, ComingSoon, WhyUs, CTA and a minimal footer. Each major section lives under `components/fragma/`; metadata is defined at route level and several sections are client components using Framer Motion.

## Current visual state

- Background: near-black with radial gradients, glow effects and noise.
- Text: white and muted slate with frequent neon cyan, pink, purple and gradient accents.
- Typography: global Montserrat configuration; no route-scoped editorial pairing.
- Cards: dark glass surfaces, large rounded corners and hover elevation.
- Buttons: pill-shaped, gradient or neon-accented CTAs.
- Borders: low-opacity white/neon borders.
- Hero: two logo assets are displayed together, but the hierarchy is not yet editorially defined; no verified hero photography is used.
- Cases: Buziosama uses existing route assets; Casa da Vó is not yet integrated as a real case.
- Gallery: generic gallery assets and fixed captions, not a centralized verified-asset model.
- Footer: minimal dark footer with FRAGMA label and portal attribution.

## Responsive baseline

The route uses Tailwind responsive utilities and stacks content on small screens. Future risks are long headlines, logo scaling, dense card grids, and the contrast between the global dark body background and the canonical warm ivory system. These are recorded as baseline risks, not changed in this phase.

## Fase 1 boundary

This baseline records the pre-foundation state. Fase 1 adds isolated FRAGMA tokens, fonts, base components, a centralized content model and a non-destructive logo-pair treatment. It does not redesign homepage sections or publish unverified Casa da Vó assets.
