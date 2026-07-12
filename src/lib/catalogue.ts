import type { BoxType, CandyItem, Sellable } from "@/types/box";

/**
 * The catalogue. PLACEHOLDER DATA.
 *
 * This is hardcoded because the headless commerce backend is still undecided (see
 * docs/architecture.md — Open decisions). When it lands, this file is replaced by a fetch
 * in an RSC and NOTHING ELSE CHANGES: the builder, the adapter, the cart and the product
 * pages all consume `BoxType` / `CandyItem`, so the swap is a data-source change, not a
 * rewrite.
 *
 * ⚠️ MONEY IS INTEGER MINOR UNITS — paise, not rupees. 9000 = ₹90.00.
 * Never a float. Floats do not survive repeated addition, and these values are summed per
 * candy line, per box, per cart. Format only at the render edge.
 *
 * Flavours are the real Konkan ones — Alphonso, cashew, kokum — because the local story is
 * the differentiator and the product names are part of the SEO surface.
 *
 * ⚠️ The `description` on each item is SHIPPED COPY: it becomes the product page's meta
 * description and the `description` in its Product JSON-LD. Write it as a sentence a person
 * would read, naming the flavour and the place. It is not filler.
 */

export const BOXES: readonly BoxType[] = [
  {
    sku: "BOX-6",
    slug: "six-piece-gift-box",
    name: "The Six",
    capacity: 6,
    price: 24000, // ₹240
    description:
      "A six-piece keepsake box, filled with the candies you choose. Small enough to give without an occasion, and finished by hand in Ratnagiri.",
    imageUrl: "",
    imageAlt: "Al-Hala six-piece keepsake gift box",
  },
  {
    sku: "BOX-12",
    slug: "twelve-piece-gift-box",
    name: "The Twelve",
    capacity: 12,
    price: 42000, // ₹420
    description:
      "Twelve pieces, chosen by you and boxed by hand. The size most people send for Eid, Diwali and thank-yous — enough to share, and enough to be remembered.",
    imageUrl: "",
    imageAlt: "Al-Hala twelve-piece keepsake gift box",
  },
  {
    sku: "BOX-24",
    slug: "signature-gift-box",
    name: "The Signature",
    capacity: 24,
    price: 78000, // ₹780
    description:
      "Our largest box: twenty-four handmade candies, arranged the way you build them. The one that gets sent for a nikah, a wedding, or a client who matters.",
    imageUrl: "",
    imageAlt: "Al-Hala twenty-four-piece signature gift box",
  },
];

export const CANDIES: readonly CandyItem[] = [
  {
    sku: "C-ALPHONSO",
    slug: "ratnagiri-alphonso-candy",
    name: "Ratnagiri Alphonso",
    price: 9000,
    description:
      "Made with Ratnagiri Alphonso — the mango this coast is known for. Sweet, resinous and unmistakably local. The candy we are asked for by name.",
    imageUrl: "",
    imageAlt: "Alphonso mango candy",
  },
  {
    sku: "C-CASHEW",
    slug: "konkan-cashew-brittle",
    name: "Konkan Cashew Brittle",
    price: 8500,
    description:
      "Konkan cashews set in a thin, dark caramel and snapped by hand. Toasted rather than sweet-first — the piece people go back to.",
    imageUrl: "",
    imageAlt: "Konkan cashew brittle",
  },
  {
    sku: "C-KOKUM",
    slug: "dark-kokum-candy",
    name: "Dark Kokum",
    price: 8000,
    description:
      "Kokum, the sour red fruit of the Konkan, cooked slowly into something dark and tart. Sharp against the sweeter pieces in a box.",
    imageUrl: "",
    imageAlt: "Dark kokum candy",
  },
  {
    sku: "C-SAFFRON",
    slug: "saffron-pistachio-candy",
    name: "Saffron & Pistachio",
    price: 11000,
    description:
      "Real saffron and slivered pistachio. The richest thing we make, and the piece most often chosen for a wedding box.",
    imageUrl: "",
    imageAlt: "Saffron and pistachio candy",
  },
  {
    sku: "C-ROSE",
    slug: "rose-cardamom-candy",
    name: "Rose & Cardamom",
    price: 9500,
    description:
      "Rose and green cardamom, kept restrained so it tastes like neither perfume nor sweet shop. Floral, warm, and quiet.",
    imageUrl: "",
    imageAlt: "Rose and cardamom candy",
  },
  {
    sku: "C-COCONUT",
    slug: "coastal-coconut-candy",
    name: "Coastal Coconut",
    price: 7500,
    description:
      "Fresh coastal coconut, barely sweetened. The simplest candy in the range, and the one children reach for first.",
    imageUrl: "",
    imageAlt: "Coconut candy",
  },
  {
    sku: "C-FIG",
    slug: "fig-honey-candy",
    name: "Fig & Honey",
    price: 10500,
    description:
      "Dried fig and honey, with the seeds left in for texture. Dense, chewy, and closer to fruit than to confectionery.",
    imageUrl: "",
    imageAlt: "Fig and honey candy",
  },
  {
    sku: "C-DATE",
    slug: "date-almond-candy",
    name: "Date & Almond",
    price: 9500,
    description:
      "Dates and toasted almond, pressed together with nothing added. The piece that goes into every Eid box we send.",
    imageUrl: "",
    imageAlt: "Date and almond candy",
  },
];

