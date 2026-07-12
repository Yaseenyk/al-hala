import { PageHeader } from "@/components/ui/PageHeader";
import type { LegalPage } from "@/lib/legal";

/** One renderer for all three legal pages — they share a silhouette, so they share a shell. */
export function LegalPageBody({ page }: { page: LegalPage }) {
  return (
    <main>
      <PageHeader
        eyebrow="The Fine Print"
        title={page.title}
        lede={page.description}
        crumbs={[{ label: page.title }]}
      />

      <div className="grain relative bg-cream text-cocoa-ink">
        <div className="mx-auto max-w-6xl px-6 pb-24 sm:px-8 md:px-16">
          <p className="text-xs tracking-widest text-cocoa-ink/40 uppercase">
            Last updated {page.updated}
          </p>

          {/* max-w-prose: line length caps around 65 characters. Long measure reads cheap,
              and on a legal page it is what makes people stop reading. */}
          <article className="mt-16 flex max-w-prose flex-col gap-8">
            {page.body.map((block, index) =>
              "h2" in block ? (
                <h2 key={index} className="mt-8 font-display text-3xl font-light">
                  {block.h2}
                </h2>
              ) : (
                <p key={index} className="text-lg leading-relaxed text-cocoa-ink/70">
                  {block.p}
                </p>
              ),
            )}
          </article>
        </div>
      </div>
    </main>
  );
}
