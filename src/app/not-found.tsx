import Link from "next/link";

import { GiftBoxMark } from "@/components/ui/GiftBoxMark";

export default function NotFound() {
  return (
    <main className="grain min-h-fold relative flex flex-col items-center justify-center gap-8 bg-cream px-6 py-24 text-center text-cocoa-ink">
      <span className="size-48">
        <GiftBoxMark tone="text-saffron" animate className="size-full" />
      </span>
      <p className="text-xs tracking-widest text-saffron uppercase">404</p>
      <h1 className="font-display text-5xl leading-none font-light md:text-7xl">
        This box is empty
      </h1>
      <span aria-hidden className="block h-px w-16 bg-saffron" />
      <p className="max-w-prose leading-relaxed text-cocoa-ink/55">
        The page you were looking for is not here. It may have moved, or it may never have
        existed. Either way, there are sweets.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link
          href="/build-a-box"
          className="rounded-full bg-hala-green px-8 py-4 text-xs tracking-widest text-cream uppercase transition-colors hover:bg-deep-green"
        >
          Build a box
        </Link>
        <Link
          href="/occasions"
          className="rounded-full border border-cocoa-ink/20 px-8 py-4 text-xs tracking-widest uppercase transition-colors hover:border-saffron"
        >
          All occasions
        </Link>
      </div>
    </main>
  );
}
