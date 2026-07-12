import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/core/JsonLd";
import { PageHeader } from "@/components/ui/PageHeader";
import { BOXES, CANDIES, formatMoney, schemaPrice } from "@/lib/catalogue";
import { SITE, absolute } from "@/lib/site";
import type { Sellable } from "@/types/box";

export const metadata: Metadata = {
  title: "Shop Handmade Candy & Gift Boxes in Ratnagiri",
  description:
    "Every candy and gift box Al-Hala makes in Ratnagiri — Alphonso, Konkan cashew, kokum, saffron and pistachio. Build a box by hand and we deliver across Maharashtra and India.",
  alternates: { canonical: "/shop" },
  openGraph: {
    type: "website",
    url: "/shop",
    title: "Shop Handmade Candy & Gift Boxes in Ratnagiri",
    description:
      "Every candy and gift box Al-Hala makes in Ratnagiri — Alphonso, Konkan cashew, kokum, saffron and pistachio.",
    images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: SITE.name }],
  },
};

const breadcrumbs = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: absolute("/") },
    { "@type": "ListItem", position: 2, name: "Shop", item: absolute("/shop") },
  ],
};

/**
 * `ItemList` of every product, each entry carrying its own `Offer`.
 *
 * The price here MUST agree with the price on the product page it points at, and both read
 * from the same catalogue for exactly that reason. A listing that advertises one price and a
 * detail page that shows another is the fastest way to get shopping results suppressed.
 */
const ALL = [...BOXES, ...CANDIES];

const itemList = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Al-Hala Candies — handmade candy and gift boxes",
  numberOfItems: ALL.length,
  itemListElement: ALL.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "Product",
      name: item.name,
      description: item.description,
      sku: item.sku,
      url: absolute(`/products/${item.slug}`),
      brand: { "@type": "Brand", name: SITE.name },
      offers: {
        "@type": "Offer",
        price: schemaPrice(item.price),
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
        url: absolute(`/products/${item.slug}`),
      },
    },
  })),
};

export default function ShopIndex() {
  return (
    <>
      <JsonLd data={breadcrumbs} />
      <JsonLd data={itemList} />

      <main>
        <PageHeader
          eyebrow="The Range"
          title="Everything we make, by hand"
          lede="Three boxes and eight candies. You choose the box, then you choose what goes in it — every piece is pressed and finished in Ratnagiri."
          crumbs={[{ label: "Shop" }]}
        />

        <div className="mx-auto flex max-w-6xl flex-col gap-24 px-6 pb-32 sm:px-8 md:px-16">
          <Section
            id="boxes"
            heading="The boxes"
            blurb="Pick the size first. The box sets how many candies you can fit, and nothing else about it changes."
            items={BOXES}
          />

          <Section
            id="candies"
            heading="The candies"
            blurb="Sold by the piece, inside a box of your making. Prices are per candy — add them in the builder and the total moves as you go."
            items={CANDIES}
          />
        </div>
      </main>
    </>
  );
}

interface SectionProps {
  id: string;
  heading: string;
  blurb: string;
  items: readonly Sellable[];
}

function Section({ id, heading, blurb, items }: SectionProps) {
  return (
    <section aria-labelledby={id}>
      <h2 id={id} className="font-display text-4xl font-light md:text-5xl">
        {heading}
      </h2>
      <span aria-hidden className="mt-6 block h-px w-16 bg-saffron" />
      <p className="mt-6 max-w-prose text-lg leading-relaxed text-cocoa-ink/55">{blurb}</p>

      <ul className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.sku}>
            <Link
              href={`/products/${item.slug}`}
              className="group flex h-full flex-col gap-4 rounded-lg border border-cocoa-ink/10 p-8 transition-colors hover:border-saffron"
            >
              <h3 className="font-display text-2xl font-light group-hover:text-saffron">
                {item.name}
              </h3>
              <p className="text-sm leading-relaxed text-cocoa-ink/55">{item.description}</p>
              <p className="mt-auto pt-4 font-display text-xl tabular-nums">
                {formatMoney(item.price)}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
