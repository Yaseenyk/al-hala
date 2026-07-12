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
