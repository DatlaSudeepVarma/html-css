import { buildWeddingIcs } from "@/lib/ics";
import { DEFAULT_LANG, LANGS, type Lang } from "@/data/wedding";

export function GET(request: Request) {
  const param = new URL(request.url).searchParams.get("lang") as Lang | null;
  const lang = param && LANGS.includes(param) ? param : DEFAULT_LANG;

  return new Response(buildWeddingIcs(lang), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="datla-wedding.ics"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}
