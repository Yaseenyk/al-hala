"use client";

import { useState } from "react";

import { formatMoney } from "@/lib/catalogue";
import { priceOrder } from "@/lib/pricing";
import { isWhatsappConfigured, orderMessage, waLink } from "@/lib/whatsapp";
import { useCart, useHasMounted } from "@/store/cart";

/**
 * Checkout — WhatsApp handoff.
 *
 * There is no server (static export), so nothing is POSTed. Submitting re-prices the cart
 * from the catalogue, writes the whole basket out as an itemised WhatsApp message, and hands
 * the customer to WhatsApp with it already typed. They press send; the shop confirms and
 * takes payment on UPI.
 *
 * The cart is NOT cleared on submit. We hand off to another app and never hear back, so we
 * do not know whether they actually pressed send. Clearing here would destroy a box they
 * spent five minutes building, on the mere assumption that they did.
 */
export function CheckoutForm() {
  const mounted = useHasMounted();
  const [error, setError] = useState<string | null>(null);

  const lines = useCart((state) => state.lines);

  if (!mounted) return <div className="min-h-96" aria-hidden />;

  if (lines.length === 0) {
    return <p className="text-lg text-cocoa-ink/55">Your cart is empty.</p>;
  }

  // Re-priced from the catalogue, never read from the cart's stored total: a cart can sit in
  // localStorage for a fortnight while a candy is discontinued underneath it.
  const quote = priceOrder(lines.map((line) => ({ payload: line.payload, qty: line.qty })));

  if (!quote.ok) {
    const stale = quote.failures.some(
      (failure) => failure.code === "UNKNOWN_BOX" || failure.code === "UNKNOWN_CANDY",
    );

    return (
      <p role="alert" className="rounded-lg border border-saffron/50 bg-saffron/10 p-8">
        {stale
          ? "Something in your cart is no longer on the menu. Please rebuild your box."
          : "That box does not add up. Please review it and try again."}
      </p>
    );
  }

  const order = quote.order;
  const configured = isWhatsappConfigured();

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!configured) {
      setError("Ordering is not switched on yet. Please call the shop.");
      return;
    }

    const form = new FormData(event.currentTarget);

    const message = orderMessage(order, {
      name: String(form.get("name") ?? ""),
      phone: String(form.get("phone") ?? ""),
      addressLine: String(form.get("addressLine") ?? ""),
      city: String(form.get("city") ?? ""),
      postalCode: String(form.get("postalCode") ?? ""),
      isGift: form.get("isGift") === "on",
      giftNote: String(form.get("giftNote") ?? "") || undefined,
    });

    // Same-tab navigation from a user gesture. `window.open` would be eaten by a popup blocker.
    window.location.href = waLink(message);
  }

  return (
    <div className="grid gap-16 lg:grid-cols-3 lg:gap-24">
      <form onSubmit={onSubmit} className="flex flex-col gap-6 lg:col-span-2">
        <fieldset className="flex flex-col gap-6">
          <legend className="sr-only">Delivery details</legend>

          <Field name="name" label="Full name" autoComplete="name" required />
          <Field name="phone" label="Phone" type="tel" autoComplete="tel" required />
          <Field name="addressLine" label="Address" autoComplete="street-address" required />

          <div className="grid gap-6 sm:grid-cols-2">
            <Field name="city" label="Town / City" autoComplete="address-level2" required />
            <Field
              name="postalCode"
              label="PIN code"
              autoComplete="postal-code"
              inputMode="numeric"
              required
            />
          </div>

          <label className="flex items-center gap-4 text-sm">
            <input
              type="checkbox"
              name="isGift"
              className="size-6 accent-hala-green"
              defaultChecked
            />
            This is a gift — ship with no price on the packing slip
          </label>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="giftNote"
              className="text-xs tracking-widest text-cocoa-ink/55 uppercase"
            >
              Gift note (optional)
            </label>
            <textarea
              id="giftNote"
              name="giftNote"
              rows={3}
              maxLength={240}
              className="rounded-lg border border-cocoa-ink/15 bg-transparent p-4 focus:border-saffron"
            />
          </div>
        </fieldset>

        {!configured ? (
          <p
            role="alert"
            className="rounded-lg border border-saffron/50 bg-saffron/10 p-4 text-sm"
          >
            Online ordering is not switched on yet — the shop’s WhatsApp number has not been
            added to the site. Please call us and we will take your order.
          </p>
        ) : null}

        {error ? (
          <p
            role="alert"
            className="rounded-lg border border-saffron/50 bg-saffron/10 p-4 text-sm"
          >
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          className="self-start rounded-full bg-hala-green px-8 py-4 text-xs tracking-widest text-cream uppercase transition-colors hover:bg-deep-green"
        >
          Order on WhatsApp
        </button>

        <p className="text-xs text-cocoa-ink/40">
          We do not take card payments online. Your order opens in WhatsApp with everything
          written out — send it, and we will confirm and take payment on UPI.
        </p>
      </form>

      <aside className="lg:sticky lg:top-32 lg:h-fit">
        <div className="rounded-lg border border-cocoa-ink/10 p-8">
          <h2 className="font-display text-2xl font-light">Your order</h2>

          <ul className="mt-8 flex flex-col gap-6 border-b border-cocoa-ink/10 pb-8">
            {order.lines.map((line) => (
              <li key={line.boxSku} className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between gap-4">
                  <span>
                    {line.boxName} × {line.qty}
                  </span>
                  <span className="tabular-nums">{formatMoney(line.lineTotal)}</span>
                </div>
                <ul className="flex flex-col gap-2 text-xs text-cocoa-ink/55">
                  {line.candies.map((candy) => (
                    <li key={candy.sku} className="flex justify-between gap-4">
                      <span>
                        {candy.name} × {candy.qty}
                      </span>
                      <span className="tabular-nums">{formatMoney(candy.total)}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>

          <dl className="mt-8 flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-cocoa-ink/55">Subtotal</dt>
              <dd className="tabular-nums">{formatMoney(order.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-cocoa-ink/55">Delivery</dt>
              <dd className="tabular-nums">
                {order.delivery === 0 ? "Free" : formatMoney(order.delivery)}
              </dd>
            </div>
          </dl>

          <div className="mt-8 flex items-baseline justify-between border-t border-cocoa-ink/10 pt-8">
            <span className="text-xs tracking-widest text-cocoa-ink/55 uppercase">Total</span>
            <span className="font-display text-3xl font-light tabular-nums">
              {formatMoney(order.total)}
            </span>
          </div>
        </div>
      </aside>
    </div>
  );
}

interface FieldProps {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  inputMode?: "numeric" | "text";
}

function Field({ name, label, type = "text", ...rest }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-xs tracking-widest text-cocoa-ink/55 uppercase">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        {...rest}
        className="rounded-lg border border-cocoa-ink/15 bg-transparent p-4 focus:border-saffron"
      />
    </div>
  );
}
