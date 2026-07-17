"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { spik } from "@/lib/data";
import { normalize } from "@/lib/search";
import { withBase } from "@/lib/basepath";
import CopyButton from "./CopyButton";
import { SearchIcon, CloseIcon } from "./Icons";

/** Längsta spiken sätter skalan för längdstaplarna. */
const MAX_MM = Math.max(...spik.map((s) => s.mm));

export default function SpikTabell() {
  const [filter, setFilter] = useState("");

  const filtrerade = useMemo(() => {
    const q = normalize(filter);
    if (!q) return spik;
    return spik.filter((s) => {
      const hay = normalize([s.namn, s.tum, `${s.mm} mm`, s.anvandning, ...s.aliases].join(" "));
      return hay.includes(q);
    });
  }, [filter]);

  return (
    <div>
      <div className="mb-4 flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-1 shadow-sm transition-colors focus-within:border-brand sm:max-w-sm">
        <SearchIcon width={20} height={20} className="shrink-0 text-wood" />
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          aria-label="Filtrera spiklängder"
          placeholder="Sök t.ex. fyrtumsspik eller 100…"
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
        <p className="text-ink-soft">Ingen spik matchar ”{filter}”.</p>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">
                Traditionella spiklängder i tum och vad de motsvarar i millimeter
              </caption>
              <thead>
                <tr className="border-b border-border bg-card-muted text-xs font-bold uppercase tracking-wide text-muted">
                  <th scope="col" className="px-4 py-3">Traditionellt namn</th>
                  <th scope="col" className="px-4 py-3">Millimeter</th>
                  <th scope="col" className="px-4 py-3">Vanlig användning</th>
                  <th scope="col" className="px-4 py-3">Illustration</th>
                  <th scope="col" className="px-4 py-3 text-right">
                    <span className="sr-only">Kopiera</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtrerade.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b border-border transition-colors last:border-0 hover:bg-card-muted"
                  >
                    <th scope="row" className="px-4 py-3 font-extrabold text-ink">
                      {s.namn}
                    </th>
                    <td className="tabnum px-4 py-3 font-bold text-brand">{s.mm} mm</td>
                    <td className="min-w-48 px-4 py-3 text-sm text-ink-soft">{s.anvandning}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-white">
                          <Image
                            src={withBase(s.bild)}
                            alt={`Illustration av ${s.namn}`}
                            width={160}
                            height={160}
                            className="h-auto w-full object-contain"
                          />
                        </span>
                        <span
                          className="h-2 min-w-24 rounded-full bg-wood-soft"
                          role="img"
                          aria-label={`Längd ${s.mm} av ${MAX_MM} millimeter`}
                        >
                          <span
                            className="block h-2 rounded-full bg-wood"
                            style={{ width: `${(s.mm / MAX_MM) * 100}%` }}
                          />
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <CopyButton value={`${s.tum} spik = ${s.mm} mm`} compact />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="border-t border-border bg-card-muted px-4 py-3 text-sm text-muted">
            En fyrtumsspik kallas också 100-spik – tumnamnet och millimeterlängden lever sida vid
            sida. Staplarna visar spikarnas längd i förhållande till varandra.
          </p>
        </div>
      )}
    </div>
  );
}
