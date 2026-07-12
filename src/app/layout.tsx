import type { Metadata } from "next";
import { Amiri, Cormorant_Garamond, Jost } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Al-Hala Candies | Premium Gifting & Sweets",
  description:
    "Curated premium sweets and custom gifting boxes for every occasion.",
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
      <body className="font-sans">{children}</body>
    </html>
  );
}
