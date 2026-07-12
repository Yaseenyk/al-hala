import type { Metadata } from "next";

import { JsonLd } from "@/components/core/JsonLd";
import { BoxBuilder } from "@/components/features/box-builder/BoxBuilder";
import { PageHeader } from "@/components/ui/PageHeader";
import { BOXES } from "@/lib/catalogue";
import { SITE_URL, absolute } from "@/lib/site";

export const metadata: Metadata = {
  title: "Build Your Own Gift Box",
  description:
    "Build your own gift box at Al-Hala Candies, Ratnagiri. Choose the box, fill it candy by candy with Alphonso, cashew, kokum and saffron sweets, and add a handwritten note.",
  alternates: { canonical: "/build-a-box" },
};

/**
 * `Product` + `AggregateOffer`, because the box is a configurable product with a price
 * RANGE rather than one price. A single `Offer` here would advertise a price the customer
 * cannot actually pay, since the total depends on what they put in it.
 */
const product = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Build a Box — custom gift box",
  description:
    "A custom gift box composed by hand: choose a box size, fill it with individual candies, add a ribbon and a written note.",
  brand: { "@type": "Brand", name: "Al-Hala Candies" },
  url: absolute("/build-a-box"),
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "INR",
    lowPrice: Math.min(...BOXES.map((box) => box.price)) / 100,
    highPrice: 250000 / 100,
    offerCount: BOXES.length,
    availability: "https://schema.org/InStock",
    seller: { "@id": `${SITE_URL}/#store` },
  },
};

export default function BuildABoxPage() {
  return (
    <>
      <JsonLd data={product} />
      <main>
        <PageHeader
          eyebrow="The Flagship"
          title="Build your box"
          lede="Choose the box. Fill it, piece by piece. Write the note. We press everything by hand in Ratnagiri and seal it before it leaves."
          crumbs={[{ label: "Build a Box" }]}
        />
        <div className="grain relative bg-cream text-cocoa-ink">
          <BoxBuilder />
        </div>
      </main>
    </>
  );
}
