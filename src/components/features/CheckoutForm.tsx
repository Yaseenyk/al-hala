"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { formatMoney } from "@/lib/catalogue";
import { placeOrder } from "@/server/actions";
import { useCart, useCartSubtotal, useHasMounted } from "@/store/cart";

/**
 * Checkout.
 *
 * Sends SKUs and quantities. It does NOT send a price — not even the one it is displaying.
 * The server recomputes the total from the catalogue and that number is authoritative. The
 * figures below are a preview, and the confirmation page shows what was actually charged.
 *
 * If the two disagree — a candy was discontinued while the cart sat in localStorage for a
 * fortnight — the server refuses the order and says so, rather than quietly charging a
 * different amount than the one on screen.
 */
export function CheckoutForm() {
  const router = useRouter();
  const mounted = useHasMounted();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const lines = useCart((state) => state.lines);
  const clear = useCart((state) => state.clear);
  const subtotal = useCartSubtotal();

  if (!mounted) return <div className="min-h-96" aria-hidden />;

  if (lines.length === 0) {
    return <p className="text-lg text-cocoa-ink/55">Your cart is empty.</p>;
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await placeOrder({
        // SKUs and quantities only. No prices cross this boundary.
        lines: lines.map((line) => ({ payload: line.payload, qty: line.qty })),
        customer: {
          name: String(form.get("name") ?? ""),
          email: String(form.get("email") ?? ""),
          phone: String(form.get("phone") ?? ""),
          addressLine: String(form.get("addressLine") ?? ""),
          city: String(form.get("city") ?? ""),
          postalCode: String(form.get("postalCode") ?? ""),
          isGift: form.get("isGift") === "on",
          giftNote: String(form.get("giftNote") ?? "") || undefined,
        },
      });

      if (!result.ok) {
        setError(result.message);
        return;
      }

      // Clear only AFTER the server has the order. Clearing first would lose the cart if
      // the request failed, and the customer would have to rebuild the whole box.
      clear();
      router.push(`/order/${result.reference}`);
    });
  }

  return (
    <div className="grid gap-16 lg:grid-cols-3 lg:gap-24">
      <form onSubmit={onSubmit} className="flex flex-col gap-6 lg:col-span-2">
        <fieldset disabled={pending} className="flex flex-col gap-6">
          <legend className="sr-only">Delivery details</legend>

          <Field name="name" label="Full name" autoComplete="name" required />
          <div className="grid gap-6 sm:grid-cols-2">
            <Field name="email" label="Email" type="email" autoComplete="email" required />
            <Field name="phone" label="Phone" type="tel" autoComplete="tel" required />
          </div>
          <Field
            name="addressLine"
            label="Address"
            autoComplete="street-address"
            required
          />
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
          disabled={pending}
          className="self-start rounded-full bg-hala-green px-8 py-4 text-xs tracking-widest text-cream uppercase transition-colors hover:bg-deep-green disabled:opacity-40"
        >
          {pending ? "Placing order…" : "Place order"}
        </button>

        {/*
          There is no payment step, and the page says so rather than implying one.
          Payment goes live when a gateway is chosen (Razorpay is the obvious one for UPI
          in India). The order is real and saved either way — the shop calls to collect.
        */}
        <p className="text-xs text-cocoa-ink/40">
          No payment is taken online yet. We will call to confirm the order and take payment.
        </p>
      </form>

      <aside className="lg:sticky lg:top-32 lg:h-fit">
        <div className="rounded-lg border border-cocoa-ink/10 p-8">
          <h2 className="font-display text-2xl font-light">Your order</h2>
          <ul className="mt-8 flex flex-col gap-4 border-b border-cocoa-ink/10 pb-8">
            {lines.map((line) => (
              <li key={line.id} className="flex justify-between gap-4 text-sm">
                <span>
                  {line.title} × {line.qty}
                </span>
                <span className="tabular-nums">
                  {formatMoney(line.unitPrice * line.qty)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex items-baseline justify-between">
            <span className="text-xs tracking-widest text-cocoa-ink/55 uppercase">
              Estimated
            </span>
            <span className="font-display text-3xl font-light tabular-nums">
              {formatMoney(subtotal)}
            </span>
          </div>
          <p className="mt-2 text-xs text-cocoa-ink/40">
            Confirmed by us before payment. Delivery added at confirmation.
          </p>
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
