"use client";

import { useSyncExternalStore } from "react";

let opened = false;
const listeners = new Set<() => void>();

/**
 * Sections build their ScrollTriggers only after the doors open: the page is scroll-locked until then, and
 * measuring every pinned section during hydration was the main source of blocking time on phones.
 */
export function markInvitationOpened() {
  if (opened) return;
  opened = true;
  document.documentElement.classList.add("invitation-opened");
  listeners.forEach((listener) => listener());
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export function useInvitationOpened() {
  return useSyncExternalStore(subscribe, () => opened, () => false);
}
