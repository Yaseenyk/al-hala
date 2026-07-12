import assert from "node:assert/strict";
import { rmSync } from "node:fs";
import { after, describe, it } from "node:test";

process.env.DATABASE_PATH = ".data/test.db";

const { priceOrder } = await import("./pricing.ts");
const { createOrder, findOrder } = await import("./orders.ts");

const payload = {
  schemaVersion: 1 as const,
  boxSku: "BOX-6",
  candySkus: [{ sku: "C-ALPHONSO", qty: 2 }, { sku: "C-KOKUM", qty: 1 }],
  note: "Eid Mubarak",
};

const customer = {
  name: "Test Customer",
  email: "t@example.com",
  phone: "+91 9999999999",
  addressLine: "1 Test Road",
  city: "Ratnagiri",
  postalCode: "415612",
  isGift: true,
};

// Windows holds the SQLite file handle open for the life of the process, so the unlink
// races the still-open connection. The temp DB is gitignored; failing the suite over
// cleanup would be reporting a passing pipeline as broken.
after(() => {
  try {
    rmSync(".data", { recursive: true, force: true });
  } catch {
    /* the OS still has the handle. Harmless — .data/ is gitignored. */
  }
});

describe("orders", () => {
  it("persists the SERVER-computed price, not anything the client sent", () => {
    const priced = priceOrder([{ payload, qty: 1 }]);
    assert.ok(priced.ok);

    const order = createOrder({ customer, priced: priced.order, payloads: [{ payload, qty: 1 }] });
    const found = findOrder(order.reference);

    assert.ok(found);
    // ₹500 box+contents + ₹60 delivery = 56000 paise. Read back off disk.
    assert.equal(found.priced.total, 56000);
    assert.equal(found.customer.isGift, true);
    assert.equal(found.status, "pending");
  });

  it("issues unguessable references", () => {
    const priced = priceOrder([{ payload, qty: 1 }]);
    assert.ok(priced.ok);

    const refs = new Set(
      Array.from({ length: 50 }, () =>
        createOrder({ customer, priced: priced.order, payloads: [{ payload, qty: 1 }] }).reference,
      ),
    );

    // A sequential reference would let anyone read other people's orders by counting.
    assert.equal(refs.size, 50);
    for (const ref of refs) assert.match(ref, /^AH-[2-9A-HJ-NP-Z]{6}$/);
  });

  it("does not resolve a reference that was never issued", () => {
    assert.equal(findOrder("AH-XXXXXX"), null);
  });
});
