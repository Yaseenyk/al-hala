"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useCallback, useState } from "react";

import { OptimizedImage } from "@/components/core/OptimizedImage";
import { HeroOrnaments } from "@/components/features/HeroOrnaments";
import { GiftBoxMark } from "@/components/ui/GiftBoxMark";
import { useIsRtl } from "@/lib/animations/motion-utils";
import {
  floatingElement,
  slideVariants,
  staggerTextContainer,
  staggerTextItem,
  type SlideCustom,
  type SlideDirection,
} from "@/lib/animations/slider-variants";
import { FLAGSHIP } from "@/lib/occasions";

/**
 * The hero.
 *
 * Four flagship occasions. Type, air, a single gold rule, one animation. The restraint is
 * the design — a premium page is mostly empty.
 */

/** Surface treatment per slide. Cream and green, crossfading. */
interface Skin {
  surface: string;
  ink: string;
  muted: string;
  rule: string;
  accent: string;
  cta: string;
  /** Drives the glow behind the artwork. A FIXED brand var — never theme-swapped. */
  glowVar: string;
  /** A SECOND gradient, offset and in a different token. One radial over a flat field is
   *  still a flat field with a smudge on it; two make a ground with weather in it. */
  washVar: string;
  /** Colour of the ornament field. Everything strokes with currentColor. */
  ornamentTone: string;
  /** Multiplies the drifting-candy field's opacity and adds a denser set. 1 = the default,
   *  restrained scatter; above 1, candies visibly flow. Omitted on most slides. */
  ornamentEmphasis?: number;
}

/*
 * The hero artwork is `GiftBoxMark` — a drawn line-art box — on every slide EXCEPT those
 * whose occasion declares an `art` AND marks it `inCarousel` (see `Occasion.art` in
 * lib/occasions.ts). The occasion PAGE reads the same `art`, so the two surfaces cannot
 * show different artwork; the flag only decides whether this one shows it at all.
 *
 * The rest of the Lottie/SVG set in /public/lottie is still NOT wired in. Two things killed
 * them:
 *
 *   1. Style. They are flat cartoon vector art, and next to Cormorant hairlines and gold
 *      rules the cartoon wins — visual hierarchy is ruthless, and the cheapest element on
 *      a page sets the register for the whole page.
 *   2. Coherence. Four illustrations by four artists is a stock-art collage, not a brand.
 *
 * Recolouring them was tried and reverted: a luminance remap works on abstract shapes and
 * DESTROYS character illustration — forms separated only by hue merge into one blob, while
 * the animation keeps running perfectly underneath, so it presents as an animation bug when
 * it is not. Pick artwork that already sits with the palette; do not repaint artwork to fit
 * it.
 *
 * That is also why `inCarousel` is opt-in: the nikah illustration is pastel, and it only
 * holds together on the CREAM slides. On `bg-deep-green` — kids, valentines — it reads as
 * pasted on. Before setting the flag, look at the artwork against that slide's surface.
 */

const SKINS: Record<string, Skin> = {
  nikah: {
    // Light green, the only on-brand way: hala-green faded over the cream body composites
    // to a soft sage. Kept at /10 — the code's own warning is that saffron over green past
    // ~15% turns the field to olive; a light tint stays clean and lets the gold candies read.
    surface: "bg-hala-green/10",
    ink: "text-cocoa-ink",
    muted: "text-cocoa-ink/55",
    rule: "border-cocoa-ink/15",
    accent: "text-saffron",
    cta: "bg-hala-green text-cream hover:bg-deep-green",
    glowVar: "--brand-saffron",
    washVar: "--brand-green",
    ornamentTone: "text-saffron",
    // The one slide that asks for candies flowing. Gold bonbons on light green is the
    // brand's core pairing, so this is where the field earns being turned up.
    ornamentEmphasis: 1.7,
  },
  kids: {
    surface: "bg-hala-green",
    ink: "text-cream",
    muted: "text-cream/65",
    rule: "border-cream/20",
    accent: "text-saffron-ring",
    cta: "bg-saffron text-deep-green hover:bg-saffron-ring",
    glowVar: "--brand-saffron-soft",
    washVar: "--brand-deep",
    ornamentTone: "text-saffron-ring",
  },
  valentines: {
    surface: "bg-deep-green",
    ink: "text-cream",
    muted: "text-cream/65",
    rule: "border-cream/20",
    accent: "text-saffron-ring",
    cta: "bg-saffron text-deep-green hover:bg-saffron-ring",
    glowVar: "--brand-saffron-soft",
    washVar: "--brand-green",
    ornamentTone: "text-saffron-ring",
  },
  eid: {
    surface: "bg-cream",
    ink: "text-cocoa-ink",
    muted: "text-cocoa-ink/55",
    rule: "border-cocoa-ink/15",
    accent: "text-saffron",
    cta: "bg-hala-green text-cream hover:bg-deep-green",
    glowVar: "--brand-green",
    washVar: "--brand-saffron",
    ornamentTone: "text-hala-green",
  },
};

