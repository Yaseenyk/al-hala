"use client";

import { motion, useReducedMotion } from "motion/react";

import {
  floatingElement,
  twinkle,
  type FloatCustom,
  type TwinkleCustom,
} from "@/lib/animations/slider-variants";

/**
 * The decorative field behind the hero.
 *
 * Line art, not fills. A stroked outline at 1px reads as engraving and jewellery; a solid
 * fill at this scale reads as a sticker. It is the single decision that keeps a field of
 * floating candy from looking like a children's party invitation.
 *
 * Everything here is hand-drawn on a 24×24 grid. Nothing is licensed, nothing is
 * downloaded, and it all inherits the current text colour — so it recolours itself per
 * slide for free.
 */

/** Fixed positions, never Math.random(): random would differ between server and client
 *  render and blow up hydration. */
type Shape = "candy" | "lollipop" | "star" | "sparkle" | "crescent" | "petal" | "diamond";

const PATHS: Record<Shape, string> = {
  // Wrapped bonbon: a round body with pinched, fanned wrappers either side.
  candy:
    "M8.6 12a3.4 3.4 0 1 0 6.8 0 3.4 3.4 0 1 0-6.8 0M8.6 12 4.4 8.7l1 3.3-1 3.3zM15.4 12l4.2-3.3-1 3.3 1 3.3z",
  // Lollipop: a spiral head on a stick.
  lollipop:
    "M12 2.6a4.7 4.7 0 1 1 0 9.4 4.7 4.7 0 0 1 0-9.4M12 5a2.3 2.3 0 0 1 0 4.6 1.2 1.2 0 0 1 0-2.3M12 12v9.4",
  // Four-point star, drawn out and sharp — not a puffy sparkle.
  star: "M12 1c1.2 7 3.8 9.8 10 11-6.2 1.2-8.8 4-10 11-1.2-7-3.8-9.8-10-11C8.2 10.8 10.8 8 12 1Z",
  // A cross-glint. The thing that says "this catches light".
  sparkle: "M12 3v18M3 12h18M6.5 6.5l11 11M17.5 6.5l-11 11",
  crescent: "M16.5 3a10 10 0 1 0 4 12A8 8 0 0 1 16.5 3Z",
  petal: "M12 2c6 5 6 15 0 20-6-5-6-15 0-20Z",
  diamond: "M12 2 21 12 12 22 3 12Z",
};

interface Ornament {
  id: string;
  shape: Shape;
  /** Percentages — the 8pt grid governs layout, not decorative scatter. */
  top: string;
  start: string;
  /** Legal spacing steps only. size-3/size-5 do not exist. */
  size: string;
  /** A NUMBER, not an `opacity-*` class: the hero scales it per slide by `emphasis`, and a
   *  static utility cannot be multiplied at runtime. */
  opacity: number;
  float: FloatCustom;
}

/** Drifting objects: candies, lollipops, petals. Bigger, slower, sparser. */
const DRIFTERS: readonly Ornament[] = [
  {
    id: "candy-1",
    shape: "candy",
    top: "18%",
    start: "8%",
    size: "size-16",
    opacity: 0.3,
    float: { distance: 16, rotate: 10, duration: 11 },
  },
  {
    id: "lolli-1",
    shape: "lollipop",
    top: "62%",
    start: "13%",
    size: "size-12",
    opacity: 0.25,
    float: { distance: 12, rotate: -8, duration: 13, delay: 1.4 },
  },
  {
    id: "candy-2",
    shape: "candy",
    top: "72%",
    start: "82%",
    size: "size-12",
    opacity: 0.25,
    float: { distance: 14, rotate: -12, duration: 12, delay: 0.7 },
  },
  {
    id: "petal-1",
    shape: "petal",
    top: "14%",
    start: "88%",
    size: "size-10",
    opacity: 0.3,
    float: { distance: 14, rotate: 14, duration: 14, delay: 2.1 },
  },
  {
    id: "crescent-1",
    shape: "crescent",
    top: "42%",
    start: "94%",
    size: "size-8",
    opacity: 0.2,
    float: { distance: 10, rotate: -6, duration: 15, delay: 1 },
  },
  {
    id: "diamond-1",
    shape: "diamond",
    top: "84%",
    start: "40%",
    size: "size-6",
    opacity: 0.2,
    float: { distance: 18, rotate: 8, duration: 16, delay: 2.6 },
  },
  {
    id: "lolli-2",
    shape: "lollipop",
    top: "8%",
    start: "62%",
    size: "size-10",
    opacity: 0.2,
    float: { distance: 12, rotate: 9, duration: 17, delay: 3 },
  },
];

/**
 * A denser layer, rendered ONLY when a slide sets `emphasis > 1`. It fills the middle band
 * the base scatter leaves open, so "candies flowing" reads as flow and not as two lonely
 * bonbons. Kept off every other slide, which is why it is a separate set and not baked into
 * DRIFTERS.
 */
