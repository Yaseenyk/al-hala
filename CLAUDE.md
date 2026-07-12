# CLAUDE.md — Al-Hala Candies

AI guardrails for this repository. These rules are binding for every code generation,
refactor, and review in this project. When a rule here conflicts with a general habit,
this file wins.

---

## 0. Project identity

**Al-Hala Candies** — a headless, premium e-commerce and occasion-gifting platform.

- Stack: **Next.js (App Router) + TypeScript + Tailwind CSS**. No other UI framework.
- Positioning: premium confectionery gifting. Restraint over decoration. Whitespace,
  typography, and one gold accent do the work. No gradients-on-everything, no drop
  shadows stacked for "depth", no emoji in product UI.
- Flagship feature: **Build a Box** — a customer composes a gift box from individual
  candies, then checks out. This is the most complex UI state in the app.

---

## 1. Brand Kit adherence (hard rule)

**The brand kit is `Al-Hala Brand Assets/README.txt`.**
**Read it before writing any UI code, CSS, or Tailwind class. Every session. No exceptions.**

Derived design tokens live in `tailwind.config.ts`. Consuming them is mandatory.

### Forbidden

- Arbitrary Tailwind values where a token exists: `text-[#1F5A3D]`, `bg-[#FAF7F0]`,
  `p-[13px]`, `text-[17px]`.
- Raw hex in `.tsx`, `.ts`, or inline `style` attributes.
- Inventing a colour that is not in the brand kit. There are five brand colours plus
  two dark-mode variants. That is the entire palette. If a design "needs" a sixth,
  **stop and ask** — do not invent one.
- Recolouring, stretching, rotating, or applying effects to the logo assets.
  Clear space = height of the `ح` glyph on all sides. Min size: mark 24px,
  horizontal lockup 120px.

### Required

```tsx
// ❌ never
<span className="text-[#C98B1F]">Gift</span>

// ✅ always
<span className="text-saffron">Gift</span>
```

- Colour: `hala-green`, `deep-green`, `saffron`, `cream`, `cocoa-ink` (+ documented
  dark-mode variants). See `docs/ui-system.md` for the full token table.
- Type: `font-display` (**Cormorant Garamond**) for headings and the wordmark, `font-sans`
  (**Jost**) for body and captions, `font-arabic` (Amiri) for any Arabic string.
  Never set Arabic text in Jost.
  **Set `font-light` on display type above `text-5xl`** — Cormorant's drama is in its
  hairlines, and at 400+ they thicken and it turns into an ordinary serif.
  (Brand kit v1.1 — Marcellus and Albert Sans are superseded. Do not reintroduce them.)
- **next/font variables belong on `<html>`, never `<body>`.** Tailwind declares
  `--font-display: var(--font-cormorant)` on `:root`; a custom property is substituted
  where it is *declared*, so a font var that only exists on `<body>` resolves to nothing
  at `:root`, and every heading silently falls back to the browser default. No error, no
  warning — the brand typeface simply never appears.
- Spacing: **strict 8pt grid. Exact multiples of 8px only.** Legal steps are
  `2` (8px), `4` (16px), `6` (24px), `8` (32px), `10` (40px), `12` (48px), `16` (64px),
  `20` (80px), `24` (96px), `32` (128px) — plus the sizing steps `40` (160px), `48`
  (192px), `64` (256px), `80` (320px), `96` (384px), `128` (512px), `160` (640px), which
  exist because pruning the spacing scale also removes `w-`/`h-`/`size-`/`max-w-`.
  There is **no 4px half-step** — `p-1`, `p-3`, `p-5`, `p-7`, `p-11` do not exist and are
  lint errors.

If a value you need genuinely has no token, **say so and propose a token** rather than
reaching for an arbitrary value.

### Muted tiers: opacity modifiers, never a new colour

A muted tier is made by fading an existing token, not by inventing a sixth colour.
`text-cream/70`, `text-cream/80`, `border-current/30`. This keeps the type hierarchy
alive on dark surfaces without touching the palette.

### Tailwind only scans `src/`

Tailwind v4 auto-scans the entire project by default. That swept up `CLAUDE.md` and
`docs/*.md` — and **these files list the banned classes** (`pl-4`, `mr-2`, `text-left`).
Tailwind read the ban list as usage and compiled every banned utility into the bundle.

`src/app/globals.css` therefore pins the scan:

```css
@import "tailwindcss" source(none);
@source "../../src";
```

Markdown files are excluded from Tailwind scanning on purpose, so that documentation of
a forbidden class cannot conjure that class into production CSS. **Do not remove the
`source(none)` / `@source` pair**, and if a new source directory is added outside `src/`,
add an explicit `@source` for it — Tailwind will silently emit nothing for it otherwise.

---

