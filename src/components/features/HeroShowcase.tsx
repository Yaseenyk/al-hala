"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useState } from "react";

import { useIsRtl } from "@/lib/animations/motion-utils";
import {
  breathe,
  floatingElement,
  jewelDraw,
  slideVariants,
  staggerTextContainer,
  staggerTextItem,
  type FloatCustom,
  type SlideCustom,
  type SlideDirection,
} from "@/lib/animations/slider-variants";

interface ShowcaseItem {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  /** Brand tokens only. Every class here exists in globals.css — no arbitrary colours. */
  surface: string;
  ink: string;
  /** A muted tier is an opacity modifier on an existing token, never a sixth colour. */
  muted: string;
  /** Stroke colour for the jewel. Gold reads differently on cream than on deep green. */
  jewel: string;
}

const SHOWCASE: readonly ShowcaseItem[] = [
  {
    id: "nikah",
    eyebrow: "Wedding",
    title: "The Royal Nikah Collection",
    description:
      "Saffron, pistachio, and rose — pressed by hand and set in a keepsake box worthy of the day.",
    surface: "bg-cream",
    ink: "text-cocoa-ink",
    muted: "text-cocoa-ink/60",
    jewel: "stroke-saffron",
  },
  {
    id: "everyday",
    eyebrow: "Everyday",
    title: "Everyday Sweetness",
    description:
      "A smaller box for no occasion at all. The gesture matters more than the calendar.",
    surface: "bg-hala-green",
    ink: "text-cream",
    muted: "text-cream/70",
    jewel: "stroke-saffron-ring",
  },
  {
    id: "valentines",
    eyebrow: "Limited",
    title: "The Valentine's Edit",
    description:
      "Twelve pieces, sealed in gold leaf. Available until the fourteenth, and not after.",
    surface: "bg-deep-green",
    ink: "text-cream",
    muted: "text-cream/70",
    jewel: "stroke-saffron-ring",
  },
];

// ---------------------------------------------------------------------------
// Decorative layer — line art, not blur. Blur reads as an unloaded asset.
// ---------------------------------------------------------------------------

type Ornament = "star" | "crescent" | "petal" | "diamond";

const ORNAMENT_PATHS: Record<Ornament, string> = {
  // Four-point star — the sharp, drawn-out kind, not a puffy sparkle.
  star: "M12 1 C13.2 8 16 10.8 23 12 C16 13.2 13.2 16 12 23 C10.8 16 8 13.2 1 12 C8 10.8 10.8 8 12 1 Z",
  crescent: "M16.5 3a10 10 0 1 0 4 12A8 8 0 0 1 16.5 3Z",
  petal: "M12 2C18 7 18 17 12 22C6 17 6 7 12 2Z",
  diamond: "M12 2 21 12 12 22 3 12 Z",
};

interface Floater {
  id: string;
  ornament: Ornament;
  /** Percentages, not tokens — the 8pt grid governs layout, not decorative drift. */
  top: string;
  start: string;
  /** Only legal spacing steps. size-1/size-3 do not exist. */
  size: string;
  opacity: string;
  motion: FloatCustom;
}

const FLOATERS: readonly Floater[] = [
  {
    id: "star-lg",
    ornament: "star",
    top: "12%",
    start: "7%",
    size: "size-16",
    opacity: "opacity-40",
    motion: { distance: 16, rotate: 12, duration: 9 },
  },
  {
    id: "crescent",
    ornament: "crescent",
    top: "68%",
    start: "13%",
    size: "size-12",
    opacity: "opacity-30",
    motion: { distance: 12, rotate: -10, duration: 11, delay: 1.2 },
  },
  {
    id: "petal",
    ornament: "petal",
    top: "20%",
    start: "82%",
    size: "size-10",
    opacity: "opacity-35",
    motion: { distance: 14, rotate: 14, duration: 10, delay: 0.6 },
  },
  {
    id: "star-sm",
    ornament: "diamond",
    top: "76%",
    start: "72%",
    size: "size-8",
    opacity: "opacity-25",
    motion: { distance: 18, rotate: -8, duration: 13, delay: 1.8 },
  },
];

