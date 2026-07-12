/**
 * Single source of truth for the site's identity.
 *
 * Metadata, JSON-LD, the sitemap, robots.txt and llms.txt all read from here. Duplicating
 * a URL or a description across those five files is how a site ends up telling Google one
 * thing, an LLM another, and its own OG card a third.
 */

/**
 * The canonical origin, INCLUDING the GitHub Pages subpath.
 *
 * The site is served from https://yaseenyk.github.io/al-hala/ — a project page, not a user
 * page — so `/al-hala` is part of the origin for every canonical, OG and sitemap URL. It
 * must agree with `basePath` in `next.config.ts`; if the two disagree, `next/link` sends
 * visitors to one place and the sitemap sends Google to another.
 *
 * ⚠️ SEO REALITY: a github.io SUBDIRECTORY is a weak home for a local business. Google
 * treats github.io as one domain shared by millions of projects, so authority does not
 * accrue to this shop. "Best candy shop in Ratnagiri" is very hard to win from here.
 * The fix is a custom domain — and it is a one-line change: set NEXT_PUBLIC_SITE_URL,
 * drop `basePath`, add a CNAME file. Nothing else in the codebase moves.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://yaseenyk.github.io/al-hala"
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

/**
 * An absolute URL in its CANONICAL form — always with a trailing slash.
 *
 * `trailingSlash: true` in `next.config.ts` means the page that actually exists is
 * `/shop/index.html`, and Next emits `<link rel="canonical" href=".../shop/">`. If this
 * helper returned `.../shop` instead, the sitemap and the JSON-LD would advertise a URL
 * that DISAGREES with the page's own canonical tag — telling Google two different things
 * about the same page, which is how a site gets its canonicals ignored and the wrong
 * variant indexed.
 *
 * Assets are the exception: a file has no trailing slash. Pass them straight to
 * `metadataBase`-relative fields (like `SITE.ogImage`) rather than through here.
 */
export const absolute = (path: string) => {
  if (path === "/") return `${SITE_URL}/`;
  return `${SITE_URL}/${path.replace(/^\/+|\/+$/g, "")}/`;
};

/**
 * An absolute URL for a FILE — no trailing slash. `alhala-og-card.png/` is not a thing, and
 * an OG image that 404s is an OG image that does not exist.
 */
export const asset = (path: string) => `${SITE_URL}/${path.replace(/^\/+/, "")}`;
