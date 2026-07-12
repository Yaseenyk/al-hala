"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { GiftBoxMark } from "@/components/ui/GiftBoxMark";
import { BOXES, CANDIES, formatMoney } from "@/lib/catalogue";
import { serializeBox } from "@/lib/adapters/box-adapter";
import { useBoxBuilder, useBoxProgress, useBoxTotal } from "@/store/box-builder";
import { useCart } from "@/store/cart";
import type { BuilderStep } from "@/types/box";

/**
 * Build a Box. The flagship.
 *
 * The store (`box-builder.ts`) and the serialization adapter (`box-adapter.ts`) have been
 * finished and unit-tested since the first day of this project with no UI on top. This is
 * that UI, and it adds NO new business logic: capacity is enforced by the store, price is
 * derived by a selector, and the cart receives a lean `BoxPayload` from `serializeBox` —
 * never the builder's working state.
 *
 * That is the whole architecture in one screen: rich ephemeral state here, lean versioned
 * payload over the wire.
 */

const STEPS: readonly { step: BuilderStep; label: string }[] = [
  { step: 1, label: "Choose your box" },
  { step: 2, label: "Fill it" },
  { step: 3, label: "Personalise" },
  { step: 4, label: "Review" },
];

export function BoxBuilder() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const currentStep = useBoxBuilder((state) => state.currentStep);
  const selectedBox = useBoxBuilder((state) => state.selectedBox);
  const candies = useBoxBuilder((state) => state.candies);
  const note = useBoxBuilder((state) => state.personalNote);

  const setStep = useBoxBuilder((state) => state.setStep);
  const selectBox = useBoxBuilder((state) => state.selectBox);
  const addCandy = useBoxBuilder((state) => state.addCandy);
  const removeCandy = useBoxBuilder((state) => state.removeCandy);
  const setNote = useBoxBuilder((state) => state.setNote);
  const reset = useBoxBuilder((state) => state.reset);

  const progress = useBoxProgress();
  const total = useBoxTotal();

  const addLine = useCart((state) => state.addLine);

  function handleAdd(sku: string) {
    const candy = CANDIES.find((entry) => entry.sku === sku)!;
    // The store returns false when the box is full — it is the single source of the
    // capacity rule, so the UI never re-implements it and the two cannot disagree.
    const added = addCandy(candy);
    if (!added) {
      setError(
        selectedBox
          ? `${selectedBox.name} holds ${selectedBox.capacity}. Remove something first.`
          : "Choose a box first.",
      );
      return;
    }
    setError(null);
  }

  function handleAddToCart() {
    try {
      // The boundary. Rich state in, lean versioned payload out. The cart never sees the
      // builder's working state, and a saved box survives a catalogue change.
      const payload = serializeBox({
        currentStep,
        selectedBox,
        candies,
        personalNote: note,
      });

      addLine({
        id: `${payload.boxSku}-${Date.now()}`,
        payload,
        title: selectedBox!.name,
        unitPrice: total,
        qty: 1,
      });

      reset();
      router.push("/cart");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not add this box.");
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 sm:px-8 md:px-16">
      <div className="grid gap-16 lg:grid-cols-3 lg:gap-24">
        <div className="lg:col-span-2">
          {/* Step rail */}
          <nav aria-label="Steps">
            <ol className="flex flex-wrap gap-2">
              {STEPS.map((entry) => {
                const active = entry.step === currentStep;
                const reachable = entry.step === 1 || selectedBox !== null;

                return (
                  <li key={entry.step}>
                    <button
                      type="button"
                      disabled={!reachable}
                      aria-current={active ? "step" : undefined}
                      onClick={() => setStep(entry.step)}
                      className={`rounded-full border px-6 py-2 text-xs tracking-widest uppercase transition-colors disabled:opacity-30 ${
                        active
                          ? "border-hala-green bg-hala-green text-cream"
                          : "border-cocoa-ink/15 hover:border-saffron"
                      }`}
                    >
                      {entry.step}. {entry.label}
                    </button>
                  </li>
                );
              })}
            </ol>
          </nav>

          {error ? (
            <p
              // The error is announced, not just coloured. A red border tells a sighted
              // user something is wrong and tells a screen-reader user nothing at all.
              role="status"
              aria-live="polite"
              className="mt-8 rounded-lg border border-saffron/40 bg-saffron/10 p-4 text-sm"
            >
              {error}
            </p>
          ) : null}

          <div className="mt-16">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                {currentStep === 1 ? (
                  <section aria-labelledby="step-1">
                    <h2 id="step-1" className="font-display text-3xl font-light">
                      Choose your box
                    </h2>
                    <ul className="mt-8 grid gap-4 sm:grid-cols-3">
                      {BOXES.map((box) => {
                        const chosen = selectedBox?.sku === box.sku;
                        return (
                          <li key={box.sku}>
                            <button
                              type="button"
                              onClick={() => {
                                selectBox(box);
                                setStep(2);
                              }}
                              aria-pressed={chosen}
                              className={`flex size-full flex-col items-start gap-4 rounded-lg border p-8 text-start transition-colors ${
                                chosen
                                  ? "border-saffron bg-saffron/5"
                                  : "border-cocoa-ink/10 hover:border-saffron/50"
                              }`}
                            >
                              <span className="size-24">
                                <GiftBoxMark
                                  tone="text-saffron"
                                  animate={false}
                                  className="size-full"
                                />
                              </span>
                              <span className="font-display text-2xl font-light">
                                {box.name}
                              </span>
                              <span className="text-sm text-cocoa-ink/55">
                                {box.capacity} pieces
                              </span>
                              <span className="mt-auto text-sm tabular-nums">
                                {formatMoney(box.price)}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                ) : null}

                {currentStep === 2 ? (
                  <section aria-labelledby="step-2">
                    <div className="flex flex-wrap items-baseline justify-between gap-4">
                      <h2 id="step-2" className="font-display text-3xl font-light">
                        Fill it
                      </h2>
                      <p
                        aria-live="polite"
                        className="text-sm text-cocoa-ink/55 tabular-nums"
                      >
                        {progress.current} of {progress.total} filled
                      </p>
                    </div>

                    {/* The progress bar is derived, never stored — see box-builder.ts. */}
                    <div className="mt-4 h-px w-full bg-cocoa-ink/10">
                      <div
                        className="h-px bg-saffron transition-all duration-500"
                        style={{
                          width: `${progress.total ? (progress.current / progress.total) * 100 : 0}%`,
                        }}
                      />
                    </div>

                    <ul className="mt-8 grid gap-4 sm:grid-cols-2">
                      {CANDIES.map((candy) => {
                        const line = candies.find((entry) => entry.candy.sku === candy.sku);
                        return (
                          <li
                            key={candy.sku}
                            className="flex items-center justify-between gap-4 rounded-lg border border-cocoa-ink/10 p-6"
                          >
                            <div className="min-w-0">
                              <p className="font-display text-xl font-light">{candy.name}</p>
                              <p className="text-sm text-cocoa-ink/55 tabular-nums">
                                {formatMoney(candy.price)}
                              </p>
                            </div>

                            <div className="flex shrink-0 items-center gap-2">
                              <button
                                type="button"
                                onClick={() => removeCandy(candy.sku)}
                                disabled={!line}
                                aria-label={`Remove one ${candy.name}`}
                                className="grid size-12 place-items-center rounded-full border border-cocoa-ink/15 transition-colors hover:border-saffron disabled:opacity-30"
                              >
                                −
                              </button>
                              <span
                                aria-live="polite"
                                className="w-6 text-center text-sm tabular-nums"
                              >
                                {line?.qty ?? 0}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleAdd(candy.sku)}
                                disabled={progress.isFull}
                                aria-label={`Add one ${candy.name}`}
                                className="grid size-12 place-items-center rounded-full border border-cocoa-ink/15 transition-colors hover:border-saffron disabled:opacity-30"
                              >
                                +
                              </button>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                ) : null}

                {currentStep === 3 ? (
                  <section aria-labelledby="step-3">
                    <h2 id="step-3" className="font-display text-3xl font-light">
                      Personalise
                    </h2>
                    <label
                      htmlFor="gift-note"
                      className="mt-8 block text-xs tracking-widest text-cocoa-ink/55 uppercase"
                    >
                      Your gift note
                    </label>
                    <textarea
                      id="gift-note"
                      value={note}
                      onChange={(event) => setNote(event.target.value)}
                      maxLength={240}
                      rows={5}
                      placeholder="Written by hand and tucked inside the box."
                      className="mt-4 w-full rounded-lg border border-cocoa-ink/15 bg-transparent p-6 focus:border-saffron"
                    />
                    <p className="mt-2 text-xs text-cocoa-ink/40 tabular-nums">
                      {note.length} / 240
                    </p>
                  </section>
                ) : null}

                {currentStep === 4 ? (
                  <section aria-labelledby="step-4">
                    <h2 id="step-4" className="font-display text-3xl font-light">
                      Review
                    </h2>
                    <dl className="mt-8 flex flex-col gap-4">
                      <div className="flex justify-between border-b border-cocoa-ink/10 pb-4">
                        <dt>{selectedBox?.name ?? "No box chosen"}</dt>
                        <dd className="tabular-nums">
                          {selectedBox ? formatMoney(selectedBox.price) : "—"}
                        </dd>
                      </div>
                      {candies.map((line) => (
                        <div
                          key={line.candy.sku}
                          className="flex justify-between border-b border-cocoa-ink/10 pb-4 text-cocoa-ink/70"
                        >
                          <dt>
                            {line.candy.name} × {line.qty}
                          </dt>
                          <dd className="tabular-nums">
                            {formatMoney(line.candy.price * line.qty)}
                          </dd>
                        </div>
                      ))}
                    </dl>

                    {note ? (
                      <blockquote className="mt-8 border-s-2 border-saffron ps-6 text-cocoa-ink/70 italic">
                        {note}
                      </blockquote>
                    ) : null}
                  </section>
                ) : null}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Summary rail. Sticky on desktop — the price should never scroll away. */}
        <aside className="lg:sticky lg:top-32 lg:h-fit">
          <div className="rounded-lg border border-cocoa-ink/10 p-8">
            <h2 className="font-display text-2xl font-light">Your box</h2>

            <div className="mt-8 flex items-center gap-6">
              <span className="size-24 shrink-0">
                <GiftBoxMark tone="text-saffron" animate className="size-full" />
              </span>
              <div className="min-w-0">
                <p className="font-display text-xl font-light">
                  {selectedBox?.name ?? "No box yet"}
                </p>
                <p className="text-sm text-cocoa-ink/55 tabular-nums">
                  {progress.current} of {progress.total || "—"} filled
                </p>
              </div>
            </div>

            <div className="mt-8 flex items-baseline justify-between border-t border-cocoa-ink/10 pt-8">
              <span className="text-xs tracking-widest text-cocoa-ink/55 uppercase">
                Total
              </span>
              <span className="font-display text-3xl font-light tabular-nums">
                {formatMoney(total)}
              </span>
            </div>
            {/* Not a disclaimer for its own sake: the client price is a preview and the
                server re-prices at checkout. Saying so here is honest and it is also what
                stops a stale localStorage total from becoming a customer complaint. */}
            <p className="mt-2 text-xs text-cocoa-ink/40">
              Confirmed at checkout. Delivery calculated separately.
            </p>

            <div className="mt-8 flex flex-col gap-4">
              {currentStep < 4 ? (
                <button
                  type="button"
                  disabled={!selectedBox}
                  onClick={() => setStep((currentStep + 1) as BuilderStep)}
                  className="rounded-full bg-hala-green px-8 py-4 text-xs tracking-widest text-cream uppercase transition-colors hover:bg-deep-green disabled:opacity-30"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="button"
                  disabled={progress.current === 0}
                  onClick={handleAddToCart}
                  className="rounded-full bg-saffron px-8 py-4 text-xs tracking-widest text-deep-green uppercase transition-colors hover:bg-saffron-ring disabled:opacity-30"
                >
                  Add to cart
                </button>
              )}

              <button
                type="button"
                onClick={reset}
                className="text-xs tracking-widest text-cocoa-ink/40 uppercase hover:text-saffron"
              >
                Start over
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
