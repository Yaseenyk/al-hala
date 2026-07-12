"use client";

import { motion } from "motion/react";

import { breathe, jewelDraw } from "@/lib/animations/slider-variants";

/**
 * The gift box, as line art.
 *
 * An isometric box drawn in a single gold hairline: it draws itself on entry (via
 * `pathLength`, so the line is literally struck rather than faded in) and breathes on
 * idle. Recovered from the pre-Lottie hero, where it read as genuinely expensive.
 *
 * Why this and not an illustration: it strokes with `currentColor`, so it recolours per
 * slide for free; it is ~1kB of paths with no licence, no download and no artist to match;
 * and line art reads as engraving where a filled illustration reads as clip-art. The same
 * reason the ornament field is stroked and not filled.
 */

interface GiftBoxMarkProps {
  /** Tailwind text-colour class. The stroke inherits it. */
  tone: string;
  animate: boolean;
  className?: string;
}

export function GiftBoxMark({ tone, animate, className }: GiftBoxMarkProps) {
  return (
    <motion.div
      variants={breathe}
      initial="still"
      animate={animate ? "breathing" : "still"}
      className={className}
    >
      <motion.svg
        viewBox="0 0 200 200"
        fill="none"
        stroke="currentColor"
        strokeWidth={1}
        strokeLinecap="round"
        strokeLinejoin="round"
        // The stroke stays a true hairline at any size instead of thickening with the
        // scale — which is exactly what separates "engraved" from "outlined".
        vectorEffect="non-scaling-stroke"
        className={`size-full ${tone}`}
        initial="hidden"
        animate="visible"
        aria-hidden
      >
        {/* Lid quad, then the two visible walls. Every path shares one variant, so the
            whole object draws as a single continuous gesture rather than seven of them. */}
        <motion.path variants={jewelDraw} d="M100 30 175 68 100 106 25 68 Z" />
        <motion.path variants={jewelDraw} d="M25 68 25 132 100 170 100 106 Z" />
        <motion.path variants={jewelDraw} d="M175 68 175 132 100 170 100 106 Z" />
        {/* The lid's inner rules, fading back — this is what gives it depth. */}
        <motion.path variants={jewelDraw} d="M100 30 100 106" opacity={0.5} />
        <motion.path variants={jewelDraw} d="M62 49 137 87" opacity={0.35} />
        <motion.path variants={jewelDraw} d="M137 49 62 87" opacity={0.35} />
        {/* The ribbon, falling down the front-left face. */}
        <motion.path variants={jewelDraw} d="M62 87 62 151" opacity={0.6} />
      </motion.svg>
    </motion.div>
  );
}
