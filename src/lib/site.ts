/**
 * Single source of truth for the site's identity.
 *
 * Metadata, JSON-LD, the sitemap, robots.txt and llms.txt all read from here. Duplicating
 * a URL or a description across those five files is how a site ends up telling Google one
 * thing, an LLM another, and its own OG card a third.
 */

/**
 * The canonical origin. NEXT_PUBLIC_SITE_URL is set per environment; the fallback exists
 * so local builds do not emit `undefined` into a sitemap.
 *
 * MUST be set in production. A canonical tag pointing at localhost de-indexes the site.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

export const SITE = {
  name: "Al-Hala Candies",
  /** Under 60 chars, or Google truncates it in the SERP. */
  title: "Al-Hala Candies — Premium Gift Boxes & Handmade Sweets",
  /**
   * Under 155 chars. This is the line that decides whether a human clicks, and — more and
   * more — the line an LLM quotes back when asked what this company does. It should read
   * as an answer to a question, not as a keyword list.
   */
  description:
    "Handmade saffron, pistachio and rose confectionery in keepsake gift boxes. Build your own box for weddings, Eid, Valentine's, corporate gifts and every occasion.",
  locale: "en",
  ogImage: "/alhala-og-card-1200x630.png",
} as const;

export const absolute = (path: string) => `${SITE_URL}${path}`;
