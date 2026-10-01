"use client";

import { useSyncExternalStore } from "react";

// Google Maps sets its own cookies, so the map only loads once the visitor says yes.
// The choice is kept in this browser only and can be changed on the cookies page.
const KEY = "fcm-maps-consent";
const EVENT = "fcm-consent";
let session: boolean | null = null; // used when the browser blocks storage

function read() {
  if (session !== null) return session;
  try {
    return localStorage.getItem(KEY) === "yes";
  } catch {
    return false;
  }
}

function subscribe(onChange: () => void) {
  const fromOtherTab = (e: StorageEvent) => {
    if (e.key !== KEY && e.key !== null) return;
    session = null;
    onChange();
  };
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", fromOtherTab);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", fromOtherTab);
  };
}

export function setMapsConsent(allowed: boolean) {
  session = allowed;
  try {
    if (allowed) localStorage.setItem(KEY, "yes");
    else localStorage.removeItem(KEY);
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

/** True once this browser has agreed to load Google Maps. */
export const useMapsConsent = () => useSyncExternalStore(subscribe, read, () => false);
