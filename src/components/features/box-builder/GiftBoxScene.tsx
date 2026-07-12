"use client";

import dynamic from "next/dynamic";

import type { GiftBoxCanvasProps } from "./GiftBoxCanvas";

/**
 * The lazy boundary for the 3D layer.
 *
 * three.js + R3F + drei is the heaviest thing in the app by a wide margin — 880kB in one
 * chunk. Statically imported it lands in the initial bundle and blocks first paint on
 * every route that touches it, which is the one cost a search-driven gifting business
 * cannot absorb.
 *
 * The split only happens because `GiftBoxCanvas` lives in its OWN module. `next/dynamic`
 * pointed at a component in this same file produces no chunk at all — the import is
 * already resolved by then. That separation is the entire reason these are two files.
 *
 * Verified: the three.js chunk does not appear in the prerendered HTML's script tags.
 *
 * `ssr: false` because WebGL needs a real canvas — three touches `document` on init, and
 * there is nothing meaningful to prerender anyway.
 */
const GiftBoxCanvas = dynamic(() => import("./GiftBoxCanvas"), {
  ssr: false,
  loading: () => (
    <div aria-hidden className="size-full animate-pulse rounded-full bg-accent/5 blur-2xl" />
  ),
});

interface GiftBoxSceneProps extends GiftBoxCanvasProps {
  className?: string;
}

export function GiftBoxScene({ className, ...canvasProps }: GiftBoxSceneProps) {
  return (
    <div className={className}>
      <GiftBoxCanvas {...canvasProps} />
    </div>
  );
}
