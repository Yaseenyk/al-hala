import { JsonLd } from "@/components/core/JsonLd";
import { OccasionsGrid } from "@/components/features/OccasionsGrid";
import { ProductShowcase } from "@/components/features/ProductShowcase";
import { OCCASIONS } from "@/lib/occasions";

/**
 * Home. A Server Component — only the carousel below is a client island.
 *
 * The JSON-LD is not optional. CLAUDE.md §3: the home page carries `Organization` +
 * `WebSite`, and a category surface carries an `ItemList`. Search is the channel for a
 * gifting business, not a polish task.
 */

const SITE = "https://al-hala.example"; // TODO: real origin before launch.

const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Al-Hala Candies",
  url: SITE,
  logo: `${SITE}/brand/alhala-mark-light.svg`,
  description:
    "Premium handmade confectionery and custom gift boxes for every occasion.",
};

const website = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Al-Hala Candies",
  url: SITE,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE}/search?q={search_term_string}`,
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
    url: `${SITE}/occasions/${occasion.slug}`,
  })),
};

export default function Home() {
  return (
    <>
      <JsonLd data={organization} />
      <JsonLd data={website} />
      <JsonLd data={occasionList} />

      <main>
        <ProductShowcase />
        <OccasionsGrid />
      </main>
    </>
  );
}
