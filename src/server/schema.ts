import { z } from "zod";

import { BOX_SCHEMA_VERSION } from "../types/box.ts";

/**
 * The trust boundary.
 *
 * Everything crossing from a browser into the server is parsed here first. Not because a
 * TypeScript type protects anything — `BoxPayload` is erased at runtime and a POST body is
 * whatever the sender felt like typing — but because this is the one place we get to
 * decide what "a valid order" means before it touches the database.
 *
 * Note what is deliberately ABSENT from every schema below: PRICE.
 *
 * The client never sends a price and the server never reads one. Prices are looked up from
 * the catalogue on the server and the total is recomputed from scratch. A schema that
 * accepted `total: number` would be a schema that lets a customer buy a ₹780 box for ₹1 by
 * editing one number in devtools, and it is the single most common way a storefront gets
 * robbed.
 */

export const boxPayloadSchema = z.object({
  schemaVersion: z.literal(BOX_SCHEMA_VERSION),
  boxSku: z.string().min(1).max(32),
  candySkus: z
    .array(
      z.object({
        sku: z.string().min(1).max(32),
        // A cap, not because 99 is meaningful, but because an unbounded integer here is a
        // memory-exhaustion primitive: qty: 1e9 makes the server allocate a billion-item
        // line before any business rule gets a chance to reject it.
        qty: z.number().int().min(1).max(99),
      }),
    )
    .min(1)
    .max(64),
  note: z.string().max(240).optional(),
});

const phone = z
  .string()
  .trim()
  .min(8)
  .max(20)
  .regex(/^[+0-9 ()-]+$/, "Enter a valid phone number");

export const customerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.email().max(120),
  phone,
  addressLine: z.string().trim().min(4).max(160),
  city: z.string().trim().min(2).max(60),
  postalCode: z.string().trim().min(4).max(12),
  /** Gift orders ship with no price on the slip. This is a product rule, not a preference. */
  isGift: z.boolean().default(false),
  giftNote: z.string().max(240).optional(),
});

export const placeOrderSchema = z.object({
  lines: z
    .array(z.object({ payload: boxPayloadSchema, qty: z.number().int().min(1).max(50) }))
    .min(1)
    .max(20),
  customer: customerSchema,
});

export type PlaceOrderInput = z.infer<typeof placeOrderSchema>;
export type CustomerInput = z.infer<typeof customerSchema>;

export const enquirySchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.email().max(120),
  message: z.string().trim().min(10).max(2000),
  /**
   * Honeypot. A real person never sees this field and so never fills it; most naive bots
   * fill every input they find. Cheaper and less hostile than a CAPTCHA, and it costs the
   * user nothing.
   */
  company: z.string().max(0).optional(),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;
