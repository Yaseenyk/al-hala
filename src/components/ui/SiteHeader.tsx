"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";

const NAV = [
  { label: "Occasions", href: "/occasions" },
  { label: "Build a Box", href: "/build-a-box" },
  { label: "Contact", href: "/contact" },
] as const;

interface SiteHeaderProps {
  /** Muted text class for the current surface. */
  muted: string;
  /** Border class for the current surface — a cream hairline is invisible on cream. */
  rule: string;
  /** Panel background for the open mobile menu. */
  panel: string;
}

/**
 * The header, with a real mobile menu.
 *
 * Three inline links plus a wordmark do not fit at 375px — they collide, or the nav wraps
 * under the logo and the hero loses a line of height it does not have. Below `md` the nav
 * collapses to a disclosure button.
 */
export function SiteHeader({ muted, rule, panel }: SiteHeaderProps) {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  // A menu that stays open behind a route change is a menu covering the page you just
  // navigated to. Escape closes it, because a full-screen overlay with no keyboard exit
  // is a trap for anyone not using a mouse.
  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="relative z-20 flex items-center justify-between p-6 md:px-16 md:py-8">
      <Link
        href="/"
        className="font-display text-lg tracking-widest uppercase md:text-xl"
      >
        Al-Hala
      </Link>

      {/* Desktop */}
      <nav aria-label="Primary" className="hidden md:block">
        <ul className="flex items-center gap-8 text-xs tracking-widest uppercase">
          {NAV.map((entry) => (
            <li key={entry.href}>
              <Link
                href={entry.href}
                className={`transition-colors duration-500 hover:text-saffron ${muted}`}
              >
                {entry.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile trigger. size-12 = 48px: at or above the 44px minimum touch target, which
          a 24px icon button silently fails. */}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? "Close menu" : "Open menu"}
        className={`grid size-12 place-items-center rounded-full border transition-colors duration-300 md:hidden ${rule}`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          aria-hidden
          className="size-6"
        >
          {open ? (
            <path d="M6 6l12 12M18 6L6 18" />
          ) : (
            <path d="M4 8h16M4 16h16" />
          )}
        </svg>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.nav
            id="mobile-nav"
            aria-label="Primary"
            initial={reduceMotion ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className={`absolute inset-x-0 top-full mx-6 rounded-lg border p-6 shadow-2xl md:hidden ${rule} ${panel}`}
          >
            <ul className="flex flex-col gap-6 text-sm tracking-widest uppercase">
              {NAV.map((entry) => (
                <li key={entry.href}>
                  <Link
                    href={entry.href}
                    onClick={() => setOpen(false)}
                    className="block py-2 transition-colors hover:text-saffron"
                  >
                    {entry.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
