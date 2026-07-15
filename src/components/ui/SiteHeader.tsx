"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { OptimizedImage } from "@/components/core/OptimizedImage";
import { ACTIVE_SOCIALS, ICONS, PRIMARY_NAV, type NavLink } from "@/lib/nav";
import { BASE_PATH } from "@/lib/site";
import { useCartCount, useWishlistCount } from "@/store/cart";

/**
 * The site header. Sticky, site-wide, on every page.
 *
 * Solid rather than transparent-over-hero on purpose: the hero crossfades between Cream,
 * Hala Green and Deep Green, so a transparent bar would need its ink to change colour mid
 * -scroll on a surface it does not own. A solid bar is legible on all three and on every
 * other page in the site, which is worth more than the drama.
 */

function Icon({ d, className = "size-6" }: { d: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <path d={d} />
    </svg>
  );
}

/** Filled glyph — socials read as marks, not as outlines. */
function SocialIcon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-4">
      <path d={d} />
    </svg>
  );
}

/** A count that is absent at zero. A cart badge reading "0" is noise pretending to be data. */
function Badge({ count }: { count: number }) {
  if (count === 0) return null;

  return (
    <span
      // end-2 / top-2, not right-2: the badge must sit on the trailing corner in RTL too.
      className="absolute end-2 top-2 grid size-6 place-items-center rounded-full bg-saffron text-xs font-medium text-deep-green tabular-nums"
      aria-hidden
    >
      {count > 9 ? "9+" : count}
    </span>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  /**
   * WHICH menu is open, not WHETHER one is.
   *
   * A single boolean here is the bug it looks like: every entry in PRIMARY_NAV with
   * children is handed the same flag, so Occasions and Shop stop being two menus and
   * become one boolean rendered twice — open either and both drop down together. Keyed by
   * href, so the state scales with the nav instead of being renamed per entry.
   */
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  const cartCount = useCartCount();
  const wishCount = useWishlistCount();

  /**
   * Menus close on CLICK, not in an effect watching `pathname`.
   *
   * Reacting to the route after it has already changed means a `setState` inside an
   * effect — which React 19 flags as a cascading render, and which also shows the drawer
   * for one frame on top of the page you just navigated to. Closing at the source is both
   * cheaper and correct.
   */
  const closeAll = () => {
    setOpen(false);
    setOpenMenu(null);
  };

  // A full-screen overlay with no keyboard exit is a trap for anyone not using a mouse.
  useEffect(() => {
    if (!open && openMenu === null) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setOpenMenu(null);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, openMenu]);

  return (
    <header className="sticky top-0 z-50">
      {/* Utility strip. Socials live HERE, not in the main nav: a social link's entire job
          is to send the visitor somewhere that is not your shop, so it belongs in the quiet
          furniture — never beside "Build a Box", where it competes with the thing that earns. */}
      <div className="hidden bg-deep-green text-cream/70 md:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-8 py-2 text-xs md:px-16">
          <p className="tracking-widest uppercase">
            Complimentary gift note · Ships nationwide
          </p>
          <ul className="flex items-center gap-4">
            {ACTIVE_SOCIALS.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  // noreferrer is not optional with target=_blank: without it the opened tab
                  // gets a window.opener handle back into this one and can redirect it.
                  rel="noopener noreferrer"
                  aria-label={`Al-Hala on ${social.label}`}
                  className="block transition-colors duration-300 hover:text-saffron"
                >
                  <SocialIcon d={social.d} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main bar */}
      <div className="border-b border-cocoa-ink/10 bg-cream/85 text-cocoa-ink backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-6 py-4 md:px-16">
          <Link
            href="/"
            onClick={closeAll}
            className="flex shrink-0 items-center gap-2 font-display text-lg tracking-widest uppercase md:text-xl"
          >
            {/* The ح monogram tile, LEADING the wordmark. The PNG, not the SVG: the SVG sets
                ح in live Amiri type, which does not load inside an <img> and would fall back
                to a system glyph. Decorative — the wordmark beside it already names the link,
                so an alt would just announce "Al-Hala" twice. BASE_PATH-prefixed because an
                unoptimized next/image does not prepend basePath (it 404s on GitHub Pages). */}
            <OptimizedImage
              src={`${BASE_PATH}/brand/alhala-monogram-1024.png`}
              decorative
              width={32}
              height={32}
              className="size-8"
            />
            {/* whitespace-nowrap: "AL-HALA" must never break at its hyphen onto two lines. */}
            <span className="whitespace-nowrap">Al-Hala</span>
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-2 text-xs tracking-widest uppercase">
              {PRIMARY_NAV.map((entry) => (
                <li key={entry.href} className="relative">
                  {entry.children ? (
                    <DesktopDropdown
                      entry={entry}
                      open={openMenu === entry.href}
                      // Opening one menu closes the other — two panels overlapping in a
                      // menu bar is not a state a user ever asked for.
                      onToggle={() =>
                        setOpenMenu((current) =>
                          current === entry.href ? null : entry.href,
                        )
                      }
                      onNavigate={closeAll}
                      reduceMotion={reduceMotion ?? false}
                    />
                  ) : (
                    // closeAll, like every other nav click: the header persists across
                    // navigation, so a plain link that does NOT close leaves the OTHER
                    // menu's panel hanging open on the page it lands on.
                    <Link
                      href={entry.href}
                      onClick={closeAll}
                      className="inline-block rounded-full border border-cocoa-ink p-2 whitespace-nowrap transition-colors duration-300 hover:border-saffron hover:text-saffron"
                    >
                      {entry.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Action rail. size-12 = 48px, at or above the 44px minimum touch target that a
              bare 24px icon silently fails. */}
          <div className="flex items-center gap-2">
            <Link
              href="/search"
              onClick={closeAll}
              aria-label="Search"
              className="hidden size-12 place-items-center rounded-full transition-colors duration-300 hover:bg-cocoa-ink/5 hover:text-saffron active:scale-95 md:grid"
            >
              <Icon d={ICONS.search} />
            </Link>

            <Link
              href="/account"
              onClick={closeAll}
              aria-label="Account"
              className="hidden size-12 place-items-center rounded-full transition-colors duration-300 hover:bg-cocoa-ink/5 hover:text-saffron active:scale-95 md:grid"
            >
              <Icon d={ICONS.account} />
            </Link>

            <Link
              href="/wishlist"
              onClick={closeAll}
              aria-label={`Wishlist, ${wishCount} items`}
              className="relative grid size-12 place-items-center rounded-full transition-colors duration-300 hover:bg-cocoa-ink/5 hover:text-saffron active:scale-95"
            >
              <Icon d={ICONS.wishlist} />
              <Badge count={wishCount} />
            </Link>

            <Link
              href="/cart"
              onClick={closeAll}
              aria-label={`Cart, ${cartCount} items`}
              className="relative grid size-12 place-items-center rounded-full transition-colors duration-300 hover:bg-cocoa-ink/5 hover:text-saffron active:scale-95"
            >
              <Icon d={ICONS.cart} />
              <Badge count={cartCount} />
            </Link>

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-drawer"
              aria-label={open ? "Close menu" : "Open menu"}
              className="grid size-12 place-items-center rounded-full border border-cocoa-ink/15 transition-colors duration-300 hover:border-saffron hover:text-saffron active:scale-95 md:hidden"
            >
              <Icon d={open ? "M6 6l12 12M18 6L6 18" : "M4 8h16M4 16h16"} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-drawer"
            initial={reduceMotion ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="max-h-dvh overflow-y-auto border-b border-cocoa-ink/10 bg-cream text-cocoa-ink shadow-2xl md:hidden"
          >
            <nav aria-label="Primary" className="px-6 py-8">
              <ul className="flex flex-col gap-2 text-sm tracking-widest uppercase">
                {PRIMARY_NAV.map((entry) => (
                  <li key={entry.href}>
                    <Link href={entry.href} onClick={closeAll} className="block py-4">
                      {entry.label}
                    </Link>
                    {entry.children ? (
                      <ul className="flex flex-col border-s border-cocoa-ink/10 ps-6">
                        {entry.children.slice(0, -1).map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                  onClick={closeAll}
                              className="block py-2 text-xs text-cocoa-ink/60 normal-case"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col gap-4 border-t border-cocoa-ink/10 pt-8">
                <Link
                  href="/account"
                  onClick={closeAll}
                  className="rounded-full border border-cocoa-ink/20 px-8 py-4 text-center text-xs tracking-widest uppercase"
                >
                  Sign in
                </Link>
                <Link
                  href="/account"
                  onClick={closeAll}
                  className="rounded-full bg-hala-green px-8 py-4 text-center text-xs tracking-widest text-cream uppercase"
                >
                  Create account
                </Link>
              </div>

              <ul className="mt-8 flex items-center justify-center gap-6">
                {ACTIVE_SOCIALS.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Al-Hala on ${social.label}`}
                      className="grid size-12 place-items-center text-cocoa-ink/60"
                    >
                      <SocialIcon d={social.d} />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

interface DesktopDropdownProps {
  entry: NavLink;
  open: boolean;
  onToggle: () => void;
  onNavigate: () => void;
  reduceMotion: boolean;
}

function DesktopDropdown({
  entry,
  open,
  onToggle,
  onNavigate,
  reduceMotion,
}: DesktopDropdownProps) {
  return (
    <>
      {/* A <button>, not a hover-only <div>. A menu that opens on hover alone cannot be
          reached from a keyboard and does not exist on a touch screen. */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-haspopup="true"
        // Black-outline pill by default; light-green fill (hala-green faded over cream) once
        // the menu is open, so the trigger reads as "active" while its panel is showing.
        className={`flex items-center gap-2 rounded-full border p-2 tracking-widest whitespace-nowrap uppercase transition-colors duration-300 ${
          open
            ? "border-hala-green bg-hala-green/10 text-deep-green"
            : "border-cocoa-ink hover:border-saffron hover:text-saffron"
        }`}
      >
        {entry.label}
        <Icon
          d={ICONS.chevron}
          className={`size-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.ul
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            // start-0, not left-0: the panel hangs off the trailing edge in RTL.
            className="absolute start-0 top-full mt-4 grid w-80 gap-2 rounded-lg border border-cocoa-ink/10 bg-cream p-4 shadow-2xl"
          >
            {entry.children!.map((child) => (
              <li key={child.href}>
                <Link
                  href={child.href}
                  onClick={onNavigate}
                  className="block rounded-sm px-4 py-2 text-xs normal-case transition-colors hover:bg-hala-green/5 hover:text-saffron"
                >
                  {child.label}
                </Link>
              </li>
            ))}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </>
  );
}
