import { CATALOGUE } from "./catalogue.ts";
import type { BoxPayload, Money } from "../types/box.ts";

/**
 * PRICING. Pure — SKUs and quantities in, rupees out. Nothing here ever READS a price from
 * its input; every figure is looked up from the catalogue and recomputed from scratch.
 *
 * ⚠️ WHERE THE AUTHORITY ACTUALLY LIVES, ON THIS DEPLOYMENT:
 *
 * The site is a static export on GitHub Pages. There is no server, so this function now runs
 * in the CUSTOMER'S BROWSER — which they control, and can edit. The total it produces is
 * therefore NOT a guarantee. Anyone determined enough can make the page display any number.
 *
 * That is survivable ONLY because of how the order completes: the WhatsApp message carries
 * the full itemised breakdown — every candy, every quantity, the box — and a HUMAN at the
 * shop confirms it before a rupee is collected. The shop is the authority. The tampered
 * total would arrive next to a line-by-line list that contradicts it, in a message a person
 * reads. That is not a hole; it is a different, older enforcement point.
 *
 * The moment payment moves online, that stops being true and this MUST run server-side
 * again. `src/server/actions.ts` already calls it exactly that way and is kept for it: parse
 * → re-price HERE → persist what the server computed. Do not wire a gateway to a total that
 * came from a browser.
 *
 * Being pure is what lets it be both — unit-tested, and correct in either home.
 */

export type PriceFailure =
  | { code: "UNKNOWN_BOX"; sku: string }
  | { code: "UNKNOWN_CANDY"; sku: string }
  | { code: "OVER_CAPACITY"; sku: string; capacity: number; filled: number }
  | { code: "EMPTY_BOX" };

export interface PricedLine {
  boxSku: string;
  boxName: string;
  boxPrice: Money;
  candies: { sku: string; name: string; qty: number; unitPrice: Money; total: Money }[];
  /** Box + contents, for one unit of this line. */
  unitTotal: Money;
  qty: number;
  lineTotal: Money;
}

export interface PricedOrder {
  lines: PricedLine[];
  subtotal: Money;
  /** Placeholder until Shiprocket rates are wired. Integer minor units. */
  delivery: Money;
  total: Money;
}

export type PriceResult =
  | { ok: true; order: PricedOrder }
  | { ok: false; failures: PriceFailure[] };

/**
 * Re-validates the box against the CURRENT catalogue, not the one the customer had.
 *
 * A box sat in someone's localStorage for three weeks. A candy was discontinued, or the box
 * capacity changed. Trusting the payload would mean selling something that no longer exists
 * at a price that no longer applies.
 */
function priceBox(payload: BoxPayload, qty: number, failures: PriceFailure[]) {
  const box = CATALOGUE.boxes[payload.boxSku];

  if (!box) {
    failures.push({ code: "UNKNOWN_BOX", sku: payload.boxSku });
    return null;
  }

  const candies: PricedLine["candies"] = [];
  let filled = 0;
  let contents: Money = 0;

  for (const item of payload.candySkus) {
    const candy = CATALOGUE.candies[item.sku];

    if (!candy) {
      failures.push({ code: "UNKNOWN_CANDY", sku: item.sku });
      continue;
    }

    const total = candy.price * item.qty;
    contents += total;
    filled += item.qty;

    candies.push({
      sku: candy.sku,
      name: candy.name,
      qty: item.qty,
      unitPrice: candy.price,
      total,
    });
  }

  if (filled === 0) {
    failures.push({ code: "EMPTY_BOX" });
    return null;
  }

  // Capacity is re-checked HERE and not only in the store. The store is a UI convenience
  // running in a browser the customer controls; it is not an enforcement point.
  if (filled > box.capacity) {
    failures.push({
      code: "OVER_CAPACITY",
      sku: box.sku,
      capacity: box.capacity,
      filled,
    });
    return null;
  }

  const unitTotal = box.price + contents;

  return {
    boxSku: box.sku,
    boxName: box.name,
    boxPrice: box.price,
    candies,
    unitTotal,
    qty,
    lineTotal: unitTotal * qty,
  } satisfies PricedLine;
}

/** Flat until Shiprocket rate quotes are wired. ₹60, free above ₹1500. */
function deliveryFor(subtotal: Money): Money {
  return subtotal >= 150000 ? 0 : 6000;
}

export function priceOrder(
  lines: readonly { payload: BoxPayload; qty: number }[],
): PriceResult {
  const failures: PriceFailure[] = [];
  const priced: PricedLine[] = [];

  for (const line of lines) {
    const result = priceBox(line.payload, line.qty, failures);
    if (result) priced.push(result);
  }

  if (failures.length > 0) return { ok: false, failures };

  const subtotal = priced.reduce((total, line) => total + line.lineTotal, 0);
  const delivery = deliveryFor(subtotal);

  return {
    ok: true,
    order: { lines: priced, subtotal, delivery, total: subtotal + delivery },
  };
}
