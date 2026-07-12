/**
 * The occasion taxonomy.
 *
 * This is the primary SEO surface for the business (see docs/architecture.md): people do
 * not search for "candy", they search for "eid gift box in Ratnagiri" and "wedding favours
 * near me". Each of these is a landing page.
 *
 * One source of truth, consumed by the hero, the grid, the nav, the sitemap, llms.txt and
 * the ItemList JSON-LD — six places that otherwise drift apart the first time someone adds
 * an occasion and updates five of them.
 *
 * ⚠️ THE COPY BELOW MUST STAY DISTINCT PER OCCASION.
 *
 * Eleven pages generated from one template with the noun swapped is a doorway-page pattern.
 * Google demotes it, and an LLM asked "what do they do for condolences" cannot find an
 * answer that is different from the wedding answer. `intro` and `highlights` exist to make
 * each page genuinely about its own occasion. Do not reduce them to a template.
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
  /** Hero line. One sentence. */
  description: string;
  /** One line for the grid — shorter and blunter than the hero description. */
  teaser: string;

  /** The <title>. Under 60 chars, and it carries the locality. */
  metaTitle: string;
  /** The meta description. Reads as an answer, names the entity and the town. */
  metaDescription: string;

  /** Two paragraphs, specific to THIS occasion. Never a template. */
  intro: readonly string[];
  /** Three concrete things. Facts, not adjectives. */
  highlights: readonly { title: string; body: string }[];
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
    metaTitle: "Wedding Favours & Nikah Gift Boxes in Ratnagiri",
    metaDescription:
      "Handmade wedding favours and nikah gift boxes from Al-Hala Candies, Ratnagiri. Saffron, pistachio and rose sweets in keepsake boxes. Bulk orders for the walima, delivered across Maharashtra.",
    intro: [
      "A wedding box is counted, not chosen. You are not buying one gift — you are buying two hundred, and every one of them has to look like it was made for the person holding it.",
      "Al-Hala presses the nikah sweets by hand in Ratnagiri: saffron, pistachio, rose. The boxes are sealed rather than bagged, because a favour that survives the drive home is a favour that gets kept on a shelf.",
    ],
    highlights: [
      {
        title: "Counted in hundreds",
        body: "Bulk favour orders for the nikah and the walima, quoted per box, with the same handmade contents as a single box.",
      },
      {
        title: "Named for the guest",
        body: "Each favour can carry a printed name or a short line. We set the type; you send us the list.",
      },
      {
        title: "Ordered early",
        body: "Wedding batches are pressed to order. Six weeks is comfortable; three is possible; the week of is not.",
      },
    ],
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
    metaTitle: "Birthday Party Favours & Kids' Candy Boxes, Ratnagiri",
    metaDescription:
      "Birthday party favours and kids' candy boxes from Al-Hala Candies in Ratnagiri. Small boxes for class treats and return gifts, handmade and priced for a whole classroom.",
    intro: [
      "A child does not care that the sweets are handmade. A child cares that there are enough of them, that they are bright, and that they are theirs.",
      "So the kids' boxes are small, individually sealed, and priced so you can order thirty without wincing. The mango is real Ratnagiri Alphonso, which is the part the parents notice.",
    ],
    highlights: [
      {
        title: "One box per child",
        body: "Individually sealed, so they can be handed out at the door without anyone counting pieces.",
      },
      {
        title: "Priced for a classroom",
        body: "Return-gift quantities are quoted by the thirty, not the one.",
      },
      {
        title: "Nothing sharp, nothing hard",
        body: "The kids' assortment leaves out the brittle. Soft sweets only.",
      },
    ],
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
    metaTitle: "Valentine's Day Chocolate & Candy Gift Box, Ratnagiri",
    metaDescription:
      "The Valentine's Edit from Al-Hala Candies, Ratnagiri — twelve handmade pieces in gold leaf, boxed and delivered with your note. Limited release, local delivery and nationwide shipping.",
    intro: [
      "Twelve pieces. Rose, saffron, and a dark kokum that is sharper than people expect and is the one they remember.",
      "It is a limited run, pressed in the first week of February and gone by the fifteenth. We do not carry it over. That is the point of it.",
    ],
    highlights: [
      {
        title: "Twelve, in gold leaf",
        body: "Each piece finished by hand. The gold is edible and it is real.",
      },
      {
        title: "Sent, not carried",
        body: "Ships straight to them with your note inside, and no price on the packing slip.",
      },
      {
        title: "Until the fourteenth",
        body: "Orders close when the batch runs out, which is usually before the date does.",
      },
    ],
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
    metaTitle: "Eid Gift Boxes & Sweets in Ratnagiri",
    metaDescription:
      "Eid gift boxes from Al-Hala Candies, Ratnagiri. Handmade saffron, pistachio and Alphonso sweets, sized for a household and priced so you can send several. Eid al-Fitr and Eid al-Adha.",
    intro: [
      "Eid is not one gift. It is the box you open at home, the box you carry to your mother's, and the three you keep by the door for whoever arrives.",
      "So the Eid boxes come in a household size and a giving size, and the giving size is priced so that sending six does not feel like an extravagance. They go out before the prayer, not after it.",
    ],
    highlights: [
      {
        title: "Two sizes",
        body: "A large box for the house, and a smaller sealed one for giving. Most people order both.",
      },
      {
        title: "Delivered before the prayer",
        body: "Order by the Wednesday and it is with you in Ratnagiri district before Eid morning.",
      },
      {
        title: "Send several",
        body: "Multiple delivery addresses on one order, each with its own note.",
      },
    ],
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
    metaTitle: "Ramadan & Iftar Sweets Box in Ratnagiri",
    metaDescription:
      "Ramadan and iftar sweet boxes from Al-Hala Candies, Ratnagiri. Dates, saffron and handmade sweets for breaking the fast, and for sending to the mosque. Local delivery across Ratnagiri district.",
    intro: [
      "The first thing after the fast should be small, sweet, and not too much. That is a narrower brief than it sounds.",
      "The Ramadan box is built for it: dates, a saffron piece, and one thing sharp. Sized for a table of eight, and repeated for thirty nights without anyone getting tired of it.",
    ],
    highlights: [
      {
        title: "Sized for the table",
        body: "One box, eight people, no leftovers going stale by suhoor.",
      },
      {
        title: "For the masjid",
        body: "Bulk iftar boxes delivered to the mosque, quoted by the tray.",
      },
      {
        title: "Weekly through the month",
        body: "A standing order, delivered fresh each week rather than pressed once and stored.",
      },
    ],
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
    metaTitle: "Corporate Gifting & Bulk Gift Boxes, Ratnagiri",
    metaDescription:
      "Corporate gift boxes from Al-Hala Candies, Ratnagiri. Bulk orders with custom notes and your branding, shipped to multiple addresses across India. Diwali, Eid and client gifting.",
    intro: [
      "Every client gets the same hamper from everyone. Yours is the one they open on the desk and the one they mention.",
      "Al-Hala does corporate volume out of Ratnagiri without the corporate look: the same hand-pressed sweets, your note, your branding on the sleeve if you want it, and each box shipped to its own address.",
    ],
    highlights: [
      {
        title: "One order, many addresses",
        body: "Send us the list. Each box ships to its recipient with its own note.",
      },
      {
        title: "Your sleeve, our box",
        body: "Branded outer sleeve available. The box underneath is unchanged.",
      },
      {
        title: "Invoiced properly",
        body: "GST invoice, PO reference, and a single point of contact. Not a shopping cart.",
      },
    ],
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
    metaTitle: "Condolence & Sympathy Sweet Boxes, Ratnagiri",
    metaDescription:
      "Condolence sweet boxes from Al-Hala Candies, Ratnagiri. Plain, unbranded and restrained, delivered discreetly to a house receiving visitors. No price on the packing slip.",
    intro: [
      "A house in mourning is full of people, and someone has to feed them. It is the least useful thing to think about and the first thing that runs out.",
      "The remembrance box is plain. No gold, no ribbon, no branding on the outside. It arrives, it is put on the table, and it does its job without asking anyone to admire it.",
    ],
    highlights: [
      {
        title: "Unbranded",
        body: "Plain outer box. No logo, no ribbon, nothing celebratory.",
      },
      {
        title: "Sent discreetly",
        body: "No price on the slip, and no marketing insert. Your name on a plain card, if you want one at all.",
      },
      {
        title: "Same day in Ratnagiri",
        body: "Call us. For a local house we will get it there today.",
      },
    ],
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
    metaTitle: "New Baby Sweets & Mubarak Boxes, Ratnagiri",
    metaDescription:
      "New baby sweet boxes from Al-Hala Candies, Ratnagiri. Handmade sweets to hand around when the visitors arrive, delivered locally or shipped across India.",
    intro: [
      "Nobody in that house has slept, and the doorbell has not stopped. What they need is a box they can open one-handed and pass around without hosting anyone.",
      "So this one is pre-portioned, individually wrapped, and it sits by the door. It is not a centrepiece. It is a supply.",
    ],
    highlights: [
      {
        title: "Individually wrapped",
        body: "Handed around without a plate, a knife, or a conversation.",
      },
      {
        title: "Sent to them, not to you",
        body: "Ships direct to the family with your note. They do not need another errand.",
      },
      {
        title: "Refills",
        body: "It will run out. Reorder in one click and we send another.",
      },
    ],
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
    metaTitle: "Thank You Gift Boxes & Small Sweet Gifts, Ratnagiri",
    metaDescription:
      "Small thank-you gift boxes from Al-Hala Candies, Ratnagiri. Handmade sweets for a teacher, a host or a neighbour — the right size for a gesture that is not an occasion.",
    intro: [
      "The hard part of a thank-you gift is not choosing it. It is choosing one small enough that it does not embarrass the person receiving it.",
      "This is that size. Four pieces, a card, and no ribbon. It says thank you and then it stops talking.",
    ],
    highlights: [
      {
        title: "Deliberately small",
        body: "Four pieces. Enough to mean it, not so much that it becomes an obligation.",
      },
      {
        title: "A written card",
        body: "Your line, set in type, tucked inside. Not a gift receipt.",
      },
      {
        title: "Under ₹500",
        body: "Priced to be given easily and often.",
      },
    ],
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
    metaTitle: "Diwali Gift Boxes & Mithai in Ratnagiri",
    metaDescription:
      "Diwali gift boxes and handmade mithai from Al-Hala Candies, Ratnagiri. Konkan cashew and Alphonso sweets boxed for the exchanges, with bulk and corporate Diwali orders.",
    intro: [
      "Diwali is an exchange. Whatever comes in the door goes back out again, and everyone knows which box came from where.",
      "The festive box is cashew-heavy — Konkan cashew, roasted here, folded in whole — and it is built to be the one that gets remembered rather than re-gifted.",
    ],
    highlights: [
      {
        title: "Konkan cashew",
        body: "Whole, not milled. Roasted in small batches on the coast.",
      },
      {
        title: "Built to re-gift-proof",
        body: "It is the box people keep. That is the entire brief.",
      },
      {
        title: "Corporate Diwali",
        body: "Bulk orders open in September. October is late.",
      },
    ],
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
    metaTitle: "Handmade Candy Boxes for No Occasion, Ratnagiri",
    metaDescription:
      "A small handmade candy box from Al-Hala Candies, Ratnagiri, for no occasion at all. Alphonso, cashew and kokum sweets, delivered locally or shipped across India.",
    intro: [
      "Most of what we send goes out for a wedding, an Eid, a Diwali. This one goes out on a Tuesday.",
      "It is the smallest box we make. Build it yourself, put one line on the card, and send it to somebody who is not expecting anything.",
    ],
    highlights: [
      {
        title: "The smallest box",
        body: "Six pieces. Enough to be a gift, small enough to be a whim.",
      },
      {
        title: "Build it yourself",
        body: "Pick the six. It takes about a minute.",
      },
      {
        title: "No occasion required",
        body: "There is no card that says 'happy Tuesday'. Leave it blank, or write your own.",
      },
    ],
  },
];

/**
 * What the hero rotates through.
 *
 * Four, not eleven: nobody clicks past the third slide of a carousel, and an occasion
 * buried at position nine is an occasion nobody sees. The rest live in the grid, where they
 * are all visible at once and each is a real, crawlable link.
 */
export const FLAGSHIP_IDS = ["nikah", "kids", "valentines", "eid"] as const;

export const FLAGSHIP: readonly Occasion[] = FLAGSHIP_IDS.map(
  (id) => OCCASIONS.find((occasion) => occasion.id === id)!,
);

export const occasionBySlug = (slug: string): Occasion | undefined =>
  OCCASIONS.find((occasion) => occasion.slug === slug);
