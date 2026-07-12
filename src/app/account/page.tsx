import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Account",
  description: "Sign in to your Al-Hala Candies account.",
  robots: { index: false, follow: true },
};

/**
 * ⚠️ THERE IS NO AUTH.
 *
 * No provider is chosen, because auth is downstream of the commerce backend decision that
 * is still open (docs/architecture.md — customer accounts usually belong to the commerce
 * platform, not to the storefront).
 *
 * So this page does not pretend. It is a real page that says plainly what is not built,
 * rather than a fake login that accepts a password and does nothing with it — which would
 * be both a lie and, if anyone typed a real password into it, a genuine hazard.
 */
export default function AccountPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Your Account"
        title="Account"
        lede="Order history, saved boxes, and addresses — once accounts are live."
        crumbs={[{ label: "Account" }]}
      />
      <div className="grain relative bg-cream text-cocoa-ink">
        <div className="mx-auto max-w-6xl px-6 pb-24 sm:px-8 md:px-16">
          <div className="max-w-prose rounded-lg border border-saffron/40 bg-saffron/5 p-8">
            <h2 className="font-display text-2xl font-light">Accounts are not live yet</h2>
            <p className="mt-4 leading-relaxed text-cocoa-ink/60">
              You do not need an account to order. Build a box, and call the shop to
              confirm — we will take it from there. When accounts open, your order history
              and saved boxes will live here.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/build-a-box"
                className="rounded-full bg-hala-green px-8 py-4 text-xs tracking-widest text-cream uppercase transition-colors hover:bg-deep-green"
              >
                Build a box
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-cocoa-ink/20 px-8 py-4 text-xs tracking-widest uppercase transition-colors hover:border-saffron"
              >
                Contact the shop
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
