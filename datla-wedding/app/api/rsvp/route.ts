import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { validateRsvp, type RsvpInput } from "@/lib/rsvp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FILE = process.env.RSVP_FILE ?? path.join(process.cwd(), ".data", "rsvps.json");
const WEBHOOK = process.env.RSVP_WEBHOOK_URL;

type Entry = RsvpInput & { submittedAt: string };

// Serialises read-modify-write so concurrent submissions in this process can't drop entries.
let queue: Promise<unknown> = Promise.resolve();

async function appendToFile(entry: Entry) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  let entries: Entry[] = [];
  try {
    entries = JSON.parse(await fs.readFile(FILE, "utf8"));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  entries.push(entry);
  const tmp = `${FILE}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(entries, null, 2), "utf8");
  await fs.rename(tmp, FILE);
}

async function sendToWebhook(entry: Entry) {
  const res = await fetch(WEBHOOK!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entry),
  });
  if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  // Honeypot: real visitors never see or fill this field.
  if (typeof body.website === "string" && body.website) return NextResponse.json({ ok: true });

  const result = validateRsvp(body);
  if (!result.ok) return NextResponse.json({ ok: false, errors: result.errors }, { status: 400 });

  const entry: Entry = { ...result.data, submittedAt: new Date().toISOString() };
  try {
    const task = queue.then(() => (WEBHOOK ? sendToWebhook(entry) : appendToFile(entry)));
    queue = task.catch(() => {});
    await task;
  } catch (error) {
    console.error("[rsvp] failed to save", error);
    return NextResponse.json({ ok: false, error: "save_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
