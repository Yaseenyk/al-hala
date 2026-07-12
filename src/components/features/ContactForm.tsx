"use client";

import { useState } from "react";

import { enquiryMessage, isWhatsappConfigured, waLink } from "@/lib/whatsapp";

/**
 * The enquiry form — WhatsApp handoff.
 *
 * No server (static export), so there is nothing to POST to. Submitting opens WhatsApp with
 * the enquiry already written out.
 *
 * The honeypot that used to live here is GONE, deliberately. It existed to protect a
 * database from bots. There is no database and no endpoint now: the form does not submit
 * anywhere, it just composes a message the human then sends themselves. A spam trap
 * guarding nothing is code that has to be maintained and read forever for no reason.
 */
export function ContactForm() {
  const [error, setError] = useState<string | null>(null);
  const configured = isWhatsappConfigured();

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!configured) {
      setError("Messaging is not switched on yet. Please call the shop.");
      return;
    }

    const form = new FormData(event.currentTarget);

    window.location.href = waLink(
      enquiryMessage({
        name: String(form.get("name") ?? ""),
        message: String(form.get("message") ?? ""),
      }),
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <fieldset className="flex flex-col gap-6">
        <legend className="sr-only">Enquiry</legend>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="name"
            className="text-xs tracking-widest text-cocoa-ink/55 uppercase"
          >
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
          <label
            htmlFor="message"
            className="text-xs tracking-widest text-cocoa-ink/55 uppercase"
          >
            What do you need?
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            required
            minLength={10}
            placeholder="Two hundred favours for a nikah in November."
            className="rounded-lg border border-cocoa-ink/15 bg-transparent p-4 focus:border-saffron"
          />
        </div>
      </fieldset>

      {!configured ? (
        <p
          role="alert"
          className="rounded-lg border border-saffron/50 bg-saffron/10 p-4 text-sm"
        >
          Messaging is not switched on yet — the shop’s WhatsApp number has not been added to
          the site. Please call us instead.
        </p>
      ) : null}

      {error ? (
        <p
          role="alert"
          className="rounded-lg border border-saffron/50 bg-saffron/10 p-4 text-sm"
        >
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        className="self-start rounded-full bg-hala-green px-8 py-4 text-xs tracking-widest text-cream uppercase transition-colors hover:bg-deep-green"
      >
        Send on WhatsApp
      </button>

      <p className="text-xs text-cocoa-ink/40">
        This opens WhatsApp with your message ready to send. We reply during shop hours.
      </p>
    </form>
  );
}
