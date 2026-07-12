import Link from "next/link";

/**
 * The standard page opening: breadcrumb, eyebrow, h1, gold rule, lede.
 *
 * One component so that every page in the site has the same silhouette. Nine pages that
 * each invent their own heading rhythm is nine pages that look like nine different sites.
 */

export interface Crumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  lede?: string;
  /** Home is prepended automatically; do not pass it. */
  crumbs?: readonly Crumb[];
}

export function PageHeader({ eyebrow, title, lede, crumbs = [] }: PageHeaderProps) {
  return (
    <section className="grain relative bg-cream text-cocoa-ink">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:px-8 md:px-16 md:pt-24">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 text-xs tracking-widest uppercase">
            <li>
              <Link href="/" className="text-cocoa-ink/50 hover:text-saffron">
                Home
              </Link>
            </li>
            {crumbs.map((crumb, index) => (
              <li key={crumb.label} className="flex items-center gap-2">
                <span aria-hidden className="text-cocoa-ink/30">
                  /
                </span>
                {crumb.href && index < crumbs.length - 1 ? (
                  <Link href={crumb.href} className="text-cocoa-ink/50 hover:text-saffron">
                    {crumb.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-cocoa-ink">
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-16 flex flex-col items-start gap-6">
          <span className="text-xs tracking-widest text-saffron uppercase">{eyebrow}</span>
          {/* Exactly one h1 per page. Every page in this site gets it from here. */}
          <h1 className="max-w-3xl font-display text-5xl leading-none font-light tracking-tight md:text-7xl">
            {title}
          </h1>
          <span aria-hidden className="block h-px w-16 bg-saffron" />
          {lede ? (
            <p className="max-w-prose text-lg leading-relaxed text-cocoa-ink/55">{lede}</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
