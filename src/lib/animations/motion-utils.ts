/**
 * Shared motion vocabulary.
 *
 * Variants are pure data. The one hook here (`useIsRtl`) is the exception, and it exists
 * because motion's `x` is the single thing in the stack that does NOT flip itself.
 */

import { useSyncExternalStore } from "react";
import type { Variants } from "motion/react";

/** Expressive out-quint. Fast departure, long settle — reads as weight, not speed. */
const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

const DEFAULT_DISTANCE = 32;

// ---------------------------------------------------------------------------
// RTL
// ---------------------------------------------------------------------------

/**
 * Logical CSS properties (`ps-*`, `me-*`, `text-start`) flip themselves under `dir="rtl"`.
 * A motion `x` transform does not — it is a raw transform on a physical axis, and no
 * amount of `dir` will touch it.
 *
 * So every x-axis value in this file is passed through `rtlX`. Skip it and an Arabic
 * reader sees content slide in from the wrong edge: the motion contradicts the reading
 * order, which is worse than no motion at all.
 */
export function rtlX(x: number, isRtl: boolean): number {
  return isRtl ? -x : x;
}

const subscribeToDir = () => () => {};

/**
 * Reads `dir` off <html>.
 *
 * `useSyncExternalStore` rather than useState + useEffect: `dir` is external DOM state,
 * and React 19's compiler lint rejects a setState in an effect body as a cascading
 * render. The server snapshot (`false`) keeps SSR markup LTR so hydration matches.
 */
export function useIsRtl(): boolean {
  return useSyncExternalStore(
    subscribeToDir,
    () => document.documentElement.dir === "rtl",
    () => false,
  );
}

// ---------------------------------------------------------------------------
// Variants
// ---------------------------------------------------------------------------

export const fadeIn: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_OUT },
  },
};

export function staggerContainer(stagger = 0.08, delayChildren = 0): Variants {
  return {
    hidden: {},
    visible: { transition: { staggerChildren: stagger, delayChildren } },
  };
}

/**
 * `start` / `end` are reading-order edges, not screen edges — the same words Tailwind's
 * logical properties use. `start` is the left in LTR and the right in RTL.
 */
export type SlideFrom = "start" | "end" | "top" | "bottom";

export function slideIn(
  from: SlideFrom,
  isRtl: boolean,
  distance = DEFAULT_DISTANCE,
): Variants {
  const offset: Record<SlideFrom, { x: number; y: number }> = {
    start: { x: rtlX(-distance, isRtl), y: 0 },
    end: { x: rtlX(distance, isRtl), y: 0 },
    top: { x: 0, y: -distance },
    bottom: { x: 0, y: distance },
  };

  return {
    hidden: { opacity: 0, ...offset[from] },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: 0.7, ease: EASE_OUT },
    },
  };
}
