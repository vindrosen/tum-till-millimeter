"use client";

import { useCallback, useEffect, useState } from "react";

/** Läser/skriver JSON-serialiserbart värde till localStorage, SSR-säkert. */
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) setValue(JSON.parse(raw) as T);
    } catch {
      /* ignorera trasig data */
    }
    setHydrated(true);
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* full lagring – ignorera */
    }
  }, [key, value, hydrated]);

  return [value, setValue, hydrated] as const;
}

/** Enkel lista med unika strängar (favoriter/historik) med max-längd. */
export function useStringList(key: string, max = 20) {
  const [list, setList, hydrated] = useLocalStorage<string[]>(key, []);

  const add = useCallback(
    (item: string) => {
      setList((prev) => {
        const utan = prev.filter((x) => x !== item);
        return [item, ...utan].slice(0, max);
      });
    },
    [setList, max],
  );

  const remove = useCallback(
    (item: string) => setList((prev) => prev.filter((x) => x !== item)),
    [setList],
  );

  const toggle = useCallback(
    (item: string) => {
      setList((prev) =>
        prev.includes(item)
          ? prev.filter((x) => x !== item)
          : [item, ...prev].slice(0, max),
      );
    },
    [setList, max],
  );

  const clear = useCallback(() => setList([]), [setList]);

  return { list, add, remove, toggle, clear, hydrated };
}

/** True först efter mount – för att undvika hydration-mismatch. */
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
