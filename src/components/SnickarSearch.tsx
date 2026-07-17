"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { sok, harExaktTraff, autocomplete } from "@/lib/search";
import { dimensionById } from "@/lib/data";
import { mmValue } from "@/lib/format";
import type { SokTraff } from "@/lib/types";
import { useStringList } from "@/lib/useStorage";
import { withBase } from "@/lib/basepath";
import DimensionCard from "./DimensionCard";
import ByggordCard from "./ByggordCard";
import { SearchIcon, CloseIcon, StarIcon, SearchIcon as Magnify } from "./Icons";

const EXEMPEL = [
  "2x4",
  "tvåfyra",
  "45x95",
  "1 tum",
  "trekvarts",
  "fyrtumsspik",
  "halvtum",
  "1/2 rör",
  "syll",
  "regel till innervägg",
];

export default function SnickarSearch() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [active, setActive] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  const historik = useStringList("tum-historik-v1", 8);
  const favoriter = useStringList("tum-favoriter-v1", 24);

  const traffar = useMemo<SokTraff[]>(() => sok(query), [query]);
  const forslag = useMemo(() => (query.trim() ? autocomplete(query, 6) : []), [query]);
  const exakt = harExaktTraff(traffar);

  const dims = traffar.filter((t) => t.typ === "dimension").slice(0, 3);
  const ord = traffar.filter((t) => t.typ === "byggord").slice(0, 2);
  const tum = traffar.filter((t) => t.typ === "tum").slice(0, 4);
  const jarn = traffar.filter((t) => t.typ === "spik" || t.typ === "skruv").slice(0, 3);
  const rorTraffar = traffar.filter((t) => t.typ === "ror").slice(0, 3);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setFocused(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  function commit(q: string) {
    const clean = q.trim();
    if (!clean) return;
    setQuery(clean);
    historik.add(clean);
    setFocused(false);
    setActive(-1);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!focused || forslag.length === 0) {
      if (e.key === "Enter") commit(query);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % forslag.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i <= 0 ? forslag.length - 1 : i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      commit(active >= 0 ? forslag[active].label : query);
    } else if (e.key === "Escape") {
      setFocused(false);
      setActive(-1);
    }
  }

  const favoritDims = favoriter.list
    .map((id) => dimensionById(id))
    .filter(Boolean)
    .slice(0, 8);

  const visarResultat = query.trim().length > 0;

  return (
    <div className="mx-auto max-w-3xl">
      {/* Sökfält */}
      <div ref={boxRef} className="relative">
        <div className="flex items-center gap-2 rounded-2xl border-2 border-border-strong bg-card px-4 py-1 shadow-sm transition-colors focus-within:border-brand">
          <SearchIcon width={22} height={22} className="shrink-0 text-wood" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setFocused(true);
              setActive(-1);
            }}
            onFocus={() => setFocused(true)}
            onKeyDown={onKeyDown}
            role="combobox"
            aria-expanded={focused && forslag.length > 0}
            aria-controls="snickar-forslag"
            aria-autocomplete="list"
            aria-label="Sök dimension, tum-mått eller byggord"
            placeholder="Skriv t.ex. 2x4, tvåfyra, 45x95 eller trekvarts…"
            className="w-full bg-transparent py-3 text-base font-semibold text-ink placeholder:font-normal placeholder:text-muted focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              aria-label="Rensa sökning"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-card-muted hover:text-ink"
            >
              <CloseIcon width={18} height={18} />
            </button>
          )}
        </div>

        {/* Autocomplete */}
        {focused && forslag.length > 0 && (
          <ul
            id="snickar-forslag"
            role="listbox"
            className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border border-border bg-card shadow-lg"
          >
            {forslag.map((f, i) => (
              <li key={f.label + i} role="option" aria-selected={i === active}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onClick={() => commit(f.label)}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                    i === active ? "bg-brand-soft" : "hover:bg-card-muted"
                  }`}
                >
                  <Magnify width={16} height={16} className="shrink-0 text-muted" />
                  <span className="font-bold text-ink">{f.label}</span>
                  <span className="truncate text-sm text-muted">{f.sub}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Exempel + historik + favoriter när tomt */}
      {!visarResultat && (
        <div className="mt-5 space-y-4">
          <ChipRow label="Prova att söka">
            {EXEMPEL.map((ex) => (
              <Chip key={ex} onClick={() => commit(ex)}>
                {ex}
              </Chip>
            ))}
          </ChipRow>

          {historik.hydrated && historik.list.length > 0 && (
            <ChipRow
              label="Senast sökta"
              action={
                <button
                  type="button"
                  onClick={historik.clear}
                  className="text-xs font-semibold text-muted underline-offset-2 hover:text-brand hover:underline"
                >
                  Rensa
                </button>
              }
            >
              {historik.list.map((h) => (
                <Chip key={h} onClick={() => commit(h)}>
                  {h}
                </Chip>
              ))}
            </ChipRow>
          )}

          {favoritDims.length > 0 && (
            <ChipRow label="Favoriter">
              {favoritDims.map(
                (d) =>
                  d && (
                    <Chip key={d.id} onClick={() => commit(d.namn)} star>
                      {d.namn}
                    </Chip>
                  ),
              )}
            </ChipRow>
          )}
        </div>
      )}

      {/* Resultat */}
      {visarResultat && (
        <div className="mt-6">
          {traffar.length === 0 ? (
            <div className="card p-6 text-center">
              <p className="font-semibold text-ink">Ingen träff på ”{query}”.</p>
              <p className="mt-1 text-sm text-muted">
                Prova en dimension som <b>2x4</b>, ett mått som <b>45x95</b> eller ett ord som{" "}
                <b>trekvarts</b>.
              </p>
            </div>
          ) : (
            <>
              <p className="mb-4 text-sm font-bold uppercase tracking-wide text-wood">
                {exakt ? "Träffar" : "Ingen exakt träff · närmaste alternativ"}
              </p>

              <div className="space-y-4">
                {dims.map((t) => {
                  const d = t.dimension!;
                  const isFav = favoriter.list.includes(d.id);
                  return (
                    <DimensionCard
                      key={d.id}
                      dimension={d}
                      highlight={t.exakt}
                      onRelated={(id) => {
                        const rd = dimensionById(id);
                        if (rd) commit(rd.namn);
                      }}
                      action={
                        <button
                          type="button"
                          onClick={() => favoriter.toggle(d.id)}
                          aria-pressed={isFav}
                          aria-label={isFav ? "Ta bort favorit" : "Spara som favorit"}
                          title={isFav ? "Ta bort favorit" : "Spara som favorit"}
                          className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
                            isFav
                              ? "border-wood/40 bg-wood-soft text-wood"
                              : "border-border bg-card text-muted hover:text-wood"
                          }`}
                        >
                          <StarIcon
                            width={18}
                            height={18}
                            fill={isFav ? "currentColor" : "none"}
                          />
                        </button>
                      }
                    />
                  );
                })}

                {ord.map((t) => (
                  <ByggordCard
                    key={t.byggord!.id}
                    byggord={t.byggord!}
                    defaultOpen
                    onRelated={(id) => {
                      commit(id);
                    }}
                  />
                ))}

                {jarn.length > 0 && (
                  <div className="card p-4">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">
                      Spik &amp; skruv
                    </p>
                    <ul className="divide-y divide-border">
                      {jarn.map((t) => {
                        const s = (t.spik ?? t.skruv)!;
                        return (
                          <li key={s.id} className="flex items-center gap-3 py-2">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-white">
                              <Image
                                src={withBase(s.bild)}
                                alt={`Illustration av ${s.namn}`}
                                width={64}
                                height={64}
                                className="h-8 w-8 object-contain"
                              />
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="font-bold leading-tight text-ink">{s.namn}</p>
                              <p className="truncate text-sm text-muted">{s.anvandning}</p>
                            </div>
                            <span className="tabnum shrink-0 font-extrabold text-brand">
                              {s.mm} mm
                            </span>
                            <a
                              href={t.typ === "spik" ? "#spik" : "#skruvar"}
                              className="shrink-0 text-xs font-bold text-brand underline-offset-2 hover:underline"
                            >
                              Tabell
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {rorTraffar.length > 0 && (
                  <div className="card p-4">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">
                      Rördimensioner
                    </p>
                    <ul className="divide-y divide-border">
                      {rorTraffar.map((t) => {
                        const r = t.ror!;
                        return (
                          <li key={r.id} className="flex items-center gap-3 py-2">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-white">
                              <Image
                                src={withBase("/images/ror.webp")}
                                alt=""
                                width={64}
                                height={64}
                                className="h-8 w-8 object-contain"
                              />
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="font-bold leading-tight text-ink">
                                {r.namn} rör <span className="text-sm text-muted">({r.dn})</span>
                              </p>
                              <p className="truncate text-sm text-muted">{r.anvandning}</p>
                            </div>
                            <span className="tabnum shrink-0 font-extrabold text-brand">
                              Ø {mmValue(r.ytterdiameter)} mm
                            </span>
                            <a
                              href="#rordimensioner"
                              className="shrink-0 text-xs font-bold text-brand underline-offset-2 hover:underline"
                            >
                              Tabell
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {tum.length > 0 && (
                  <div className="card p-4">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">
                      Tum-mått
                    </p>
                    <ul className="divide-y divide-border">
                      {tum.map((t) => (
                        <li
                          key={t.tum!.tum}
                          className="flex items-center justify-between gap-3 py-2"
                        >
                          <span className="font-bold text-ink">{t.tum!.tum}</span>
                          <span className="text-sm text-muted">{t.tum!.namn}</span>
                          <span className="tabnum font-extrabold text-brand">
                            {mmValue(t.tum!.mm)} mm
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function ChipRow({
  label,
  action,
  children,
}: {
  label: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wide text-muted">{label}</span>
        {action}
      </div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Chip({
  children,
  onClick,
  star,
}: {
  children: React.ReactNode;
  onClick: () => void;
  star?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-semibold text-ink-soft shadow-sm transition-colors hover:border-brand/40 hover:text-brand"
    >
      {star && <StarIcon width={14} height={14} fill="currentColor" className="text-wood" />}
      {children}
    </button>
  );
}