export function ProductShowcase() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<SlideDirection>(1);
  const isRtl = useIsRtl();
  const reduceMotion = useReducedMotion();
  const animate = !reduceMotion;

  const paginate = useCallback((next: SlideDirection) => {
    setDirection(next);
    setIndex((current) => (current + next + FLAGSHIP.length) % FLAGSHIP.length);
  }, []);

  const item = FLAGSHIP[index]!;
  const skin = SKINS[item.id]!;
  // `inCarousel`, not just `art`: an occasion's page artwork does NOT get the carousel by
  // default. Half these slides are deep green — see the note on OccasionArt.
  const art = item.art?.inCarousel ? item.art : undefined;
  const slideCustom: SlideCustom = { direction, isRtl };

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured occasions"
      // min-h-dvh, not min-h-screen: `100vh` on mobile Safari/Chrome measures the viewport
      // WITHOUT the browser chrome, so a 100vh hero is always taller than the visible area
      // and the bottom is permanently cut off. `dvh` tracks the real, dynamic viewport.
      className={`grain min-h-fold relative flex flex-col transition-colors duration-700 ease-in-out ${skin.surface} ${skin.ink}`}
    >
      {/* The ground.
          TWO gradients, not one: a single radial over a flat colour is still a flat colour
          with a smudge in the middle of it. A second, offset, in a different token gives
          the field weather — light coming from somewhere, and shade somewhere else.
          Kept at 8–14%: at 30% the saffron turned the whole page to olive sludge. */}
      <AnimatePresence>
        <motion.div
          key={item.id}
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: [
              `radial-gradient(45% 45% at 68% 32%, color-mix(in oklab, var(${skin.glowVar}) 14%, transparent), transparent 70%)`,
              `radial-gradient(55% 50% at 12% 88%, color-mix(in oklab, var(${skin.washVar}) 9%, transparent), transparent 72%)`,
            ].join(","),
          }}
        />
      </AnimatePresence>

      {/* Candies, lollipops, stars. Line art, drifting and twinkling. */}
      <HeroOrnaments
        tone={skin.ornamentTone}
        animate={animate}
        emphasis={skin.ornamentEmphasis ?? 1}
      />


      {/* Two columns, not one stack.
          Stacked, the artwork + eyebrow + headline + Arabic + rule + copy + CTA is taller
          than any viewport, and the CTA — the only thing on the page that earns money —
          falls below the fold. Side by side, the tallest column sets the height and the
          whole slide fits. */}
      <div className="relative flex flex-1 items-center px-6 py-8 sm:px-8 md:px-16">
        <AnimatePresence mode="wait" custom={slideCustom} initial={false}>
          <motion.div
            key={item.id}
            variants={staggerTextContainer}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="mx-auto grid w-full max-w-6xl items-center gap-8 md:grid-cols-2 md:gap-16"
          >
            {/* The artwork. `HERO_ART` wins where it has an entry; every other slide falls
                back to the gift box drawn in a gold hairline, where only the tone changes.
                A coherent mark beats four illustrations from four artists — so the drawn
                box remains the default, not the exception. */}
            <motion.div
              variants={slideVariants}
              custom={slideCustom}
              className="relative mx-auto size-48 sm:size-64 md:order-2 md:size-80 lg:size-96"
            >
              <motion.div
                variants={floatingElement}
                custom={{ distance: 8, rotate: 0, duration: 9 }}
                initial="still"
                animate={animate ? "float" : "still"}
                className="relative size-full"
              >
                {art ? (
                  // Hero, and the LCP element on first paint — hence `priority`. It is
                  // product imagery, so it does NOT mirror under `dir="rtl"`.
                  <OptimizedImage
                    key={item.id}
                    src={art.src}
                    alt={art.alt}
                    fill
                    priority
                    sizes="(min-width: 1024px) 384px, (min-width: 768px) 320px, (min-width: 640px) 256px, 192px"
                    className="object-contain"
                  />
                ) : (
                  <GiftBoxMark
                    key={item.id}
                    tone={skin.accent}
                    animate={animate}
                    className="size-full"
                  />
                )}
              </motion.div>
            </motion.div>

            {/* Copy. First in the DOM so it is first for a screen reader and a crawler;
                `md:order-2` above moves the artwork visually, not semantically. */}
            <div className="flex flex-col items-center gap-4 text-center md:items-start md:text-start">
              {/* Each line rides up out of its own overflow-hidden mask. The mask IS the
                  reveal — without it this is a fade, and it reads as a page, not print. */}
              <span className="block overflow-hidden">
                <motion.span
                  variants={staggerTextItem}
                  className={`block text-xs tracking-widest uppercase ${skin.accent}`}
                >
                  {item.eyebrow}
                </motion.span>
              </span>

              <h1 className="block overflow-hidden pb-2">
                <motion.span
                  variants={staggerTextItem}
                  // font-light is not optional: Cormorant's drama lives in its hairlines,
                  // and at 400+ they thicken and it becomes an ordinary serif.
                  className="block font-display text-4xl leading-none font-light tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
                >
                  {item.title}
                </motion.span>
              </h1>

              {item.arabic ? (
                <span className="block overflow-hidden">
                  <motion.span
                    variants={staggerTextItem}
                    lang="ar"
                    dir="rtl"
                    className={`block font-arabic text-2xl ${skin.accent}`}
                  >
                    {item.arabic}
                  </motion.span>
                </span>
              ) : null}

              <span className="block overflow-hidden py-2">
                <motion.span
                  variants={staggerTextItem}
                  aria-hidden
                  className="block h-px w-16 bg-saffron"
                />
              </span>

              <span className="block max-w-prose overflow-hidden">
                <motion.span
                  variants={staggerTextItem}
                  className={`block leading-relaxed ${skin.muted}`}
                >
                  {item.description}
                </motion.span>
              </span>

              <span className="block overflow-hidden pt-4">
                <motion.span variants={staggerTextItem} className="block">
                  <OrderButton tone={skin.cta} />
                </motion.span>
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <footer className="relative flex items-center justify-between p-6 sm:px-8 md:px-16 md:py-8">
        <nav aria-label="Featured occasions">
          <ol className="flex items-center gap-6">
            {FLAGSHIP.map((occasion, slideIndex) => (
              <li key={occasion.id}>
                <button
                  type="button"
                  aria-label={`Go to ${occasion.title}`}
                  aria-current={slideIndex === index}
                  onClick={() => {
                    setDirection(slideIndex > index ? 1 : -1);
                    setIndex(slideIndex);
                  }}
                  className={`text-xs tracking-widest tabular-nums transition-opacity duration-500 ${
                    slideIndex === index
                      ? skin.accent
                      : `${skin.muted} opacity-50 hover:opacity-100`
                  }`}
                >
                  {occasion.index}
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <div className="flex items-center gap-4">
          <ArrowButton
            label="Previous occasion"
            rule={skin.rule}
            onClick={() => paginate(-1)}
            back
          />
          <ArrowButton
            label="Next occasion"
            rule={skin.rule}
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
    <Link
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
    </Link>
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
