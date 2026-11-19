"use client";

import { useContext } from "react";
import { LanguageContext } from "@/components/providers/LanguageProvider";

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside <LanguageProvider>");
  return ctx;
}
