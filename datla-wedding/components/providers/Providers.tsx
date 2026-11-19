"use client";

import type { ReactNode } from "react";
import { LanguageProvider } from "./LanguageProvider";
import { SmoothScrollProvider } from "./SmoothScrollProvider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <SmoothScrollProvider>{children}</SmoothScrollProvider>
    </LanguageProvider>
  );
}
