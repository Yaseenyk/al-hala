# UI System — Al-Hala Candies

How the brand kit becomes Tailwind tokens, and the spacing law that governs layout.

**Source of truth: `Al-Hala Brand Assets/README.txt`.** This document does not replace
it — it translates it into code. When the two disagree, the brand kit wins and this file
is wrong.

---

> **Tailwind v4.** There is no `tailwind.config.ts`. Tokens are declared CSS-first in
> `src/app/globals.css` via `@theme`. Any `tailwind.config.ts` you find in a snippet or
> a tutorial is v3 and does not apply here.

---

## 1. The translation rule

The brand kit is prose. The `@theme` block in `src/app/globals.css` is the
machine-readable form of it. Every value in that block traces to a line in the kit;
nothing is invented in the theme.

Consequence: **arbitrary Tailwind values are banned.** If a token exists, use it. If one
does not, the answer is to propose a token — not to reach for `text-[#1F5A3D]`.

```tsx
// ❌ bans, all of them
<div className="bg-[#1F5A3D] text-[#FAF7F0] p-[13px]" />
<div style={{ color: '#C98B1F' }} />

// ✅
<div className="bg-hala-green text-cream p-4" />
```

Raw hex may appear in exactly two places: the `@theme` / `:root` blocks in
`src/app/globals.css`, and the SVG/PNG assets themselves. Nowhere else in the repository.

---

## 2. Colour tokens

Five brand colours plus two dark-mode variants. That is the **entire** palette. There
is no sixth colour. If a design appears to need one, that is a conversation with the
brand owner, not an improvisation in a component.

| Brand kit name  | Hex       | Tailwind token      | Role                                              |
| --------------- | --------- | ------------------- | ------------------------------------------------- |
| Hala Green      | `#1F5A3D` | `hala-green`        | Core brand green. Primary actions, brand surfaces. |
| Deep Green      | `#0E1F17` | `deep-green`        | The tile. Deepest surface, footer, dark sections.  |
| — (dark tile)   | `#17402E` | `deep-green-tile`   | Dark-mode substitute for the tile.                 |
| Saffron Gold    | `#C98B1F` | `saffron`           | **The single accent.** Gilded square, rules, emphasis. |
| — (dark ring)   | `#E9C87E` | `saffron-ring`      | Dark-mode substitute for the accent.               |
| Cream           | `#FAF7F0` | `cream`             | Page ground. The default background.               |
| Cocoa Ink       | `#221B14` | `cocoa-ink`         | Body text. The default foreground.                 |

### Semantic aliases

Components should reach for **semantic** tokens, not raw brand names, so a dark-mode or
theme change is a config edit rather than a codebase sweep:

| Semantic token | Light         | Dark               | Use                          |
| -------------- | ------------- | ------------------ | ---------------------------- |
| `surface`      | `#FAF7F0`     | `#0E1F17`          | Page background              |
| `surface-deep` | `#0E1F17`     | `#17402E`          | Tiles, footer, dark bands    |
| `ink`          | `#221B14`     | `#FAF7F0`          | Body text                    |
| `ink-muted`    | `#221B14` @70%| `#FAF7F0` @70%     | Captions, metadata           |
| `brand`        | `#1F5A3D`     | `#1F5A3D`          | Primary action               |
| `accent`       | `#C98B1F`     | `#E9C87E`          | The one gold accent          |

### Discipline on gold

Saffron is a **jewel, not a paint**. It appears as a rule, a hairline border, a small
mark, a hover state — rarely as a large fill. A page with three gold buttons is not a
premium page. **One gold moment per viewport** is the working rule.

### Accessibility

Cocoa Ink on Cream ≈ 14:1 — comfortably AAA. Cream on Hala Green ≈ 6.5:1 — AA for body,
AAA for large text.

**Saffron on Cream is ~2.6:1 and fails WCAG AA for text.** Gold is decoration, borders,
and marks — **not body text on a light ground**. Gold text is permitted only on
`deep-green` or larger than 24px bold, and must be contrast-checked before it ships.

### Where this lives (Tailwind v4)

Canonical declaration: the `@theme` block in **`src/app/globals.css`**. Two mechanisms,
and the difference matters:

- **Fixed brand colours** (`hala-green`, `saffron`, …) are declared directly in `@theme`.
  They never change with the theme — Hala Green is Hala Green in light and dark.
