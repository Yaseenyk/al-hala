import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/core/JsonLd";
import { GiftBoxMark } from "@/components/ui/GiftBoxMark";
import { BUSINESS } from "@/lib/business";
import { OCCASIONS, occasionBySlug } from "@/lib/occasions";
import { SITE, SITE_URL, absolute } from "@/lib/site";

/**
 * An occasion landing page. A Server Component — the only client JS on it is the header.
 *
 * `generateStaticParams` prerenders all eleven at build time: they are the SEO surface, and
 * a page that is rendered on demand is a page a crawler may time out on.
 */

interface Params {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return OCCASIONS.map((occasion) => ({ slug: occasion.slug }));
}

/** Anything not in the taxonomy 404s rather than rendering an empty shell. */
export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const occasion = occasionBySlug(slug);

  if (!occasion) return {};

  const url = `/occasions/${occasion.slug}`;

  return {
    title: occasion.metaTitle,
    description: occasion.metaDescription,
    // Without this, every occasion page canonicalises to "/" via the layout's default and
    // Google collapses all eleven into the home page.
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: occasion.metaTitle,
      description: occasion.metaDescription,
      images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: occasion.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: occasion.metaTitle,
      description: occasion.metaDescription,
      images: [SITE.ogImage],
    },
  };
}

