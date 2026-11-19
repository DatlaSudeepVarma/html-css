import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Line heights come from per-language CSS variables (globals.css) so Telugu glyph stacks aren't clipped.
      fontSize: {
        xs: ["0.75rem", { lineHeight: "var(--lh-text)" }],
        sm: ["0.875rem", { lineHeight: "var(--lh-text)" }],
        base: ["1rem", { lineHeight: "var(--lh-text)" }],
        lg: ["1.125rem", { lineHeight: "var(--lh-text)" }],
        xl: ["1.25rem", { lineHeight: "var(--lh-text)" }],
        "2xl": ["1.5rem", { lineHeight: "var(--lh-display)" }],
        "3xl": ["1.875rem", { lineHeight: "var(--lh-display)" }],
      },
      colors: {
        parchment: {
          light: "#F3ECDB",
          DEFAULT: "#E8DFC8",
          dark: "#D9CCAE",
          deep: "#C9B88F",
        },
        maroon: {
          light: "#8A2C2C",
          DEFAULT: "#6B1E1E",
          dark: "#4A1212",
        },
        gold: {
          light: "#D4AF6A",
          DEFAULT: "#B8893B",
          dark: "#8C6424",
        },
        brown: {
          light: "#5A3A24",
          DEFAULT: "#3B2314",
          dark: "#24150B",
        },
        lotus: {
          light: "#F6D3D3",
          DEFAULT: "#E8A3A7",
          deep: "#C96B7A",
        },
        saffron: {
          light: "#F4AE63",
          DEFAULT: "#E07B2A",
          deep: "#B85A14",
        },
      },
      fontFamily: {
        "telugu-display": ["var(--font-ramabhadra)", "var(--font-noto-serif-telugu)", "serif"],
        telugu: ["var(--font-noto-serif-telugu)", "serif"],
        decorative: ["var(--font-cinzel-decorative)", "var(--font-playfair)", "serif"],
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        script: ["var(--font-script)", "cursive"],
      },
      backgroundImage: {
        "gold-sheen":
          "linear-gradient(135deg, #8C6424 0%, #D4AF6A 25%, #F3DFA2 50%, #D4AF6A 75%, #8C6424 100%)",
        "maroon-fade": "linear-gradient(180deg, #6B1E1E 0%, #4A1212 100%)",
      },
      boxShadow: {
        card: "0 10px 40px -10px rgba(59, 35, 20, 0.45)",
        glow: "0 0 24px rgba(212, 175, 106, 0.55)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "200% center" },
          "100%": { backgroundPosition: "-200% center" },
        },
        "slow-spin": {
          to: { transform: "rotate(360deg)" },
        },
        sway: {
          "0%, 100%": { transform: "rotate(-1.5deg)" },
          "50%": { transform: "rotate(2.5deg)" },
        },
        twinkle: {
          "0%, 100%": { opacity: "0.15", transform: "scale(0.6)" },
          "50%": { opacity: "1", transform: "scale(1)" },
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 14px 2px rgba(212,175,106,0.45), inset 0 1px 0 rgba(255,244,204,0.8)" },
          "50%": { boxShadow: "0 0 36px 8px rgba(244,215,140,0.85), inset 0 1px 0 rgba(255,244,204,0.8)" },
        },
        "scroll-cue": {
          "0%, 100%": { transform: "translateY(0)", opacity: "0.55" },
          "50%": { transform: "translateY(8px)", opacity: "1" },
        },
        "flip-top": {
          from: { transform: "rotateX(0deg)" },
          to: { transform: "rotateX(-90deg)" },
        },
        "flip-bottom": {
          from: { transform: "rotateX(90deg)" },
          to: { transform: "rotateX(0deg)" },
        },
        flicker: {
          "0%, 100%": { transform: "scale(1, 1) skewX(0deg)", opacity: "0.95" },
          "25%": { transform: "scale(0.96, 1.08) skewX(-2deg)", opacity: "1" },
          "50%": { transform: "scale(1.03, 0.94) skewX(1.5deg)", opacity: "0.85" },
          "75%": { transform: "scale(0.98, 1.12) skewX(2deg)", opacity: "1" },
        },
        heartbeat: {
          "0%, 100%": { transform: "scale(1)" },
          "15%": { transform: "scale(1.25)" },
          "30%": { transform: "scale(1)" },
          "45%": { transform: "scale(1.18)" },
        },
        eq: {
          "0%, 100%": { transform: "scaleY(0.25)" },
          "50%": { transform: "scaleY(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0) rotate(-2deg)" },
          "50%": { transform: "translateY(-7%) rotate(2deg)" },
        },
      },
      animation: {
        shimmer: "shimmer 6s linear infinite",
        "slow-spin": "slow-spin 60s linear infinite",
        sway: "sway 7s ease-in-out infinite",
        twinkle: "twinkle 3.5s ease-in-out infinite",
        glow: "glow 2.6s ease-in-out infinite",
        "scroll-cue": "scroll-cue 1.8s ease-in-out infinite",
        "flip-top": "flip-top 0.28s ease-in both",
        "flip-bottom": "flip-bottom 0.28s ease-out 0.28s both",
        flicker: "flicker 1.6s ease-in-out infinite",
        heartbeat: "heartbeat 1.6s ease-in-out infinite",
        eq: "eq 0.9s ease-in-out infinite",
        float: "float 4.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
