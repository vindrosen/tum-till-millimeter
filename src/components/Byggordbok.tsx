"use client";

import { useMemo, useRef, useState } from "react";
import { byggord } from "@/lib/data";
import { normalize } from "@/lib/search";
import ByggordCard from "./ByggordCard";
import { SearchIcon, CloseIcon } from "./Icons";

export default function Byggordbok() {
  const [filter, setFilter] = useState("");
  const gridRef = useRef<HTMLDivElement>(null);

  const filtrerade = useMemo(() => {
    const q = normalize(filter);
    if (!q) return byggord;
    return byggord.filter((b) => {
      const hay = normalize([b.ord, b.kort, b.beskrivning, ...b.aliases].join(" "));
      return hay.includes(q);
    });
  }, [filter]);

  return (
    <div>
      <div className="mb-6 flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-1 shadow-sm transition-colors focus-within:border-brand sm:max-w-sm">
        <SearchIcon width={20} height={20} className="shrink-0 text-wood" />
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          aria-label="Filtrera byggord"
          placeholder="Filtrera ord…"
          className="w-full bg-transparent py-2.5 text-sm font-semibold text-ink placeholder:font-normal placeholder:text-muted focus:outline-none"
        />
        {filter && (
          <button
            type="button"
            onClick={() => setFilter("")}
            aria-label="Rensa filter"
            className="inline-flex h-7 w-7 items-center justify-center rounded-full text-muted hover:bg-card-muted hover:text-ink"
          >
            <CloseIcon width={16} height={16} />
          </button>
        )}
      </div>

      {filtrerade.length === 0 ? (
        <p className="text-ink-soft">Inget byggord matchar ”{filter}”.</p>
      ) : (
        <div ref={gridRef} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtrerade.map((b) => (
            <ByggordCard
              key={b.id}
              byggord={b}
              onRelated={(id) => {
                const target = byggord.find((x) => x.id === id);
                if (target) {
                  setFilter(target.ord);
                  gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
