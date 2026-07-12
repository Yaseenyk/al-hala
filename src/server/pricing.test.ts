import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { priceOrder } from "./pricing.ts";
import { BOX_SCHEMA_VERSION, type BoxPayload } from "../types/box.ts";

/**
 * The most security-relevant tests in the repo.
 *
 * A bug here does not produce a wrong pixel. It produces a customer paying ₹1 for a ₹780
 * box, or an order accepted for a candy that no longer exists.
 */

const box = (over: Partial<BoxPayload> = {}): BoxPayload => ({
  schemaVersion: BOX_SCHEMA_VERSION,
  boxSku: "BOX-6",
  candySkus: [
    { sku: "C-ALPHONSO", qty: 2 }, // 9000 x2 = 18000
    { sku: "C-KOKUM", qty: 1 }, //    8000
  ],
  ...over,
});

describe("priceOrder", () => {
  it("computes box + contents from the catalogue", () => {
    const result = priceOrder([{ payload: box(), qty: 1 }]);
    assert.ok(result.ok);

    // BOX-6 = 24000, contents = 18000 + 8000 = 26000. Unit = 50000 (₹500).
    assert.equal(result.order.lines[0]!.unitTotal, 50000);
    assert.equal(result.order.subtotal, 50000);
    // Under ₹1500, so delivery applies.
    assert.equal(result.order.delivery, 6000);
    assert.equal(result.order.total, 56000);
  });

  it("IGNORES any price the client tries to send", () => {
    // The attack: a tampered payload carrying its own prices. The schema strips unknown
    // keys, but even if it did not, nothing in pricing.ts ever READS a client price.
    const tampered = {
      ...box(),
      total: 1,
      price: 1,
      candySkus: [{ sku: "C-ALPHONSO", qty: 1, price: 1, unitPrice: 1 }],
    } as unknown as BoxPayload;

    const result = priceOrder([{ payload: tampered, qty: 1 }]);
    assert.ok(result.ok);

    // 24000 (box) + 9000 (one Alphonso, at the CATALOGUE price) = 33000. Not 1.
    assert.equal(result.order.subtotal, 33000);
  });

  it("multiplies by line quantity", () => {
    const result = priceOrder([{ payload: box(), qty: 3 }]);
    assert.ok(result.ok);
    assert.equal(result.order.lines[0]!.lineTotal, 150000);
    // Subtotal is now >= 150000, so delivery is free.
    assert.equal(result.order.delivery, 0);
    assert.equal(result.order.total, 150000);
  });

  it("rejects a box that is over capacity", () => {
    // BOX-6 holds six. Seven is not a rounding error, it is a tampered cart: the store
    // enforces capacity in the browser, and the browser is the customer's.
    const overfull = box({ candySkus: [{ sku: "C-ALPHONSO", qty: 7 }] });

    const result = priceOrder([{ payload: overfull, qty: 1 }]);
    assert.ok(!result.ok);
    assert.equal(result.failures[0]?.code, "OVER_CAPACITY");
  });

  it("rejects a discontinued candy rather than silently dropping it", () => {
    const stale = box({ candySkus: [{ sku: "C-GONE", qty: 1 }] });

    const result = priceOrder([{ payload: stale, qty: 1 }]);
    assert.ok(!result.ok);
    assert.equal(result.failures[0]?.code, "UNKNOWN_CANDY");
  });

  it("rejects an unknown box", () => {
    const result = priceOrder([{ payload: box({ boxSku: "BOX-FAKE" }), qty: 1 }]);
    assert.ok(!result.ok);
    assert.equal(result.failures[0]?.code, "UNKNOWN_BOX");
  });

  it("rejects an empty box", () => {
    const result = priceOrder([{ payload: box({ candySkus: [] }), qty: 1 }]);
    assert.ok(!result.ok);
  });

  it("prices multiple lines independently", () => {
    const result = priceOrder([
      { payload: box(), qty: 1 },
      {
        payload: box({ boxSku: "BOX-12", candySkus: [{ sku: "C-SAFFRON", qty: 4 }] }),
        qty: 2,
      },
    ]);

    assert.ok(result.ok);
    // Line 1: 50000. Line 2: (42000 + 11000*4) * 2 = 86000 * 2 = 172000.
    assert.equal(result.order.subtotal, 50000 + 172000);
  });

  it("keeps every value an integer — no float creeps in", () => {
    const result = priceOrder([{ payload: box(), qty: 3 }]);
    assert.ok(result.ok);

    for (const value of [
      result.order.subtotal,
      result.order.delivery,
      result.order.total,
      ...result.order.lines.map((line) => line.lineTotal),
    ]) {
      assert.ok(Number.isInteger(value), `${value} is not an integer`);
    }
  });
});
