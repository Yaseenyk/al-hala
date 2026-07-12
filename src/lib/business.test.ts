import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { BUSINESS, localBusinessSchema } from "./business.ts";

const SITE = "https://example.com";

describe("localBusinessSchema", () => {
  it("NEVER ships a TODO placeholder into structured data", () => {
    // This shipped to production once. The visible footer correctly hid the unfilled NAP,
    // but the JSON-LD published `telephone: "TODO: +91-XXXXXXXXXX"` straight to Google —
    // a false claim it cannot match against the Business Profile, which is strictly worse
    // than an absent field. This assertion is the tripwire.
    const json = JSON.stringify(localBusinessSchema(SITE));
    assert.doesNotMatch(json, /TODO/, "a TODO placeholder escaped into the Store schema");
  });

  it("omits the unfilled fields entirely rather than emitting an empty string", () => {
    const schema = localBusinessSchema(SITE) as Record<string, unknown>;

    // Only meaningful while the NAP is still unfilled. When the real values land these flip,
    // and the assertions below should be inverted in the SAME commit.
    assert.ok(BUSINESS.telephone.startsWith("TODO"), "fixture assumes an unfilled NAP");

    assert.equal(schema.telephone, undefined);
    assert.equal(schema.email, undefined);
    assert.equal(schema.hasMap, undefined);

    // Unverified geo and hours are withheld: a pin that disagrees with the Google Business
    // Profile is a mismatch signal, and wrong hours send a customer to a shop that is shut.
    assert.equal(schema.geo, undefined);
    assert.equal(schema.openingHoursSpecification, undefined);
  });

  it("still publishes what IS known — the town is the whole local-SEO play", () => {
    const schema = localBusinessSchema(SITE) as Record<string, unknown>;
    const address = schema.address as Record<string, unknown>;

    assert.equal(address.addressLocality, "Ratnagiri");
    assert.equal(address.addressRegion, "MH");
    assert.equal(address.addressCountry, "IN");
    // The street is not known. That field, and only that field, drops out.
    assert.equal(address.streetAddress, undefined);

    assert.equal(schema["@type"], "Store");
    assert.equal(schema["@id"], `${SITE}/#store`);
  });
});
