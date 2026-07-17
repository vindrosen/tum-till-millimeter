"use client";

import { useMemo, useRef, useState } from "react";
import { byggord, bygguttryck, ordbok, byggordById } from "@/lib/data";
import { normalize } from "@/lib/search";
import ByggordCard from "./ByggordCard";
import { SearchIcon, CloseIcon } from "./Icons";

export default function Bygguttryck() {
  const [filter, setFilter] = useState("");
  const gridRef = useRef<HTMLDivElement>(null);

  // Tomt filter visar uttrycken; vid sökning letar vi i hela ordförrådet
  // så att även ordboksord som "regel" hittas härifrån.
  const filtrerade = useMemo(() => {
    const q = normalize(filter);
    if (!q) return bygguttryck;
    return byggord.filter((b) => {
      const hay = normalize([b.ord, b.kort, b.beskrivning, ...b.aliases].join(" "));
      return hay.includes(q);
    });
  }, [filter]);

  function visaRelaterad(id: string) {
    const target = byggordById(id);
    if (!target) return;
    setFilter(target.ord);
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-1 shadow-sm transition-colors focus-within:border-brand sm:max-w-sm">
        <SearchIcon width={20} height={20} className="shrink-0 text-wood" />
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          aria-label="Filtrera bygguttryck"
          placeholder="Filtrera uttryck…"
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
        <p className="text-ink-soft">Inget uttryck matchar ”{filter}”.</p>
      ) : (
        <div ref={gridRef} className="grid scroll-mt-24 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtrerade.map((b) => (
            <ByggordCard key={b.id} byggord={b} onRelated={visaRelaterad} />
          ))}
        </div>
      )}

      <div className="mt-8">
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">
          Grundorden förklaras i byggordboken
        </p>
        <div className="flex flex-wrap gap-2">
          {ordbok.map((b) => (
            <a
              key={b.id}
              href="#byggordbok"
              className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1.5 text-sm font-semibold text-ink-soft shadow-sm transition-colors hover:border-brand/40 hover:text-brand"
            >
              {b.ord}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