export const CATALOGUE = {
  boxes: Object.fromEntries(BOXES.map((box) => [box.sku, box])),
  candies: Object.fromEntries(CANDIES.map((candy) => [candy.sku, candy])),
};

/** Everything with its own product page. Boxes first — they are the higher-intent purchase. */
export const SELLABLES: readonly Sellable[] = [...BOXES, ...CANDIES];

export function sellableBySlug(slug: string): Sellable | undefined {
  return SELLABLES.find((item) => item.slug === slug);
}

/** A box has a capacity; a candy does not. The one honest way to tell the two apart. */
export function isBox(item: Sellable): item is BoxType {
  return "capacity" in item;
}

/**
 * The image for a product's JSON-LD, or `undefined` if there is no real photograph of it.
 *
 * ⚠️ GOOGLE RENDERS NO PRODUCT RICH RESULT WITHOUT A PER-PRODUCT IMAGE. Every `Offer` on this
 * site — price, stock, shipping, returns — is valid and completely inert until this returns
 * something.
 *
 * It deliberately does NOT fall back to the brand OG card. Handing Google the same generic
 * image for all eleven products asserts that the Alphonso candy and the 24-piece box look
 * identical, which is a false claim about every one of them. An ABSENT image is honest and
 * costs a rich result; a WRONG image is a false claim and costs trust.
 *
 * Photos are a drop-in: put the file in `public/products/`, set `imageUrl`, done. No code
 * changes — that is the whole point of routing it through here.
 */
export function productImage(item: Sellable, absoluteUrl: (path: string) => string) {
  return item.imageUrl ? absoluteUrl(item.imageUrl) : undefined;
}

/**
 * Money formatting happens HERE and nowhere else — the one render edge.
 *
 * `Intl.NumberFormat` with a fixed locale, not the user's: a price is a fact about the
 * shop, not about the browser. A visitor in Germany must still see ₹240, or the number
 * they read is not the number they are charged.
 */
const INR = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function formatMoney(minorUnits: number): string {
  return INR.format(minorUnits / 100);
}

/**
 * Schema.org wants a decimal string in MAJOR units — "240.00". Not 24000, and not "₹240":
 * a currency symbol in a `price` field makes Google drop the offer silently.
 *
 * This is the only place minor units become a decimal, and it exists so that no JSON-LD
 * builder is ever tempted to do the division inline and get it subtly wrong.
 */
export function schemaPrice(minorUnits: number): string {
  return (minorUnits / 100).toFixed(2);
}

/**
 * `priceValidUntil` — a year from the build.
 *
 * Google drops an Offer whose `priceValidUntil` has passed, so a hardcoded date would
 * silently stop your products showing in Search on the day it expired. Recomputed on every
 * deploy instead, which means it can only go stale if the site itself goes unbuilt for a
 * year — and by then the prices are wrong anyway.
 */
function priceValidUntil(): string {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 1);
  return date.toISOString().split("T")[0];
}

/**
 * The `Offer` for a product, complete enough for merchant rich results.
 *
 * `shippingDetails` and `hasMerchantReturnPolicy` are what gate the price/stock/delivery
 * snippets in Search. Without them Google has the price but not the terms, and shows a
 * plain blue link where a competitor gets a rich card.
 *
 * EVERY VALUE BELOW IS TRUE and traceable: the rates come from `deliveryFor()` in
 * `pricing.ts`, the lead times and the returns position from the Shipping & Returns page in
 * `legal.ts`. Structured data that contradicts the policy page it links to is a manual
 * action waiting to happen — so when one changes, change the other in the same commit.
 */
export function offerSchema(item: Sellable, url: string) {
  return {
    "@type": "Offer",
    price: schemaPrice(item.price),
    priceCurrency: "INR",
    availability: "https://schema.org/InStock",
    itemCondition: "https://schema.org/NewCondition",
    priceValidUntil: priceValidUntil(),
    url,
    shippingDetails: {
      "@type": "OfferShippingDetails",
      shippingRate: {
        "@type": "MonetaryAmount",
        // ₹60, and free above ₹1500 — `deliveryFor()` in pricing.ts. `maxValue: 0` on a
        // second rate is how "free over X" is expressed, but the flat rate is the honest
        // headline and Google reads the simple case more reliably.
        value: "60.00",
        currency: "INR",
      },
      shippingDestination: {
        "@type": "DefinedRegion",
        addressCountry: "IN",
      },
      deliveryTime: {
        "@type": "ShippingDeliveryTime",
        // "Everything is pressed to order, so allow two to three working days before it
        // ships." — legal.ts, Shipping & Returns.
        handlingTime: {
          "@type": "QuantitativeValue",
          minValue: 2,
          maxValue: 3,
          unitCode: "DAY",
        },
        // Next day within Ratnagiri district; three to six working days elsewhere in India.
        transitTime: {
          "@type": "QuantitativeValue",
          minValue: 1,
          maxValue: 6,
          unitCode: "DAY",
        },
      },
    },
    hasMerchantReturnPolicy: {
      "@type": "MerchantReturnPolicy",
      applicableCountry: "IN",
      // NOT a hedge — the true policy. "Food made to order cannot be resold, so we do not
      // accept returns for a change of mind." Claiming a returns window we do not offer
      // would be a lie that Google checks and customers act on.
      returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
    },
  };
}
