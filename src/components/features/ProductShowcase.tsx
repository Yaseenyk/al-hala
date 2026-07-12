"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useState } from "react";

import { OptimizedImage } from "@/components/core/OptimizedImage";
import { useIsRtl } from "@/lib/animations/motion-utils";
import {
  floatingElement,
  slideVariants,
  staggerTextContainer,
  staggerTextItem,
  type SlideCustom,
  type SlideDirection,
} from "@/lib/animations/slider-variants";

/**
 * The hero.
 *
 * Minimal, on purpose. The WebGL gift box was removed: hand-modelled primitives cannot
 * carry a premium hero, and every hour spent bevelling them was an hour spent making a
 * cube look slightly less like a cube.
 *
 * What replaces it is the one genuinely beautiful asset this brand already owns — the
 * mark. Type, air, a single gold rule, and the mark. Nothing else earns its place.
 *
 * If real product photography ever arrives, it slots straight into the same frame via
 * OptimizedImage.
 */

interface Collection {
  id: string;
  index: string;
  eyebrow: string;
  title: string;
  description: string;

  /** Surface + ink. Cream and green, crossfading. */
  surface: string;
  ink: string;
  muted: string;
  rule: string;
  accentClass: string;
  ctaClass: string;

  /**
   * The mark ships in two cuts: `-light` (deep-green tile, for light grounds) and `-dark`
   * (the paler #17402E tile, for dark grounds). Pick the cut — never recolour the artwork
   * with CSS. Brand kit, §RULES.
   */
  mark: string;
}

const COLLECTIONS: readonly Collection[] = [
  {
    id: "nikah",
    index: "01",
    eyebrow: "The Wedding Collection",
    title: "The Royal Nikah",
    description:
      "Saffron, pistachio, and rose — pressed by hand, sealed in gold, and set in a keepsake box worthy of the day.",
    surface: "bg-cream",
    ink: "text-cocoa-ink",
    muted: "text-cocoa-ink/55",
    rule: "border-cocoa-ink/15",
    accentClass: "text-saffron",
    ctaClass: "bg-hala-green text-cream hover:bg-deep-green",
    mark: "/brand/alhala-mark-light.svg",
  },
  {
    id: "everyday",
    index: "02",
    eyebrow: "The Everyday Collection",
    title: "Everyday Sweetness",
    description:
      "A smaller box, for no occasion at all. The gesture matters more than the calendar.",
    surface: "bg-hala-green",
    ink: "text-cream",
    muted: "text-cream/65",
    rule: "border-cream/20",
    accentClass: "text-saffron-ring",
    ctaClass: "bg-saffron text-deep-green hover:bg-saffron-ring",
    mark: "/brand/alhala-mark-dark.svg",
  },
  {
    id: "valentines",
    index: "03",
    eyebrow: "Limited Release",
    title: "The Valentine's Edit",
    description:
      "Twelve pieces, wrapped in gold leaf. Available until the fourteenth, and not a day after.",
    surface: "bg-deep-green",
    ink: "text-cream",
    muted: "text-cream/65",
    rule: "border-cream/20",
    accentClass: "text-saffron-ring",
    ctaClass: "bg-saffron text-deep-green hover:bg-saffron-ring",
    mark: "/brand/alhala-mark-dark.svg",
  },
];

