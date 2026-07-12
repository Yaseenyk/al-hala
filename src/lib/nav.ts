import { OCCASIONS } from "@/lib/occasions";

/**
 * Site navigation and social presence. One source of truth for the header, the mobile
 * drawer, and (later) the footer — three places that otherwise drift apart the first time
 * someone adds a page.
 */

export interface NavLink {
  label: string;
  href: string;
  /** Rendered as a dropdown when present. */
  children?: readonly NavLink[];
}

export const PRIMARY_NAV: readonly NavLink[] = [
  {
    label: "Occasions",
    href: "/occasions",
    children: [
      ...OCCASIONS.map((occasion) => ({
        label: occasion.title,
        href: `/occasions/${occasion.slug}`,
      })),
      { label: "All occasions", href: "/occasions" },
    ],
  },
  { label: "Build a Box", href: "/build-a-box" },
  { label: "Our Story", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export interface Social {
  label: string;
  href: string;
  /** 24×24 path data. Hand-drawn — no icon library, no extra kB. */
  d: string;
}

/**
 * Socials live in the utility bar, NOT the main nav.
 *
 * A social link is the one link on your page whose entire job is to send the visitor
 * somewhere that is not your shop. It belongs in the quiet furniture — a slim top strip or
 * the footer — never beside "Build a Box", where it competes with the thing that earns.
 */
export const SOCIALS: readonly Social[] = [
  {
    label: "Instagram",
    href: "https://instagram.com/",
    d: "M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4 1.3-.1 1.7-.1 4.8-.1ZM12 7.6a4.4 4.4 0 1 0 0 8.8 4.4 4.4 0 0 0 0-8.8Zm0 7.3a2.9 2.9 0 1 1 0-5.8 2.9 2.9 0 0 1 0 5.8Zm5.6-7.5a1 1 0 1 1-2.1 0 1 1 0 0 1 2.1 0Z",
  },
  {
    label: "Facebook",
    href: "https://facebook.com/",
    d: "M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7A10 10 0 0 0 22 12Z",
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/",
    d: "M12 2a9.9 9.9 0 0 0-8.5 15L2 22l5.2-1.4A9.9 9.9 0 1 0 12 2Zm0 18a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1 1 12 20Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.4-3c-.1-.2 0-.4.1-.5l.5-.6c.1-.2.1-.3 0-.5l-.7-1.7c-.2-.4-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.3-.9.9-.9 2.1s.9 2.5 1 2.6c.1.2 1.8 2.8 4.4 3.9 1.6.7 2.2.7 3 .6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2 0-.1-.2-.2-.4-.3Z",
  },
  {
    label: "YouTube",
    href: "https://youtube.com/",
    d: "M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15V9l5.2 3-5.2 3Z",
  },
];

/** Icon paths for the action rail. Hand-drawn, stroked, on a 24×24 grid. */
export const ICONS = {
  search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14ZM20 20l-4-4",
  account: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21a8 8 0 0 1 16 0",
  wishlist:
    "M12 20s-7-4.4-7-9.3A4 4 0 0 1 12 8a4 4 0 0 1 7-1.3c0 4.9-7 13.3-7 13.3Z",
  cart: "M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.5a2 2 0 0 0 2-1.6L20 8H6M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm9 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z",
  chevron: "M6 9l6 6 6-6",
} as const;
