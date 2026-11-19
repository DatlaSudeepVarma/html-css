"use client";

import { ui, wedding } from "@/data/wedding";
import { useLanguage } from "@/hooks/useLanguage";

const PILL =
  "font-heading inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-base shadow-glow transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-light active:scale-95 sm:text-lg";

export function AddToCalendarButton({ className = "" }: { className?: string }) {
  const { lang, t } = useLanguage();
  return (
    <a
      href={`/api/calendar?lang=${lang}`}
      download="datla-wedding.ics"
      className={`${PILL} border-2 border-[#F3DFA2] bg-gradient-to-b from-[#F6E3A8] via-gold to-gold-dark text-maroon-dark ${className}`}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
        <path
          d="M7 2v2H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2H7Zm-2 7h14v10H5V9Zm6 2v2.5H8.5v2H11V18h2v-2.5h2.5v-2H13V11h-2Z"
          fill="currentColor"
        />
      </svg>
      {t(ui.addToCalendar)}
    </a>
  );
}

export function WhatsAppShareButton({ className = "" }: { className?: string }) {
  const { t } = useLanguage();

  const share = () => {
    const url = process.env.NEXT_PUBLIC_SITE_URL || window.location.href.split("#")[0];
    const text = `${t(wedding.share.message)}\n${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <button type="button" onClick={share} className={`${PILL} border-2 border-[#9BE7B4] bg-[#1F7A4A] text-white ${className}`}>
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
        <path
          d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.2-.2-.5-.3Z"
          fill="currentColor"
        />
      </svg>
      {t(ui.shareWhatsApp)}
    </button>
  );
}
