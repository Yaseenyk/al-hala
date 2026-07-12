import type { Metadata } from "next";

import { ContactForm } from "@/components/features/ContactForm";
import { PageHeader } from "@/components/ui/PageHeader";
import { BUSINESS, formattedAddress } from "@/lib/business";

export const metadata: Metadata = {
  title: "Contact & Visit the Shop",
  description:
    "Contact Al-Hala Candies in Ratnagiri. Call the shop, visit us, or send an enquiry about wedding favours, bulk and corporate gifting.",
  alternates: { canonical: "/contact" },
};

const isPlaceholder = (value: string) => value.startsWith("TODO");

export default function ContactPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Say Hello"
        title="Contact"
        lede="Bulk order, wedding favour count, or a question about what keeps and what does not. We answer the phone."
        crumbs={[{ label: "Contact" }]}
      />

      <div className="grain relative bg-cream text-cocoa-ink">
        <div className="mx-auto grid max-w-6xl gap-16 px-6 pb-24 sm:px-8 md:grid-cols-2 md:gap-24 md:px-16">
          <ContactForm />

          <aside className="flex flex-col gap-8">
            <div className="rounded-lg border border-cocoa-ink/10 p-8">
              <h2 className="font-display text-2xl font-light">The shop</h2>
              <address className="mt-6 flex flex-col gap-4 text-sm leading-relaxed text-cocoa-ink/60 not-italic">
                <span>
                  {isPlaceholder(BUSINESS.streetAddress)
                    ? `${BUSINESS.primaryLocality}, ${BUSINESS.region}, India`
                    : formattedAddress()}
                </span>
                {isPlaceholder(BUSINESS.telephone) ? null : (
                  <a href={`tel:${BUSINESS.telephone}`} className="hover:text-saffron">
                    {BUSINESS.telephone}
                  </a>
                )}
              </address>

              <dl className="mt-8 flex flex-col gap-2 border-t border-cocoa-ink/10 pt-8 text-sm text-cocoa-ink/60">
                {BUSINESS.openingHours.map((slot) => (
                  <div key={slot.days[0]} className="flex justify-between gap-8">
                    <dt>
                      {slot.days.length > 1
                        ? `${slot.days[0]!.slice(0, 3)}–${slot.days.at(-1)!.slice(0, 3)}`
                        : slot.days[0]!.slice(0, 3)}
                    </dt>
                    <dd className="tabular-nums">
                      {slot.opens} – {slot.closes}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="rounded-lg border border-cocoa-ink/10 p-8">
              <h2 className="font-display text-2xl font-light">We deliver to</h2>
              <p className="mt-6 leading-relaxed text-cocoa-ink/60">
                {BUSINESS.servesNearby.join(", ")} — and anywhere in India.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
