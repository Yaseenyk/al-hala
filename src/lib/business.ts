import { socialProfiles } from "./nav.ts";

/**
 * The physical business. NAP — Name, Address, Phone.
 *
 * ⚠️ EVERY VALUE MARKED `TODO` MUST BE REPLACED WITH THE REAL ONE BEFORE LAUNCH.
 *
 * NAP consistency is the backbone of local search: Google cross-references the name,
 * address and phone here against your Google Business Profile, your Maps listing, and
 * every directory that mentions you. A mismatch — even a different way of abbreviating
 * "Road" — splits your local authority across two entities and neither ranks.
 *
 * An INVENTED address is worse than no address at all. It cannot be verified, it will
 * never match the Business Profile, and it teaches Google that this site's structured data
 * is unreliable. If a value is not known yet, leave the TODO in and ship without the field
 * rather than guessing.
 */

export const BUSINESS = {
  legalName: "Al-Hala Candies",
  /** The one query this business must win. */
  primaryLocality: "Ratnagiri",
  region: "Maharashtra",
  regionCode: "MH",
  country: "IN",

  // TODO — real values required.
  streetAddress: "TODO: shop no., street, landmark",
  postalCode: "TODO: 415612",
  telephone: "TODO: +91-XXXXXXXXXX",
  email: "TODO: hello@example.com",

  /**
   * ⚠️ THE ORDER FLOW DEPENDS ON THIS ONE VALUE. Nothing can be bought until it is real.
   *
   * There is no server on GitHub Pages, so every order and every enquiry leaves the site as
   * a WhatsApp message to this number. While it reads `TODO`, the "Order on WhatsApp" button
   * builds a link to a number that does not exist and the customer lands on an error.
   *
   * Format: country code, then the number. DIGITS ONLY — no `+`, no spaces, no dashes.
   * wa.me rejects anything else. A Ratnagiri mobile is `91` followed by the ten digits.
   */
  whatsapp: "TODO91XXXXXXXXXX",

  /**
   * TODO — real coordinates. Take them from your Google Business Profile, not from a
   * rough pin: geo that disagrees with the verified profile is a mismatch signal.
   */
  geo: { latitude: 16.9902, longitude: 73.312 },

  /**
   * Schema.org hours. `Mo-Sa 10:00-21:00` style.
   * TODO — real trading hours, including any weekly closure.
   */
  openingHours: [
    { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "10:00", closes: "21:00" },
    { days: ["Sunday"], opens: "10:00", closes: "14:00" },
  ],

  /**
   * Where we actually deliver. Named towns beat a vague radius: "we ship across India" is
   * a claim, whereas naming Ratnagiri, Chiplun and Ganpatipule is an ANSWER — and an answer
   * is what an assistant repeats when someone asks who delivers to Chiplun.
   */
  servesNearby: [
    "Ratnagiri",
    "Chiplun",
    "Ganpatipule",
    "Guhagar",
    "Dapoli",
    "Sangameshwar",
    "Lanja",
    "Rajapur",
  ],
  shipsNationwide: true,

  priceRange: "₹₹",

  /** TODO — the real Google Business Profile / Maps URL. */
  mapsUrl: "TODO: https://maps.google.com/?cid=...",
} as const;

/**
 * Is this value still a `TODO` placeholder?
 *
 * Lives HERE, beside the data it guards, and is exported. It used to be copy-pasted into
 * each component that rendered NAP — which is exactly how `localBusinessSchema()` below came
 * to ship `telephone: "TODO: +91-XXXXXXXXXX"` to Google while the visible footer correctly
 * hid it. A guard that does not live next to its data gets forgotten by the next consumer.
 */
export const isPlaceholder = (value: string) => value.startsWith("TODO");

/**
 * The value, or `undefined` if it is still a placeholder.
 *
 * `JSON.stringify` drops undefined keys, so an unfilled field vanishes from the JSON-LD
 * entirely. That is the point: a MISSING property is neutral, whereas a property whose value
 * reads `TODO: shop no., street, landmark` is a positive claim that is false. Google cannot
 * match it to the Google Business Profile, and it learns that this site's structured data is
 * not to be trusted — which costs more than the field was ever worth.
 */
const real = (value: string) => (isPlaceholder(value) ? undefined : value);

/**
 * Publish coordinates and opening hours only once a human has checked them against the
 * Google Business Profile. Both defaults below are plausible guesses, and that is precisely
 * the danger: a geo pin that disagrees with the verified profile is a mismatch signal, and
 * wrong opening hours send a real customer to a shop that is shut.
 *
 * Flip to `true` in the same change that fills in the real values.
 */
export const NAP_VERIFIED = false;

/** A single-line address for display and for NAP consistency. Do not reformat it per page. */
export function formattedAddress(): string {
  return [
    BUSINESS.streetAddress,
    BUSINESS.primaryLocality,
    BUSINESS.region,
    BUSINESS.postalCode,
  ].join(", ");
}

/**
 * `Store` rather than plain `LocalBusiness`: the more specific the type, the better Google
 * understands the entity. A confectioner with a shopfront is a Store that sells food.
 */
export function localBusinessSchema(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Store",
    "@id": `${siteUrl}/#store`,
    name: BUSINESS.legalName,
    description: `Handmade confectionery and custom gift boxes in ${BUSINESS.primaryLocality}, ${BUSINESS.region}. Alphonso, cashew, kokum and saffron sweets, boxed for weddings, Eid, and every occasion.`,
    url: siteUrl,
    image: `${siteUrl}/alhala-og-card-1200x630.png`,
    logo: `${siteUrl}/brand/alhala-mark-light.svg`,
    // `real()` on every unverifiable field. An unfilled one disappears rather than shipping
    // the word TODO into Google's index.
    telephone: real(BUSINESS.telephone),
    email: real(BUSINESS.email),
    priceRange: BUSINESS.priceRange,
    currenciesAccepted: "INR",
    address: {
      "@type": "PostalAddress",
      streetAddress: real(BUSINESS.streetAddress),
      // Locality, region and country are KNOWN and stay. "A confectioner in Ratnagiri,
      // Maharashtra" is true and useful today; the street simply is not known yet.
      addressLocality: BUSINESS.primaryLocality,
      addressRegion: BUSINESS.regionCode,
      postalCode: real(BUSINESS.postalCode),
      addressCountry: BUSINESS.country,
    },
    ...(NAP_VERIFIED
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: BUSINESS.geo.latitude,
            longitude: BUSINESS.geo.longitude,
          },
          openingHoursSpecification: BUSINESS.openingHours.map((slot) => ({
            "@type": "OpeningHoursSpecification",
            dayOfWeek: slot.days,
            opens: slot.opens,
            closes: slot.closes,
          })),
        }
      : {}),
    areaServed: [
      ...BUSINESS.servesNearby.map((place) => ({
        "@type": "City",
        name: place,
      })),
      ...(BUSINESS.shipsNationwide
        ? [{ "@type": "Country", name: "India" }]
        : []),
    ],
    hasMap: real(BUSINESS.mapsUrl),
    // Ties this Store to its social accounts and Google Business Profile as ONE entity.
    // Empty while the socials are placeholders — and an empty array would itself be a claim,
    // so it is dropped entirely rather than emitted as `sameAs: []`.
    sameAs: socialProfiles().length > 0 ? socialProfiles() : undefined,
  };
}
