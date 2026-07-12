"use client";

import { useState, useTransition } from "react";

import { sendEnquiry } from "@/server/actions";

/**
 * The enquiry form. Wired to a Server Action — it really does save.
 *
 * Enquiries land in the `enquiries` table. Email is NOT sent, because no mail transport is
 * configured, and the confirmation below says so rather than implying a reply is on its
 * way. Read the table, or add a transport.
 */
export function ContactForm() {
  const [pending, startTransition] = useTransition();
  const [state, setState] = useState<"idle" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const element = event.currentTarget;
    const form = new FormData(element);

    startTransition(async () => {
      const result = await sendEnquiry({
        name: String(form.get("name") ?? ""),
        email: String(form.get("email") ?? ""),
        message: String(form.get("message") ?? ""),
        company: String(form.get("company") ?? ""),
      });

      if (result.ok) {
        setState("sent");
        element.reset();
        return;
      }

      setState("error");
      setMessage(result.message);
    });
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <fieldset disabled={pending} className="flex flex-col gap-6">
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
            htmlFor="email"
            className="text-xs tracking-widest text-cocoa-ink/55 uppercase"
          >
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

        {/*
          Honeypot. A real person never sees this and never fills it; most naive bots fill
          every input they find, and the server silently rejects anything that arrives with
          it set. Cheaper and far less hostile than a CAPTCHA, and it costs the user nothing.

          `aria-hidden` + `tabIndex={-1}` keep it out of the tab order and away from screen
          readers — otherwise the honeypot becomes a trap for exactly the people that a
          CAPTCHA already fails.
        */}
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden
          className="sr-only"
        />
      </fieldset>

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-full bg-hala-green px-8 py-4 text-xs tracking-widest text-cream uppercase transition-colors hover:bg-deep-green disabled:opacity-40"
      >
        {pending ? "Sending…" : "Send enquiry"}
      </button>

      {state === "sent" ? (
        <p
          role="status"
          className="rounded-lg border border-hala-green/40 bg-hala-green/5 p-4 text-sm"
        >
          Got it — your enquiry is saved. We do not send an automatic email yet, so if it is
          urgent, call the shop and we will pick it up straight away.
        </p>
      ) : null}

      {state === "error" ? (
        <p
          role="alert"
          className="rounded-lg border border-saffron/50 bg-saffron/10 p-4 text-sm"
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
