/**
 * Structured data injector.
 *
 * A Server Component on purpose: JSON-LD built on the client is JSON-LD a crawler may
 * never execute, which defeats the entire point of emitting it.
 *
 * Per CLAUDE.md §3, a product or category page shipped without JSON-LD is incomplete
 * work. Search is not a polish task for a gifting business — it is the channel.
 */

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // The payload is ours, not user input. `JSON.stringify` escapes the quotes; the
      // `<` guard closes the one hole that matters — a literal "</script>" inside a string
      // would otherwise terminate the tag early and turn data into markup.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
