import type { Metadata } from "next";

import { WishlistView } from "@/components/features/WishlistView";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Your Wishlist",
  description: "Occasions you have saved at Al-Hala Candies.",
  robots: { index: false, follow: true },
};

export default function WishlistPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Saved"
        title="Wishlist"
        lede="The occasions you have set aside. Nothing here is reserved — everything is pressed to order."
        crumbs={[{ label: "Wishlist" }]}
      />
      <div className="grain relative bg-cream text-cocoa-ink">
        <div className="mx-auto max-w-6xl px-6 pb-24 sm:px-8 md:px-16">
          <WishlistView />
        </div>
      </div>
    </main>
  );
}
