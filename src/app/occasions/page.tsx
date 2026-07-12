import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/core/JsonLd";
import { OccasionsGrid } from "@/components/features/OccasionsGrid";
import { BUSINESS } from "@/lib/business";
import { OCCASIONS } from "@/lib/occasions";
import { SITE, SITE_URL, absolute } from "@/lib/site";

export const metadata: Metadata = {
  title: "Gift Boxes for Every Occasion in Ratnagiri",
  description:
    "Handmade gift boxes from Al-Hala Candies, Ratnagiri — weddings, Eid, Diwali, birthdays, corporate and condolence. Delivered across Ratnagiri district and shipped across India.",
  alternates: { canonical: "/occasions" },
  openGraph: {
    type: "website",
    url: "/occasions",
    title: "Gift Boxes for Every Occasion in Ratnagiri",
    description:
      "Handmade gift boxes for weddings, Eid, Diwali, birthdays, corporate and condolence — made by hand in Ratnagiri.",
    images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: SITE.name }],
  },
};

const breadcrumbs = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Occasions", item: absolute("/occasions") },
  ],
};

const itemList = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Gifting occasions",
  numberOfItems: OCCASIONS.length,
  itemListElement: OCCASIONS.map((occasion, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: occasion.title,
    description: occasion.teaser,
    url: absolute(`/occasions/${occasion.slug}`),
  })),
};

export default function OccasionsIndex() {
  return (
    <>
      <JsonLd data={breadcrumbs} />
      <JsonLd data={itemList} />

      <main>
        <section className="grain relative bg-cream text-cocoa-ink">
          <div className="mx-auto max-w-6xl px-6 pt-16 sm:px-8 md:px-16 md:pt-24">
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-2 text-xs tracking-widest uppercase">
                <li>
                  <Link href="/" className="text-cocoa-ink/50 hover:text-saffron">
                    Home
                  </Link>
                </li>
                <li aria-hidden className="text-cocoa-ink/30">
                  /
                </li>
                <li aria-current="page" className="text-cocoa-ink">
                  Occasions
                </li>
              </ol>
            </nav>

            <div className="mt-16 flex flex-col items-start gap-6">
              <span className="text-xs tracking-widest text-saffron uppercase">
                Every Occasion
              </span>
              {/* The one h1. It carries the town, because the query does. */}
              <h1 className="max-w-3xl font-display text-5xl leading-none font-light tracking-tight md:text-7xl">
                A box for every occasion, made in Ratnagiri
              </h1>
              <span aria-hidden className="block h-px w-16 bg-saffron" />
              <p className="max-w-prose text-lg leading-relaxed text-cocoa-ink/55">
                Weddings and condolences. Eid and a Tuesday. We have been asked for all of
                it, and we have said yes to all of it — pressed by hand in{" "}
                {BUSINESS.primaryLocality} and delivered across {BUSINESS.region}.
              </p>
            </div>
          </div>
        </section>

        {/* Reuses the homepage grid — one component, so the two lists cannot disagree. */}
        <OccasionsGrid />
      </main>
    </>
  );
}
