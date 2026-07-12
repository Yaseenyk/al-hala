import { randomBytes } from "node:crypto";

import { getDb } from "./db.ts";
import type { PricedOrder } from "../lib/pricing.ts";
import type { CustomerInput } from "./schema.ts";
import type { BoxPayload } from "../types/box.ts";

/**
 * The order repository. The ONLY module that talks to the database.
 *
 * Everything above it — the actions, the pages — calls these functions. Swap `db.ts` for
 * Postgres and this file's signatures do not change, so nothing above it changes either.
 */

export interface OrderRecord {
  reference: string;
  status: string;
  customer: CustomerInput;
  priced: PricedOrder;
  createdAt: string;
}

/**
 * A human-readable reference: AH-7K4M2Q.
 *
 * `randomBytes`, not `Math.random()` or a timestamp. A sequential or guessable reference
 * means anyone can enumerate other people's orders by counting — and this reference is the
 * key to the confirmation page.
 *
 * Crockford-ish alphabet: no I, O, 0 or 1, because this gets read aloud over the phone and
 * "was that an oh or a zero" is a support call you do not want.
 */
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTVWXYZ";

function newReference(): string {
  const bytes = randomBytes(6);
  const body = Array.from(bytes, (byte) => ALPHABET[byte % ALPHABET.length]).join("");
  return `AH-${body}`;
}

export function createOrder(input: {
  customer: CustomerInput;
  priced: PricedOrder;
  payloads: readonly { payload: BoxPayload; qty: number }[];
}): OrderRecord {
  const db = getDb();
  const reference = newReference();

  db.prepare(
    `INSERT INTO orders (
       reference, status,
       customer_name, customer_email, customer_phone,
       address_line, city, postal_code, is_gift, gift_note,
       subtotal, delivery, total,
       priced_json, payload_json
     ) VALUES (?, 'pending', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    reference,
    input.customer.name,
    input.customer.email,
    input.customer.phone,
    input.customer.addressLine,
    input.customer.city,
    input.customer.postalCode,
    input.customer.isGift ? 1 : 0,
    input.customer.giftNote ?? null,
    input.priced.subtotal,
    input.priced.delivery,
    input.priced.total,
    JSON.stringify(input.priced),
    JSON.stringify(input.payloads),
  );

  return {
    reference,
    status: "pending",
    customer: input.customer,
    priced: input.priced,
    createdAt: new Date().toISOString(),
  };
}

export function findOrder(reference: string): OrderRecord | null {
  const db = getDb();

  const row = db
    .prepare(`SELECT * FROM orders WHERE reference = ?`)
    .get(reference) as Record<string, unknown> | undefined;

  if (!row) return null;

  return {
    reference: row.reference as string,
    status: row.status as string,
    customer: {
      name: row.customer_name as string,
      email: row.customer_email as string,
      phone: row.customer_phone as string,
      addressLine: row.address_line as string,
      city: row.city as string,
      postalCode: row.postal_code as string,
      isGift: Boolean(row.is_gift),
      giftNote: (row.gift_note as string | null) ?? undefined,
    },
    priced: JSON.parse(row.priced_json as string) as PricedOrder,
    createdAt: row.created_at as string,
  };
}

export function saveEnquiry(input: {
  name: string;
  email: string;
  message: string;
}): void {
  getDb()
    .prepare(`INSERT INTO enquiries (name, email, message) VALUES (?, ?, ?)`)
    .run(input.name, input.email, input.message);
}
