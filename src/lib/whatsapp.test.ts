import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { priceOrder } from "./pricing.ts";
import { enquiryMessage, isWhatsappConfigured, orderMessage, waLink } from "./whatsapp.ts";

const payload = {
  schemaVersion: 1 as const,
  boxSku: "BOX-6",
  candySkus: [
    { sku: "C-ALPHONSO", qty: 2 },
    { sku: "C-KOKUM", qty: 1 },
  ],
};

const contact = {
  name: "Test Customer",
  phone: "+91 9999999999",
  addressLine: "1 Test Road",
  city: "Ratnagiri",
  postalCode: "415612",
  isGift: true,
  giftNote: "Eid Mubarak",
};

function priced() {
  const result = priceOrder([{ payload, qty: 1 }]);
  assert.ok(result.ok, "fixture must price cleanly");
  return result.order;
}

describe("whatsapp", () => {
  it("itemises every candy, so a human can check the total against the list", () => {
    const message = orderMessage(priced(), contact);

    // The breakdown IS the safety mechanism. Browser-computed totals are only trustworthy
    // because a person reads them next to the lines that produced them. If this assertion
    // ever fails, the tampered-total check has silently gone with it.
    assert.match(message, /Ratnagiri Alphonso × 2 — ₹180/);
    assert.match(message, /Dark Kokum × 1 — ₹80/);
    assert.match(message, /Subtotal: ₹500/);
    assert.match(message, /Delivery: ₹60/);
    assert.match(message, /\*Total: ₹560\*/);
  });

  it("carries the address and the gift instruction", () => {
    const message = orderMessage(priced(), contact);

    assert.match(message, /1 Test Road, Ratnagiri 415612/);
    assert.match(message, /no price on the packing slip/);
    assert.match(message, /Eid Mubarak/);
  });

  it("omits the gift instruction when it is not a gift", () => {
    const message = orderMessage(priced(), { ...contact, isGift: false });
    assert.doesNotMatch(message, /packing slip/);
  });

  it("strips everything but digits from the number", () => {
    // wa.me rejects a `+`, a space or a dash outright — the customer sees "invalid number",
    // which reads as a broken shop rather than a bad config.
    const link = waLink("hello");
    assert.doesNotMatch(link, /wa\.me\/\D/);
  });

  it("percent-encodes the message, so newlines survive the URL", () => {
    const link = waLink(enquiryMessage({ name: "A", message: "line one\nline two" }));
    assert.match(link, /%0A/);
    assert.doesNotMatch(link, /\n/);
  });

  it("knows the shop's number is still a placeholder", () => {
    // Guards the launch blocker: BUSINESS.whatsapp is `TODO…` until someone fills it in,
    // and until then NOTHING can be ordered. This test is the tripwire — when the real
    // number lands it flips to `true` and this assertion must be inverted deliberately.
    assert.equal(isWhatsappConfigured(), false);
  });
});
