import { BUSINESS } from "./business.ts";
import { formatMoney } from "./catalogue.ts";
import type { PricedOrder } from "./pricing.ts";

/**
 * The order channel.
 *
 * There is no server (see `next.config.ts` — static export), so an order cannot be POSTed
 * anywhere. Instead it leaves as a WhatsApp message: the customer taps a button, WhatsApp
 * opens with the full basket already typed out, and they hit send. The shop replies and
 * takes payment on UPI.
 *
 * This is not a downgrade dressed up as a feature. It is how most confectioners, bakers and
 * gifting shops in India actually sell, and it has two properties a half-built checkout does
 * not: the customer keeps a copy of exactly what they ordered, and a HUMAN confirms the
 * order before any money moves — which is what makes browser-side pricing safe (see
 * `pricing.ts`).
 *
 * Everything here is a PURE string function. No fetch, no DOM. That is what makes it
 * testable, and pricing/ordering is the code most worth testing in this repo.
 */

/** WhatsApp's own markup. `*bold*` — not Markdown's `**bold**`, which renders literally. */
const bold = (text: string) => `*${text}*`;

/**
 * wa.me demands DIGITS ONLY — no `+`, no spaces, no dashes. A number with a `+` in it
 * yields "phone number shared via url is invalid", which reads to a customer as a broken
 * shop. Strip defensively rather than trust the config to be clean.
 */
function normaliseNumber(raw: string): string {
  return raw.replace(/\D/g, "");
}

/** True once `BUSINESS.whatsapp` holds something that could actually be dialled. */
export function isWhatsappConfigured(): boolean {
  return !BUSINESS.whatsapp.startsWith("TODO") && normaliseNumber(BUSINESS.whatsapp).length >= 10;
}

export function waLink(message: string): string {
  return `https://wa.me/${normaliseNumber(BUSINESS.whatsapp)}?text=${encodeURIComponent(message)}`;
}

export interface OrderContact {
  name: string;
  phone: string;
  addressLine: string;
  city: string;
  postalCode: string;
  isGift: boolean;
  giftNote?: string;
}

/**
 * The message a customer sends to place an order.
 *
 * ITEMISED DELIBERATELY, down to each candy and its quantity. The totals in this message
 * were computed in the customer's own browser and so cannot be trusted on their own — but
 * they arrive beside a line-by-line breakdown that a person at the shop reads before
 * confirming. A tampered total contradicts the list printed directly above it. That is the
 * check, and it only works if the breakdown is actually here.
 */
export function orderMessage(order: PricedOrder, contact: OrderContact): string {
  const lines: string[] = [bold("New order — Al-Hala Candies"), ""];

  order.lines.forEach((line, index) => {
    lines.push(`${index + 1}. ${bold(line.boxName)} × ${line.qty}`);

    for (const candy of line.candies) {
      lines.push(`   • ${candy.name} × ${candy.qty} — ${formatMoney(candy.total)}`);
    }

    lines.push(
      `   Box ${formatMoney(line.boxPrice)} + contents ${formatMoney(
        line.unitTotal - line.boxPrice,
      )} = ${formatMoney(line.lineTotal)}`,
      "",
    );
  });

  lines.push(
    `Subtotal: ${formatMoney(order.subtotal)}`,
    `Delivery: ${order.delivery === 0 ? "Free" : formatMoney(order.delivery)}`,
    bold(`Total: ${formatMoney(order.total)}`),
    "",
    bold("Deliver to"),
    contact.name,
    contact.phone,
    `${contact.addressLine}, ${contact.city} ${contact.postalCode}`,
  );

  if (contact.isGift) {
    lines.push("", "🎁 This is a gift — please ship with no price on the packing slip.");
    if (contact.giftNote) lines.push(`Gift note: “${contact.giftNote}”`);
  }

  return lines.join("\n");
}

export function enquiryMessage(input: { name: string; message: string }): string {
  return [
    bold("Enquiry — Al-Hala Candies"),
    "",
    input.message,
    "",
    `— ${input.name}`,
  ].join("\n");
}

/** A product page's "ask about this" button. Pre-names the item so the shop has context. */
export function productEnquiryMessage(productName: string): string {
  return `Hello Al-Hala — I would like to ask about ${bold(productName)}.`;
}
