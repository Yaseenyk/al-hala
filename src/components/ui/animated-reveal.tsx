"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

import {
  fadeIn,
  slideIn,
  useIsRtl,
  type SlideFrom,
} from "@/lib/animations/motion-utils";

interface AnimatedRevealProps {
  children: ReactNode;
  /** Omit for a plain fade-up. `start`/`end` are reading-order edges and flip under RTL. */
  from?: SlideFrom;
  distance?: number;
  delay?: number;
  /** Re-animate every time it re-enters the viewport. Off by default — repeated motion on scroll is noise. */
  repeat?: boolean;
  className?: string;
}

export function AnimatedReveal({
  children,
  from,
  distance,
  delay = 0,
  repeat = false,
  className,
}: AnimatedRevealProps) {
  const isRtl = useIsRtl();
  const reduceMotion = useReducedMotion();

  /**
   * Not "animate faster" — no animation at all.
   *
   * A reduced-motion user has asked the OS to stop things moving. Honouring that with a
   * shorter transform still moves. And a scroll-triggered reveal that degrades to
   * `opacity: 0` waiting on an animation that never runs would leave the page blank —
   * so the content must render plainly, visible, with no motion wrapper at all.
   */
  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const variants = from ? slideIn(from, isRtl, distance) : fadeIn;

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      // `once` unless asked: the reveal is an entrance, not a loop.
      // `amount: 0.3` — fire when a third is showing, so tall blocks don't wait for the fold.
      viewport={{ once: !repeat, amount: 0.3 }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}
