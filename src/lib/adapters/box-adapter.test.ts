import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  BOX_SCHEMA_VERSION,
  type BoxBuilderState,
  type BoxPayload,
  type BoxType,
  type CandyItem,
  type InventoryCatalogue,
} from "../../types/box.ts";
import {
  BoxSchemaVersionError,
  BoxSerializationError,
  countCandies,
  deserializeBox,
  serializeBox,
} from "./box-adapter.ts";

// --- fixtures --------------------------------------------------------------

const SMALL_BOX: BoxType = {
  sku: "BOX-6",
  name: "Signature Six",
  capacity: 6,
  price: 45000,
  imageUrl: "/boxes/box-6.jpg",
  imageAlt: "Al-Hala signature six-piece gift box",
};

const TINY_BOX: BoxType = { ...SMALL_BOX, sku: "BOX-2", capacity: 2 };

const SAFFRON: CandyItem = {
  sku: "CANDY-SAFFRON",
  name: "Saffron Pistachio",
  price: 9000,
  imageUrl: "/candies/saffron.jpg",
  imageAlt: "Saffron and pistachio candy",
};

const ROSE: CandyItem = {
  sku: "CANDY-ROSE",
  name: "Rose Cardamom",
  price: 8500,
  imageUrl: "/candies/rose.jpg",
  imageAlt: "Rose and cardamom candy",
};

const CATALOGUE: InventoryCatalogue = {
  boxes: { [SMALL_BOX.sku]: SMALL_BOX, [TINY_BOX.sku]: TINY_BOX },
  candies: { [SAFFRON.sku]: SAFFRON, [ROSE.sku]: ROSE },
};

function stateWith(overrides: Partial<BoxBuilderState> = {}): BoxBuilderState {
  return {
    currentStep: 4,
    selectedBox: SMALL_BOX,
    candies: [
      { candy: SAFFRON, qty: 2 },
      { candy: ROSE, qty: 1 },
    ],
    personalNote: "Eid Mubarak",
    ...overrides,
  };
}

// --- serializeBox ----------------------------------------------------------

describe("serializeBox", () => {
  it("reduces rich state to SKUs, quantities, and a version — nothing else", () => {
    const payload = serializeBox(stateWith());

    assert.deepEqual(payload, {
      schemaVersion: BOX_SCHEMA_VERSION,
      boxSku: "BOX-6",
      candySkus: [
        { sku: "CANDY-SAFFRON", qty: 2 },
        { sku: "CANDY-ROSE", qty: 1 },
      ],
      note: "Eid Mubarak",
    });

    // The point of the whole pattern: no catalogue facts survive into the payload.
    const wire = JSON.stringify(payload);
    assert.ok(!wire.includes("Saffron Pistachio"), "leaked a product name");
    assert.ok(!wire.includes("/candies/"), "leaked an image URL");
    assert.ok(!wire.includes("9000"), "leaked a price");
    assert.ok(!wire.includes("currentStep"), "leaked UI state");
  });

  it("omits an empty or whitespace-only note rather than persisting an empty string", () => {
    const payload = serializeBox(stateWith({ personalNote: "   " }));
    assert.equal("note" in payload, false);
  });

  it("drops zero-quantity lines", () => {
    const payload = serializeBox(
      stateWith({ candies: [{ candy: SAFFRON, qty: 2 }, { candy: ROSE, qty: 0 }] }),
    );
    assert.deepEqual(payload.candySkus, [{ sku: "CANDY-SAFFRON", qty: 2 }]);
  });

  it("serializes a box filled exactly to capacity", () => {
    const payload = serializeBox(stateWith({ candies: [{ candy: SAFFRON, qty: 6 }] }));
    assert.deepEqual(payload.candySkus, [{ sku: "CANDY-SAFFRON", qty: 6 }]);
  });

  it("throws OVER_CAPACITY when the candies exceed the box", () => {
    const overfilled = stateWith({
      selectedBox: TINY_BOX, // capacity 2
      candies: [
        { candy: SAFFRON, qty: 2 },
        { candy: ROSE, qty: 1 }, // 3 > 2
      ],
    });

    assert.throws(
      () => serializeBox(overfilled),
      (error: unknown) => {
        assert.ok(error instanceof BoxSerializationError);
        assert.equal(error.code, "OVER_CAPACITY");
        return true;
      },
    );
  });

  it("counts quantities, not lines, when checking capacity", () => {
    // One line, but three candies in a box that holds two. A line-count check misses this.
    const overfilled = stateWith({
      selectedBox: TINY_BOX,
      candies: [{ candy: SAFFRON, qty: 3 }],
    });

    assert.throws(() => serializeBox(overfilled), BoxSerializationError);
  });

  it("throws NO_BOX_SELECTED when no box has been chosen", () => {
    assert.throws(
      () => serializeBox(stateWith({ selectedBox: null })),
      (error: unknown) => {
        assert.ok(error instanceof BoxSerializationError);
        assert.equal(error.code, "NO_BOX_SELECTED");
        return true;
      },
    );
  });
});

