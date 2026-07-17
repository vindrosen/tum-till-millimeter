"use client";

import Image from "next/image";
import { useState } from "react";
import type { Byggord } from "@/lib/types";
import { byggordById, dimensionById } from "@/lib/data";
import { withBase } from "@/lib/basepath";
import { ChevronDownIcon } from "./Icons";

interface ByggordCardProps {
  byggord: Byggord;
  onRelated?: (id: string) => void;
  defaultOpen?: boolean;
}

export default function ByggordCard({ byggord: b, onRelated, defaultOpen = false }: ByggordCardProps) {
  const [open, setOpen] = useState(defaultOpen);

  const relateradeOrd = b.relaterade
    .map((id) => byggordById(id))
    .filter((x): x is Byggord => Boolean(x));
  const dims = b.dimensioner.map((id) => dimensionById(id)).filter(Boolean);

  return (
    <article className="card flex h-full flex-col overflow-hidden">
      <div className="flex items-center gap-4 p-4">
        <span className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border bg-white">
          <Image
            src={withBase(b.bild)}
            alt={`Illustration av ${b.ord}`}
            width={120}
            height={120}
            className="h-[70px] w-[70px] object-contain"
          />
        </span>
        <div className="min-w-0">
          <h3 className="font-display text-xl font-extrabold leading-tight text-wood-strong">
            {b.ord}
          </h3>
          <p className="mt-0.5 text-sm leading-snug text-ink-soft">{b.kort}</p>
        </div>
      </div>

      {dims.length > 0 && (
        <div className="flex flex-wrap gap-1.5 px-4 pb-3">
          {dims.map(
            (d) =>
              d && (
                <span
                  key={d.id}
                  className="tabnum rounded-full bg-wood-soft px-2 py-0.5 text-xs font-bold text-wood-strong"
                >
                  {d.namn} · {d.hyvlat.t}×{d.hyvlat.b}
                </span>
              ),
          )}
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="mt-auto flex items-center justify-between gap-2 border-t border-border px-4 py-2.5 text-left text-sm font-bold text-brand transition-colors hover:bg-brand-soft/60"
      >
        {open ? "Visa mindre" : "Läs mer"}
        <ChevronDownIcon
          width={18}
          height={18}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="border-t border-border bg-card-muted px-4 py-4 text-sm leading-relaxed text-ink-soft">
          <p>{b.beskrivning}</p>

          {b.exempel.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-bold uppercase tracking-wide text-muted">Exempel</p>
              <ul className="mt-1 space-y-1">
                {b.exempel.map((ex, i) => (
                  <li key={i} className="flex gap-2 text-ink">
                    <span className="text-wood">•</span>
                    <span className="italic">{ex}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {relateradeOrd.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wide text-muted">
                Relaterade ord:
              </span>
              {relateradeOrd.map((r) =>
                onRelated ? (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => onRelated(r.id)}
                    className="rounded-full border border-border bg-card px-2.5 py-1 text-xs font-bold text-ink-soft transition-colors hover:border-brand/40 hover:text-brand"
                  >
                    {r.ord}
                  </button>
                ) : (
                  <a
                    key={r.id}
                    href="#byggordbok"
                    className="rounded-full border border-border bg-card px-2.5 py-1 text-xs font-bold text-ink-soft transition-colors hover:border-brand/40 hover:text-brand"
                  >
                    {r.ord}
                  </a>
                ),
              )}
            </div>
          )}
        </div>
      )}
    </article>
  );
}