## 1b. RTL and logical properties (hard rule)

**Arabic is a supported locale. The layout must flip.**

Physical directional utilities are **BANNED**. Use logical properties everywhere, so
every layout mirrors automatically the moment `dir="rtl"` is active.

| ❌ Banned (physical) | ✅ Required (logical) |
| -------------------- | --------------------- |
| `pl-4` / `pr-4`      | `ps-4` / `pe-4`       |
| `ml-2` / `mr-2`      | `ms-2` / `me-2`       |
| `text-left` / `text-right` | `text-start` / `text-end` |
| `left-0` / `right-0` | `start-0` / `end-0`   |
| `border-l` / `border-r` | `border-s` / `border-e` |
| `rounded-l-*` / `rounded-r-*` | `rounded-s-*` / `rounded-e-*` |
| `float-left` / `float-right` | `float-start` / `float-end` |
| `scroll-ml-*` / `scroll-mr-*` | `scroll-ms-*` / `scroll-me-*` |
| `inset-x` with `left`/`right` overrides | `inset-inline-*` / `start-*` / `end-*` |

Also:

- **Raw CSS follows the same rule.** `margin-left` → `margin-inline-start`,
  `padding-right` → `padding-inline-end`, `left:` → `inset-inline-start:`.
- **Directional icons must mirror.** Chevrons, arrows, back/next, and progress
  indicators flip in RTL — use `rtl:-scale-x-100` or ship a mirrored variant. A
  right-pointing "next" arrow in an RTL layout is a bug.
- **Do not mirror what should not mirror**: logos, the `ح` monogram, product
  photography, brand marks, media playback controls, and numerals stay as they are.
- `text-center`, `mx-*`, `px-*`, `space-x-*`, and `gap-*` are direction-agnostic and
  remain fine.
- **Flexbox `flex-row` is already logical** and flips with `dir`. Do not "fix" it with
  `flex-row-reverse` — that double-flips and breaks LTR.

`text-left` is only ever correct when the content is genuinely direction-locked (e.g. a
code block). That is a deliberate, commented exception — not a default.

---

## 2. Component strategy — RSC by default

**Every component is a React Server Component until proven otherwise.**

- Do not put `"use client"` at the top of a page, layout, or section wrapper.
- `"use client"` belongs at the **lowest possible leaf node** — the button that has an
  `onClick`, the input that has `onChange`, the drawer that holds open/closed state.
- When a mostly-static section needs one interactive element, extract that element into
  its own client component and keep the parent on the server.
- Data fetching happens in Server Components (`async` component + `fetch`). Do not
  fetch product or catalogue data in a `useEffect`.
- Never pass a function, class instance, `Date`, or `Map` across the server→client
  boundary. Props crossing that boundary must be **serialisable plain objects**.

```
app/products/[slug]/page.tsx        ← RSC. fetches product. renders layout.
  ├─ ProductGallery.tsx             ← RSC. static markup.
  │    └─ GalleryZoom.tsx           ← "use client". only the zoom handler.
  └─ AddToBoxButton.tsx             ← "use client". only the button.
```

**Order of preference for interactivity:** CSS → Server Action → `"use client"`.
Reach for `"use client"` last, not first.

---

## 3. SEO & semantics (non-negotiable)

Premium gifting is a search-driven business. SEO is a product requirement, not a polish task.

### Semantic HTML

- Exactly **one `<h1>` per page**. Heading levels never skip (`h1` → `h2` → `h3`).
- Use `<main>`, `<nav>`, `<header>`, `<footer>`, `<article>`, `<section>`, `<aside>`
  correctly. A `<div>` with `role="button"` is a bug — use `<button>`.
- Every interactive element is reachable and operable by keyboard.
- Landmark regions get accessible names where more than one exists on a page.

### Structured data (JSON-LD) — mandatory

Inject via a `<script type="application/ld+json">` tag rendered from a Server Component.
Never build it on the client.

| Page                | Required schema                                      |
| ------------------- | ---------------------------------------------------- |
| Product detail      | `Product` + nested `Offer` (price, currency, availability) + `AggregateRating` when reviews exist |
| Category / listing  | `ItemList` + `BreadcrumbList`                         |
| Build-a-Box builder | `Product` for the configured box                      |
| Home                | `Organization` + `WebSite` (with `SearchAction`)      |
| Article / gifting guide | `Article` + `BreadcrumbList`                      |
| FAQ blocks          | `FAQPage`                                             |

Every route also exports Next.js `metadata` (or `generateMetadata`) with `title`,
`description`, `openGraph`, and `alternates.canonical`. OG image default:
`/alhala-og-card-1200x630.png`.

A product or category page shipped **without JSON-LD is incomplete work.** Do not mark it done.

---

## 4. Image pipeline

