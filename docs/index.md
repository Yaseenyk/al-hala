# Al-Hala Candies — Documentation Hub

Shadow documentation for the Al-Hala Candies platform. This folder is the source of
truth for project context. Read the relevant page before working in an area; update it
in the same change that makes it stale.

---

## What we are building

**Al-Hala Candies** is a headless, premium e-commerce and occasion-gifting platform.

We are not building a generic candy shop. We are building a **gifting** product. The
distinction drives nearly every decision below:

- **The gift, not the sweet, is the unit of value.** A customer is buying a gesture —
  for Eid, a wedding, a corporate client, a thank-you. The product page sells an
  occasion, not a confection.
- **Build a Box is the flagship.** Customers compose a box from individual candies:
  choose a box size, fill slots, add a ribbon and a handwritten-style gift note. This
  is the most complex UI state in the app and the primary conversion surface.
- **Presentation is the product.** Photography, whitespace, typography, and one
  restrained gold accent carry the premium positioning. Cluttered UI destroys the
  price point.
- **Occasions are the taxonomy.** Alongside the flavour catalogue, the site is
  organised by occasion (Eid, Ramadan, weddings, corporate, condolence, celebration).
  Occasion landing pages are the primary SEO surface.

---

## The Brand Kit is binding

**The brand kit lives at `Al-Hala Brand Assets/README.txt` in the repository root.**

It is the canonical source for colours, typefaces, logo usage, and clear-space rules.
Read it before writing any UI code — every session, without exception.

At a glance:

| Token        | Hex       | Dark-mode variant | Role                      |
| ------------ | --------- | ----------------- | ------------------------- |
| Hala Green   | `#1F5A3D` | —                 | Core brand green          |
| Deep Green   | `#0E1F17` | `#17402E` (tile)  | Tile / deep surface       |
| Saffron Gold | `#C98B1F` | `#E9C87E` (ring)  | The single accent         |
| Cream        | `#FAF7F0` | —                 | Page ground               |
| Cocoa Ink    | `#221B14` | —                 | Body text                 |

Typefaces (Google Fonts): **Marcellus** (display / wordmark), **Albert Sans** (body /
captions), **Amiri** (Arabic — `الحلا` / `ح`).

The mark is a deep-green tile crossed by a gilded square, forming an eight-point star.
Never recolour, stretch, or apply effects to it. Clear space equals the height of the
`ح` glyph on all sides. Minimum sizes: mark 24px / 10mm, horizontal lockup 120px / 30mm.

Five brand colours plus two dark-mode variants is the **entire** palette. There is no
sixth. If a design appears to need one, that is a conversation, not an improvisation.

> **Open gap:** the brand kit defines colour, type family, and logo rules — it does
> **not** define a type scale or a spacing scale. `docs/ui-system.md` proposes both,
> derived from the kit and an 8pt grid. Those proposals are **pending sign-off** and
> should be treated as provisional until confirmed.

See **[ui-system.md](./ui-system.md)** for how these map into `tailwind.config.ts`.

---

## Stack

| Layer            | Choice                                         |
| ---------------- | ---------------------------------------------- |
| Framework        | Next.js (App Router), React Server Components   |
| Language         | TypeScript, strict                              |
| Styling          | Tailwind CSS, tokens only                       |
| Client state     | Zustand (Build-a-Box builder)                   |
| Server cache     | RTK Query (where client caching earns its keep) |
| Commerce backend | Headless (see architecture.md)                  |
| Shipping         | Shiprocket API                                  |
| Images           | `next/image` behind a mandatory `OptimizedImage` wrapper |

---

## Non-negotiables

Enforced by [`CLAUDE.md`](../CLAUDE.md) at the repository root:

1. **Brand kit adherence.** Design tokens only. No arbitrary Tailwind values, no raw hex.
2. **RSC by default.** `"use client"` at the lowest possible leaf, never at a page or layout.
3. **SEO is a product requirement.** Strict semantic HTML; JSON-LD structured data
   mandatory on every product and category page.
4. **Every image goes through `OptimizedImage`.** Lazy loading, skeleton, zero CLS,
   and a required non-empty `alt`.
5. **Lean payloads.** Rich builder state stays in the client store; a serialisation
   adapter converts it to a lean, versioned payload before it touches the network.
6. **Money is integer minor units.** No floats, anywhere.

---

## Documentation map

| Document                              | Contents                                                                 |
| ------------------------------------- | ------------------------------------------------------------------------ |
| [architecture.md](./architecture.md)  | Headless architecture, Build-a-Box state strategy, serialisation adapter, Shiprocket integration, data-flow diagrams |
| [ui-system.md](./ui-system.md)        | Brand kit → Tailwind token mapping, type scale, 8pt grid rules, component conventions |
| [`CLAUDE.md`](../CLAUDE.md)           | AI guardrails — binding rules for all code generation                    |

---

## Project status

**Phase 0 — Architecture, boilerplate, and shadow documentation.**

Done:
- Brand assets delivered (`Al-Hala Brand Assets/`)
- AI guardrails (`CLAUDE.md`)
- Shadow documentation (this folder)

Next, pending decisions:
- Confirm the headless commerce backend and CMS (see architecture.md — *Open decisions*)
- Sign off the type scale and spacing scale proposed in ui-system.md
- Scaffold the Next.js app and land `tailwind.config.ts` with the token mapping
- Build `OptimizedImage` and the atomic UI layer

No application logic is written yet. That is deliberate.
