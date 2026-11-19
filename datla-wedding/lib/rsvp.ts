import type { ui } from "@/data/wedding";

export const NAME_MIN = 2;
export const NAME_MAX = 60;
export const GUESTS_MAX = 20;
export const MESSAGE_MAX = 500;

export interface RsvpInput {
  name: string;
  attending: boolean;
  /** 0 when not attending. */
  guests: number;
  message: string;
}

/** Each error is a key of `ui`, so the client can show it in the current language. */
export type RsvpErrors = Partial<Record<keyof RsvpInput, keyof typeof ui>>;

export type RsvpResult = { ok: true; data: RsvpInput } | { ok: false; errors: RsvpErrors };

/** Shared by the form and the API route; accepts untrusted input. */
export function validateRsvp(raw: unknown): RsvpResult {
  const input = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const errors: RsvpErrors = {};

  const name = typeof input.name === "string" ? input.name.trim().replace(/\s+/g, " ") : "";
  if (!name) errors.name = "errNameRequired";
  else if (name.length < NAME_MIN || name.length > NAME_MAX) errors.name = "errNameLength";

  const attending = input.attending;
  if (typeof attending !== "boolean") errors.attending = "errAttending";

  const guests = Number(input.guests);
  if (attending === true && (!Number.isInteger(guests) || guests < 1 || guests > GUESTS_MAX)) {
    errors.guests = "errGuests";
  }

  const message = typeof input.message === "string" ? input.message.trim() : "";
  if (message.length > MESSAGE_MAX) errors.message = "errMessage";

  if (Object.keys(errors).length) return { ok: false, errors };
  return { ok: true, data: { name, attending: attending as boolean, guests: attending ? guests : 0, message } };
}