- **Semantic aliases** (`surface`, `ink`, `accent`, …) are declared in `@theme inline`
  pointing at CSS variables that are *redefined* under `.dark`. `inline` is what makes
  the emitted utility reference `var(--surface)` at runtime rather than baking in a
  copy of the value at build time. Without `inline`, dark mode silently does nothing.

Fonts load via `next/font/google` in the root layout and are exposed as CSS variables,
which `@theme` then maps to `--font-sans` / `--font-display` / `--font-arabic`. No
`<link>` to Google Fonts — that is a render-blocking request and a privacy leak.

---

## 3. Typography

The brand kit names three faces and their roles. It does **not** define a type scale.

> **Brand kit v1.1.** Marcellus and Albert Sans are **superseded**. Marcellus is a Roman
> capital face with almost no stroke contrast, so it never reads as dramatic however large
> it is set — the brand needs thick-thin to carry "premium" at display sizes.

| Face                    | Token          | Role                                                        |
| ----------------------- | -------------- | ----------------------------------------------------------- |
| **Cormorant Garamond**  | `font-display` | Headings, wordmark, product names, occasion titles. **Set `font-light` above `text-5xl`** — the drama is in the hairlines, and at 400+ they thicken and it becomes an ordinary serif. Never body copy. |
| **Jost**                | `font-sans`    | Body, captions, UI, buttons, form labels. The default.       |
| **Amiri**               | `font-arabic`  | **Every Arabic string, without exception.** Arabic set in Jost is a brand violation. |

**next/font variables must sit on `<html>`, not `<body>`.** Tailwind declares
`--font-display: var(--font-cormorant)` on `:root`, and a custom property is substituted
where it is *declared* — so a font var scoped to `<body>` resolves to nothing at `:root`,
`--font-display` computes invalid, and every heading silently falls back to the browser
default. This failed silently for several days on this project. Do not repeat it.

### Proposed type scale — ⚠️ pending sign-off

Not in the brand kit. Derived here on a ~1.25 (major third) ratio, snapped so every
line-height lands on the 8pt grid. **Treat as provisional until confirmed.**

| Step        | Size / line-height | Face      | Use                                |
| ----------- | ------------------ | --------- | ---------------------------------- |
| `display`   | 56 / 64            | Marcellus | Hero. One per page, at most.       |
| `h1`        | 40 / 48            | Marcellus | Page title                         |
| `h2`        | 32 / 40            | Marcellus | Section                            |
| `h3`        | 24 / 32            | Marcellus | Sub-section, product card title    |
| `body-lg`   | 18 / 32            | Albert    | Lead paragraph, product description|
| `body`      | 16 / 24            | Albert    | Default                            |
| `caption`   | 14 / 24            | Albert    | Metadata, helper text              |
| `micro`     | 12 / 16            | Albert    | Labels, legal. Sparingly.          |

Rules:

- Line length caps at **~65 characters** (`max-w-prose`). Long measure reads cheap.
- Marcellus at display sizes gets **tightened tracking**; Albert Sans is left alone.
- Never fake a heading with a bold `<p>`, and never pick a heading level for its size —
  levels are structure, size is a class. (See the semantics rules in `CLAUDE.md`.)

### Arabic and RTL

**Decided: Arabic is a shipping locale.** The layout must flip.

That makes physical directional utilities (`pl-*`, `mr-*`, `text-left`, `left-0`,
`border-l`) **banned across the codebase** in favour of logical properties (`ps-*`,
`me-*`, `text-start`, `start-0`, `border-s`). Directional icons mirror; logos, the `ح`
monogram, and product photography do not. The full rule, with the substitution table
and the do-not-mirror list, is `CLAUDE.md` §1b — it is binding, not advisory.

The root layout ships `dir="ltr"` today. It flips per-locale once i18n lands. Writing
logical properties now means that flip costs nothing; writing physical ones now means
paying for a full sweep later. Retrofitting RTL is expensive — this is why the rule is
enforced from the first component rather than the first Arabic page.

---

## 4. The 8pt grid

**Every spatial value is a multiple of 8px.** Padding, margin, gap, height, width,
border-radius, icon size. No exceptions negotiated per component.