export default async function OccasionPage({ params }: Params) {
  const { slug } = await params;
  const occasion = occasionBySlug(slug);

  if (!occasion) notFound();

  const others = OCCASIONS.filter((entry) => entry.id !== occasion.id).slice(0, 3);

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absolute("/") },
      { "@type": "ListItem", position: 2, name: "Occasions", item: absolute("/occasions") },
      {
        "@type": "ListItem",
        position: 3,
        name: occasion.title,
        item: absolute(`/occasions/${occasion.slug}`),
      },
    ],
  };

  /**
   * `CollectionPage` + `about`, tied back to the Store by `@id`.
   *
   * The `about` + `areaServed` pairing is what tells Google this page is about THIS
   * occasion IN Ratnagiri — which is the query. A page about "wedding favours" with no
   * place attached competes nationally against everyone and wins nothing.
   */
  const page = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: occasion.metaTitle,
    description: occasion.metaDescription,
    url: absolute(`/occasions/${occasion.slug}`),
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@type": "Thing", name: occasion.title },
    provider: { "@id": `${SITE_URL}/#store` },
    areaServed: BUSINESS.servesNearby.map((place) => ({
      "@type": "City",
      name: place,
    })),
  };

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <JsonLd data={page} />

      <main>
        {/* Hero */}
        <section className="grain relative bg-cream text-cocoa-ink">
          <div className="mx-auto max-w-6xl px-6 py-16 sm:px-8 md:px-16 md:py-24">
            <Breadcrumbs occasion={occasion.title} />

            <div className="mt-16 grid items-center gap-16 md:grid-cols-2 md:gap-24">
              <div className="flex flex-col items-start gap-6">
                <span className="text-xs tracking-widest text-saffron uppercase">
                  {occasion.eyebrow}
                </span>

                {/* Exactly one h1 per page. */}
                <h1 className="font-display text-5xl leading-none font-light tracking-tight md:text-7xl">
                  {occasion.title}
                </h1>

                {occasion.arabic ? (
                  <span lang="ar" dir="rtl" className="font-arabic text-2xl text-saffron">
                    {occasion.arabic}
                  </span>
                ) : null}

                <span aria-hidden className="block h-px w-16 bg-saffron" />

                <p className="max-w-prose text-lg leading-relaxed text-cocoa-ink/60">
                  {occasion.description}
                </p>

                <Link
                  href="/build-a-box"
                  className="group mt-4 inline-flex items-center gap-4 rounded-full bg-hala-green px-8 py-4 text-xs tracking-widest text-cream uppercase transition-colors duration-500 hover:bg-deep-green"
                >
                  Build your box
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
                </Link>
              </div>

              <div className="relative mx-auto size-64 md:size-80 lg:size-96">
                <GiftBoxMark tone="text-saffron" animate className="size-full" />
              </div>
            </div>
          </div>
        </section>

        {/* The copy that makes this page about THIS occasion and not the template. */}
        <section
          aria-labelledby="about-heading"
          className="grain relative bg-deep-green text-cream"
        >
          <div className="mx-auto max-w-6xl px-6 py-24 sm:px-8 md:px-16 md:py-32">
            <div className="grid gap-16 md:grid-cols-3 md:gap-24">
              <h2
                id="about-heading"
                className="font-display text-4xl leading-none font-light tracking-tight md:text-5xl"
              >
                {occasion.teaser}
              </h2>

              <div className="flex flex-col gap-6 md:col-span-2">
                {occasion.intro.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 24)}
                    className="max-w-prose text-lg leading-relaxed text-cream/70"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <dl className="mt-24 grid gap-px md:grid-cols-3">
              {occasion.highlights.map((highlight) => (
                <div
                  key={highlight.title}
                  className="flex flex-col gap-4 border-t border-cream/15 p-8"
                >
                  <dt className="font-display text-2xl font-light">{highlight.title}</dt>
                  <dd className="leading-relaxed text-cream/60">{highlight.body}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Local block. Every occasion page carries the town — that is the whole strategy. */}
        <section className="grain relative bg-cream text-cocoa-ink">
          <div className="mx-auto max-w-6xl px-6 py-24 sm:px-8 md:px-16">
            <div className="flex flex-col items-start gap-6">
              <span className="text-xs tracking-widest text-saffron uppercase">
                Delivered from Ratnagiri
              </span>
              <h2 className="max-w-3xl font-display text-3xl leading-tight font-light md:text-4xl">
                Made by hand in {BUSINESS.primaryLocality}, delivered across{" "}
                {BUSINESS.region} and shipped anywhere in India.
              </h2>
              <p className="max-w-prose leading-relaxed text-cocoa-ink/55">
                We deliver across Ratnagiri district — {BUSINESS.servesNearby.slice(1).join(", ")} —
                and ship nationwide. Gift orders travel with your note inside and no price on
                the packing slip.
              </p>
            </div>

            {/* Internal links. Eleven pages that do not link to each other are eleven
                orphans; a crawler reaches them once and never returns. */}
            <div className="mt-24 border-t border-cocoa-ink/10 pt-16">
              <h2 className="font-display text-2xl font-light">Other occasions</h2>
              <ul className="mt-8 grid gap-px md:grid-cols-3">
                {others.map((other) => (
                  <li key={other.id}>
                    <Link
                      href={`/occasions/${other.slug}`}
                      className="group flex h-full flex-col gap-4 border-t border-cocoa-ink/10 p-8 transition-colors hover:border-saffron/40 hover:bg-hala-green/5"
                    >
                      <span className="font-display text-2xl font-light">{other.title}</span>
                      <span className="leading-relaxed text-cocoa-ink/55">
                        {other.teaser}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/occasions"
                className="mt-8 inline-flex text-xs tracking-widest text-saffron uppercase hover:text-hala-green"
              >
                All occasions →
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

function Breadcrumbs({ occasion }: { occasion: string }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 text-xs tracking-widest uppercase">
        <li>
          <Link href="/" className="text-cocoa-ink/50 hover:text-saffron">
            Home
          </Link>
        </li>
        <li aria-hidden className="text-cocoa-ink/30">
          /
        </li>
        <li>
          <Link href="/occasions" className="text-cocoa-ink/50 hover:text-saffron">
            Occasions
          </Link>
        </li>
        <li aria-hidden className="text-cocoa-ink/30">
          /
        </li>
        <li aria-current="page" className="text-cocoa-ink">
          {occasion}
        </li>
      </ol>
    </nav>
  );
}
