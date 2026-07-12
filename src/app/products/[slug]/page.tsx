import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/core/JsonLd";
import { PageHeader } from "@/components/ui/PageHeader";
import { BUSINESS } from "@/lib/business";
import { SELLABLES, formatMoney, isBox, schemaPrice, sellableBySlug } from "@/lib/catalogue";
import { SITE, SITE_URL, absolute, asset } from "@/lib/site";
import { isWhatsappConfigured, productEnquiryMessage, waLink } from "@/lib/whatsapp";

/**
 * Product detail. One page per candy and per box.
 *
 * These are the pages that win shopping queries — "alphonso candy Ratnagiri", "cashew
 * brittle gift box" — so each carries `Product` + `Offer` JSON-LD, and each is a distinct
 * entity with its own copy. They are not a template with a name swapped in, which Google
 * reads as a doorway pattern and demotes.
 *
 * A CANDY IS NOT SOLD ALONE. It is priced per piece, and you buy it by putting it in a box.
 * So the call to action here is "build a box with this", not "add to cart" — an add-to-cart
 * on a lone candy would either lie or quietly invent a box the customer did not choose.
 */

export function generateStaticParams() {
  return SELLABLES.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = sellableBySlug(slug);

  if (!item) return {};

  const title = `${item.name} — Handmade in ${BUSINESS.primaryLocality}`;

  return {
    title,
    description: item.description,
    alternates: { canonical: `/products/${item.slug}` },
    openGraph: {
      type: "website",
      url: `/products/${item.slug}`,
      title,
      description: item.description,
      images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: item.imageAlt }],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = sellableBySlug(slug);

  if (!item) notFound();

  const url = absolute(`/products/${item.slug}`);
  const box = isBox(item);

  const product = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name: item.name,
    description: item.description,
    sku: item.sku,
    url,
    image: asset(SITE.ogImage),
    brand: { "@type": "Brand", name: SITE.name },
    category: box ? "Gift Boxes" : "Confectionery",
    // Ties the product to the shop entity declared on the homepage, so Google understands
    // WHO sells it — which is most of the battle for a local business.
    manufacturer: { "@id": `${SITE_URL}/#store` },
    offers: {
      "@type": "Offer",
      price: schemaPrice(item.price),
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      url,
      seller: { "@id": `${SITE_URL}/#store` },
      areaServed: BUSINESS.servesNearby.map((place) => ({ "@type": "City", name: place })),
    },
    // No `aggregateRating`. There are no reviews. Inventing one is the single fastest way to
    // earn a structured-data manual action, and it is fraud besides. It goes in when a real
    // review does.
  };

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absolute("/") },
      { "@type": "ListItem", position: 2, name: "Shop", item: absolute("/shop") },
      { "@type": "ListItem", position: 3, name: item.name, item: url },
    ],
  };

  return (
    <>
      <JsonLd data={product} />
      <JsonLd data={breadcrumbs} />

      <main>
        <PageHeader
          eyebrow={box ? "Gift Box" : "Candy"}
          title={item.name}
          lede={item.description}
          crumbs={[{ label: "Shop", href: "/shop" }, { label: item.name }]}
        />

        <div className="mx-auto max-w-6xl px-6 pb-32 sm:px-8 md:px-16">
          <div className="grid gap-16 md:grid-cols-2 md:gap-24">
            <section aria-labelledby="detail">
              <h2 id="detail" className="sr-only">
                Details
              </h2>

              <dl className="flex flex-col gap-6">
                <Row label="Price">
                  <span className="font-display text-4xl font-light tabular-nums">
                    {formatMoney(item.price)}
                  </span>
                  <span className="ms-2 text-sm text-cocoa-ink/55">
                    {box ? "for the empty box" : "per piece"}
                  </span>
                </Row>

                {box ? (
                  <Row label="Holds">
                    {item.capacity} candies — you choose every one of them
                  </Row>
                ) : null}

                <Row label="Made in">
                  {BUSINESS.primaryLocality}, {BUSINESS.region} — by hand, in small batches
                </Row>

                <Row label="Delivery">
                  Across {BUSINESS.servesNearby.slice(0, 4).join(", ")} and the rest of{" "}
                  {BUSINESS.region}. Shipped nationwide.
                </Row>
              </dl>
            </section>

            <section aria-labelledby="buy" className="flex flex-col gap-8">
              <h2 id="buy" className="font-display text-3xl font-light">
                {box ? "Fill this box" : "Put this in a box"}
              </h2>

              <p className="text-lg leading-relaxed text-cocoa-ink/55">
                {box
                  ? `Start with ${item.name} and choose the ${item.capacity} candies that go inside it. The price moves as you build.`
                  : `${item.name} is sold by the piece, inside a box you build yourself. Pick a box, then add as many as you like.`}
              </p>

              <Link
                href="/build-a-box"
                className="self-start rounded-full bg-hala-green px-8 py-4 text-xs tracking-widest text-cream uppercase transition-colors hover:bg-deep-green"
              >
                Build a box
              </Link>

              {isWhatsappConfigured() ? (
                <a
                  href={waLink(productEnquiryMessage(item.name))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="self-start rounded-full border border-cocoa-ink/20 px-8 py-4 text-xs tracking-widest uppercase transition-colors hover:border-saffron hover:text-saffron"
                >
                  Ask about this on WhatsApp
                </a>
              ) : null}
            </section>
          </div>
        </div>
      </main>
    </>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 border-b border-cocoa-ink/10 pb-6">
      <dt className="text-xs tracking-widest text-cocoa-ink/55 uppercase">{label}</dt>
      <dd className="text-lg leading-relaxed">{children}</dd>
    </div>
  );
}
