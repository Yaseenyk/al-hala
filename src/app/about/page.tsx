import type { Metadata } from "next";

import { StoreSection } from "@/components/features/StoreSection";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Al-Hala Candies is a handmade confectionery and gift-box shop in Ratnagiri, on the Konkan coast. Alphonso, cashew and kokum, pressed by hand in small batches.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Our Story"
        title="We started with one box"
        lede="A wedding, two hundred guests, and no one in Ratnagiri making a favour worth keeping. So we made it ourselves, and then people kept asking."
        crumbs={[{ label: "Our Story" }]}
      />
      <StoreSection />
    </main>
  );
}
