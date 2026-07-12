/**
 * Build-a-Box domain types.
 *
 * Two shapes, deliberately not one:
 *   BoxBuilderState — rich, ephemeral, client-only. Verbose so the UI is instant.
 *   BoxPayload      — lean, versioned, what the cart and database actually store.
 *
 * The adapter in `src/lib/adapters/box-adapter.ts` is the only bridge between them.
 * Nothing else may cross. See CLAUDE.md §5.
 */

/**
 * Integer minor units (paise / fils / cents). Never a float — floats do not survive
 * repeated addition of prices, and this value is summed per candy line. Format only at
 * the render edge.
 */
export type Money = number;

/** Bumped whenever BoxPayload's shape changes. A box saved today must open in a year. */
export const BOX_SCHEMA_VERSION = 1;

/** 1: Choose Box · 2: Select Candies · 3: Personalize · 4: Review */
export type BuilderStep = 1 | 2 | 3 | 4;

/**
 * The URL segment for a product page: /products/<slug>.
 *
 * EXPLICIT, never derived from the SKU. A slug is a public, permanent URL and a ranking
 * asset; a SKU is an internal identifier that warehouse staff rename. Deriving one from the
 * other means an inventory tidy-up silently 404s a page that Google has indexed.
 * Slugs are also written for humans and for search — `ratnagiri-alphonso-candy`, not `c-alphonso`.
 */
export interface Sellable {
  sku: string;
  slug: string;
  name: string;
  /**
   * A real sentence about the product. This is the `description` in Product JSON-LD and the
   * meta description of its page — so it is the line Google shows and the line an assistant
   * quotes back. Not a keyword list.
   */
  description: string;
  price: Money;
  imageUrl: string;
  imageAlt: string;
}

export interface BoxType extends Sellable {
  /** Total candies this box holds. The single business constraint of the builder. */
  capacity: number;
}

export type CandyItem = Sellable;

/** A candy plus how many of it are in the box. `qty` is always >= 1. */
export interface CandyLine {
  candy: CandyItem;
  qty: number;
}

// ---------------------------------------------------------------------------
// Client state — heavy, ephemeral, never persisted
// ---------------------------------------------------------------------------

/**
 * Note what is NOT here: price totals, fill counts, validation errors. Those are
 * derived, and derived state stored is derived state that goes stale. They are computed
 * in selectors instead — see `src/store/box-builder.ts`.
 */
export interface BoxBuilderState {
  currentStep: BuilderStep;
  selectedBox: BoxType | null;
  candies: CandyLine[];
  personalNote: string;
}

// ---------------------------------------------------------------------------
// Wire / DB state — lean, versioned
// ---------------------------------------------------------------------------

export interface BoxPayloadLine {
  sku: string;
  qty: number;
}

/**
 * SKUs and counts. No names, no image URLs, no prices — every one of those is a
 * catalogue fact that will change, and a saved box must not carry a stale copy of it.
 */
export interface BoxPayload {
  schemaVersion: number;
  boxSku: string;
  candySkus: BoxPayloadLine[];
  note?: string;
}

// ---------------------------------------------------------------------------
// Rehydration
// ---------------------------------------------------------------------------

/** Injected into `deserializeBox` — the adapter never fetches. Pure functions only. */
export interface InventoryCatalogue {
  boxes: Readonly<Record<string, BoxType>>;
  candies: Readonly<Record<string, CandyItem>>;
}

export interface DeserializedBox {
  state: BoxBuilderState;
  /** SKUs in the payload that no longer exist in the catalogue. Surface these to the user. */
  missingSkus: string[];
  /** Candies dropped because the box's capacity shrank since the box was saved. */
  droppedSkus: string[];
}
