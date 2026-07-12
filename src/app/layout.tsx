import type { Metadata, Viewport } from "next";
import { Amiri, Cormorant_Garamond, Jost } from "next/font/google";

import { SiteFooter } from "@/components/ui/SiteFooter";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { SITE, SITE_URL } from "@/lib/site";

import "./globals.css";

/**
 * Brand kit v1.1 — Marcellus and Albert Sans were replaced. Marcellus is a Roman capital
 * face with almost no stroke contrast, so it never reads as dramatic no matter how large
 * it is set; the brand needed thick-thin to carry "premium" at display sizes.
 *
 * `Al-Hala Brand Assets/README.txt` is the source of truth and has been amended to match.
 */

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  // 300 is the display weight. Cormorant's drama lives in its light weights at large
  // sizes — set it at 400+ above 3rem and the hairlines thicken and it turns ordinary.
  weight: ["300", "400", "600"],
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
});

const amiri = Amiri({
  weight: ["400", "700"],
  subsets: ["arabic", "latin"],
  variable: "--font-amiri",
  display: "swap",
});

/**
 * `metadataBase` is load-bearing. Without it every relative URL in `openGraph`, `twitter`
 * and `alternates.canonical` resolves against nothing — Next emits a warning and ships
 * relative OG image paths, which no social crawler and no LLM fetcher can resolve.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE.title,
    // Every child route gets "Page — Al-Hala Candies" without repeating the brand by hand.
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    // Local intent first — this is the business's home turf and its highest-converting
    // traffic. A generic "gift boxes" query is national, expensive, and someone else's.
    "candy shop in Ratnagiri",
    "best candy shop Ratnagiri",
    "gift box Ratnagiri",
    "Ratnagiri Alphonso sweets",
    "Konkan cashew candy",
    "wedding favours Ratnagiri",
    "Eid gift box Maharashtra",
    "handmade candy India",
    "build your own gift box",
    "corporate gifting Ratnagiri",
  ],
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
    url: "/",
    locale: "en_US",
    images: [
      {
        url: SITE.ogImage,
        width: 1200,
        height: 630,
        alt: "Al-Hala Candies — premium handmade confectionery in keepsake gift boxes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
    images: [SITE.ogImage],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon-180.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      // Let Google show a full-size image and an unlimited snippet. Capping the snippet
      // is what produces those useless truncated SERP descriptions.
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  /**
   * Ownership verification. Both are optional and both are just a `<meta>` tag.
   *
   * Until Search Console is verified you are blind: you cannot see whether Google has
   * indexed a single page, which queries you surface for, or which of the structured data
   * above it actually accepted. Shipping SEO work without it is guessing.
   *
   * Set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` (and optionally the Bing one) in the repo's
   * Actions variables. Unset, the key is `undefined` and Next omits the tag entirely — an
   * empty `content=""` would be a broken tag rather than an absent one.
   */
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
      : {},
  },
};

/**
 * Separate from `metadata` — Next 15+ requires the viewport export, and a missing
 * `width=device-width` is the single most common cause of a broken mobile layout.
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF7F0" },
    { media: "(prefers-color-scheme: dark)", color: "#0E1F17" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // The font variables MUST sit on <html>, not <body>.
  //
  // Tailwind declares `--font-display: var(--font-marcellus)` on `:root`. A custom
  // property is substituted where it is DECLARED — so if `--font-marcellus` only exists
  // on <body>, then at `:root` it resolves to nothing, `--font-display` computes to an
  // invalid value, and every `font-display` / `font-sans` on the page silently falls back
  // to the browser default. No error, no warning; the brand typeface just never appears.
  //
  // `dir` flips per-locale once i18n lands. Until then components must already use
  // logical properties (ps-*/me-*/text-start) so that flip costs nothing.
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${jost.variable} ${cormorant.variable} ${amiri.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans">
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
