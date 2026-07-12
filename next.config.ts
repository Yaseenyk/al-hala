import type { NextConfig } from "next";

/**
 * STATIC EXPORT — GitHub Pages.
 *
 * GitHub Pages serves files. There is no Node process, so there is no server: no Server
 * Actions, no route handlers that compute at request time, no image optimiser, no SSR.
 * `output: "export"` makes Next emit a folder of HTML/CSS/JS into `out/` and nothing else.
 *
 * What that costs us, and where it went:
 *   - Ordering  → WhatsApp handoff (`src/lib/whatsapp.ts`). No server needed.
 *   - Enquiries → same.
 *   - Orders DB → `src/server/*` is dormant, not deleted. It is the migration path back to
 *                 a Node host (Railway/Fly) the day payment is wired.
 */

/**
 * ONE source of truth for where this site lives: `NEXT_PUBLIC_SITE_URL`.
 *
 * `basePath` is DERIVED from it, exactly as `BASE_PATH` is in `src/lib/site.ts`. Both read
 * the same env var, so the router and the canonical URLs cannot drift — a site whose links
 * point at one origin while its sitemap advertises another is a site Google cannot index.
 *
 * Today:  https://yaseenyk.github.io/al-hala  → basePath "/al-hala"
 * Custom: https://alhalacandies.com          → basePath ""        (and a CNAME is written)
 *
 * Moving to the custom domain is therefore a ONE-LINE change — set the env var. Nothing in
 * `src/` moves.
 */
// `||`, NOT `??`: an unset GitHub Actions variable arrives as an EMPTY STRING, which `??`
// happily accepts — SITE_URL becomes "", `new URL("")` throws, and the build dies in CI
// while passing locally. Treat empty as unset, because that is what it means.
const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://yaseenyk.github.io/al-hala"
).replace(/\/$/, "");

const basePath = new URL(SITE_URL).pathname.replace(/\/$/, "");

const nextConfig: NextConfig = {
  output: "export",

  // "" on a custom domain, "/al-hala" on the project page. `next/link` and `next/image`
  // apply it automatically; a hand-written `<img src="/x">` would NOT, which is why nothing
  // in this codebase writes one.
  basePath,

  images: {
    /**
     * The Next image optimiser is a SERVER. It cannot exist here. Without this flag the
     * export fails outright rather than silently degrading — the correct trade, but it does
     * mean every image ships at its source resolution. Compress before committing.
     */
    unoptimized: true,
  },

  /**
   * Emits `/shop/index.html` rather than `/shop.html`, so `/shop` and `/shop/` both resolve
   * on a static host. Without it, Pages 404s the extensionless URL that every link uses.
   */
  trailingSlash: true,
};

export default nextConfig;
