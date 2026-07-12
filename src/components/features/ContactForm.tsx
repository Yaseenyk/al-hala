"use client";

import { useState } from "react";

/**
 * The enquiry form.
 *
 * ⚠️ NOT WIRED. There is no mail transport, no form backend, and no spam protection —
 * those decisions are downstream of the commerce/CMS choice that is still open.
 *
 * It therefore does NOT pretend to submit. A form that shows a green "thanks, we'll be in
 * touch!" and drops the message on the floor is worse than no form at all: the customer
 * believes they have contacted you and then thinks you ignored them.
 *
 * Instead it says plainly that it is not live, and points at the phone. When a transport
 * lands, `onSubmit` becomes a Server Action and nothing else here changes.
 */
export function ContactForm() {
  const [sent, setSent] = useState(false);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setSent(true);
      }}
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-xs tracking-widest text-cocoa-ink/55 uppercase">
          Your name
        </label>
        <input
          id="name"
          name="name"
          required
          autoComplete="name"
          className="rounded-lg border border-cocoa-ink/15 bg-transparent p-4 focus:border-saffron"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-xs tracking-widest text-cocoa-ink/55 uppercase">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="rounded-lg border border-cocoa-ink/15 bg-transparent p-4 focus:border-saffron"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-xs tracking-widest text-cocoa-ink/55 uppercase">
          What do you need?
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          placeholder="Two hundred favours for a nikah in November."
          className="rounded-lg border border-cocoa-ink/15 bg-transparent p-4 focus:border-saffron"
        />
      </div>

      <button
        type="submit"
        className="self-start rounded-full bg-hala-green px-8 py-4 text-xs tracking-widest text-cream uppercase transition-colors hover:bg-deep-green"
      >
        Send enquiry
      </button>

      {sent ? (
        <p role="status" className="rounded-lg border border-saffron/40 bg-saffron/10 p-4 text-sm">
          This form is not connected yet — nothing was sent, and we would rather tell you
          than let you believe otherwise. Please call the shop and we will take it from there.
        </p>
      ) : null}
    </form>
  );
}
