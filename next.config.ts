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
const nextConfig: NextConfig = {
  output: "export",

  /**
   * The site lives at https://yaseenyk.github.io/al-hala/ — a SUBPATH, not a root.
   *
   * Every internal href and asset URL must carry the `/al-hala` prefix or it 404s.
   * `next/link` and `next/image` apply this automatically; a hand-written `<img src="/x">`
   * would NOT, which is why nothing in this codebase writes one.
   */
  basePath: "/al-hala",

  images: {
    /**
     * The Next image optimiser is a SERVER. It cannot exist here. Without this flag the
     * export fails outright rather than silently degrading — which is the correct trade,
     * but it does mean every image ships at its source resolution. Compress before commit.
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
