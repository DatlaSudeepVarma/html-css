"use client";

import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { DEFAULT_LANG, LANGS, type Lang, type Localized } from "@/data/wedding";

const STORAGE_KEY = "datla-wedding:lang";

export interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  t: (value: Localized) => string;
}

export const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (stored && LANGS.includes(stored)) setLangState(stored);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  // Persist only on explicit choice: writing from an effect would overwrite the stored value with the default on mount.
  const setLang = useCallback((next: Lang) => {
    window.localStorage.setItem(STORAGE_KEY, next);
    setLangState(next);
  }, []);
  const toggleLang = useCallback(() => {
    setLangState((current) => {
      const next = current === "te" ? "en" : "te";
      window.localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);
  const t = useCallback((value: Localized) => value[lang], [lang]);

  const value = useMemo(() => ({ lang, setLang, toggleLang, t }), [lang, setLang, toggleLang, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
