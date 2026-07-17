"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import type { Dimension } from "@/lib/types";
import { dimensionById } from "@/lib/data";
import { withBase } from "@/lib/basepath";
import CopyButton from "./CopyButton";

interface DimensionCardProps {
  dimension: Dimension;
  onRelated?: (id: string) => void;
  highlight?: boolean;
  action?: ReactNode;
}

export default function DimensionCard({ dimension: d, onRelated, highlight, action }: DimensionCardProps) {
  const related = d.relaterade
    .map((id) => dimensionById(id))
    .filter((x): x is Dimension => Boolean(x));

  return (
    <article
      className={`card overflow-hidden ${highlight ? "ring-2 ring-brand/40" : ""}`}
    >
      <div className="grid gap-0 sm:grid-cols-[200px_1fr]">
        {/* Illustration */}
        <div className="flex items-center justify-center border-b border-border bg-white p-4 sm:border-b-0 sm:border-r">
          <Image
            src={withBase(d.bild)}
            alt={`Illustration av virkesdimensionen ${d.namn}`}
            width={200}
            height={200}
            className="h-32 w-auto object-contain sm:h-36"
          />
        </div>

        {/* Innehåll */}
        <div className="p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <span className="inline-flex rounded-full bg-wood-soft px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-wood-strong">
                {d.kategori}
              </span>
              <h3 className="mt-2 font-display text-3xl font-extrabold leading-none text-wood-strong">
                {d.namn}
              </h3>
              <p className="mt-1 text-sm font-semibold text-muted">{d.tum}</p>
            </div>
            <div className="flex items-center gap-2">
              {action}
              <CopyButton value={`${d.namn} = hyvlat ${d.hyvlat.t}×${d.hyvlat.b} mm`} compact />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border bg-card-muted px-3 py-2.5">
              <p className="text-xs font-bold uppercase tracking-wide text-muted">Hyvlat</p>
              <p className="tabnum mt-0.5 text-lg font-extrabold text-ink">
                {d.hyvlat.t}×{d.hyvlat.b}
                <span className="ml-1 text-xs font-semibold text-muted">mm</span>
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card-muted px-3 py-2.5">
              <p className="text-xs font-bold uppercase tracking-wide text-muted">Ohyvlat</p>
              <p className="tabnum mt-0.5 text-lg font-extrabold text-ink">
                {d.ohyvlat.t}×{d.ohyvlat.b}
                <span className="ml-1 text-xs font-semibold text-muted">mm</span>
              </p>
            </div>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-ink-soft">{d.beskrivning}</p>

          <p className="mt-3 flex items-start gap-2 text-sm text-ink">
            <span className="font-bold text-wood">Används till:</span>
            <span className="text-ink-soft">{d.anvandning}</span>
          </p>

          {related.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wide text-muted">Relaterade:</span>
              {related.map((r) =>
                onRelated ? (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => onRelated(r.id)}
                    className="rounded-full border border-border bg-card px-2.5 py-1 text-xs font-bold text-ink-soft transition-colors hover:border-brand/40 hover:text-brand"
                  >
                    {r.namn}
                  </button>
                ) : (
                  <a
                    key={r.id}
                    href="#virke"
                    className="rounded-full border border-border bg-card px-2.5 py-1 text-xs font-bold text-ink-soft transition-colors hover:border-brand/40 hover:text-brand"
                  >
                    {r.namn}
                  </a>
                ),
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
