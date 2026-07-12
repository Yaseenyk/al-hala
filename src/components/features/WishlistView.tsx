"use client";

import Link from "next/link";

import { occasionBySlug } from "@/lib/occasions";
import { useCart, useHasMounted } from "@/store/cart";

/** The wishlist holds SLUGS, never copies of the item — a saved copy goes stale the moment
 *  the occasion copy is edited. It is a list of references, resolved at render. */
export function WishlistView() {
  const mounted = useHasMounted();
  const wishlist = useCart((state) => state.wishlist);
  const toggleWish = useCart((state) => state.toggleWish);

  if (!mounted) return <div className="min-h-96" aria-hidden />;

  if (wishlist.length === 0) {
    return (
      <div className="flex flex-col items-start gap-8">
        <p className="text-lg text-cocoa-ink/55">
          Nothing saved yet. Save an occasion and it will wait for you here.
        </p>
        <Link
          href="/occasions"
          className="rounded-full bg-hala-green px-8 py-4 text-xs tracking-widest text-cream uppercase transition-colors hover:bg-deep-green"
        >
          Browse occasions
        </Link>
      </div>
    );
  }

  return (
    <ul className="grid gap-px md:grid-cols-2 lg:grid-cols-3">
      {wishlist.map((slug) => {
        const occasion = occasionBySlug(slug);
        if (!occasion) return null;

        return (
          <li
            key={slug}
            className="flex flex-col gap-4 border-t border-cocoa-ink/10 p-8"
          >
            <Link
              href={`/occasions/${occasion.slug}`}
              className="font-display text-2xl font-light hover:text-saffron"
            >
              {occasion.title}
            </Link>
            <p className="flex-1 leading-relaxed text-cocoa-ink/55">{occasion.teaser}</p>
            <button
              type="button"
              onClick={() => toggleWish(slug)}
              className="self-start text-xs tracking-widest text-cocoa-ink/40 uppercase hover:text-saffron"
            >
              Remove
            </button>
          </li>
        );
      })}
    </ul>
  );
}