**Every image in this app renders through `src/components/core/OptimizedImage.tsx`.**

- Never import `next/image` directly in a feature component. Never use a bare `<img>`.
- `OptimizedImage` wraps `next/image` and enforces:
  - **`alt` is a required, non-empty prop.** Decorative images must pass
    `decorative` explicitly, which sets `alt=""` and `aria-hidden`. There is no
    silent path to a missing alt.
  - Lazy loading by default. Above-the-fold hero images opt in with `priority`.
  - A skeleton / blur placeholder while loading — no layout shift, no white flash.
  - Explicit `width`/`height` or `fill` + a sized parent. CLS budget is zero.
  - Correct `sizes` for responsive art direction.
- Alt text is **SEO copy, not a filename**. `alt="alhala-box-3.jpg"` is a bug.
  `alt="Al-Hala signature gift box with twelve saffron and pistachio candies"` is correct.
- Product photography is the hero of a premium brand. Never ship a product image
  below its intended resolution and never upscale.

---

## 5. State management — Build a Box

The box builder is the one place where state gets genuinely complex. Discipline here.

### The rule

**Rich state lives in the client store. A lean, serialised payload goes to the database.**
Never persist the working UI state directly.

- Builder UI state (selected candies, quantities, slot positions, box size, ribbon,
  gift note draft, live price preview, validation errors) lives in a **Zustand** store
  under `src/store/`. It is ephemeral and can be verbose — it exists to make the UI fast.
- Server data (catalogue, inventory, pricing rules) is fetched in RSCs, or via
  **RTK Query** where client-side caching and revalidation genuinely pay for themselves.
  Do not mirror server data into Zustand.
- Before anything crosses the network — add-to-cart, save-for-later, checkout — it
  passes through a **serialisation adapter** in `src/lib/adapters/`.

### The adapter contract

`src/lib/adapters/` owns the boundary in both directions:

- `serializeBox(state: BoxBuilderState): BoxPayload` — strips derived values, UI-only
  fields, and denormalised catalogue data. Emits a lean, versioned, DB-shaped payload
  (IDs and quantities, not embedded product objects).
- `deserializeBox(payload: BoxPayload, catalogue): BoxBuilderState` — rehydrates the
  builder from a saved payload for edit/reorder flows.
- The payload carries a **schema version**. Saved boxes must survive a catalogue change.
- Adapters are **pure functions**. No fetching, no store access, no side effects.
  They are the most test-worthy code in the repo — unit test them.

### Money

Prices are **integer minor units** end to end. No floats. Ever. Format only at the
render edge.

### Also

- No `useState` chains lifted five levels up to fake a store. If it is shared, it is
  in the store.
- No `useEffect` that syncs one piece of state to another. Derive it.
- Server-side price recomputation at checkout is authoritative. The client price is a
  preview and is never trusted.

---

## 6. Documentation is part of the change

`docs/` is the project's shadow documentation and the source of truth for context.

- `docs/index.md` — project hub
- `docs/architecture.md` — system design, data flow, Shiprocket integration
- `docs/ui-system.md` — brand kit → Tailwind token mapping, 8pt grid

**Read the relevant doc before touching an area. Update the doc in the same change
that makes it stale.** A PR that changes the box payload shape and leaves
`docs/architecture.md` describing the old shape is not done.

---

## 7. Working agreement

- **Ask before building.** State the intended approach in a sentence or two and wait.
  This applies to any non-trivial change.
- **Surgical changes only.** Touch what the task requires. No drive-by refactors, no
  renaming, no "while I was in there" cleanups, no speculative abstractions.
- **No new files unless asked.** Prefer editing what exists. Never create a new `.md`
  unless explicitly requested.
- **No speculative error handling.** Validate at real boundaries — user input, external
  APIs (Shiprocket, payments), webhook bodies. Not in between.
- **Comments only when the *why* is non-obvious.** Do not narrate what the code says.
- **Verify before claiming done.** Run typecheck, lint, and build. If you cannot run
  something, say so plainly instead of implying success.
- **Never commit secrets.** Shiprocket credentials, payment keys, and CMS tokens live
  in `.env.local` and in the deployment environment. Nowhere else.

---

## 8. Definition of done (UI work)

- [ ] Brand kit read; only design tokens used; zero arbitrary Tailwind values
- [ ] Spacing on the 8pt grid
- [ ] RSC by default; `"use client"` only at leaves
- [ ] Semantic HTML; single `h1`; no skipped heading levels; keyboard-operable
- [ ] JSON-LD present on product/category pages; `metadata` exported
- [ ] All images via `OptimizedImage` with real, descriptive alt text
- [ ] No floats for money
- [ ] Box state serialised through an adapter, never persisted raw
- [ ] Typecheck, lint, and build pass
- [ ] Affected `docs/` updated
