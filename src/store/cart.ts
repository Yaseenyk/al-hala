"use client";

import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { BoxPayload, Money } from "@/types/box";

/**
 * Cart and wishlist.
 *
 * NOTE the deliberate difference from `box-builder.ts`, which forbids `persist`:
 *
 *   - The box BUILDER is ephemeral. A half-composed box rehydrated from localStorage would
 *     carry candy names and prices captured at save time, and the catalogue moves.
 *   - The CART is durable. A customer who refreshes and loses their cart does not rebuild
 *     it, they leave. So the cart persists — but it persists the LEAN `BoxPayload`, never
 *     the builder's working state. Same adapter boundary, opposite lifetime.
 *
 * Prices here are a PREVIEW. Integer minor units, never floats. The server re-prices from
 * the payload at checkout and that price is the only authoritative one — a cart total
 * restored from a month-old localStorage entry is a guess, not a quote.
 */

export interface CartLine {
  /** Stable line id, so the same box added twice is two lines, not a merge. */
  id: string;
  payload: BoxPayload;
  /** Denormalised for display only. Re-derived on the server at checkout. */
  title: string;
  unitPrice: Money;
  qty: number;
}

interface CartState {
  lines: CartLine[];
  /** Occasion / product slugs. Wishlist is a set of references, never a copy of the item. */
  wishlist: string[];
}

interface CartActions {
  addLine(line: CartLine): void;
  removeLine(id: string): void;
  setQty(id: string, qty: number): void;
  toggleWish(slug: string): void;
  clear(): void;
}

const initialState: CartState = { lines: [], wishlist: [] };

export const useCart = create<CartState & CartActions>()(
  persist(
    (set) => ({
      ...initialState,

      addLine: (line) => set((state) => ({ lines: [...state.lines, line] })),

      removeLine: (id) =>
        set((state) => ({ lines: state.lines.filter((line) => line.id !== id) })),

      setQty: (id, qty) =>
        set((state) => ({
          lines: state.lines
            .map((line) => (line.id === id ? { ...line, qty } : line))
            .filter((line) => line.qty > 0),
        })),

      toggleWish: (slug) =>
        set((state) => ({
          wishlist: state.wishlist.includes(slug)
            ? state.wishlist.filter((entry) => entry !== slug)
            : [...state.wishlist, slug],
        })),

      clear: () => set(initialState),
    }),
    {
      name: "alhala-cart",
      version: 1,
      // Only the durable half. Actions and any future derived fields stay out of storage.
      partialize: (state) => ({ lines: state.lines, wishlist: state.wishlist }),
    },
  ),
);

// ---------------------------------------------------------------------------
// Hydration
// ---------------------------------------------------------------------------

/**
 * `persist` rehydrates from localStorage on the client, so the very first client render
 * can disagree with the server HTML — the server always renders an empty cart, the client
 * may render "3". React calls that a hydration mismatch and blows away the tree.
 *
 * `useSyncExternalStore` with a server snapshot of `false` gives a clean two-pass render:
 * the badge is absent on the server and on the first client paint, and appears immediately
 * after. No mismatch, no flash of a wrong number.
 */
const noop = () => () => {};

export function useHasMounted(): boolean {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}

/** Total items, not total lines — a box with qty 3 is three things in the bag. */
export function useCartCount(): number {
  const mounted = useHasMounted();
  const count = useCart((state) =>
    state.lines.reduce((total, line) => total + line.qty, 0),
  );
  return mounted ? count : 0;
}

export function useWishlistCount(): number {
  const mounted = useHasMounted();
  const count = useCart((state) => state.wishlist.length);
  return mounted ? count : 0;
}

/** Preview only. The server re-prices at checkout; this number is never trusted. */
export function useCartSubtotal(): Money {
  return useCart((state) =>
    state.lines.reduce((total, line) => total + line.unitPrice * line.qty, 0),
  );
}