The grid is what makes a premium layout feel calm instead of merely tidy. Ad-hoc
one-off values are the single fastest way to make a page look cheap.

### The scale

**Strict.** Only exact multiples of 8px exist. There is **no 4px half-step** — it was
considered for icon-to-label gaps and rejected. One grid, no escape hatch.

Tailwind v4 generates spacing utilities *dynamically* from a single `--spacing` base,
so by default `p-7`, `p-11`, `p-13` all work. We kill that base and declare a **fixed,
discrete scale** instead — so `p-7` no longer exists.

**But "does not exist" is silent, not fatal.** Tailwind does not error on an unknown
utility in markup; it simply emits no CSS. `p-7` compiles fine and the element just has
no padding. That is worse than an error. **ESLint is what makes it fail** — see below.

| Token | px  | Typical use                             |
| ----- | --- | --------------------------------------- |
| `0`   | 0   | Reset                                    |
| `2`   | 8   | Tight — inside a chip, badge, input      |
| `4`   | 16  | Default — card padding, stack gap        |
| `6`   | 24  | Comfortable — card padding, form rows    |
| `8`   | 32  | Component separation                     |
| `10`  | 40  | Component separation, wide               |
| `12`  | 48  | Sub-section separation                   |
| `16`  | 64  | Section separation                       |
| `20`  | 80  | Section separation, generous             |
| `24`  | 96  | Major section break                      |
| `32`  | 128 | Page-level breathing room, hero padding  |

**Legal steps: `0, 2, 4, 6, 8, 10, 12, 16, 20, 24, 32`. Nothing else exists.**
`p-1`, `p-3`, `gap-5`, `mt-7`, `p-11`, `p-[13px]` are all **lint errors** — CI fails.

The token number is *not* the pixel count — it is the legacy Tailwind step (`n × 4px`),
kept so the numbers read familiarly. `p-4` is 16px, as it always was.

### Enforcement

Do not rely on discipline. In v4, clear the `--spacing-*` namespace first — this removes
the dynamic base — then declare the discrete steps:

```css
/* src/app/globals.css */
@theme {
  --spacing-*: initial;   /* kill the dynamic scale. p-7 and p-11 now do not exist. */

  --spacing-0:  0px;
  --spacing-2:  8px;
  --spacing-4:  16px;
  --spacing-6:  24px;
  --spacing-8:  32px;
  --spacing-10: 40px;
  --spacing-12: 48px;
  --spacing-16: 64px;
  --spacing-20: 80px;
  --spacing-24: 96px;
  --spacing-32: 128px;
}
```

The theme alone catches nothing at build time. **ESLint is the enforcement.**
`eslint-plugin-tailwindcss` v4 (`cssConfigPath` → `src/app/globals.css`) is wired in
`eslint.config.mjs` with two rules as **errors**:

| Rule                              | Catches                                                   |
| --------------------------------- | --------------------------------------------------------- |
| `tailwindcss/no-arbitrary-value`  | `p-[13px]`, `text-[#FF0000]` — arbitrary values bypass the theme entirely and **no theme config can disable them** |
| `tailwindcss/no-custom-classname` | `p-7`, `gap-3`, `px-5` — off-grid classes that emit no CSS silently |

Verified against a probe file: all four forms error out. A rule a linter enforces is a
rule; a rule in a document is a suggestion.

**Still not enforced by any linter: the RTL rule.** No Tailwind plugin bans `pl-4` /
`mr-2` / `text-left` — they are perfectly valid Tailwind. Today `CLAUDE.md` §1b is the
only thing holding that line. A custom `no-restricted-syntax` rule can close it.

### Vertical rhythm

Line-heights are 8-multiples (see the type scale above), so text blocks sit on the grid
by construction. Space **between** blocks uses the same scale — the rhythm is continuous
from a paragraph to a page section.

### Radius, borders, elevation

| Token          | Value | Use                                       |
| -------------- | ----- | ----------------------------------------- |
| `rounded-none` | 0     | The tile, the mark. The brand's geometry is square. |
| `rounded-sm`   | 4px   | Inputs, chips                             |
| `rounded`      | 8px   | Cards, buttons                            |
| `rounded-lg`   | 16px  | Modals, drawers                           |

- Borders are **1px hairlines**. A gold hairline is the house detail; a 2px gold border
  is loud.
