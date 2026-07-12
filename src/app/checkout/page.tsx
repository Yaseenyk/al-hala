import type { Metadata } from "next";

import { CheckoutForm } from "@/components/features/CheckoutForm";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your Al-Hala order.",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Almost There"
        title="Checkout"
        lede="Where is it going, and who is it for? We will call to confirm before anything is pressed."
        crumbs={[{ label: "Checkout" }]}
      />
      <div className="grain relative bg-cream text-cocoa-ink">
        <div className="mx-auto max-w-6xl px-6 pb-24 sm:px-8 md:px-16">
          <CheckoutForm />
        </div>
      </div>
    </main>
  );
}
