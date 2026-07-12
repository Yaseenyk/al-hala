/**
 * Build-a-Box UI state.
 *
 * Ephemeral and client-only. No `persist` middleware, deliberately: a box rehydrated
 * from localStorage would carry candy prices and names captured at save time, and the
 * catalogue moves. The cart is the only durable home for a box, and it stores the lean
 * payload from `serializeBox`. A hard refresh resets the builder — that is the intent.
 *
 * Business rules live here, not in components. Capacity is enforced on every mutation,
 * so no component can construct a state that `serializeBox` would reject.
 */

import { create } from "zustand";

import { countCandies } from "@/lib/adapters/box-adapter";
import type {
  BoxBuilderState,
  BoxType,
  BuilderStep,
  CandyItem,
  CandyLine,
  Money,
} from "@/types/box";

export interface BoxBuilderActions {
  setStep(step: BuilderStep): void;
  /** Trims the candies to fit if the new box is smaller than the current selection. */
  selectBox(box: BoxType): void;
  /** Returns false when the box is full or unchosen, so the UI can raise a toast. */
  addCandy(candy: CandyItem): boolean;
  /** Decrements the line; removes it entirely at zero. */
  removeCandy(candySku: string): void;
  setNote(note: string): void;
  reset(): void;
}

export type BoxBuilderStore = BoxBuilderState & BoxBuilderActions;

const initialState: BoxBuilderState = {
  currentStep: 1,
  selectedBox: null,
  candies: [],
  personalNote: "",
};

/** Trims from the end of the list — last candies added are the first to go. */
function trimToCapacity(candies: readonly CandyLine[], capacity: number): CandyLine[] {
  if (countCandies(candies) <= capacity) return [...candies];

  const trimmed: CandyLine[] = [];
  let filled = 0;

  for (const line of candies) {
    const room = capacity - filled;
    if (room <= 0) break;
    const qty = Math.min(line.qty, room);
    trimmed.push({ candy: line.candy, qty });
    filled += qty;
  }

  return trimmed;
}

export const useBoxBuilder = create<BoxBuilderStore>()((set, get) => ({
  ...initialState,

  setStep: (step) => set({ currentStep: step }),

  selectBox: (box) =>
    set((state) => ({
      selectedBox: box,
      candies: trimToCapacity(state.candies, box.capacity),
    })),

  addCandy: (candy) => {
    const { selectedBox, candies } = get();

    if (selectedBox === null) return false;
    if (countCandies(candies) >= selectedBox.capacity) return false;

    const existing = candies.find((line) => line.candy.sku === candy.sku);

    set({
      candies: existing
        ? candies.map((line) =>
            line.candy.sku === candy.sku ? { ...line, qty: line.qty + 1 } : line,
          )
        : [...candies, { candy, qty: 1 }],
    });

    return true;
  },

  removeCandy: (candySku) =>
    set((state) => ({
      candies: state.candies
        .map((line) =>
          line.candy.sku === candySku ? { ...line, qty: line.qty - 1 } : line,
        )
        .filter((line) => line.qty > 0),
    })),

  setNote: (note) => set({ personalNote: note }),

  reset: () => set(initialState),
}));

// ---------------------------------------------------------------------------
// Derived state
//
// Computed here, never stored. A `pricePreview` field in the store is a field that goes
// stale the moment a candy is removed and something forgets to recompute it.
//
// Each hook subscribes to primitives only. Zustand v5 compares with Object.is, so a
// selector returning a fresh object or array would re-render on every store change —
// these assemble their object from scalar selections instead.
// ---------------------------------------------------------------------------

export interface BoxProgress {
  current: number;
  total: number;
  isFull: boolean;
}

export function useBoxProgress(): BoxProgress {
  const current = useBoxBuilder((state) => countCandies(state.candies));
  const total = useBoxBuilder((state) => state.selectedBox?.capacity ?? 0);

  return { current, total, isFull: total > 0 && current >= total };
}

/** Integer minor units. The client total is a preview — checkout re-prices server-side. */
export function useBoxTotal(): Money {
  const boxPrice = useBoxBuilder((state) => state.selectedBox?.price ?? 0);
  const candiesPrice = useBoxBuilder((state) =>
    state.candies.reduce((total, line) => total + line.candy.price * line.qty, 0),
  );

  return boxPrice + candiesPrice;
}
