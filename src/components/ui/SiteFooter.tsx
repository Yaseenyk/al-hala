import Link from "next/link";

import { BUSINESS, formattedAddress, isPlaceholder } from "@/lib/business";
import { SOCIALS } from "@/lib/nav";
import { OCCASIONS } from "@/lib/occasions";
import { SITE } from "@/lib/site";

/**
 * The footer. A Server Component — no state, nothing to hydrate.
 *
 * It carries the NAP a second time, on every page in the site. That is not duplication for
 * its own sake: a footer address that appears site-wide is one of the signals Google uses
 * to bind a domain to a place. It must match the Google Business Profile character for
 * character, exactly like the one in StoreSection — two spellings of the same address is
 * two entities, and neither ranks.
 */


const COMPANY = [
  { label: "Our Story", href: "/about" },
  { label: "Journal", href: "/blog" },
  { label: "Contact", href: "/contact" },
  { label: "Build a Box", href: "/build-a-box" },
];

const LEGAL = [
  { label: "Shipping & Returns", href: "/shipping" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

export function SiteFooter() {
  const year = 2026;

  return (
    <footer className="grain relative bg-deep-green text-cream">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:px-8 md:px-16">
        <div className="grid gap-16 md:grid-cols-4">
          {/* Brand + NAP */}
          <div className="flex flex-col gap-6 md:col-span-1">
            <span className="font-display text-xl tracking-widest uppercase">Al-Hala</span>
            <p className="max-w-prose text-sm leading-relaxed text-cream/60">
              Handmade candy and keepsake gift boxes, pressed by hand in{" "}
              {BUSINESS.primaryLocality} on the Konkan coast.
            </p>

            <address className="flex flex-col gap-2 text-sm leading-relaxed text-cream/60 not-italic">
              {isPlaceholder(BUSINESS.streetAddress) ? (
                <span>
                  {BUSINESS.primaryLocality}, {BUSINESS.region}, India
                </span>
              ) : (
                <span>{formattedAddress()}</span>
              )}
              {isPlaceholder(BUSINESS.telephone) ? null : (
                <a
                  href={`tel:${BUSINESS.telephone.replace(/\s/g, "")}`}
                  className="hover:text-saffron-ring"
                >
                  {BUSINESS.telephone}
                </a>
              )}
              {isPlaceholder(BUSINESS.email) ? null : (
                <a href={`mailto:${BUSINESS.email}`} className="hover:text-saffron-ring">
                  {BUSINESS.email}
                </a>
              )}
            </address>
          </div>

          {/* Occasions — every one, linked. The footer is a crawl path as much as a menu. */}
          <nav aria-labelledby="footer-occasions">
            <h2
              id="footer-occasions"
              className="text-xs tracking-widest text-saffron-ring uppercase"
            >
              Occasions
            </h2>
            <ul className="mt-6 flex flex-col gap-4 text-sm">
              {OCCASIONS.map((occasion) => (
                <li key={occasion.id}>
                  <Link
                    href={`/occasions/${occasion.slug}`}
                    className="text-cream/60 transition-colors hover:text-saffron-ring"
                  >
                    {occasion.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-company">
            <h2
              id="footer-company"
              className="text-xs tracking-widest text-saffron-ring uppercase"
            >
              Al-Hala
            </h2>
            <ul className="mt-6 flex flex-col gap-4 text-sm">
              {COMPANY.map((entry) => (
                <li key={entry.href}>
                  <Link
                    href={entry.href}
                    className="text-cream/60 transition-colors hover:text-saffron-ring"
                  >
                    {entry.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h2 className="mt-8 text-xs tracking-widest text-saffron-ring uppercase">
              Help
            </h2>
            <ul className="mt-6 flex flex-col gap-4 text-sm">
              {LEGAL.map((entry) => (
                <li key={entry.href}>
                  <Link
                    href={entry.href}
                    className="text-cream/60 transition-colors hover:text-saffron-ring"
                  >
                    {entry.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Hours + socials */}
          <div className="flex flex-col gap-8">
            <div>
              <h2 className="text-xs tracking-widest text-saffron-ring uppercase">
                Shop hours
              </h2>
              <dl className="mt-6 flex flex-col gap-2 text-sm text-cream/60">
                {BUSINESS.openingHours.map((slot) => (
                  <div key={slot.days[0]} className="flex justify-between gap-4">
                    <dt>
                      {slot.days.length > 1
                        ? `${slot.days[0]!.slice(0, 3)}–${slot.days.at(-1)!.slice(0, 3)}`
                        : slot.days[0]!.slice(0, 3)}
                    </dt>
                    <dd className="tabular-nums">
                      {slot.opens}–{slot.closes}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div>
              <h2 className="text-xs tracking-widest text-saffron-ring uppercase">
                Follow
              </h2>
              <ul className="mt-6 flex items-center gap-2">
                {SOCIALS.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      // Without noreferrer the opened tab gets a window.opener handle back
                      // into this one and can redirect it.
                      rel="noopener noreferrer"
                      aria-label={`Al-Hala on ${social.label}`}
                      className="grid size-12 place-items-center rounded-full text-cream/60 transition-colors hover:bg-cream/5 hover:text-saffron-ring"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-4">
                        <path d={social.d} />
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-24 flex flex-col justify-between gap-4 border-t border-cream/10 pt-8 text-xs text-cream/40 md:flex-row">
          <p>
            © {year} {SITE.name}. Made in {BUSINESS.primaryLocality}, India.
          </p>
          <p lang="ar" dir="rtl" className="font-arabic text-sm">
            الحلا
          </p>
        </div>
      </div>
    </footer>
  );
}
