/**
 * The serialization boundary for Build-a-Box.
 *
 * Pure functions. No fetching, no store access, no side effects — the catalogue is
 * injected, never imported. This is the most test-worthy code in the repo, and it is
 * pure precisely so it can be.
 */

import {
  BOX_SCHEMA_VERSION,
  type BoxBuilderState,
  type BoxPayload,
  type CandyLine,
  type DeserializedBox,
  type InventoryCatalogue,
} from "../../types/box.ts";

export type BoxSerializationCode = "NO_BOX_SELECTED" | "OVER_CAPACITY";

export class BoxSerializationError extends Error {
  readonly code: BoxSerializationCode;

  constructor(code: BoxSerializationCode, message: string) {
    super(message);
    this.name = "BoxSerializationError";
    this.code = code;
  }
}

export class BoxSchemaVersionError extends Error {
  readonly received: number;

  constructor(received: number) {
    super(
      `Unsupported box payload schemaVersion ${received}; expected ${BOX_SCHEMA_VERSION}.`,
    );
    this.name = "BoxSchemaVersionError";
    this.received = received;
  }
}

/** Total candies in the box — the sum of line quantities, not the number of lines. */
export function countCandies(candies: readonly CandyLine[]): number {
  return candies.reduce((total, line) => total + line.qty, 0);
}

/**
 * Rich UI state → lean payload.
 *
 * Throws rather than emitting an invalid box: an over-capacity payload that reaches the
 * cart is far more expensive to unpick than a failed add-to-cart.
 */
export function serializeBox(state: BoxBuilderState): BoxPayload {
  const box = state.selectedBox;

  if (box === null) {
    throw new BoxSerializationError(
      "NO_BOX_SELECTED",
      "Cannot serialize a box before one has been chosen.",
    );
  }

  const filled = countCandies(state.candies);
  if (filled > box.capacity) {
    throw new BoxSerializationError(
      "OVER_CAPACITY",
      `Box "${box.sku}" holds ${box.capacity} candies but ${filled} were selected.`,
    );
  }

  const note = state.personalNote.trim();

  return {
    schemaVersion: BOX_SCHEMA_VERSION,
    boxSku: box.sku,
    candySkus: state.candies
      .filter((line) => line.qty > 0)
      .map((line) => ({ sku: line.candy.sku, qty: line.qty })),
    ...(note.length > 0 ? { note } : {}),
  };
}

/**
 * Lean payload → rich UI state, for edit and reorder flows.
 *
 * The catalogue moves underneath saved boxes: candies are discontinued, box capacities
 * change. Rehydration therefore reports what it could not restore rather than throwing —
 * the user still has a box worth editing, and the UI needs to tell them what changed.
 *
 * Capacity overflow is trimmed here on purpose. Left untrimmed, the rehydrated state
 * would be one that `serializeBox` refuses, stranding the user in a box they cannot save.
 */
export function deserializeBox(
  payload: BoxPayload,
  inventoryCatalogue: InventoryCatalogue,
): DeserializedBox {
  if (payload.schemaVersion !== BOX_SCHEMA_VERSION) {
    throw new BoxSchemaVersionError(payload.schemaVersion);
  }

  const missingSkus: string[] = [];
  const droppedSkus: string[] = [];

  const selectedBox = inventoryCatalogue.boxes[payload.boxSku] ?? null;
  if (selectedBox === null) {
    missingSkus.push(payload.boxSku);
  }

  const restored: CandyLine[] = [];
  for (const line of payload.candySkus) {
    const candy = inventoryCatalogue.candies[line.sku];
    if (candy === undefined) {
      missingSkus.push(line.sku);
      continue;
    }
    restored.push({ candy, qty: line.qty });
  }

  const capacity = selectedBox?.capacity ?? 0;
  const candies: CandyLine[] = [];
  let filled = 0;

  for (const line of restored) {
    const room = capacity - filled;
    if (room <= 0) {
      droppedSkus.push(line.candy.sku);
      continue;
    }
    const qty = Math.min(line.qty, room);
    if (qty < line.qty) {
      droppedSkus.push(line.candy.sku);
    }
    candies.push({ candy: line.candy, qty });
    filled += qty;
  }

  return {
    state: {
      currentStep: resumeStep(selectedBox !== null, missingSkus.length, droppedSkus.length),
      selectedBox,
      candies,
      personalNote: payload.note ?? "",
    },
    missingSkus,
    droppedSkus,
  };
}

/** Drop the user at the step where the damage is, so they land on what needs fixing. */
function resumeStep(
  hasBox: boolean,
  missingCount: number,
  droppedCount: number,
): BoxBuilderState["currentStep"] {
  if (!hasBox) return 1;
  if (missingCount > 0 || droppedCount > 0) return 2;
  return 4;
}
