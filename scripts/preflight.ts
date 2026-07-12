/**
 * LAUNCH PREFLIGHT.
 *
 *   npm run preflight
 *
 * One command that answers one question: is this shop ready to be announced to the world?
 *
 * Every check below is something that is CURRENTLY INERT — schema that is valid but that
 * Google will not act on, or a feature that silently does nothing — because a value has not
 * been filled in. The site deploys fine in all of these states, which is exactly the danger:
 * nothing errors, so nothing tells you.
 *
 * It exits 1 when a BLOCKER remains, so it can gate an announcement. It is deliberately NOT
 * a hard gate on the deploy workflow — being unable to publish a preview because the phone
 * number is missing would be its own kind of stupid.
 */

import { existsSync } from "node:fs";

import { BUSINESS, NAP_VERIFIED, isPlaceholder } from "../src/lib/business.ts";
import { SELLABLES } from "../src/lib/catalogue.ts";
import { SOCIALS, isPlaceholderSocial } from "../src/lib/nav.ts";
import { SITE_URL } from "../src/lib/site.ts";

type Level = "blocker" | "warning";

interface Check {
  level: Level;
  label: string;
  ok: boolean;
  /** What is broken RIGHT NOW as a result. Not a restatement of the label. */
  consequence: string;
  fix: string;
}

const checks: Check[] = [
  {
    level: "blocker",
    label: "WhatsApp number",
    ok: !isPlaceholder(BUSINESS.whatsapp),
    consequence: "Nothing can be ordered. Checkout shows a notice instead of a button.",
    fix: "BUSINESS.whatsapp in src/lib/business.ts — digits only, e.g. 919876543210",
  },
  {
    level: "blocker",
    label: "Street address + postcode",
    ok: !isPlaceholder(BUSINESS.streetAddress) && !isPlaceholder(BUSINESS.postalCode),
    consequence:
      "Store schema ships with no address. A local business with no address cannot rank locally, and an assistant cannot tell anyone where you are.",
    fix: "BUSINESS.streetAddress / postalCode — must match the Google Business Profile exactly",
  },
  {
    level: "blocker",
    label: "Telephone",
    ok: !isPlaceholder(BUSINESS.telephone),
    consequence: "Store schema ships with no phone. Same as above — an uncontactable shop.",
    fix: "BUSINESS.telephone",
  },
  {
    level: "blocker",
    label: "Opening hours + geo verified",
    ok: NAP_VERIFIED,
    consequence:
      "geo and openingHours are withheld from the Store schema, because the defaults are guesses. Wrong hours send a customer to a shut shop.",
    fix: "Check both against the Business Profile, then set NAP_VERIFIED = true",
  },
  {
    level: "blocker",
    label: "Product photography",
    ok: SELLABLES.every((item) => item.imageUrl !== ""),
    consequence:
      "Google renders NO product rich result without a per-product image. All 11 Offers — price, stock, shipping, returns — are valid and doing nothing.",
    fix: "Drop files in public/products/ and set imageUrl in src/lib/catalogue.ts",
  },
  {
    level: "warning",
    label: "Google Search Console verified",
    ok: Boolean(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION),
    consequence:
      "You are blind: no way to know whether Google has indexed a single page, or which structured data it accepted.",
    fix: "Set NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION in the repo's Actions variables",
  },
  {
    level: "warning",
    label: "Social accounts linked",
    ok: SOCIALS.some((social) => !isPlaceholderSocial(social.href)),
    consequence:
      "sameAs is empty, so the entity graph does not connect the site to your accounts or your Business Profile. Social icons are hidden rather than dead.",
    fix: "Real profile URLs in SOCIALS, src/lib/nav.ts",
  },
  {
    level: "warning",
    label: "Google Maps / Business Profile URL",
    ok: !isPlaceholder(BUSINESS.mapsUrl),
    consequence: "hasMap omitted. The Maps pack outranks every blue link for a local query.",
    fix: "BUSINESS.mapsUrl — and CLAIM the profile first, if you have not",
  },
  {
    level: "warning",
    label: "Custom domain",
    ok: !SITE_URL.includes("github.io"),
    consequence:
      "github.io is one domain shared by millions of repos, and you are a SUBDIRECTORY of it. Authority does not accrue to this shop. The single biggest structural cap on ranking.",
    fix: "Set NEXT_PUBLIC_SITE_URL to the real origin. basePath, canonicals, sitemap and CNAME all follow automatically.",
  },
  {
    level: "warning",
    label: "OG share card present",
    ok: existsSync("public/alhala-og-card-1200x630.png"),
    consequence: "Every WhatsApp share and social post renders with no image.",
    fix: "public/alhala-og-card-1200x630.png",
  },
];

const bold = (text: string) => `\x1b[1m${text}\x1b[0m`;
const red = (text: string) => `\x1b[31m${text}\x1b[0m`;
const amber = (text: string) => `\x1b[33m${text}\x1b[0m`;
const green = (text: string) => `\x1b[32m${text}\x1b[0m`;
const dim = (text: string) => `\x1b[2m${text}\x1b[0m`;

const blockers = checks.filter((check) => check.level === "blocker" && !check.ok);
const warnings = checks.filter((check) => check.level === "warning" && !check.ok);
const passed = checks.filter((check) => check.ok);

console.log(`\n${bold("LAUNCH PREFLIGHT")}  ${dim(SITE_URL)}\n`);

for (const check of passed) {
  console.log(`  ${green("✓")} ${check.label}`);
}

for (const check of [...blockers, ...warnings]) {
  const mark = check.level === "blocker" ? red("✗") : amber("!");
  const tag = check.level === "blocker" ? red("BLOCKER") : amber("warning");

  console.log(`\n  ${mark} ${bold(check.label)}  ${tag}`);
  console.log(`      ${check.consequence}`);
  console.log(`      ${dim(`fix: ${check.fix}`)}`);
}

console.log(
  `\n${bold("—")} ${passed.length} passed · ${blockers.length} blockers · ${warnings.length} warnings\n`,
);

if (blockers.length > 0) {
  console.log(
    red(
      `NOT READY TO LAUNCH. ${blockers.length} blocker${blockers.length > 1 ? "s" : ""} remain.\n` +
        `The site will still deploy and look finished — that is precisely why this check exists.\n`,
    ),
  );
  process.exit(1);
}

if (warnings.length > 0) {
  console.log(amber("Launchable, but leaving ranking on the table.\n"));
} else {
  console.log(green("Ready to launch.\n"));
}
