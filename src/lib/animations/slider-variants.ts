/**
 * Motion variants for the hero showcase.
 *
 * Pure data — no React, no DOM. Kept out of the component so the animation language is
 * declared once and reused, rather than re-improvised per component.
 */

import type { Variants } from "motion/react";

/**
 * The house ease. A classic premium out-quint: leaves fast, settles long.
 *
 * Deliberately not a spring. Springs overshoot, and overshoot reads as playful — the
 * opposite of what a keepsake box costing four figures should feel like. A long-tailed
 * bezier reads as weight and control.
 */
const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
const EASE_IN_OUT: [number, number, number, number] = [0.65, 0, 0.35, 1];

/** How far a slide travels on enter/exit, in px. */
const SLIDE_DISTANCE = 64;

/** 1 = advancing to the next slide, -1 = going back. */
export type SlideDirection = 1 | -1;

export interface SlideCustom {
  direction: SlideDirection;
  isRtl: boolean;
}

/**
 * The RTL rule, applied to motion.
 *
 * Logical CSS properties flip themselves; a motion `x` transform does not — it is a
 * raw transform on a physical axis. So the sign is flipped by hand here. Without this,
 * an Arabic reader taps "next" (which points left in RTL) and the slide walks right:
 * the animation contradicts the button.
 */
const axis = (isRtl: boolean): 1 | -1 => (isRtl ? -1 : 1);

export const slideVariants: Variants = {
  enter: ({ direction, isRtl }: SlideCustom) => ({
    x: direction * axis(isRtl) * SLIDE_DISTANCE,
    opacity: 0,
    scale: 0.94,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 0.9, ease: EASE_OUT },
  },
  exit: ({ direction, isRtl }: SlideCustom) => ({
    x: -direction * axis(isRtl) * SLIDE_DISTANCE,
    opacity: 0,
    scale: 0.94,
    transition: { duration: 0.5, ease: EASE_IN_OUT },
  }),
};

/**
 * Masked text reveal.
 *
 * Each item rides up from fully below its own baseline. The parent of every item MUST
 * carry `overflow-hidden` — the mask is not decoration, it IS the effect. Without it the
 * text simply slides, which looks like a web animation; with it the line appears to be
 * set into place, which looks like print.
 *
 * `y: "110%"` rather than `100%`: descenders (g, y, ن) hang below the baseline and stay
 * visible as a row of stubs under the mask at exactly 100%.
 */
export const staggerTextContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.12 },
  },
  exit: {
    transition: { staggerChildren: 0.04, staggerDirection: -1 },
  },
};

export const staggerTextItem: Variants = {
  hidden: { y: "110%" },
  visible: {
    y: "0%",
    transition: { duration: 0.9, ease: EASE_OUT },
  },
  exit: {
    y: "-110%",
    transition: { duration: 0.4, ease: EASE_IN_OUT },
  },
};

export interface FloatCustom {
  /** Vertical travel in px. Keep small — this is depth, not motion. */
  distance?: number;
  /** Degrees of drift. */
  rotate?: number;
  duration?: number;
  delay?: number;
}

/**
 * Continuous drift for the decorative layer.
 *
 * Each element takes a different duration and delay so the layer never syncs up into a
 * single visible pulse — desynchronised drift is what sells parallax depth. Synchronised
 * drift just looks like the whole page is breathing.
 *
 * `still` exists for `prefers-reduced-motion`: an infinite loop is exactly the kind of
 * animation that triggers vestibular discomfort, and it can never be escaped by
 * scrolling past it.
 */
export const floatingElement: Variants = {
  still: { y: 0, rotate: 0 },
  float: ({ distance = 12, rotate = 4, duration = 6, delay = 0 }: FloatCustom = {}) => ({
    y: [0, -distance, 0],
    rotate: [0, rotate, 0],
    transition: {
      duration,
      delay,
      repeat: Infinity,
      repeatType: "loop" as const,
      ease: "easeInOut" as const,
    },
  }),
};

/**
 * The jewel's idle breath.
 *
 * 2% of scale over eight seconds. Large enough that the object reads as alive rather
 * than as a static asset the page forgot to load; small enough that you cannot catch it
 * moving if you look directly at it. Placeholder until the WebGL box lands.
 */
export const breathe: Variants = {
  still: { scale: 1 },
  breathing: {
    scale: [1, 1.02, 1],
    transition: {
      duration: 8,
      repeat: Infinity,
      repeatType: "loop" as const,
      ease: "easeInOut" as const,
    },
  },
};

/** The jewel's own entrance — drawn, not faded, so the wireframe reads as line art. */
export const jewelDraw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 1.6, ease: EASE_OUT },
      opacity: { duration: 0.4 },
    },
  },
};
