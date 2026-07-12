/**
 * The journal. Gifting guides.
 *
 * This is the long-tail SEO surface. Occasion pages catch "eid gift box ratnagiri";
 * these catch "what to give at a nikah", "how many favours per guest", "best mango sweets
 * in konkan" — the questions people actually type before they know what they want to buy.
 *
 * They are also the pages an LLM is most likely to cite, because they ANSWER something
 * rather than sell something. Each post opens with the answer in the first paragraph, for
 * exactly the reason the FAQ does.
 *
 * Content lives here rather than in a CMS because the CMS is still undecided
 * (docs/architecture.md). The shape is deliberately CMS-like, so migrating is a fetch
 * swap, not a rewrite.
 */

export interface Post {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  /** ISO date. Used for `datePublished` and sitemap lastmod. */
  date: string;
  readingMinutes: number;
  tag: string;
  /** Markdown-free: an array of paragraphs and headings. Keeps rendering trivial and safe. */
  body: readonly ({ h2: string } | { p: string })[];
}

export const POSTS: readonly Post[] = [
  {
    slug: "how-many-wedding-favours",
    title: "How many wedding favours do you actually need?",
    metaTitle: "How Many Wedding Favours Do You Need? A Ratnagiri Guide",
    description:
      "One favour per guest is the wrong answer. Here is how to count wedding favours properly — by household, with a margin — from a confectioner in Ratnagiri who presses them.",
    date: "2026-06-02",
    readingMinutes: 4,
    tag: "Weddings",
    body: [
      {
        p: "Count by household, not by head, and then add fifteen percent. That is the short answer, and almost nobody does it, which is why favours run out at the door while three boxes go home in the car.",
      },
      { h2: "Why per-guest counting fails" },
      {
        p: "A family of five takes one favour, not five — they are going home to the same table. But the two cousins who came separately take two. If you counted heads you over-ordered on the family and under-ordered on the singles, and the error does not cancel out.",
      },
      {
        p: "Count invitations, not names. Then add the fifteen percent, because someone always brings someone.",
      },
      { h2: "The nikah and the walima are two counts" },
      {
        p: "They are different guest lists with an overlap, and the overlap is not a discount — a guest at both will take a favour at both, and will notice if the second one is the same as the first. Order two batches, and make them different.",
      },
      { h2: "Order six weeks out" },
      {
        p: "Everything at Al-Hala is pressed to order in Ratnagiri, not pulled off a shelf. Six weeks is comfortable. Three is possible. The week of the wedding is not, and we will tell you so rather than take the order and disappoint you.",
      },
    ],
  },
  {
    slug: "ratnagiri-alphonso-sweets",
    title: "What makes a Ratnagiri Alphonso sweet different",
    metaTitle: "Ratnagiri Alphonso Sweets: What Makes Them Different",
    description:
      "Ratnagiri Alphonso has a shorter season and a higher sugar content than mango grown elsewhere. That changes what you can make with it — and what you should not.",
    date: "2026-05-14",
    readingMinutes: 5,
    tag: "The Konkan",
    body: [
      {
        p: "Ratnagiri Alphonso is sweeter and more perishable than mango grown inland, and it has a season of about ten weeks. That is the whole reason the mango sweets taste different here, and it is also the reason they are not available all year.",
      },
      { h2: "The season is the constraint" },
      {
        p: "April to early June. Outside it, anyone selling you an Alphonso sweet is selling you pulp from a tin, and the difference is not subtle. We stop making it when the fruit stops.",
      },
      { h2: "Less sugar, not more" },
      {
        p: "Because the fruit is already high in sugar, the recipe takes less. A mango sweet that tastes mostly of sugar is a sweet made from a weaker mango and corrected with the sugar bowl.",
      },
      { h2: "Why we do not ship it in July" },
      {
        p: "We could. It would keep. It would just not be worth giving to anyone, and a gift box that disappoints is worse for us than a gift box we did not sell.",
      },
    ],
  },
  {
    slug: "eid-gifting-guide",
    title: "An Eid gifting guide for people who leave it late",
    metaTitle: "Eid Gifting Guide: What to Send and When | Ratnagiri",
    description:
      "What to send for Eid, how many boxes you actually need, and the last day to order in Ratnagiri district so it arrives before the prayer.",
    date: "2026-04-01",
    readingMinutes: 4,
    tag: "Eid",
    body: [
      {
        p: "Order by the Wednesday before Eid and it will reach you in Ratnagiri district before Eid morning. That is the deadline; everything else in this guide is detail.",
      },
      { h2: "You need more boxes than you think" },
      {
        p: "One for the house. One for your mother's. And two or three by the door, because people arrive and you cannot send them away empty-handed. Most people order one large and four small, and most people come back for more small ones.",
      },
      { h2: "Send, do not carry" },
      {
        p: "If it is going to another town, send it directly with the note inside. Gift orders leave without a price on the packing slip, so the person opening it never sees what it cost.",
      },
      { h2: "The late option" },
      {
        p: "If you have missed the Wednesday and you are in Ratnagiri, call the shop. We will tell you honestly whether we can still make it. Sometimes we can.",
      },
    ],
  },
  {
    slug: "corporate-gifting-that-is-not-a-hamper",
    title: "Corporate gifting that isn't another hamper",
    metaTitle: "Corporate Gifting in Ratnagiri: Beyond the Hamper",
    description:
      "Every client gets the same dry-fruit hamper from everyone. Here is how to send something they actually open — bulk, branded, and shipped to individual addresses.",
    date: "2026-03-11",
    readingMinutes: 3,
    tag: "Corporate",
    body: [
      {
        p: "The reason your client does not remember your Diwali gift is that it was the fourth identical hamper on their desk. The fix is not spending more. It is sending something that was obviously made rather than assembled.",
      },
      { h2: "One order, many addresses" },
      {
        p: "Send the list. Each box ships to its own recipient with its own note. Nobody has to redistribute anything from a reception desk, which is where most corporate gifts go to die.",
      },
      { h2: "Brand the sleeve, not the box" },
      {
        p: "Your logo goes on an outer sleeve that comes off. Underneath is an unbranded keepsake box, which is the part they keep. A box with a supplier's logo printed on the lid is a box that goes in the bin in January.",
      },
      { h2: "Book Diwali in September" },
      {
        p: "October is late. We press to order, and the festive weeks fill up.",
      },
    ],
  },
];

export const postBySlug = (slug: string): Post | undefined =>
  POSTS.find((post) => post.slug === slug);