function Ornaments({ jewel, animate }: { jewel: string; animate: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {FLOATERS.map((floater) => (
        <motion.svg
          key={floater.id}
          viewBox="0 0 24 24"
          fill="none"
          strokeWidth={1}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`absolute ${floater.size} ${floater.opacity} ${jewel}`}
          style={{ top: floater.top, insetInlineStart: floater.start }}
          variants={floatingElement}
          custom={floater.motion}
          initial="still"
          animate={animate ? "float" : "still"}
        >
          <path d={ORNAMENT_PATHS[floater.ornament]} />
        </motion.svg>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// The jewel — a wireframe box, drawn in gold hairline. Stands in for the WebGL model.
// ---------------------------------------------------------------------------

function Jewel({ stroke, animate }: { stroke: string; animate: boolean }) {
  return (
    <motion.div
      variants={breathe}
      initial="still"
      animate={animate ? "breathing" : "still"}
      className="w-full max-w-sm"
    >
      <motion.svg
        viewBox="0 0 200 200"
        fill="none"
        strokeWidth={1}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        className={`size-full ${stroke}`}
        initial="hidden"
        animate="visible"
        aria-hidden
      >
        {/* Isometric box: lid quad, then the two visible walls, then the lid's inner rule.
            Every path shares one variant so the whole object draws as a single gesture. */}
        <motion.path variants={jewelDraw} d="M100 30 175 68 100 106 25 68 Z" />
        <motion.path variants={jewelDraw} d="M25 68 25 132 100 170 100 106 Z" />
        <motion.path variants={jewelDraw} d="M175 68 175 132 100 170 100 106 Z" />
        <motion.path variants={jewelDraw} d="M100 30 100 106" opacity={0.5} />
        <motion.path variants={jewelDraw} d="M62 49 137 87" opacity={0.35} />
        <motion.path variants={jewelDraw} d="M137 49 62 87" opacity={0.35} />
        {/* The ribbon, falling down the front-left face. */}
        <motion.path variants={jewelDraw} d="M62 87 62 151" opacity={0.6} />
      </motion.svg>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------

export function HeroShowcase() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<SlideDirection>(1);
  const isRtl = useIsRtl();
  const reduceMotion = useReducedMotion();
  const animate = !reduceMotion;

  const paginate = useCallback((next: SlideDirection) => {
    setDirection(next);
    setIndex((current) => (current + next + SHOWCASE.length) % SHOWCASE.length);
  }, []);

  const item = SHOWCASE[index]!;
  const slideCustom: SlideCustom = { direction, isRtl };

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured collections"
      className={`relative overflow-hidden transition-colors duration-700 ease-in-out ${item.surface} ${item.ink}`}
    >
      <Ornaments jewel={item.jewel} animate={animate} />

      <div className="relative mx-auto grid max-w-6xl items-center gap-16 p-8 md:grid-cols-2 md:p-24">
        <AnimatePresence mode="wait" custom={slideCustom} initial={false}>
          <motion.div
            key={item.id}
            variants={staggerTextContainer}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-col items-start gap-6 text-start"
          >
            {/* Every line gets its own overflow-hidden mask. The mask IS the effect —
                without it this is just a slide, and it reads as a web page, not print. */}
            <span className="block overflow-hidden">
              <motion.span
                variants={staggerTextItem}
                className={`block text-sm tracking-widest uppercase ${item.muted}`}
              >
                {item.eyebrow}
              </motion.span>
            </span>

            <h1 className="block overflow-hidden pb-2">
              <motion.span
                variants={staggerTextItem}
                className="block font-display text-4xl leading-none tracking-tight md:text-6xl"
              >
                {item.title}
              </motion.span>
            </h1>

            <span className="block max-w-prose overflow-hidden">
              <motion.span
                variants={staggerTextItem}
                className={`block text-lg leading-relaxed ${item.muted}`}
              >
                {item.description}
              </motion.span>
            </span>

            <span className="block overflow-hidden pt-2">
              <motion.span variants={staggerTextItem} className="block">
                <CallToAction />
              </motion.span>
            </span>
          </motion.div>
        </AnimatePresence>

        <div className="relative grid place-items-center">
          <AnimatePresence mode="wait" custom={slideCustom} initial={false}>
            <motion.div
              key={item.id}
              variants={slideVariants}
              custom={slideCustom}
              initial="enter"
              animate="center"
              exit="exit"
              className="grid w-full place-items-center"
            >
              <Jewel stroke={item.jewel} animate={animate} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <nav
        aria-label="Carousel navigation"
        className="relative mx-auto flex max-w-6xl items-center gap-4 p-8 md:justify-end md:pe-24"
      >
        <ol className="me-auto flex items-center gap-4">
          {SHOWCASE.map((slide, slideIndex) => (
            <li key={slide.id}>
              <button
                type="button"
                aria-label={`Go to ${slide.title}`}
                aria-current={slideIndex === index}
                onClick={() => {
                  setDirection(slideIndex > index ? 1 : -1);
                  setIndex(slideIndex);
                }}
                className="group grid size-6 place-items-center"
              >
                <span
                  className={`block h-px transition-all duration-500 ${
                    slideIndex === index
                      ? "w-6 bg-current"
                      : "w-2 bg-current/40 group-hover:bg-current/70"
                  }`}
                />
              </button>
            </li>
          ))}
        </ol>

        <ArrowButton label="Previous collection" onClick={() => paginate(-1)} back />
        <ArrowButton label="Next collection" onClick={() => paginate(1)} />
      </nav>
    </section>
  );
}

/**
 * Editorial pill. The arrow slides on hover — but the slide lives INSIDE the
 * rtl:-scale-x-100 wrapper, so the mirror flips the motion along with the glyph.
 * Put `translate-x` outside that wrapper and the Arabic arrow points left while
 * travelling right.
 */
function CallToAction() {
  return (
    <a
      href="/build-a-box"
      className="group inline-flex items-center gap-4 rounded-full border border-current/30 px-6 py-4 text-sm tracking-widest uppercase transition-colors duration-500 hover:border-saffron hover:text-saffron"
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
  onClick: () => void;
  back?: boolean;
}

function ArrowButton({ label, onClick, back = false }: ArrowButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid size-12 place-items-center rounded-full border border-current/30 transition-colors duration-500 hover:border-saffron hover:text-saffron"
    >
      {/* rtl:-scale-x-100 mirrors the chevron: in RTL, "next" points left. A chevron that
          kept pointing right would contradict the direction the slide actually travels. */}
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
