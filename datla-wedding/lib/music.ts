const VOLUME = 0.45;
const PREF_KEY = "datla-wedding:music";

let audio: HTMLAudioElement | null = null;
const listeners = new Set<(playing: boolean) => void>();

function ensureAudio(src: string) {
  if (typeof window === "undefined") return null;
  if (!audio) {
    audio = new Audio(src);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = VOLUME;
    audio.addEventListener("play", () => listeners.forEach((l) => l(true)));
    audio.addEventListener("pause", () => listeners.forEach((l) => l(false)));
  }
  return audio;
}

/** Must run inside the Open Invitation click so the browser allows playback. */
export function startWeddingMusic(src: string) {
  const a = ensureAudio(src);
  if (!a) return;
  window.localStorage.removeItem(PREF_KEY);
  a.play().catch(() => {});
}

export function toggleWeddingMusic(src: string): boolean {
  const a = ensureAudio(src);
  if (!a) return false;
  if (a.paused) {
    window.localStorage.removeItem(PREF_KEY);
    a.play().catch(() => {});
    return true;
  }
  a.pause();
  window.localStorage.setItem(PREF_KEY, "off");
  return false;
}

export function subscribeMusic(listener: (playing: boolean) => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function isMusicPlaying() {
  return Boolean(audio && !audio.paused);
}

export function pauseWeddingMusic() {
  audio?.pause();
}

export const MUSIC_PREF_KEY = PREF_KEY;
