"use client";

import { ui, type Lang } from "@/data/wedding";
import { useLanguage } from "@/hooks/useLanguage";

const OPTIONS: { lang: Lang; label: string; font: string }[] = [
  // Ramabhadra (with its Latin subset) is the only font loaded before the invitation is opened.
  { lang: "te", label: "తెలుగు", font: "font-telugu-display" },
  { lang: "en", label: "English", font: "font-telugu-display" },
];

export function LanguageToggle({ className = "" }: { className?: string }) {
  const { lang, setLang, t } = useLanguage();

  return (
    <div
      role="group"
      aria-label={t(ui.langGroupAria)}
      className={`flex rounded-full border border-gold bg-parchment-light/90 p-1 shadow-card backdrop-blur ${className}`}
    >
      {OPTIONS.map((option) => {
        const active = option.lang === lang;
        return (
          <button
            key={option.lang}
            type="button"
            lang={option.lang}
            aria-pressed={active}
            onClick={() => setLang(option.lang)}
            className={`${option.font} rounded-full px-3.5 py-1 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold ${
              active ? "bg-maroon text-[#F3DFA2] shadow-inner" : "text-maroon hover:bg-gold/15"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
