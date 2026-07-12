"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { OCCASIONS } from "@/lib/occasions";
import { POSTS } from "@/lib/posts";

/**
 * Client-side search over the taxonomy and the journal.
 *
 * Everything this site knows is already in the bundle — eleven occasions and four posts —
 * so shipping a search backend for it would be absurd. When the catalogue grows past a few
 * hundred products this must become a real server search; until then a filter is honest,
 * instant, and costs one function.
 */
interface Hit {
  title: string;
  href: string;
  kind: string;
  blurb: string;
}

const INDEX: readonly Hit[] = [
  ...OCCASIONS.map((occasion) => ({
    title: occasion.title,
    href: `/occasions/${occasion.slug}`,
    kind: "Occasion",
    blurb: occasion.teaser,
  })),
  ...POSTS.map((post) => ({
    title: post.title,
    href: `/blog/${post.slug}`,
    kind: "Journal",
    blurb: post.description,
  })),
  {
    title: "Build a Box",
    href: "/build-a-box",
    kind: "Product",
    blurb: "Choose the box, fill it piece by piece, add a note.",
  },
];

export function SearchView() {
  const [query, setQuery] = useState("");

  const hits = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return INDEX.filter((hit) =>
      `${hit.title} ${hit.blurb} ${hit.kind}`.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <label htmlFor="q" className="text-xs tracking-widest text-cocoa-ink/55 uppercase">
          Search
        </label>
        <input
          id="q"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="eid, wedding, alphonso…"
          className="max-w-prose rounded-lg border border-cocoa-ink/15 bg-transparent p-4 focus:border-saffron"
        />
      </div>

      <p aria-live="polite" className="text-sm text-cocoa-ink/40">
        {query.trim().length < 2
          ? "Type at least two letters."
          : `${hits.length} result${hits.length === 1 ? "" : "s"}`}
      </p>

      <ul className="grid gap-px md:grid-cols-2">
        {hits.map((hit) => (
          <li key={hit.href}>
            <Link
              href={hit.href}
              className="flex h-full flex-col gap-2 border-t border-cocoa-ink/10 p-8 transition-colors hover:border-saffron/40 hover:bg-hala-green/5"
            >
              <span className="text-xs tracking-widest text-saffron uppercase">
                {hit.kind}
              </span>
              <span className="font-display text-2xl font-light">{hit.title}</span>
              <span className="leading-relaxed text-cocoa-ink/55">{hit.blurb}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
