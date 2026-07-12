"use server";

import { createOrder, saveEnquiry } from "./orders.ts";
import { priceOrder } from "./pricing.ts";
import { enquirySchema, placeOrderSchema } from "./schema.ts";

/**
 * Server Actions. The entry point from the browser into the server.
 *
 * `"use server"` means these are POST endpoints, reachable by anyone with the page open and
 * a network tab. Treat every argument as hostile — a Server Action is not a function call
 * that happens to run on the server; it is a public API with a nice-looking call site.
 *
 * The order of operations below is the whole security model, and it does not vary:
 *
 *   1. PARSE the input. If it does not match the schema, stop.
 *   2. RE-PRICE from the catalogue on the server. The client's number is never read.
 *   3. PERSIST what the server computed, never what the client sent.
 */

export type PlaceOrderResult =
  | { ok: true; reference: string }
  | { ok: false; message: string };

export async function placeOrder(raw: unknown): Promise<PlaceOrderResult> {
  const parsed = placeOrderSchema.safeParse(raw);

  if (!parsed.success) {
    // The validation detail is deliberately not echoed back. It tells an attacker exactly
    // which field to change next, and it tells a real customer nothing they can act on.
    return { ok: false, message: "Please check the details and try again." };
  }

  const { lines, customer } = parsed.data;

  // The authoritative number. Recomputed from the catalogue — the browser never sent one.
  const priced = priceOrder(lines);

  if (!priced.ok) {
    const stale = priced.failures.some(
      (failure) => failure.code === "UNKNOWN_BOX" || failure.code === "UNKNOWN_CANDY",
    );

    return {
      ok: false,
      message: stale
        ? "Something in your cart is no longer available. Please rebuild your box."
        : "That box does not add up. Please review it and try again.",
    };
  }

  try {
    const order = createOrder({
      customer,
      priced: priced.order,
      payloads: lines,
    });

    return { ok: true, reference: order.reference };
  } catch {
    // The customer gets a sentence. The stack trace does not belong on their screen — it
    // is an information leak and it is useless to them.
    return {
      ok: false,
      message: "We could not save that order. Please call the shop and we will take it.",
    };
  }
}

export type EnquiryResult = { ok: true } | { ok: false; message: string };

export async function sendEnquiry(raw: unknown): Promise<EnquiryResult> {
  const parsed = enquirySchema.safeParse(raw);

  if (!parsed.success) {
    return { ok: false, message: "Please check the form and try again." };
  }

  // The honeypot was filled, so this is a bot. Return success: telling a bot it was caught
  // teaches whoever is running it to fix their script.
  if (parsed.data.company) return { ok: true };

  try {
    saveEnquiry({
      name: parsed.data.name,
      email: parsed.data.email,
      message: parsed.data.message,
    });
    return { ok: true };
  } catch {
    return { ok: false, message: "Could not send that. Please call the shop." };
  }
}
