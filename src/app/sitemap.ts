import type { MetadataRoute } from "next";

import { OCCASIONS } from "@/lib/occasions";
import { absolute } from "@/lib/site";

/**
 * sitemap.xml, generated from the occasion taxonomy rather than hand-listed.
 *
 * A hand-maintained sitemap is a sitemap that goes stale the first time someone adds a
 * page and forgets. This one cannot: add an occasion to `src/lib/occasions.ts` and it
 * appears here, in the nav, in the grid, and in the ItemList JSON-LD, together.
 *
 * Priorities are relative, not absolute — they only tell a crawler which of OUR pages
 * matter most. The occasion pages are the money pages, so they sit above everything but
 * the home page and the builder.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: absolute("/"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
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
      priority: 0.8,
    },
    ...OCCASIONS.map((occasion) => ({
      url: absolute(`/occasions/${occasion.slug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
