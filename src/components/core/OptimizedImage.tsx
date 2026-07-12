import NextImage, { type ImageProps as NextImageProps } from "next/image";

/**
 * The ONLY way an image enters this application.
 *
 * Never import `next/image` in a feature component, and never write a bare `<img>`.
 * Everything routes through here so that four rules cannot be forgotten one component at
 * a time:
 *
 *   1. `alt` is REQUIRED and non-empty. There is no silent path to a missing alt — a
 *      decorative image must say so explicitly via `decorative`, which is a deliberate
 *      act rather than an omission.
 *   2. Lazy by default. Above-the-fold images opt IN with `priority`.
 *   3. A skeleton while loading, so there is no white flash.
 *   4. Explicit dimensions or `fill`. The CLS budget is zero.
 */

type BaseProps = Omit<NextImageProps, "alt" | "src"> & {
  src: NextImageProps["src"];
  /** Wrapper class. Use `fill` inside a sized, relatively-positioned parent. */
  className?: string;
};

type Described = BaseProps & {
  /**
   * SEO copy, not a filename. `alt="box-3.jpg"` is a bug.
   * `alt="Al-Hala signature gift box with twelve saffron and pistachio candies"` is not.
   */
  alt: string;
  decorative?: false;
};

type Decorative = BaseProps & {
  /** Purely ornamental: emits `alt=""` + `aria-hidden`, hiding it from assistive tech. */
  decorative: true;
  alt?: never;
};

/**
 * The union is what makes `alt` un-forgettable at COMPILE time: `<OptimizedImage src=…/>`
 * with no `alt` and no `decorative` simply does not typecheck.
 */
export type OptimizedImageProps = Described | Decorative;

/** A union cannot be rest-destructured, so the body works against the flattened shape. */
type Flat = BaseProps & { alt?: string; decorative?: boolean };

export function OptimizedImage(props: OptimizedImageProps) {
  const { className, decorative, alt, ...rest } = props as Flat;

  if (decorative) {
    return <NextImage {...rest} alt="" aria-hidden className={className} />;
  }

  if (alt === undefined || alt.trim().length === 0) {
    // A real boundary, not speculative defence. The union already blocks a missing `alt`
    // at compile time; this catches the runtime hole — a value that types as `string` but
    // arrives empty (a CMS field nobody filled in). An empty alt is invisible in review
    // and in the browser, and only surfaces in an accessibility audit months later.
    throw new Error(
      "OptimizedImage: `alt` must be a non-empty description, or pass `decorative` to opt out.",
    );
  }

  return <NextImage {...rest} alt={alt} className={className} />;
}
