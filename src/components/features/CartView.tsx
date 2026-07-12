"use client";

import Link from "next/link";

import { GiftBoxMark } from "@/components/ui/GiftBoxMark";
import { formatMoney } from "@/lib/catalogue";
import { useCart, useCartSubtotal, useHasMounted } from "@/store/cart";

/**
 * The cart.
 *
 * Reads from the persisted store, so it must not render its contents until after mount:
 * the server renders an empty cart and the client may rehydrate three items, which is a
 * hydration mismatch. `useHasMounted` gives a clean two-pass render.
 */
export function CartView() {
  const mounted = useHasMounted();
  const lines = useCart((state) => state.lines);
  const setQty = useCart((state) => state.setQty);
  const removeLine = useCart((state) => state.removeLine);
  const subtotal = useCartSubtotal();

  if (!mounted) {
    return <div className="min-h-96" aria-hidden />;
  }

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-start gap-8">
        <p className="text-lg text-cocoa-ink/55">
          Your cart is empty. Everything here is made to order, so nothing is waiting.
        </p>
        <Link
          href="/build-a-box"
          className="rounded-full bg-hala-green px-8 py-4 text-xs tracking-widest text-cream uppercase transition-colors hover:bg-deep-green"
        >
          Build a box
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-16 lg:grid-cols-3 lg:gap-24">
      <ul className="flex flex-col lg:col-span-2">
        {lines.map((line) => (
          <li
            key={line.id}
            className="flex flex-wrap items-center gap-6 border-b border-cocoa-ink/10 py-8"
          >
            <span className="size-24 shrink-0">
              <GiftBoxMark tone="text-saffron" animate={false} className="size-full" />
            </span>

            <div className="min-w-0 flex-1">
              <p className="font-display text-2xl font-light">{line.title}</p>
              <p className="mt-2 text-sm text-cocoa-ink/55">
                {line.payload.candySkus.reduce((total, item) => total + item.qty, 0)} pieces
              </p>
              {line.payload.note ? (
                <p className="mt-2 max-w-prose text-sm text-cocoa-ink/40 italic">
                  “{line.payload.note}”
                </p>
              ) : null}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQty(line.id, line.qty - 1)}
                aria-label="Decrease quantity"
                className="grid size-12 place-items-center rounded-full border border-cocoa-ink/15 hover:border-saffron"
              >
                −
              </button>
              <span className="w-6 text-center tabular-nums">{line.qty}</span>
              <button
                type="button"
                onClick={() => setQty(line.id, line.qty + 1)}
                aria-label="Increase quantity"
                className="grid size-12 place-items-center rounded-full border border-cocoa-ink/15 hover:border-saffron"
              >
                +
              </button>
            </div>

            <p className="w-24 text-end font-display text-xl tabular-nums">
              {formatMoney(line.unitPrice * line.qty)}
            </p>

            <button
              type="button"
              onClick={() => removeLine(line.id)}
              className="text-xs tracking-widest text-cocoa-ink/40 uppercase hover:text-saffron"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <aside className="lg:sticky lg:top-32 lg:h-fit">
        <div className="rounded-lg border border-cocoa-ink/10 p-8">
          <h2 className="font-display text-2xl font-light">Summary</h2>

          <dl className="mt-8 flex flex-col gap-4 border-b border-cocoa-ink/10 pb-8">
            <div className="flex justify-between">
              <dt className="text-cocoa-ink/55">Subtotal</dt>
              <dd className="tabular-nums">{formatMoney(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-cocoa-ink/55">Delivery</dt>
              <dd className="text-cocoa-ink/40">Calculated at checkout</dd>
            </div>
          </dl>

          <div className="mt-8 flex items-baseline justify-between">
            <span className="text-xs tracking-widest text-cocoa-ink/55 uppercase">
              Total
            </span>
            <span className="font-display text-3xl font-light tabular-nums">
              {formatMoney(subtotal)}
            </span>
          </div>

          {/*
            Deliberately disabled, and labelled.

            There is no payment gateway and no commerce backend yet — those decisions are
            still open (docs/architecture.md). A checkout button that looks live and then
            fails silently is worse than one that says plainly it is not ready. When the
            gateway lands, this is the ONE place that changes: the cart already holds a
            lean, versioned BoxPayload the server can re-price.
          */}
          <button
            type="button"
            disabled
            aria-describedby="checkout-note"
            className="mt-8 w-full rounded-full bg-saffron px-8 py-4 text-xs tracking-widest text-deep-green uppercase disabled:opacity-40"
          >
            Checkout
          </button>
          <p id="checkout-note" className="mt-4 text-xs text-cocoa-ink/40">
            Online payment is not live yet. Call the shop to order — we will take it from
            there.
          </p>
        </div>
      </aside>
    </div>
  );
}
