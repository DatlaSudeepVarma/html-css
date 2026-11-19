"use client";

import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { AddToCalendarButton, WhatsAppShareButton } from "@/components/InviteActions";
import { GoldDivider } from "@/components/ornaments/GoldDivider";
import { PetalConfetti } from "@/components/ornaments/PetalConfetti";
import { SectionTitle } from "@/components/ornaments/SectionTitle";
import { ui, wedding } from "@/data/wedding";
import { useLanguage } from "@/hooks/useLanguage";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { MOTION_OK, scrollReveal, useScrollAnimation } from "@/lib/gsap";
import { GUESTS_MAX, MESSAGE_MAX, NAME_MAX, validateRsvp, type RsvpErrors } from "@/lib/rsvp";

type Status = "idle" | "submitting" | "done" | "failed";

const INPUT =
  "font-body w-full rounded-xl border border-gold/60 bg-white/70 px-4 py-2.5 text-base text-brown placeholder:text-brown/40 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/40 aria-[invalid=true]:border-maroon-light";

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="font-body mb-1.5 block text-sm font-semibold text-maroon">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="font-body mt-1 text-sm text-maroon-light">
          {error}
        </p>
      )}
    </div>
  );
}

export function Rsvp() {
  const { t } = useLanguage();
  const reducedMotion = usePrefersReducedMotion();
  const root = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [name, setName] = useState("");
  const [attending, setAttending] = useState<boolean | null>(null);
  const [guests, setGuests] = useState("1");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<RsvpErrors>({});
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [celebrate, setCelebrate] = useState(0);

  useScrollAnimation(
    root,
    ({ gsap }) => {
      gsap.matchMedia().add(MOTION_OK, () => {
        gsap
          .timeline({ scrollTrigger: scrollReveal(root.current, { start: "top 75%", end: "top 15%", scrub: 1 }) })
          .from(".rs-item", { opacity: 0, y: 36, stagger: 0.15 });
      });
    },
  );

  const values = () => ({ name, attending, guests: Number(guests), message, website });

  const revalidate = (next: Partial<ReturnType<typeof values>>) => {
    if (!attempted) return;
    const result = validateRsvp({ ...values(), ...next });
    setErrors(result.ok ? {} : result.errors);
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setAttempted(true);
    const result = validateRsvp(values());
    if (!result.ok) {
      setErrors(result.errors);
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>("[aria-invalid='true']")?.focus());
      return;
    }
    setErrors({});
    setStatus("submitting");
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...result.data, website }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (body.errors) setErrors(body.errors);
        setStatus("failed");
        return;
      }
      setStatus("done");
      setCelebrate((n) => n + 1);
    } catch {
      setStatus("failed");
    }
  };

  const reset = () => {
    setName("");
    setAttending(null);
    setGuests("1");
    setMessage("");
    setErrors({});
    setAttempted(false);
    setStatus("idle");
  };

  const err = (key: keyof RsvpErrors) => (errors[key] ? t(ui[errors[key]!]) : undefined);
  const stepGuests = (delta: number) => {
    const next = String(Math.min(GUESTS_MAX, Math.max(1, (Number(guests) || 0) + delta)));
    setGuests(next);
    revalidate({ guests: Number(next) });
  };

  return (
    <section ref={root} id="rsvp" data-bg="#350B0B" className="relative">
      <div className="relative flex min-h-[100svh] flex-col items-center justify-center px-[calc(var(--frame-width)+1.25rem)] py-[calc(var(--frame-width)+3rem)]">
        <SectionTitle title={wedding.rsvp.title} subtitle={wedding.rsvp.subtitle} tone="light" className="rs-item max-w-2xl" />

        <div className="rs-item mt-7 flex flex-wrap items-center justify-center gap-3">
          <AddToCalendarButton />
          <WhatsAppShareButton />
        </div>

        <div className="rs-item relative mt-8 w-full max-w-xl overflow-hidden rounded-3xl border-2 border-gold bg-parchment-light/95 p-6 text-left shadow-[0_20px_60px_rgba(0,0,0,0.45)] sm:p-8">
          {status === "done" ? (
              <div
                className="py-8 text-center motion-safe:animate-[fade-in_0.5s_ease]"
                role="status"
              >
                <p className="font-heading text-shimmer-gold text-[clamp(2.25rem,8vw,3.5rem)] leading-[1.5]">{t(wedding.rsvp.thanks)}</p>
                <GoldDivider className="mx-auto my-4 max-w-[12rem]" />
                <p className="font-body text-lg text-brown/85">
                  {t(attending ? wedding.rsvp.thanksAttending : wedding.rsvp.thanksDeclined)}
                </p>
                <button type="button" onClick={reset} className="font-body mt-6 text-sm text-maroon underline underline-offset-4 hover:text-maroon-light">
                  {t(ui.rsvpAgain)}
                </button>
              </div>
            ) : (
              <form
                ref={formRef}
                noValidate
                onSubmit={onSubmit}
                className="space-y-5"
              >
                <Field id="rsvp-name" label={t(ui.rsvpName)} error={err("name")}>
                  <input
                    id="rsvp-name"
                    name="name"
                    autoComplete="name"
                    maxLength={NAME_MAX + 10}
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      revalidate({ name: e.target.value });
                    }}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "rsvp-name-error" : undefined}
                    className={INPUT}
                  />
                </Field>

                <fieldset aria-invalid={!!errors.attending} aria-describedby={errors.attending ? "rsvp-attending-error" : undefined} tabIndex={-1} className="focus:outline-none">
                  <legend className="font-body mb-1.5 text-sm font-semibold text-maroon">{t(ui.rsvpAttending)}</legend>
                  <div className="grid grid-cols-2 gap-3">
                    {([true, false] as const).map((value) => (
                      <label key={String(value)} className="cursor-pointer">
                        <input
                          type="radio"
                          name="attending"
                          className="peer sr-only"
                          checked={attending === value}
                          onChange={() => {
                            setAttending(value);
                            revalidate({ attending: value });
                          }}
                        />
                        <span className="font-body flex h-full items-center justify-center rounded-xl border border-gold/60 bg-white/60 px-3 py-2.5 text-center text-sm text-brown transition-colors peer-checked:border-maroon peer-checked:bg-maroon peer-checked:text-[#F3DFA2] peer-focus-visible:ring-2 peer-focus-visible:ring-gold sm:text-base">
                          {value ? "🙏 " : ""}
                          {t(value ? ui.rsvpYes : ui.rsvpNo)}
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors.attending && (
                    <p id="rsvp-attending-error" className="font-body mt-1 text-sm text-maroon-light">
                      {err("attending")}
                    </p>
                  )}
                </fieldset>

                {attending && (
                  <Field id="rsvp-guests" label={t(ui.rsvpGuests)} error={err("guests")}>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => stepGuests(-1)} aria-label="−1" className="h-11 w-11 shrink-0 rounded-xl border border-gold/60 bg-white/60 text-xl text-maroon hover:bg-gold/15">
                        −
                      </button>
                      <input
                        id="rsvp-guests"
                        name="guests"
                        type="number"
                        inputMode="numeric"
                        min={1}
                        max={GUESTS_MAX}
                        value={guests}
                        onChange={(e) => {
                          setGuests(e.target.value);
                          revalidate({ guests: Number(e.target.value) });
                        }}
                        aria-invalid={!!errors.guests}
                        aria-describedby={errors.guests ? "rsvp-guests-error" : undefined}
                        className={`${INPUT} text-center tabular-nums [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none`}
                      />
                      <button type="button" onClick={() => stepGuests(1)} aria-label="+1" className="h-11 w-11 shrink-0 rounded-xl border border-gold/60 bg-white/60 text-xl text-maroon hover:bg-gold/15">
                        +
                      </button>
                    </div>
                  </Field>
                )}

                <Field id="rsvp-message" label={t(ui.rsvpMessage)} error={err("message")}>
                  <textarea
                    id="rsvp-message"
                    name="message"
                    rows={3}
                    data-lenis-prevent
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      revalidate({ message: e.target.value });
                    }}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? "rsvp-message-error" : undefined}
                    className={`${INPUT} resize-none`}
                  />
                  <p className={`font-body mt-1 text-right text-xs tabular-nums ${message.trim().length > MESSAGE_MAX ? "text-maroon-light" : "text-brown/50"}`}>
                    {message.trim().length}/{MESSAGE_MAX}
                  </p>
                </Field>

                {/* Honeypot: hidden from people and assistive tech, often filled by bots. */}
                <input
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="absolute -left-[9999px] h-px w-px opacity-0"
                />

                {status === "failed" && (
                  <p role="alert" className="font-body rounded-lg bg-maroon/10 px-3 py-2 text-sm text-maroon">
                    {t(ui.rsvpFailed)}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="font-heading w-full rounded-full border-2 border-[#F3DFA2] bg-gradient-to-b from-[#F6E3A8] via-gold to-gold-dark px-6 py-3 text-lg text-maroon-dark shadow-glow transition-transform hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold active:scale-[0.98] disabled:cursor-wait disabled:opacity-70"
                >
                  {t(status === "submitting" ? ui.rsvpSubmitting : ui.rsvpSubmit)}
                </button>
              </form>
            )}
        </div>
      </div>

      {celebrate > 0 && !reducedMotion && <PetalConfetti key={celebrate} />}
    </section>
  );
}
