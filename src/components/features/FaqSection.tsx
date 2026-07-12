import { FAQS } from "@/lib/faq";

/**
 * The FAQ. A Server Component, and deliberately built on native <details>/<summary>.
 *
 * No JavaScript, for a reason that matters more than the kilobytes: an accordion whose
 * answers only enter the DOM after hydration is an accordion a crawler and an LLM fetcher
 * may never read. `<details>` ships every answer in the HTML, collapsed by CSS, readable
 * by everything — while still being keyboard-operable and screen-reader-announced for free.
 *
 * This is the highest-leverage block on the page for AI search: these answers are written
 * to be QUOTED, and an assistant can only quote text it actually received.
 */
export function FaqSection() {
  return (
    <section
      aria-labelledby="faq-heading"
      className="grain relative bg-cream text-cocoa-ink"
    >
      <div className="mx-auto max-w-6xl px-6 py-24 sm:px-8 md:px-16 md:py-32">
        <div className="grid gap-16 md:grid-cols-3 md:gap-24">
          <header className="flex flex-col items-start gap-6">
            <span className="text-xs tracking-widest text-saffron uppercase">
              Questions
            </span>
            <h2
              id="faq-heading"
              className="font-display text-4xl leading-none font-light tracking-tight md:text-5xl"
            >
              The things people ask
            </h2>
            <span aria-hidden className="block h-px w-16 bg-saffron" />
            <p className="max-w-prose leading-relaxed text-cocoa-ink/55">
              And the honest answers. If yours is not here, ask us — we answer the phone.
            </p>
          </header>

          <div className="md:col-span-2">
            <ul className="flex flex-col">
              {FAQS.map((faq) => (
                <li key={faq.question}>
                  <details className="group border-t border-cocoa-ink/10">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-8 py-8 text-start transition-colors hover:text-saffron">
                      <h3 className="font-display text-xl font-light md:text-2xl">
                        {faq.question}
                      </h3>
                      {/* Rotates on open. `group-open:` is a native CSS state — no JS. */}
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        strokeLinecap="round"
                        aria-hidden
                        className="size-6 shrink-0 transition-transform duration-300 group-open:rotate-45"
                      >
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </summary>
                    <p className="max-w-prose pb-8 leading-relaxed text-cocoa-ink/60">
                      {faq.answer}
                    </p>
                  </details>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
