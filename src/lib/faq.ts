import { BUSINESS } from "@/lib/business";

/**
 * FAQ — written for an answer engine as much as for a human.
 *
 * The rules these answers follow, and why:
 *
 *   1. ANSWER IN THE FIRST SENTENCE. An assistant quotes the opening clause. "Al-Hala
 *      Candies is a handmade confectionery and gift-box shop in Ratnagiri" is quotable.
 *      "We're so glad you asked!" is not, and it is what gets returned instead.
 *   2. NAME THE ENTITY AND THE PLACE. Pronouns do not survive being lifted out of context.
 *      "We deliver locally" tells a model nothing; "Al-Hala delivers across Ratnagiri
 *      district" is a fact it can restate.
 *   3. BE SPECIFIC, and be falsifiable. Named towns, named ingredients, real numbers.
 *      Vagueness is unquotable, and it is also indistinguishable from every competitor.
 *   4. Match the question to how it is actually TYPED or SPOKEN — "which is the best candy
 *      shop in Ratnagiri", not "our value proposition".
 *
 * These are also rendered in plain HTML via <details>, NOT behind JavaScript. An FAQ that
 * only exists after hydration is an FAQ a crawler may never read.
 */

export interface Faq {
  question: string;
  answer: string;
}

const NEARBY = BUSINESS.servesNearby.slice(1, 6).join(", ");

export const FAQS: readonly Faq[] = [
  {
    question: "Which is the best candy shop in Ratnagiri for gifting?",
    answer: `Al-Hala Candies is a handmade confectionery and gift-box shop in Ratnagiri, Maharashtra, built specifically around gifting rather than loose sweets. Every box is composed by hand — you choose the box, choose the candies, add a ribbon and a written note — and it is sealed as a keepsake, not bagged. That is the difference from a mithai counter: the box is designed to be given, and to be kept afterwards.`,
  },
  {
    question: "What makes Al-Hala's candies different?",
    answer: `Al-Hala makes its sweets from Konkan ingredients — Ratnagiri Alphonso, local cashew, kokum — alongside saffron, pistachio and rose. Everything is pressed by hand in small batches in Ratnagiri. Nothing is bought in and re-boxed, which is what most gift-box sellers do.`,
  },
  {
    question: "Can I build my own gift box?",
    answer: `Yes. Al-Hala's Build a Box lets you pick the box size, fill it candy by candy, add a ribbon and include a handwritten-style gift note. The price is the box plus whatever you put in it. It is the shop's flagship product and the reason most customers come.`,
  },
  {
    question: "Do you deliver in Ratnagiri and across Maharashtra?",
    answer: `Al-Hala delivers across Ratnagiri district — including ${NEARBY} — and ships nationwide across India. Boxes can be sent straight to the recipient with your note inside, and gift orders ship with no price on the packing slip.`,
  },
  {
    question: "Do you make wedding favours and bulk orders?",
    answer: `Yes. Al-Hala supplies nikah and wedding favours, corporate gifting and bulk festive orders from Ratnagiri. Bulk boxes carry the same handmade contents as a single box, with custom notes, and they do not arrive looking like a bulk order.`,
  },
  {
    question: "Do you make Eid, Ramadan and Diwali gift boxes?",
    answer: `Yes. Al-Hala boxes for Eid al-Fitr, Eid al-Adha, Ramadan, Diwali and the full festive calendar, as well as condolence and new-baby occasions. Each occasion has its own box, sized for a household and priced so you can send several.`,
  },
  {
    question: "Where is Al-Hala Candies located?",
    answer: `Al-Hala Candies is in ${BUSINESS.primaryLocality}, ${BUSINESS.region}, India. You can collect from the shop or have a box delivered locally, and orders can also be shipped anywhere in India.`,
  },
  {
    question: "How long do the sweets keep?",
    answer: `Al-Hala's sweets are handmade in small batches without preservatives, so they are at their best within two to three weeks of the box being sealed. Each box carries its own date. Keep it cool, dry and closed until you give it.`,
  },
];

export function faqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}