export function ProductShowcase() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<SlideDirection>(1);
  const isRtl = useIsRtl();
  const reduceMotion = useReducedMotion();
  const animate = !reduceMotion;

  const paginate = useCallback((next: SlideDirection) => {
    setDirection(next);
    setIndex((current) => (current + next + COLLECTIONS.length) % COLLECTIONS.length);
  }, []);

  const item = COLLECTIONS[index]!;
  const slideCustom: SlideCustom = { direction, isRtl };

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured collections"
      className={`relative flex min-h-screen flex-col transition-colors duration-700 ease-in-out ${item.surface} ${item.ink}`}
    >
      <header className="flex items-center justify-between p-8 md:px-16">
        <span className="font-display text-xl tracking-widest uppercase">Al-Hala</span>
        <nav aria-label="Primary">
          <ul className="flex items-center gap-8 text-xs tracking-widest uppercase">
            {["Collections", "Occasions", "Contact"].map((label) => (
              <li key={label}>
                <a
                  href={`/${label.toLowerCase()}`}
                  className={`transition-colors duration-500 hover:text-saffron ${item.muted}`}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {/* One centred column. The restraint IS the design — a premium page is mostly air. */}
      <div className="flex flex-1 items-center justify-center px-8 py-16">
        <AnimatePresence mode="wait" custom={slideCustom} initial={false}>
          <motion.div
            key={item.id}
            variants={staggerTextContainer}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex max-w-2xl flex-col items-center gap-8 text-center"
          >
            {/* The mark. Never recoloured, never stretched — the cut is swapped per ground.
                Square asset in a square box, so the aspect ratio cannot drift. */}
            <motion.div
              variants={slideVariants}
              custom={slideCustom}
              className="relative size-40 md:size-48"
            >
              <motion.div
                variants={floatingElement}
                custom={{ distance: 8, rotate: 0, duration: 9 }}
                initial="still"
                animate={animate ? "float" : "still"}
                className="relative size-full"
              >
                <OptimizedImage
                  src={item.mark}
                  alt="Al-Hala Candies"
                  fill
                  priority
                  sizes="192px"
                  className="object-contain"
                />
              </motion.div>
            </motion.div>

            {/* Each line rides up out of its own overflow-hidden mask. The mask IS the
                reveal — without it this is a fade, and it reads as a web page, not print. */}
            <span className="block overflow-hidden">
              <motion.span
                variants={staggerTextItem}
                className={`block text-xs tracking-widest uppercase ${item.accentClass}`}
              >
                {item.eyebrow}
              </motion.span>
            </span>

            <h1 className="block overflow-hidden pb-2">
              <motion.span
                variants={staggerTextItem}
                // font-light is not optional: Cormorant's drama lives in its hairlines,
                // and at 400+ they thicken and it becomes an ordinary serif.
                className="block font-display text-5xl leading-none font-light tracking-tight md:text-7xl"
              >
                {item.title}
              </motion.span>
            </h1>

            <span className="block overflow-hidden">
              <motion.span
                variants={staggerTextItem}
                aria-hidden
                className="block h-px w-16 bg-saffron"
              />
            </span>

            <span className="block max-w-prose overflow-hidden">
              <motion.span
                variants={staggerTextItem}
                className={`block leading-relaxed ${item.muted}`}
              >
                {item.description}
              </motion.span>
            </span>

            <span className="block overflow-hidden pt-2">
              <motion.span variants={staggerTextItem} className="block">
                <OrderButton tone={item.ctaClass} />
              </motion.span>
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      <footer className="flex items-center justify-between p-8 md:px-16">
        <nav aria-label="Collections">
          <ol className="flex items-center gap-6">
            {COLLECTIONS.map((collection, slideIndex) => (
              <li key={collection.id}>
                <button
                  type="button"
                  aria-label={`Go to ${collection.title}`}
                  aria-current={slideIndex === index}
                  onClick={() => {
                    setDirection(slideIndex > index ? 1 : -1);
                    setIndex(slideIndex);
                  }}
                  className={`text-xs tracking-widest tabular-nums transition-opacity duration-500 ${
                    slideIndex === index
                      ? item.accentClass
                      : `${item.muted} opacity-50 hover:opacity-100`
                  }`}
                >
                  {collection.index}
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <div className="flex items-center gap-4">
          <ArrowButton
            label="Previous collection"
            rule={item.rule}
            onClick={() => paginate(-1)}
            back
          />
          <ArrowButton
            label="Next collection"
            rule={item.rule}
            onClick={() => paginate(1)}
          />
        </div>
      </footer>
    </section>
  );
}

/**
 * The arrow's hover-translate lives INSIDE the rtl:-scale-x-100 wrapper, so the mirror
 * flips the motion along with the glyph. Outside it, the Arabic arrow would point left
 * while travelling right.
 */
function OrderButton({ tone }: { tone: string }) {
  return (
    <a
      href="/build-a-box"
      className={`group inline-flex items-center gap-4 rounded-full px-8 py-4 text-xs tracking-widest uppercase transition-colors duration-500 ${tone}`}
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
    </a>
  );
}

interface ArrowButtonProps {
  label: string;
  /** Border colour for the current surface — a cream hairline is invisible on cream. */
  rule: string;
  onClick: () => void;
  back?: boolean;
}

function ArrowButton({ label, rule, onClick, back = false }: ArrowButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`grid size-12 place-items-center rounded-full border transition-colors duration-500 hover:border-saffron hover:text-saffron ${rule}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        className={`size-4 rtl:-scale-x-100 ${back ? "rotate-180" : ""}`}
      >
        <path d="M9 6l6 6-6 6" />
      </svg>
    </button>
  );
}