- **Elevation is restrained.** One soft shadow token for lifted surfaces (dropdowns,
  drawers). Premium reads as flat, spacious, and precise — not as stacked drop shadows.
- The brand geometry is a square tile crossed by a square. Heavy rounding fights the mark.

---

## 5. Component conventions

### Atomic layering

| Folder                  | Contains                                                             |
| ----------------------- | -------------------------------------------------------------------- |
| `src/components/ui/`    | Atoms and molecules mapped straight to brand tokens — `Button`, `Input`, `Card`, `Badge`, `Heading`, `Price`. Dumb, presentational, no data fetching, no store access. |
| `src/components/core/`  | Infrastructure primitives — `OptimizedImage`, `JsonLd`, `Section`. Not brand-facing; behaviour-bearing. |
| `src/components/features/` | Composed, domain-aware — `BoxBuilder`, `ProductCard`, `OccasionHero`. May read the store, may take server data as props. |

### Variants

Use `cva` (class-variance-authority) so a component's variants are declared once, not
re-derived per call site with ad-hoc `className` strings:

```ts
const button = cva('font-sans rounded transition-colors', {
  variants: {
    intent: {
      primary:   'bg-brand text-cream hover:bg-hala-green/90',
      secondary: 'border border-brand text-brand hover:bg-brand/5',
      ghost:     'text-ink hover:bg-ink/5',
    },
    size: {
      sm: 'h-8  px-4 text-caption',   // 32px — on grid
      md: 'h-12 px-6 text-body',      // 48px — on grid
      lg: 'h-16 px-8 text-body-lg',   // 64px — on grid
    },
  },
})
```

Note every height lands on the grid. That is not a coincidence and it is not optional.

### Non-negotiables inherited from `CLAUDE.md`

- **RSC by default.** A `ui/` atom is a Server Component unless it owns an event handler.
- **Every image goes through `OptimizedImage`.** Never `next/image` directly, never a
  bare `<img>`. Required non-empty `alt`; decorative images opt out explicitly.
- **Semantic HTML.** A `<div onClick>` is a bug. One `<h1>` per page. Levels never skip.
- **Tokens only.** No arbitrary values. No raw hex outside the `@theme` / `:root` blocks
  in `src/app/globals.css`.
- **Logical properties only.** `ps-*` / `pe-*` / `ms-*` / `me-*` / `text-start` /
  `text-end`. Physical directional utilities (`pl-*`, `mr-*`, `text-left`) are banned —
  Arabic is a shipping locale and every layout must flip. See `CLAUDE.md` §1b.

---

## 6. Logo usage in code

- Import SVGs from `Al-Hala Brand Assets/svg/` — never re-trace, never re-export, never
  hand-edit the paths.
- Light and dark variants exist. Pick the variant; **do not recolour the light one with CSS.**
- **Clear space = the height of the `ح` glyph on all sides.** Enforce it with a wrapper,
  not by eyeballing it.
- **Minimum sizes: mark 24px, horizontal lockup 120px.** Below that, use the monogram.
- Never stretch (always preserve aspect ratio), never rotate, never apply a shadow,
  filter, or gradient, never place on busy imagery. A logo on a photograph needs a solid
  or scrimmed ground.

---

## 7. Open items

| # | Item                                        | Status                                  |
| - | ------------------------------------------- | --------------------------------------- |
| 1 | **Spacing scale — strict 8pt** (§4)         | ✅ Signed off. No 4px half-step. Multiples of 8 only. |
| 2 | **Arabic / RTL as a shipping locale**       | ✅ Confirmed. Logical properties mandatory — `CLAUDE.md` §1b. |
| 3 | **Colour tokens** (§2)                      | ✅ Locked to the brand kit. Emerald / rosewater / pistachio / pure-white / invented-border were drift and are dropped. |
| 4 | **Type scale** (§3)                         | ⚠️ Derived here — still needs sign-off. Not in the brand kit. |
| 5 | **Dark mode** — shipping, or brand-only?    | ⚠️ Tokens are wired (`.dark` class). Whether the storefront exposes a toggle is undecided. |
| 6 | Motion + easing tokens                      | Not defined in the kit. Needed before animation work. |

Item 4 is **provisional** — the brand kit defines colour, type family, and logo rules,
but no type scale. Confirm before the type layer hardens.
