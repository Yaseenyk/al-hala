import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/core/JsonLd";
import { PageHeader } from "@/components/ui/PageHeader";
import { POSTS } from "@/lib/posts";
import { absolute } from "@/lib/site";

export const metadata: Metadata = {
  title: "The Journal — Gifting Guides",
  description:
    "Gifting guides from Al-Hala Candies, Ratnagiri. How many wedding favours you need, when to order for Eid, and why Ratnagiri Alphonso tastes different.",
  alternates: { canonical: "/blog" },
};

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "The Al-Hala Journal",
  url: absolute("/blog"),
  blogPost: POSTS.map((post) => ({
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    url: absolute(`/blog/${post.slug}`),
  })),
};

export default function BlogIndex() {
  return (
    <>
      <JsonLd data={blogSchema} />
      <main>
        <PageHeader
          eyebrow="The Journal"
          title="Gifting, explained"
          lede="How many favours you actually need. When to order for Eid. Why the mango only tastes like that for ten weeks. Written by the people who press it."
          crumbs={[{ label: "Journal" }]}
        />

        <div className="grain relative bg-cream text-cocoa-ink">
          <div className="mx-auto max-w-6xl px-6 pb-24 sm:px-8 md:px-16">
            <ul className="grid gap-px md:grid-cols-2">
              {POSTS.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group flex h-full flex-col gap-4 border-t border-cocoa-ink/10 p-8 transition-colors hover:border-saffron/40 hover:bg-hala-green/5"
                  >
                    <div className="flex items-center justify-between gap-4 text-xs tracking-widest uppercase">
                      <span className="text-saffron">{post.tag}</span>
                      <span className="text-cocoa-ink/40 tabular-nums">
                        {post.readingMinutes} min
                      </span>
                    </div>
                    <h2 className="font-display text-3xl leading-tight font-light">
                      {post.title}
                    </h2>
                    <p className="flex-1 leading-relaxed text-cocoa-ink/55">
                      {post.description}
                    </p>
                    <span className="text-xs tracking-widest text-saffron uppercase">
                      Read →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </>
  );
}
