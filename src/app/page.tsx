import { JsonLd } from "@/components/core/JsonLd";
import { FaqSection } from "@/components/features/FaqSection";
import { OccasionsGrid } from "@/components/features/OccasionsGrid";
import { ProductShowcase } from "@/components/features/ProductShowcase";
import { StoreSection } from "@/components/features/StoreSection";
import { BUSINESS, localBusinessSchema } from "@/lib/business";
import { faqSchema } from "@/lib/faq";
import { OCCASIONS } from "@/lib/occasions";
import { SITE, SITE_URL, absolute, asset } from "@/lib/site";

/**
 * Home. A Server Component — only the hero carousel and the header are client islands.
 *
 * Five JSON-LD graphs, and each one earns its place:
 *
 *   Organization  — who we are.
 *   WebSite       — the site, plus the sitelinks search box.
 *   Store         — THE LOCAL ONE. Address, geo, hours, service area. This is what
 *                   competes for "best candy shop in Ratnagiri" and the Maps local pack.
 *   ItemList      — the occasion taxonomy.
 *   FAQPage       — the answers. Eligible for rich results, and the block an assistant is
 *                   most likely to quote when asked about us.
 */

const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE.name,
  url: SITE_URL,
  logo: asset("/brand/alhala-mark-light.svg"),
  description: SITE.description,
  // Ties the brand entity to the physical shop, so Google resolves them as one thing
  // rather than two competing entities with the same name.
  location: { "@id": `${SITE_URL}/#store` },
  areaServed: BUSINESS.servesNearby,
};

const website = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: SITE.name,
  url: SITE_URL,
  publisher: { "@id": `${SITE_URL}/#organization` },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: absolute("/search?q={search_term_string}"),
    },
    "query-input": "required name=search_term_string",
  },
};

const occasionList = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Gifting occasions",
  itemListElement: OCCASIONS.map((occasion, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: occasion.title,
    url: absolute(`/occasions/${occasion.slug}`),
  })),
};

export default function Home() {
  return (
    <>
      <JsonLd data={organization} />
      <JsonLd data={website} />
      <JsonLd data={localBusinessSchema(SITE_URL)} />
      <JsonLd data={occasionList} />
      <JsonLd data={faqSchema()} />

      <main>
        <ProductShowcase />
        <OccasionsGrid />
        <StoreSection />
        <FaqSection />
      </main>
    </>
  );
}
