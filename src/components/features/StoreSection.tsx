import Link from "next/link";

import { BUSINESS, formattedAddress, isPlaceholder } from "@/lib/business";

/**
 * The Ratnagiri section. A Server Component — no state, nothing to hydrate.
 *
 * This exists for one query: "best candy shop in Ratnagiri". Local search is won with
 * three things, and this section carries all three:
 *
 *   1. NAP on the page, in text, matching the Google Business Profile exactly.
 *   2. Genuine local specificity. Alphonso, cashew and kokum are Konkan facts, not
 *      marketing — and a real detail is what separates a page that ranks locally from one
 *      that says "premium quality" and is indistinguishable from every competitor.
 *   3. Named service towns. "We ship across India" is a claim; "we deliver to Chiplun and
 *      Ganpatipule" is an ANSWER, and an answer is what an assistant repeats.
 */

const CRAFT = [
  {
    title: "Ratnagiri Alphonso",
    body: "The mango the district is named for. In season, pressed into the fruit sweets and nothing else added to stretch it.",
  },
  {
    title: "Konkan cashew",
    body: "Grown on the coast, roasted in small batches, folded whole into the brittle rather than milled into dust.",
  },
  {
    title: "Kokum & saffron",
    body: "The sharpness that cuts sugar. Kokum from the Konkan, saffron for the wedding boxes.",
  },
];


export function StoreSection() {
  const hasAddress = !isPlaceholder(BUSINESS.streetAddress);
  const hasPhone = !isPlaceholder(BUSINESS.telephone);
  const hasMap = !isPlaceholder(BUSINESS.mapsUrl);

  return (
    <section
      aria-labelledby="store-heading"
      className="grain relative bg-deep-green text-cream"
    >
      <div className="mx-auto max-w-6xl px-6 py-24 sm:px-8 md:px-16 md:py-32">
        <div className="grid gap-16 md:grid-cols-2 md:gap-24">
          {/* Story */}
          <div className="flex flex-col items-start gap-6">
            <span className="text-xs tracking-widest text-saffron-ring uppercase">
              Made in Ratnagiri
            </span>

            <h2
              id="store-heading"
              className="font-display text-4xl leading-none font-light tracking-tight sm:text-5xl md:text-6xl"
            >
              A candy shop on the Konkan coast
            </h2>

            <span aria-hidden className="block h-px w-16 bg-saffron" />

            <p className="max-w-prose leading-relaxed text-cream/65">
              Al-Hala Candies is a handmade confectionery and gifting shop in{" "}
              {BUSINESS.primaryLocality}, {BUSINESS.region}. We press our sweets by hand,
              in small batches, from what the Konkan already grows well — Alphonso, cashew,
              kokum — alongside saffron, pistachio and rose.
            </p>

            <p className="max-w-prose leading-relaxed text-cream/65">
              Nothing here is bought in and re-boxed. That is the whole business.
            </p>

            <dl className="mt-8 grid gap-8">
              {CRAFT.map((entry) => (
                <div key={entry.title} className="border-s border-cream/15 ps-6">
                  <dt className="font-display text-2xl font-light">{entry.title}</dt>
                  <dd className="mt-2 max-w-prose leading-relaxed text-cream/55">
                    {entry.body}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Visit — the NAP block. This text must match the Google Business Profile
              character for character; a different abbreviation of "Road" splits the entity. */}
          <aside className="flex flex-col gap-8 md:pt-24">
            <div className="rounded-lg border border-cream/15 p-8">
              <h3 className="font-display text-3xl font-light">Visit the shop</h3>

              <address className="mt-6 flex flex-col gap-4 text-sm leading-relaxed text-cream/70 not-italic">
                {hasAddress ? (
                  <span>{formattedAddress()}</span>
                ) : (
                  <span className="text-cream/40">
                    {BUSINESS.primaryLocality}, {BUSINESS.region}, India
                  </span>
                )}

                {hasPhone ? (
                  <a
                    href={`tel:${BUSINESS.telephone.replace(/\s/g, "")}`}
                    className="transition-colors hover:text-saffron-ring"
                  >
                    {BUSINESS.telephone}
                  </a>
                ) : null}
              </address>

              <dl className="mt-8 flex flex-col gap-2 border-t border-cream/15 pt-8 text-sm text-cream/70">
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

              {hasMap ? (
                <a
                  href={BUSINESS.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex rounded-full bg-saffron px-8 py-4 text-xs tracking-widest text-deep-green uppercase transition-colors hover:bg-saffron-ring"
                >
                  Get directions
                </a>
              ) : null}
            </div>

            {/* Named towns, not a vague radius. This is the paragraph an assistant repeats
                when someone asks who delivers to Chiplun. */}
            <div className="rounded-lg border border-cream/15 p-8">
              <h3 className="font-display text-3xl font-light">Where we deliver</h3>
              <p className="mt-6 leading-relaxed text-cream/70">
                We deliver across Ratnagiri district — {BUSINESS.servesNearby.slice(1).join(", ")} — and
                ship anywhere in India. Gift orders travel with your note inside and no
                price on the packing slip.
              </p>
              <Link
                href="/build-a-box"
                className="mt-8 inline-flex text-xs tracking-widest text-saffron-ring uppercase transition-colors hover:text-saffron"
              >
                Build a box →
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