const EXTRA_DRIFTERS: readonly Ornament[] = [
  {
    id: "x-candy-1",
    shape: "candy",
    top: "34%",
    start: "34%",
    size: "size-10",
    opacity: 0.22,
    float: { distance: 14, rotate: -10, duration: 12, delay: 0.5 },
  },
  {
    id: "x-lolli-1",
    shape: "lollipop",
    top: "52%",
    start: "56%",
    size: "size-12",
    opacity: 0.2,
    float: { distance: 12, rotate: 8, duration: 14, delay: 1.7 },
  },
  {
    id: "x-candy-2",
    shape: "candy",
    top: "80%",
    start: "54%",
    size: "size-8",
    opacity: 0.24,
    float: { distance: 16, rotate: 12, duration: 13, delay: 2.4 },
  },
  {
    id: "x-petal-1",
    shape: "petal",
    top: "30%",
    start: "50%",
    size: "size-8",
    opacity: 0.22,
    float: { distance: 12, rotate: -8, duration: 15, delay: 3.2 },
  },
];

interface Star {
  id: string;
  shape: "star" | "sparkle";
  top: string;
  start: string;
  size: string;
  twinkle: TwinkleCustom;
}

/** Twinkling stars: small, many, unsynchronised. These carry most of the life. */
const STARS: readonly Star[] = [
  { id: "s1", shape: "star", top: "10%", start: "24%", size: "size-6", twinkle: { duration: 4 } },
  { id: "s2", shape: "sparkle", top: "26%", start: "72%", size: "size-4", twinkle: { duration: 5, delay: 1.2 } },
  { id: "s3", shape: "star", top: "50%", start: "5%", size: "size-4", twinkle: { duration: 6, delay: 0.6 } },
  { id: "s4", shape: "sparkle", top: "78%", start: "22%", size: "size-6", twinkle: { duration: 4.5, delay: 2.3 } },
  { id: "s5", shape: "star", top: "34%", start: "90%", size: "size-4", twinkle: { duration: 5.5, delay: 1.8 } },
  { id: "s6", shape: "sparkle", top: "88%", start: "68%", size: "size-4", twinkle: { duration: 4, delay: 3.1 } },
  { id: "s7", shape: "star", top: "6%", start: "44%", size: "size-4", twinkle: { duration: 6.5, delay: 2.7 } },
  { id: "s8", shape: "sparkle", top: "58%", start: "78%", size: "size-6", twinkle: { duration: 5, delay: 0.4 } },
  { id: "s9", shape: "star", top: "92%", start: "12%", size: "size-4", twinkle: { duration: 4.8, delay: 1.5 } },
  { id: "s10", shape: "sparkle", top: "20%", start: "36%", size: "size-4", twinkle: { duration: 5.2, delay: 3.4 } },
];

interface HeroOrnamentsProps {
  /** Tailwind text colour class. Everything strokes with currentColor, so this recolours
   *  the whole field per slide. */
  tone: string;
  /** Explicit on/off. OMIT it — as a server-rendered page must — and the field respects the
   *  viewer's reduced-motion preference on its own. The carousel passes it because it
   *  already computes the preference for the whole slide. */
  animate?: boolean;
  /** Scales the drifting field's opacity and, above 1, adds the denser `EXTRA_DRIFTERS`
   *  layer. Default 1 leaves the field byte-for-byte its restrained self. */
  emphasis?: number;
}

export function HeroOrnaments({ tone, animate, emphasis = 1 }: HeroOrnamentsProps) {
  const reduceMotion = useReducedMotion();
  const isAnimating = animate ?? !reduceMotion;
  const drifters = emphasis > 1 ? [...DRIFTERS, ...EXTRA_DRIFTERS] : DRIFTERS;

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${tone}`}
    >
      {drifters.map((ornament) => (
        <motion.svg
          key={ornament.id}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1}
          strokeLinecap="round"
          strokeLinejoin="round"
          // transition-opacity so a slide's emphasis eases in with its colour crossfade
          // rather than snapping. Cap at 0.75 — a background field never becomes foreground.
          className={`absolute ${ornament.size} transition-opacity duration-700`}
          style={{
            top: ornament.top,
            insetInlineStart: ornament.start,
            opacity: Math.min(ornament.opacity * emphasis, 0.75),
          }}
          variants={floatingElement}
          custom={ornament.float}
          initial="still"
          animate={isAnimating ? "float" : "still"}
        >
          <path d={PATHS[ornament.shape]} />
        </motion.svg>
      ))}

      {STARS.map((star) => (
        <motion.svg
          key={star.id}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`absolute ${star.size}`}
          style={{ top: star.top, insetInlineStart: star.start }}
          variants={twinkle}
          custom={star.twinkle}
          initial="still"
          // Under reduced motion they hold at a steady 50% — present, but not pulsing.
          animate={isAnimating ? "twinkling" : "still"}
        >
          <path d={PATHS[star.shape]} />
        </motion.svg>
      ))}
    </div>
  );
}
