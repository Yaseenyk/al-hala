import type { MetadataRoute } from "next";

import { LEGAL_PAGES } from "@/lib/legal";
import { OCCASIONS } from "@/lib/occasions";
import { POSTS } from "@/lib/posts";
import { absolute } from "@/lib/site";

/**
 * sitemap.xml, generated from the data — never hand-listed.
 *
 * A hand-maintained sitemap goes stale the first time someone adds a page and forgets.
 * This one cannot: add an occasion, a post or a legal page and it appears here, in the
 * nav, in the footer and in the JSON-LD together.
 *
 * NOTE what is deliberately ABSENT: /cart, /wishlist, /account, /search. They are
 * per-visitor or infinite thin content, they carry `robots: noindex`, and listing a
 * noindexed page in a sitemap is a contradictory signal.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: absolute("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: absolute("/build-a-box"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: absolute("/occasions"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...OCCASIONS.map((occasion) => ({
      url: absolute(`/occasions/${occasion.slug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    { url: absolute("/blog"), lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    ...POSTS.map((post) => ({
      url: absolute(`/blog/${post.slug}`),
      // The post's own date, not `now`: telling a crawler every article changed today,
      // every day, is how a site teaches Google to ignore its lastmod entirely.
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    { url: absolute("/about"), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    {
      url: absolute("/contact"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...LEGAL_PAGES.map((page) => ({
      url: absolute(`/${page.slug}`),
      lastModified: new Date(page.updated),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
