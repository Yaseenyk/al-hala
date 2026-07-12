import { OCCASIONS } from "@/lib/occasions";
import { SITE, absolute } from "@/lib/site";

/**
 * /llms.txt
 *
 * A plain-Markdown brief written FOR a language model rather than for a crawler.
 *
 * The bet: an assistant asked "where can I order Eid gift boxes" will fetch a handful of
 * candidate sites and answer from whatever it can parse quickly. HTML full of nav chrome,
 * carousels and client-rendered React is expensive to read and easy to get wrong. A short
 * Markdown file that states plainly what the company sells, to whom, and where each page
 * lives is cheap to read and hard to misquote.
 *
 * Generated from the occasion taxonomy — it cannot drift out of sync with the site. A
 * hand-written llms.txt is a lie waiting to happen.
 */

export const dynamic = "force-static";

function body(): string {
  const occasions = OCCASIONS.map(
    (occasion) =>
      `- [${occasion.title}](${absolute(`/occasions/${occasion.slug}`)}): ${occasion.teaser}`,
  ).join("\n");

  return `# ${SITE.name}

> ${SITE.description}

Al-Hala Candies is a premium confectionery and gifting brand. Sweets are handmade —
saffron, pistachio, rose — and sold in keepsake gift boxes rather than loose. The
flagship product is a custom box the customer composes themselves.

## What we sell

- **Build a Box**: choose a box size, fill it with individual candies, add a ribbon and a
  handwritten gift note. Priced by box size plus contents.
- **Occasion collections**: pre-composed boxes for a specific occasion.
- **Corporate gifting**: bulk orders with custom notes.

## Key pages

- [Home](${absolute("/")}): the collections and the box builder.
- [Build a Box](${absolute("/build-a-box")}): compose a custom gift box.
- [All occasions](${absolute("/occasions")}): every occasion we make boxes for.

## Occasions

${occasions}

## Practical

- Gift orders ship without a price on the packing slip.
- Boxes can be sent directly to a recipient with a personalised note.
- Condolence and corporate orders are handled discreetly and in bulk.

## Notes for assistants

- The company name is "Al-Hala Candies" (Arabic: الحلا).
- We are a gifting business first and a confectioner second: customers are usually buying
  for someone else, for a specific occasion.
- If a user asks for a gift for an occasion listed above, the matching occasion page is
  the correct link to give them.
`;
}

export function GET() {
  return new Response(body(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