// --- deserializeBox --------------------------------------------------------

describe("deserializeBox", () => {
  const payload: BoxPayload = {
    schemaVersion: BOX_SCHEMA_VERSION,
    boxSku: "BOX-6",
    candySkus: [
      { sku: "CANDY-SAFFRON", qty: 2 },
      { sku: "CANDY-ROSE", qty: 1 },
    ],
    note: "Eid Mubarak",
  };

  it("rehydrates full product detail from the catalogue", () => {
    const { state, missingSkus, droppedSkus } = deserializeBox(payload, CATALOGUE);

    assert.deepEqual(missingSkus, []);
    assert.deepEqual(droppedSkus, []);
    assert.equal(state.selectedBox?.name, "Signature Six");
    assert.equal(state.candies[0]?.candy.name, "Saffron Pistachio");
    assert.equal(state.candies[0]?.candy.price, 9000);
    assert.equal(state.personalNote, "Eid Mubarak");
    assert.equal(state.currentStep, 4);
  });

  it("round-trips: serialize(deserialize(payload)) === payload", () => {
    const { state } = deserializeBox(payload, CATALOGUE);
    assert.deepEqual(serializeBox(state), payload);
  });

  it("drops a discontinued candy and reports its SKU", () => {
    const withDiscontinued: BoxPayload = {
      ...payload,
      candySkus: [...payload.candySkus, { sku: "CANDY-DISCONTINUED", qty: 1 }],
    };

    const { state, missingSkus } = deserializeBox(withDiscontinued, CATALOGUE);

    assert.deepEqual(missingSkus, ["CANDY-DISCONTINUED"]);
    assert.equal(state.candies.length, 2);
    assert.equal(countCandies(state.candies), 3);
    // Lands the user on the candy step, where the gap is.
    assert.equal(state.currentStep, 2);
  });

  it("reports a discontinued box and leaves the user at step 1", () => {
    const { state, missingSkus } = deserializeBox(
      { ...payload, boxSku: "BOX-GONE" },
      CATALOGUE,
    );

    assert.deepEqual(missingSkus, ["BOX-GONE"]);
    assert.equal(state.selectedBox, null);
    assert.equal(state.currentStep, 1);
  });

  it("trims candies when the box capacity shrank, so the box stays saveable", () => {
    // BOX-2 holds two; the saved payload has three candies in it.
    const shrunk: BoxPayload = {
      schemaVersion: BOX_SCHEMA_VERSION,
      boxSku: "BOX-2",
      candySkus: [
        { sku: "CANDY-SAFFRON", qty: 2 },
        { sku: "CANDY-ROSE", qty: 1 },
      ],
    };

    const { state, droppedSkus } = deserializeBox(shrunk, CATALOGUE);

    assert.equal(countCandies(state.candies), 2);
    assert.deepEqual(droppedSkus, ["CANDY-ROSE"]);
    // The whole point of trimming: the result can be re-saved rather than stranding the user.
    assert.doesNotThrow(() => serializeBox(state));
  });

  it("partially trims a single over-capacity line", () => {
    const shrunk: BoxPayload = {
      schemaVersion: BOX_SCHEMA_VERSION,
      boxSku: "BOX-2",
      candySkus: [{ sku: "CANDY-SAFFRON", qty: 5 }],
    };

    const { state, droppedSkus } = deserializeBox(shrunk, CATALOGUE);

    assert.deepEqual(state.candies, [{ candy: SAFFRON, qty: 2 }]);
    assert.deepEqual(droppedSkus, ["CANDY-SAFFRON"]);
  });

  it("rejects a payload written by a future schema version", () => {
    assert.throws(
      () => deserializeBox({ ...payload, schemaVersion: 99 }, CATALOGUE),
      BoxSchemaVersionError,
    );
  });
});
