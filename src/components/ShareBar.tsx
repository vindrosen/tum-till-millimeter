"use client";

import { useEffect, useState } from "react";
import { BookmarkIcon, CheckIcon, ShareIcon } from "./Icons";
import { site } from "@/lib/site";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function ShareBar() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [hint, setHint] = useState(false);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    const installedHandler = () => setInstalled(true);
    window.addEventListener("appinstalled", installedHandler);
    if (window.matchMedia("(display-mode: standalone)").matches) setInstalled(true);
    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, []);

  async function install() {
    if (deferred) {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      if (choice.outcome === "accepted") setInstalled(true);
      setDeferred(null);
    } else {
      setHint((v) => !v);
    }
  }

  async function share() {
    const data = {
      title: site.name,
      text: "Tum eller mm? Här ser du vad det egentligen är.",
      url: site.url,
    };
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(data);
      } catch {
        /* avbruten – ignorera */
      }
    } else {
      try {
        await navigator.clipboard.writeText(site.url);
        setShared(true);
        window.setTimeout(() => setShared(false), 1800);
      } catch {
        /* ignorera */
      }
    }
  }

  return (
    <div className="relative flex flex-wrap gap-2.5">
      {!installed && (
        <button
          type="button"
          onClick={install}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-bold text-ink transition-colors hover:border-brand/40 hover:text-brand"
        >
          <BookmarkIcon width={18} height={18} />
          Spara till hemskärmen
        </button>
      )}

      <button
        type="button"
        onClick={share}
        className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-bold text-ink transition-colors hover:border-brand/40 hover:text-brand"
      >
        {shared ? <CheckIcon width={18} height={18} /> : <ShareIcon width={18} height={18} />}
        {shared ? "Länk kopierad!" : "Dela appen"}
      </button>

      {hint && (
        <div
          role="status"
          className="absolute bottom-full left-0 mb-2 w-72 rounded-xl border border-border bg-card p-3 text-sm text-ink-soft shadow-lg"
        >
          Öppna webbläsarens meny och välj <b>”Lägg till på hemskärmen”</b> för att installera
          appen. På iPhone: tryck på <b>Dela</b>-ikonen och sedan <b>Lägg till på hemskärmen</b>.
        </div>
      )}
    </div>
  );
}
