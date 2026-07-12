import type { BoxType, CandyItem } from "@/types/box";

/**
 * The catalogue. PLACEHOLDER DATA.
 *
 * This is hardcoded because the headless commerce backend is still undecided (see
 * docs/architecture.md — Open decisions). When it lands, this file is replaced by a fetch
 * in an RSC and NOTHING ELSE CHANGES: the builder, the adapter and the cart all consume
 * `BoxType` / `CandyItem`, so the swap is a data-source change, not a rewrite.
 *
 * ⚠️ MONEY IS INTEGER MINOR UNITS — paise, not rupees. 9000 = ₹90.00.
 * Never a float. Floats do not survive repeated addition, and these values are summed per
 * candy line, per box, per cart. Format only at the render edge.
 *
 * Flavours are the real Konkan ones — Alphonso, cashew, kokum — because the local story is
 * the differentiator and the product names are part of the SEO surface.
 */

export const BOXES: readonly BoxType[] = [
  {
    sku: "BOX-6",
    name: "The Six",
    capacity: 6,
    price: 24000, // ₹240
    imageUrl: "",
    imageAlt: "Al-Hala six-piece keepsake gift box",
  },
  {
    sku: "BOX-12",
    name: "The Twelve",
    capacity: 12,
    price: 42000, // ₹420
    imageUrl: "",
    imageAlt: "Al-Hala twelve-piece keepsake gift box",
  },
  {
    sku: "BOX-24",
    name: "The Signature",
    capacity: 24,
    price: 78000, // ₹780
    imageUrl: "",
    imageAlt: "Al-Hala twenty-four-piece signature gift box",
  },
];

export const CANDIES: readonly CandyItem[] = [
  {
    sku: "C-ALPHONSO",
    name: "Ratnagiri Alphonso",
    price: 9000,
    imageUrl: "",
    imageAlt: "Alphonso mango candy",
  },
  {
    sku: "C-CASHEW",
    name: "Konkan Cashew Brittle",
    price: 8500,
    imageUrl: "",
    imageAlt: "Konkan cashew brittle",
  },
  {
    sku: "C-KOKUM",
    name: "Dark Kokum",
    price: 8000,
    imageUrl: "",
    imageAlt: "Dark kokum candy",
  },
  {
    sku: "C-SAFFRON",
    name: "Saffron & Pistachio",
    price: 11000,
    imageUrl: "",
    imageAlt: "Saffron and pistachio candy",
  },
  {
    sku: "C-ROSE",
    name: "Rose & Cardamom",
    price: 9500,
    imageUrl: "",
    imageAlt: "Rose and cardamom candy",
  },
  {
    sku: "C-COCONUT",
    name: "Coastal Coconut",
    price: 7500,
    imageUrl: "",
    imageAlt: "Coconut candy",
  },
  {
    sku: "C-FIG",
    name: "Fig & Honey",
    price: 10500,
    imageUrl: "",
    imageAlt: "Fig and honey candy",
  },
  {
    sku: "C-DATE",
    name: "Date & Almond",
    price: 9500,
    imageUrl: "",
    imageAlt: "Date and almond candy",
  },
];

export const CATALOGUE = {
  boxes: Object.fromEntries(BOXES.map((box) => [box.sku, box])),
  candies: Object.fromEntries(CANDIES.map((candy) => [candy.sku, candy])),
};

/**
 * Money formatting happens HERE and nowhere else — the one render edge.
 *
 * `Intl.NumberFormat` with a fixed locale, not the user's: a price is a fact about the
 * shop, not about the browser. A visitor in Germany must still see ₹240.00, or the number
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
