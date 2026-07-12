import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { BUSINESS, localBusinessSchema } from "./business.ts";
import { CANDIES, offerSchema } from "./catalogue.ts";
import { ACTIVE_SOCIALS, SOCIALS, isPlaceholderSocial, socialProfiles } from "./nav.ts";

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

describe("socials", () => {
  it("treats a bare domain as a placeholder", () => {
    // These four shipped live as real links. Clicking "Instagram" in the footer took the
    // visitor to instagram.com — not to the shop. A real profile carries a handle in its
    // path; a placeholder has an empty one.
    assert.equal(isPlaceholderSocial("https://instagram.com/"), true);
    assert.equal(isPlaceholderSocial("https://wa.me/"), true);
    assert.equal(isPlaceholderSocial("https://instagram.com/alhalacandies"), false);
    assert.equal(isPlaceholderSocial("https://wa.me/919876543210"), false);
  });

  it("renders no social link that goes nowhere", () => {
    for (const social of ACTIVE_SOCIALS) {
      assert.equal(isPlaceholderSocial(social.href), false, `${social.label} is a dead link`);
    }
  });

  it("keeps placeholders out of sameAs", () => {
    // A `sameAs` pointing at an account that is not yours merges your shop's identity with a
    // stranger's — strictly worse than having none.
    assert.equal(
      socialProfiles().length,
      ACTIVE_SOCIALS.length,
      "sameAs must be built only from socials that name an account",
    );
    // Guards the current state: all four are still unfilled, so nothing is claimed.
    assert.equal(SOCIALS.every((s) => isPlaceholderSocial(s.href)), true);
    assert.equal(socialProfiles().length, 0);
  });
});

describe("offerSchema", () => {
  it("carries the fields that gate merchant rich results", () => {
    const offer: Record<string, unknown> = offerSchema(
      CANDIES[0],
      "https://example.com/products/x/",
    );

    // Without shippingDetails and hasMerchantReturnPolicy, Google has the price but not the
    // terms, and shows a plain blue link where a competitor gets a rich card.
    assert.ok(offer.shippingDetails, "shippingDetails missing");
    assert.ok(offer.hasMerchantReturnPolicy, "hasMerchantReturnPolicy missing");
    assert.ok(offer.priceValidUntil, "priceValidUntil missing");
    assert.equal(offer.priceCurrency, "INR");
  });

  it("states the TRUE returns position — made-to-order food is not returnable", () => {
    const offer = offerSchema(CANDIES[0], "x");

    // Must agree with the Shipping & Returns page. Structured data that contradicts the
    // policy it links to is a manual action waiting to happen.
    assert.equal(
      offer.hasMerchantReturnPolicy.returnPolicyCategory,
      "https://schema.org/MerchantReturnNotPermitted",
    );
  });

  it("prices in major units — a currency symbol makes Google drop the offer", () => {
    const offer = offerSchema(CANDIES[0], "x");
    assert.match(offer.price, /^\d+\.\d{2}$/);
    assert.doesNotMatch(offer.price, /₹/);
  });
});
