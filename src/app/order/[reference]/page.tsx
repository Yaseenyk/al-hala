import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { GiftBoxMark } from "@/components/ui/GiftBoxMark";
import { PageHeader } from "@/components/ui/PageHeader";
import { BUSINESS } from "@/lib/business";
import { formatMoney } from "@/lib/catalogue";
import { findOrder } from "@/server/orders";

export const metadata: Metadata = {
  title: "Order Confirmed",
  // An order page is per-customer and contains their address. It must never be indexed,
  // and it must never be followed into.
  robots: { index: false, follow: false },
};

/**
 * The confirmation. Rendered on the SERVER from the database — not from the cart, and not
 * from anything the browser is holding.
 *
 * That matters: the numbers below are what was actually saved and what will actually be
 * charged. Rendering this from client state would show the customer the preview price and
 * then bill them the real one.
 */
export default async function OrderPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = await params;
  const order = findOrder(reference);

  if (!order) notFound();

  return (
    <main>
      <PageHeader
        eyebrow={`Order ${order.reference}`}
        title="We have your order"
        lede="Nothing is pressed until we have spoken to you. We will call to confirm the details and take payment."
        crumbs={[{ label: "Order" }]}
      />

      <div className="grain relative bg-cream text-cocoa-ink">
        <div className="mx-auto max-w-6xl px-6 pb-24 sm:px-8 md:px-16">
          <div className="grid gap-16 md:grid-cols-3 md:gap-24">
            <div className="md:col-span-2">
              <h2 className="font-display text-3xl font-light">What you ordered</h2>

              <ul className="mt-8 flex flex-col gap-8">
                {order.priced.lines.map((line) => (
                  <li
                    key={line.boxSku}
                    className="flex flex-col gap-4 border-t border-cocoa-ink/10 pt-8"
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="font-display text-2xl font-light">
                        {line.boxName} × {line.qty}
                      </h3>
                      <span className="tabular-nums">{formatMoney(line.lineTotal)}</span>
                    </div>
                    <ul className="flex flex-col gap-2 text-sm text-cocoa-ink/60">
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

              <dl className="mt-16 flex flex-col gap-4 border-t border-cocoa-ink/10 pt-8">
                <div className="flex justify-between">
                  <dt className="text-cocoa-ink/55">Subtotal</dt>
                  <dd className="tabular-nums">{formatMoney(order.priced.subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-cocoa-ink/55">Delivery</dt>
                  <dd className="tabular-nums">
                    {order.priced.delivery === 0
                      ? "Free"
                      : formatMoney(order.priced.delivery)}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between border-t border-cocoa-ink/10 pt-4">
                  <dt className="text-xs tracking-widest uppercase">Total</dt>
                  <dd className="font-display text-3xl font-light tabular-nums">
                    {formatMoney(order.priced.total)}
                  </dd>
                </div>
              </dl>
            </div>

            <aside className="flex flex-col gap-8">
              <span className="size-48 self-center">
                <GiftBoxMark tone="text-saffron" animate className="size-full" />
              </span>

              <div className="rounded-lg border border-cocoa-ink/10 p-8">
                <h2 className="font-display text-2xl font-light">Reference</h2>
                <p className="mt-4 font-display text-3xl tracking-widest tabular-nums">
                  {order.reference}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-cocoa-ink/55">
                  Quote this when you call. We have sent nothing by email yet — email is not
                  wired up, and we would rather say so than let you wait for a message that
                  is not coming.
                </p>
              </div>

              <div className="rounded-lg border border-cocoa-ink/10 p-8">
                <h2 className="font-display text-2xl font-light">Delivering to</h2>
                <address className="mt-4 text-sm leading-relaxed text-cocoa-ink/60 not-italic">
                  {order.customer.name}
                  <br />
                  {order.customer.addressLine}
                  <br />
                  {order.customer.city} {order.customer.postalCode}
                </address>
                {order.customer.isGift ? (
                  <p className="mt-4 text-xs tracking-widest text-saffron uppercase">
                    Gift — no price on the slip
                  </p>
                ) : null}
              </div>

              <p className="text-sm leading-relaxed text-cocoa-ink/55">
                Made by hand in {BUSINESS.primaryLocality}. We will call within one working
                day.
              </p>

              <Link
                href="/"
                className="self-start text-xs tracking-widest text-saffron uppercase hover:text-hala-green"
              >
                Back to the shop →
              </Link>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}
