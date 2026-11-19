import { wedding, type Lang, type WeddingEvent } from "@/data/wedding";

const CRLF = "\r\n";

/** 20261203T153600Z */
const toUtcStamp = (date: Date) => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

const escapeText = (value: string) =>
  value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");

/** RFC 5545 caps lines at 75 octets; Telugu is 3 bytes per code unit, so fold by bytes, never mid-character. */
function fold(line: string): string {
  const encoder = new TextEncoder();
  const parts: string[] = [];
  let current = "";
  let bytes = 0;
  for (const char of line) {
    const size = encoder.encode(char).length;
    const limit = parts.length === 0 ? 75 : 74;
    if (bytes + size > limit) {
      parts.push(current);
      current = "";
      bytes = 0;
    }
    current += char;
    bytes += size;
  }
  parts.push(current);
  return parts.join(`${CRLF} `);
}

function eventLines(event: WeddingEvent, lang: Lang, stamp: string): string[] {
  const start = new Date(event.dateTime);
  const end = new Date(start.getTime() + event.durationMinutes * 60_000);
  const { venue, calendar } = wedding;
  // English regardless of `lang`: calendar apps geocode this field.
  const location = [venue.name.en, ...venue.addressLines.map((l) => l.en)].join(", ");

  return [
    "BEGIN:VEVENT",
    `UID:${event.id}-20261203@datla-wedding`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${toUtcStamp(start)}`,
    `DTEND:${toUtcStamp(end)}`,
    `SUMMARY:${escapeText(`${calendar.eventPrefix[lang]} — ${event.title[lang]}`)}`,
    `DESCRIPTION:${escapeText(`${calendar.description[lang]}\n${venue.mapsUrl}`)}`,
    `LOCATION:${escapeText(location)}`,
    `URL:${venue.mapsUrl}`,
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escapeText(event.title[lang])}`,
    "TRIGGER:-PT3H",
    "END:VALARM",
    "END:VEVENT",
  ];
}

/** Both events in one calendar file, with times stored in UTC so every client shows the correct local time. */
export function buildWeddingIcs(lang: Lang): string {
  const stamp = toUtcStamp(new Date());
  const { vindhu, muhurtham } = wedding.events;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Datla Wedding//Invitation//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    ...eventLines(vindhu, lang, stamp),
    ...eventLines(muhurtham, lang, stamp),
    "END:VCALENDAR",
  ];
  return lines.map(fold).join(CRLF) + CRLF;
}
