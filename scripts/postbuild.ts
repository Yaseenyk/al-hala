/**
 * Post-export step. Writes `out/CNAME` when the site is on a custom domain.
 *
 * GitHub Pages will not serve a custom domain without a CNAME file at the root of the
 * published artifact. Miss it and Pages keeps answering on `github.io` while the real domain
 * 404s — with no error anywhere to explain why.
 *
 * Derived from NEXT_PUBLIC_SITE_URL, the same single source `next.config.ts` reads, so
 * pointing the site at a new domain remains one change and this file can never disagree
 * with `basePath`.
 *
 * On github.io no CNAME is written — one that says `yaseenyk.github.io` would tell Pages the
 * project page is its own custom domain, and break it.
 */

import { writeFileSync } from "node:fs";

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://yaseenyk.github.io/al-hala"
).replace(/\/$/, "");

const { hostname } = new URL(SITE_URL);

if (hostname.endsWith("github.io")) {
  console.log(`postbuild: ${hostname} is a github.io project page — no CNAME needed.`);
} else {
  writeFileSync("out/CNAME", `${hostname}\n`);
  console.log(`postbuild: wrote out/CNAME -> ${hostname}`);
}
