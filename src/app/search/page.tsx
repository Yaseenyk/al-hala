import type { Metadata } from "next";

import { SearchView } from "@/components/features/SearchView";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Search",
  description: "Search occasions, guides and gift boxes at Al-Hala Candies.",
  // A search results page is infinite thin content. Never let a crawler index it.
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  return (
    <main>
      <PageHeader eyebrow="Find It" title="Search" crumbs={[{ label: "Search" }]} />
      <div className="grain relative bg-cream text-cocoa-ink">
        <div className="mx-auto max-w-6xl px-6 pb-24 sm:px-8 md:px-16">
          <SearchView />
        </div>
      </div>
    </main>
  );
}
