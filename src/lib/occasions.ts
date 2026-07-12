/**
 * The occasion taxonomy.
 *
 * This is the primary SEO surface for the business (see docs/architecture.md): people do
 * not search for "candy", they search for "eid gift box" and "wedding favours". Each of
 * these becomes a landing page.
 *
 * One source of truth, consumed by the hero carousel and the occasions grid — two lists
 * that drift apart is how a site ends up advertising a collection that no longer exists.
 */

export interface Occasion {
  id: string;
  /** URL segment. Becomes /occasions/<slug>. */
  slug: string;
  index: string;
  eyebrow: string;
  title: string;
  /** Set in Amiri. Omitted where a forced translation would be worse than none. */
  arabic?: string;
  description: string;
  /** One line for the grid — shorter and blunter than the hero description. */
  teaser: string;
}

export const OCCASIONS: readonly Occasion[] = [
  {
    id: "nikah",
    slug: "weddings",
    index: "01",
    eyebrow: "The Wedding Collection",
    title: "The Royal Nikah",
    arabic: "النكاح",
    description:
      "Saffron, pistachio, and rose — pressed by hand, sealed in gold, and set in a keepsake box worthy of the day.",
    teaser: "Favours and keepsake boxes for the wedding, the walima, and every guest.",
  },
  {
    id: "kids",
    slug: "kids",
    index: "02",
    eyebrow: "For the Little Ones",
    title: "Kids Love It",
    description:
      "Bright, bold, and gone in a week. Birthday parties, class treats, and the box that buys you an afternoon of quiet.",
    teaser: "Birthdays, party favours, and treats that vanish before the candles cool.",
  },
  {
    id: "valentines",
    slug: "valentines",
    index: "03",
    eyebrow: "Limited Release",
    title: "The Valentine's Edit",
    description:
      "Twelve pieces, wrapped in gold leaf. Available until the fourteenth, and not a day after.",
    teaser: "Twelve pieces in gold leaf. Gone on the fifteenth.",
  },
  {
    id: "eid",
    slug: "eid",
    index: "04",
    eyebrow: "Eid al-Fitr & Eid al-Adha",
    title: "Eid Mubarak",
    arabic: "عيد مبارك",
    description:
      "The box that arrives before the prayer and is empty before the evening. Sized for a household, priced for many.",
    teaser: "For the family, the neighbours, and everyone who comes by unannounced.",
  },
  {
    id: "ramadan",
    slug: "ramadan",
    index: "05",
    eyebrow: "Iftar & Suhoor",
    title: "Ramadan Nights",
    arabic: "رمضان",
    description:
      "Dates, saffron, and something sweet for the moment the fast breaks.",
    teaser: "Something sweet for the moment the fast breaks.",
  },
  {
    id: "corporate",
    slug: "corporate",
    index: "06",
    eyebrow: "For Business",
    title: "Corporate Gifting",
    description:
      "Your client remembers who sent the good one. Bulk orders, custom notes, and a box that does not look like a bulk order.",
    teaser: "Bulk orders that do not arrive looking like bulk orders.",
  },
  {
    id: "condolence",
    slug: "condolence",
    index: "07",
    eyebrow: "With Sympathy",
    title: "In Remembrance",
    description:
      "Quiet, unbranded, and sent without a price on the slip. For the house that is receiving visitors.",
    teaser: "Quiet, restrained, no price on the slip.",
  },
  {
    id: "newborn",
    slug: "new-baby",
    index: "08",
    eyebrow: "Congratulations",
    title: "A New Arrival",
    arabic: "مبروك",
    description:
      "For the family that has not slept and the visitors who keep arriving. Sweets to hand around.",
    teaser: "Sweets to hand around when the visitors keep arriving.",
  },
  {
    id: "thankyou",
    slug: "thank-you",
    index: "09",
    eyebrow: "A Small Gesture",
    title: "Thank You",
    description:
      "For the teacher, the host, the neighbour who took the parcel in. Small, and the better for it.",
    teaser: "For the teacher, the host, the neighbour who took the parcel in.",
  },
  {
    id: "festive",
    slug: "festive",
    index: "10",
    eyebrow: "Diwali & Festive",
    title: "The Festive Table",
    description:
      "Mithai, done properly. Boxed for the visits, the exchanges, and the table that never empties.",
    teaser: "Mithai, done properly. Boxed for the visits and the exchanges.",
  },
  {
    id: "everyday",
    slug: "everyday",
    index: "11",
    eyebrow: "No Occasion At All",
    title: "Everyday Sweetness",
    description:
      "A smaller box, for no reason. The gesture matters more than the calendar.",
    teaser: "A smaller box, for no reason at all.",
  },
];

/**
 * What the hero rotates through.
 *
 * Four, not eleven: nobody clicks past the third slide of a carousel, and an occasion
 * buried at position nine is an occasion nobody sees. The rest live in the grid, where
 * they are all visible at once and each is a real, crawlable link.
 */
export const FLAGSHIP_IDS = ["nikah", "kids", "valentines", "eid"] as const;

export const FLAGSHIP: readonly Occasion[] = FLAGSHIP_IDS.map(
  (id) => OCCASIONS.find((occasion) => occasion.id === id)!,
);
