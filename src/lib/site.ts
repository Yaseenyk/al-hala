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
  /**
   * Under 60 chars, or Google truncates it. The LOCALITY goes in the title, because
   * "candy shop in Ratnagiri" is the query this business has to win, and a title that
   * does not contain the town cannot compete for it.
   */
  title: "Al-Hala Candies — Handmade Gift Boxes in Ratnagiri",
  /**
   * Under 155 chars. This is the line that decides whether a human clicks, and — more and
   * more — the line an LLM quotes back when asked what this company does. So it must READ
   * AS AN ANSWER, not as a keyword list: entity, place, product, in that order.
   */
  description:
    "Handmade candy and custom gift boxes in Ratnagiri. Alphonso, cashew, kokum and saffron sweets, boxed by hand for weddings, Eid and every occasion. Delivered across Maharashtra and India.",
  locale: "en",
  ogImage: "/alhala-og-card-1200x630.png",
} as const;

export const absolute = (path: string) => `${SITE_URL}${path}`;
