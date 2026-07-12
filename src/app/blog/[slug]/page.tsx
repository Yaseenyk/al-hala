import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/core/JsonLd";
import { PageHeader } from "@/components/ui/PageHeader";
import { POSTS, postBySlug } from "@/lib/posts";
import { SITE, SITE_URL, absolute, asset } from "@/lib/site";

interface Params {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return POSTS.map((post) => ({ slug: post.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = postBySlug(slug);
  if (!post) return {};

  return {
    title: post.metaTitle,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      url: `/blog/${post.slug}`,
      title: post.metaTitle,
      description: post.description,
      publishedTime: post.date,
      images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: post.title }],
    },
  };
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const post = postBySlug(slug);
  if (!post) notFound();

  const others = POSTS.filter((entry) => entry.slug !== post.slug).slice(0, 2);

  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@id": `${SITE_URL}/#organization` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    mainEntityOfPage: absolute(`/blog/${post.slug}`),
    image: asset(SITE.ogImage),
  };

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absolute("/") },
      { "@type": "ListItem", position: 2, name: "Journal", item: absolute("/blog") },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: absolute(`/blog/${post.slug}`),
      },
    ],
  };

  return (
    <>
      <JsonLd data={article} />
      <JsonLd data={breadcrumbs} />

      <main>
        <PageHeader
          eyebrow={post.tag}
          title={post.title}
          crumbs={[{ label: "Journal", href: "/blog" }, { label: post.title }]}
        />

        <div className="grain relative bg-cream text-cocoa-ink">
          <div className="mx-auto max-w-6xl px-6 pb-24 sm:px-8 md:px-16">
            {/* max-w-prose: line length caps at ~65 characters. Long measure reads cheap
                and it is the fastest way to make an article feel like a wall. */}
            <article className="flex max-w-prose flex-col gap-8">
              {post.body.map((block, index) =>
                "h2" in block ? (
                  <h2
                    key={index}
                    className="mt-8 font-display text-3xl leading-tight font-light"
                  >
                    {block.h2}
                  </h2>
                ) : (
                  <p key={index} className="text-lg leading-relaxed text-cocoa-ink/70">
                    {block.p}
                  </p>
                ),
              )}
            </article>

            <div className="mt-24 border-t border-cocoa-ink/10 pt-16">
              <Link
                href="/build-a-box"
                className="inline-flex rounded-full bg-hala-green px-8 py-4 text-xs tracking-widest text-cream uppercase transition-colors hover:bg-deep-green"
              >
                Build your box
              </Link>

              <h2 className="mt-24 font-display text-2xl font-light">Keep reading</h2>
              <ul className="mt-8 grid gap-px md:grid-cols-2">
                {others.map((other) => (
                  <li key={other.slug}>
                    <Link
                      href={`/blog/${other.slug}`}
                      className="flex h-full flex-col gap-4 border-t border-cocoa-ink/10 p-8 transition-colors hover:border-saffron/40 hover:bg-hala-green/5"
                    >
                      <span className="font-display text-2xl font-light">{other.title}</span>
                      <span className="leading-relaxed text-cocoa-ink/55">
                        {other.description}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
