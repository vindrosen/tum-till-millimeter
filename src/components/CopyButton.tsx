"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon } from "./Icons";

interface CopyButtonProps {
  value: string;
  label?: string;
  className?: string;
  compact?: boolean;
}

export default function CopyButton({
  value,
  label = "Kopiera",
  className = "",
  compact = false,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      /* fallback nedan */
      const ta = document.createElement("textarea");
      ta.value = value;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } catch {
        /* ignorera */
      }
      document.body.removeChild(ta);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Kopierat" : `${label} ${value}`}
      className={`inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm font-semibold transition-colors ${
        copied
          ? "border-brand/40 bg-brand-soft text-brand"
          : "bg-card text-ink-soft hover:bg-card-muted hover:text-brand"
      } ${className}`}
    >
      {copied ? <CheckIcon width={16} height={16} /> : <CopyIcon width={16} height={16} />}
      {!compact && <span>{copied ? "Kopierat!" : label}</span>}
    </button>
  );
}
