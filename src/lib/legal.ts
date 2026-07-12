/**
 * Legal pages.
 *
 * ⚠️ PLAINLY-WRITTEN PLACEHOLDER TEXT. NOT LEGAL ADVICE. NOT REVIEWED BY A LAWYER.
 *
 * It describes how the shop actually intends to operate, in the shop's own voice, so the
 * pages are useful and honest rather than a template full of clauses that do not apply.
 * But it is not a compliant Indian e-commerce privacy policy and it MUST be replaced by
 * something a lawyer has read before you take money.
 *
 * A privacy policy copied from another company's site is a policy describing someone
 * else's data handling. That is worse than having none: it is a published, written claim
 * about your business that is not true.
 */

export interface LegalPage {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  updated: string;
  body: readonly ({ h2: string } | { p: string })[];
}

export const LEGAL_PAGES: readonly LegalPage[] = [
  {
    slug: "shipping",
    title: "Shipping & Returns",
    metaTitle: "Shipping & Returns",
    description:
      "How Al-Hala Candies ships from Ratnagiri, how long it takes, and what happens if something arrives damaged.",
    updated: "2026-07-01",
    body: [
      { h2: "Where we deliver" },
      {
        p: "We deliver across Ratnagiri district — Chiplun, Ganpatipule, Guhagar, Dapoli, Sangameshwar, Lanja and Rajapur — and we ship anywhere in India.",
      },
      { h2: "How long it takes" },
      {
        p: "Everything is pressed to order, so allow two to three working days before it ships. Within Ratnagiri district, delivery is usually next day. Elsewhere in India, three to six working days depending on the courier.",
      },
      { h2: "Gift orders" },
      {
        p: "Gift orders ship with no price on the packing slip and no marketing inserts. Your note travels inside the box. The person opening it never sees what it cost.",
      },
      { h2: "If it arrives damaged" },
      {
        p: "Photograph it and call us within 48 hours. We will remake it and resend it, and we will not ask you to post the damaged box back — it is confectionery, and shipping it twice helps nobody.",
      },
      { h2: "Returns" },
      {
        p: "Food made to order cannot be resold, so we do not accept returns for a change of mind. If we got the order wrong, or it arrived damaged, that is ours to fix and we will fix it.",
      },
      { h2: "Freshness" },
      {
        p: "Our sweets are handmade without preservatives and are at their best within two to three weeks of the box being sealed. Each box carries its date.",
      },
    ],
  },
  {
    slug: "privacy",
    title: "Privacy Policy",
    metaTitle: "Privacy Policy",
    description: "What data Al-Hala Candies collects, why, and what we do not do with it.",
    updated: "2026-07-01",
    body: [
      { h2: "The short version" },
      {
        p: "We collect what we need to make and deliver your order, and nothing else. We do not sell your data. We do not share it with anyone except the people who have to see it to get a box to your door.",
      },
      { h2: "What we collect" },
      {
        p: "Your name, delivery address, phone number and email, so we can make the order and deliver it. If you write a gift note, we store its text, because it has to be printed.",
      },
      { h2: "What never leaves your browser" },
      {
        p: "Your cart and your wishlist are stored in your own browser, not on our servers. Clearing your browser data clears them, and we cannot see them.",
      },
      { h2: "Who else sees it" },
      {
        p: "The courier gets your name, address and phone number, because otherwise they cannot deliver. When online payment goes live it will be handled by a payment provider, and we will not store your card details.",
      },
      { h2: "How long we keep it" },
      {
        p: "Order records are kept for as long as tax law requires, and no longer than that for anything else.",
      },
      { h2: "Asking us to delete it" },
      {
        p: "Write to us. We will delete what we are allowed to delete, and tell you plainly what we are legally required to keep.",
      },
    ],
  },
  {
    slug: "terms",
    title: "Terms of Service",
    metaTitle: "Terms of Service",
    description: "The terms on which Al-Hala Candies sells and delivers.",
    updated: "2026-07-01",
    body: [
      { h2: "Ordering" },
      {
        p: "An order is confirmed when we confirm it, not when you place it. Everything is pressed to order and our capacity is finite, so for weddings, festivals and bulk we will agree the date with you before taking payment.",
      },
      { h2: "Prices" },
      {
        p: "Prices are in Indian Rupees. The price shown while you build a box is a preview; the price confirmed at checkout is the one that applies.",
      },
      { h2: "Seasonal items" },
      {
        p: "Some things exist only in season — Alphonso is roughly April to early June. When the fruit stops, we stop, and we will not substitute something else without telling you.",
      },
      { h2: "Allergens" },
      {
        p: "Our sweets contain nuts and dairy, and are made in a kitchen that handles both. If you have an allergy, call us before ordering and we will tell you honestly whether we can serve you safely.",
      },
      { h2: "Cancellation" },
      {
        p: "Tell us before we have started pressing and we will cancel and refund in full. Once a batch has been made for you, we cannot.",
      },
    ],
  },
];

export const legalBySlug = (slug: string) =>
  LEGAL_PAGES.find((page) => page.slug === slug);
