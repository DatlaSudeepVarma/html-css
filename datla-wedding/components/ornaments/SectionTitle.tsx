"use client";

import type { Localized } from "@/data/wedding";
import { useLanguage } from "@/hooks/useLanguage";
import { GoldDivider } from "./GoldDivider";

interface SectionTitleProps {
  title: Localized | string;
  subtitle?: Localized | string;
  as?: "h1" | "h2" | "h3";
  align?: "center" | "left";
  divider?: boolean;
  /** Use "light" on maroon / dark backgrounds. */
  tone?: "dark" | "light";
  className?: string;
}

function Swash({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 40 20"
      className={`hidden h-4 w-8 shrink-0 sm:block sm:h-5 sm:w-10 ${flip ? "-scale-x-100" : ""}`}
      aria-hidden
    >
      <path
        d="M38 10 C30 2 20 2 16 8 C13 13 19 16 21 12 C23 8 16 6 12 10 C8 14 4 13 2 10"
        fill="none"
        stroke="#B8893B"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <circle cx="38" cy="10" r="1.6" fill="#B8893B" />
    </svg>
  );
}

export function SectionTitle({
  title,
  subtitle,
  as: Tag = "h2",
  align = "center",
  divider = true,
  tone = "dark",
  className = "",
}: SectionTitleProps) {
  const light = tone === "light";
  const { t } = useLanguage();
  const resolve = (v: Localized | string) => (typeof v === "string" ? v : t(v));
  const centered = align === "center";

  return (
    <div className={`${centered ? "text-center" : "text-left"} ${className}`}>
      <div className={`flex items-center gap-3 ${centered ? "justify-center" : ""}`}>
        {centered && <Swash />}
        <Tag
          className={`font-heading py-[0.2em] text-3xl leading-[1.45] sm:text-4xl lg:text-5xl ${
            light ? "text-shimmer-gold-light" : "text-shimmer-gold"
          }`}
        >
          {resolve(title)}
        </Tag>
        {centered && <Swash flip />}
      </div>
      {divider && <GoldDivider className={`mt-2 ${centered ? "mx-auto max-w-xs" : "max-w-[14rem]"}`} />}
      {subtitle && (
        <p className={`font-body mt-3 text-base sm:text-lg ${light ? "text-parchment-light/90" : "text-maroon/90"}`}>
          {resolve(subtitle)}
        </p>
      )}
    </div>
  );
}
