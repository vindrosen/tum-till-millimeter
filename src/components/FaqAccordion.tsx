"use client";

import { useState } from "react";
import type { FaqItem } from "@/lib/types";
import { ChevronDownIcon } from "./Icons";

interface FaqAccordionProps {
  items: FaqItem[];
  limit?: number;
  moreHref?: string;
  compact?: boolean;
}

export default function FaqAccordion({ items, limit, moreHref, compact }: FaqAccordionProps) {
  const [open, setOpen] = useState<number | null>(compact ? null : 0);
  const visible = limit ? items.slice(0, limit) : items;

  return (
    <div className={compact ? "space-y-1.5" : "space-y-2.5"}>
      {visible.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={item.fraga}
            className={`overflow-hidden rounded-xl border border-border bg-card ${
              isOpen ? "shadow-sm" : ""
            }`}
          >
            <h3>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className={`flex w-full items-center justify-between gap-3 px-4 text-left font-bold text-ink transition-colors hover:text-brand ${
                  compact ? "py-3 text-sm" : "py-4"
                }`}
              >
                <span>{item.fraga}</span>
                <ChevronDownIcon
                  width={20}
                  height={20}
                  className={`shrink-0 text-wood transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
            </h3>
            {isOpen && (
              <div
                className={`border-t border-border bg-card-muted px-4 leading-relaxed text-ink-soft ${
                  compact ? "py-3 text-sm" : "py-4"
                }`}
              >
                {item.svar}
              </div>
            )}
          </div>
        );
      })}

      {moreHref && limit && items.length > limit && (
        <a
          href={moreHref}
          className="flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-bold text-brand transition-colors hover:bg-brand-soft"
        >
          Fler frågor och svar
          <ChevronDownIcon width={16} height={16} className="-rotate-90" />
        </a>
      )}
    </div>
  );
}
