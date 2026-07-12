import type { Metadata } from "next";

import { CartView } from "@/components/features/CartView";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Your Cart",
  description: "Review your Al-Hala gift boxes before checkout.",
  // A cart is per-visitor, has no search value, and would be a thin duplicate for every
  // crawler that reached it. Keep it out of the index deliberately.
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Your Order"
        title="Cart"
        crumbs={[{ label: "Cart" }]}
      />
      <div className="grain relative bg-cream text-cocoa-ink">
        <div className="mx-auto max-w-6xl px-6 pb-24 sm:px-8 md:px-16">
          <CartView />
        </div>
      </div>
    </main>
  );
}
