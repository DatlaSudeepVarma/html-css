"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LotusIcon } from "@/components/ornaments/LotusIcon";
import { ui } from "@/data/wedding";
import { useLanguage } from "@/hooks/useLanguage";

const PREF_KEY = "datla-wedding:music";
const VOLUME = 0.45;
const FADE_MS = 1200;
// Only these count as user activation for autoplay; pointerdown does not on touch devices.
const UNLOCK_EVENTS = ["click", "touchend", "keydown"] as const;
const BARS = [
  { rest: 0.35, duration: "0.9s", delay: "-0.2s" },
  { rest: 0.6, duration: "0.7s", delay: "-0.5s" },
  { rest: 0.45, duration: "1.1s", delay: "-0.1s" },
  { rest: 0.7, duration: "0.8s", delay: "-0.35s" },
];

export function MusicToggle({ src }: { src: string }) {
  const { t } = useLanguage();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef = useRef(0);
  /** Whether the visitor wants music, independent of tab visibility. */
  const wantRef = useRef(false);
  /** Cleared once the toggle has been used, so the first-tap autoplay never overrides a choice. */
  const armedRef = useRef(true);
  const [playing, setPlaying] = useState(false);

  const getAudio = useCallback(() => {
    if (!audioRef.current) {
      const audio = new Audio(src);
      audio.loop = true;
      audio.preload = "auto";
      audio.volume = 0;
      audio.addEventListener("play", () => setPlaying(true));
      audio.addEventListener("pause", () => setPlaying(false));
      audioRef.current = audio;
    }
    return audioRef.current;
  }, [src]);

  const fadeTo = useCallback((audio: HTMLAudioElement, target: number, done?: () => void) => {
    cancelAnimationFrame(fadeRef.current);
    const from = audio.volume;
    const start = performance.now();
    const step = (now: number) => {
      const k = Math.min(1, (now - start) / FADE_MS);
      audio.volume = from + (target - from) * k;
      if (k < 1) fadeRef.current = requestAnimationFrame(step);
      else done?.();
    };
    fadeRef.current = requestAnimationFrame(step);
  }, []);

  const play = useCallback(() => {
    const audio = getAudio();
    wantRef.current = true;
    audio
      .play()
      .then(() => fadeTo(audio, VOLUME))
      .catch(() => {
        wantRef.current = false;
      });
  }, [getAudio, fadeTo]);

  const pause = useCallback(
    (remember: boolean) => {
      const audio = audioRef.current;
      if (remember) wantRef.current = false;
      if (audio && !audio.paused) fadeTo(audio, 0, () => audio.pause());
    },
    [fadeTo],
  );

  useEffect(() => {
    if (window.localStorage.getItem(PREF_KEY) === "off") return;
    const remove = () => UNLOCK_EVENTS.forEach((e) => window.removeEventListener(e, onFirstGesture, true));
    function onFirstGesture(event: Event) {
      if ((event.target as Element | null)?.closest?.("[data-music-toggle]")) return;
      remove();
      if (armedRef.current) play();
    }
    UNLOCK_EVENTS.forEach((e) => window.addEventListener(e, onFirstGesture, true));
    return remove;
  }, [play]);

  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) pause(false);
      else if (wantRef.current) play();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [play, pause]);

  useEffect(
    () => () => {
      cancelAnimationFrame(fadeRef.current);
      audioRef.current?.pause();
    },
    [],
  );

  const toggle = () => {
    armedRef.current = false;
    if (wantRef.current) {
      pause(true);
      window.localStorage.setItem(PREF_KEY, "off");
    } else {
      play();
      window.localStorage.removeItem(PREF_KEY);
    }
  };

  return (
    <button
      type="button"
      data-music-toggle
      onClick={toggle}
      aria-pressed={playing}
      aria-label={t(playing ? ui.musicPause : ui.musicPlay)}
      title={t(playing ? ui.musicPause : ui.musicPlay)}
      className="fixed bottom-[calc(var(--frame-width)+1rem+var(--safe-bottom))] right-[calc(var(--frame-width)+1rem+var(--safe-right))] z-50 flex h-12 items-center gap-2.5 rounded-full border border-gold bg-parchment-light/90 pl-1.5 pr-4 shadow-card backdrop-blur transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold active:scale-95"
    >
      <span className={`grid h-9 w-9 place-items-center rounded-full bg-maroon ring-1 ring-gold-light ${playing ? "shadow-glow" : ""}`}>
        <LotusIcon className={`h-7 w-7 transition-opacity ${playing ? "motion-safe:animate-sway" : "opacity-70"}`} />
      </span>
      <span className="flex h-5 items-end gap-[3px]" aria-hidden>
        {BARS.map((bar, i) => (
          <span
            key={i}
            className={`h-full w-[3px] origin-bottom rounded-full bg-gold-dark transition-transform ${playing ? "motion-safe:animate-eq" : ""}`}
            style={{ transform: `scaleY(${playing ? bar.rest : 0.2})`, animationDuration: bar.duration, animationDelay: bar.delay }}
          />
        ))}
      </span>
    </button>
  );
}
