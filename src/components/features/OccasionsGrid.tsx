import Link from "next/link";

import { OCCASIONS } from "@/lib/occasions";

/**
 * Every occasion, all visible at once.
 *
 * A Server Component — no state, no handlers, nothing to hydrate. It is also the reason
 * the carousel above only carries four: an occasion buried at slide nine is an occasion
 * nobody sees, and every one of these is a real <a> a crawler can follow.
 */
export function OccasionsGrid() {
  return (
    <section
      id="occasions"
      aria-labelledby="occasions-heading"
      className="grain relative bg-cream text-cocoa-ink"
    >
      <div className="mx-auto max-w-6xl px-8 py-24 md:px-16 md:py-32">
        <header className="flex flex-col items-start gap-6">
          <span className="text-xs tracking-widest text-saffron uppercase">
            Every Occasion
          </span>
          <h2
            id="occasions-heading"
            className="max-w-2xl font-display text-5xl leading-none font-light tracking-tight md:text-7xl"
          >
            There is a box for it
          </h2>
          <span aria-hidden className="block h-px w-16 bg-saffron" />
          <p className="max-w-prose text-lg leading-relaxed text-cocoa-ink/55">
            Weddings and condolences. Eid and a Tuesday. We have been asked for all of it,
            and we have said yes to all of it.
          </p>
        </header>

        <ul className="mt-24 grid gap-px md:grid-cols-2 lg:grid-cols-3">
          {OCCASIONS.map((occasion) => (
            <li key={occasion.id}>
              <Link
                href={`/occasions/${occasion.slug}`}
                className="group flex h-full flex-col gap-4 border-t border-cocoa-ink/10 p-8 transition-colors duration-500 hover:border-saffron/40 hover:bg-hala-green/5"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-xs tracking-widest text-cocoa-ink/30 tabular-nums">
                    {occasion.index}
                  </span>
                  {occasion.arabic ? (
                    <span
                      lang="ar"
                      dir="rtl"
                      className="font-arabic text-lg text-saffron/70"
                    >
                      {occasion.arabic}
                    </span>
                  ) : null}
                </div>

                <h3 className="font-display text-3xl leading-tight font-light">
                  {occasion.title}
                </h3>

                <p className="flex-1 leading-relaxed text-cocoa-ink/55">
                  {occasion.teaser}
                </p>

                <span className="flex items-center gap-2 text-xs tracking-widest text-saffron uppercase">
                  Explore
                  <span className="inline-block rtl:-scale-x-100">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                      className="size-4 transition-transform duration-500 group-hover:translate-x-2"
                    >
                      <path d="M4 12h15M13 6l6 6-6 6" />
                    </svg>
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
