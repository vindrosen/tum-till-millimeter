"use client";

import { useMemo, useState } from "react";
import { SwapIcon } from "./Icons";
import CopyButton from "./CopyButton";
import { mmValue, tumValue, TUM_I_MM } from "@/lib/format";

type Unit = "tum" | "mm";

const UNIT_LABEL: Record<Unit, string> = { tum: "Tum (″)", mm: "Millimeter (mm)" };

/** Tolkar tal med komma, decimaler och bråk som "1 1/2" eller "3/4". */
function parseValue(input: string): number | null {
  const s = input.trim().replace(",", ".");
  if (!s) return null;
  const mixed = s.match(/^(\d+(?:\.\d+)?)\s+(\d+)\/(\d+)$/);
  if (mixed) return Number(mixed[1]) + Number(mixed[2]) / Number(mixed[3]);
  const frac = s.match(/^(\d+)\/(\d+)$/);
  if (frac) return Number(frac[1]) / Number(frac[2]);
  const num = Number(s);
  return Number.isFinite(num) ? num : null;
}

const PRESETS: { label: string; unit: Unit; value: string }[] = [
  { label: '3/4″', unit: "tum", value: "3/4" },
  { label: '1″', unit: "tum", value: "1" },
  { label: '2″', unit: "tum", value: "2" },
  { label: "45 mm", unit: "mm", value: "45" },
  { label: "95 mm", unit: "mm", value: "95" },
];

export default function Converter() {
  const [from, setFrom] = useState<Unit>("tum");
  const [input, setInput] = useState("2");

  const to: Unit = from === "tum" ? "mm" : "tum";
  const parsed = useMemo(() => parseValue(input), [input]);

  const result = useMemo(() => {
    if (parsed === null) return null;
    if (from === "tum") return mmValue(parsed * TUM_I_MM, 2);
    return tumValue(parsed / TUM_I_MM, 3);
  }, [parsed, from]);

  const resultUnit = to === "mm" ? "mm" : "″";
  const copyText = result ? `${result} ${to === "mm" ? "mm" : "tum"}` : "";

  function swap() {
    // Behåll det numeriska värdet men byt riktning.
    setFrom(to);
    if (result) setInput(result.replace(/\s/g, ""));
  }

  return (
    <div className="card h-full p-5 sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-wood-soft text-wood-strong">
          <SwapIcon width={20} height={20} />
        </span>
        <h3 className="font-display text-lg font-extrabold text-wood-strong">Snabbomvandlare</h3>
      </div>

      {/* Etiketter och kontroller i separata rader så de alltid ligger i linje */}
      <div className="grid grid-cols-[1fr_auto_1fr] gap-2 text-sm">
        <span className="font-semibold text-muted">Från</span>
        <span className="w-10" aria-hidden />
        <span className="font-semibold text-muted">Till</span>
      </div>
      <div className="mt-1.5 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <select
          value={from}
          onChange={(e) => setFrom(e.target.value as Unit)}
          aria-label="Enhet att räkna om från"
          className="h-11 w-full truncate rounded-xl border border-border bg-card-muted px-3 text-sm font-semibold text-ink outline-none transition-colors focus:border-brand"
        >
          <option value="tum">{UNIT_LABEL.tum}</option>
          <option value="mm">{UNIT_LABEL.mm}</option>
        </select>

        <button
          type="button"
          onClick={swap}
          aria-label="Byt riktning"
          title="Byt riktning"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-brand transition-transform hover:rotate-180 hover:bg-brand-soft"
        >
          <SwapIcon width={18} height={18} />
        </button>

        <div className="flex h-11 w-full items-center truncate rounded-xl border border-border bg-card-muted px-3 text-sm font-semibold text-ink">
          {UNIT_LABEL[to]}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <input
          inputMode="decimal"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          aria-label={`Värde i ${from === "tum" ? "tum" : "millimeter"}`}
          placeholder="0"
          className="tabnum w-full rounded-2xl border border-border-strong bg-card px-4 py-3 text-center text-2xl font-extrabold text-ink outline-none transition-colors focus:border-brand"
        />
        <span className="text-2xl font-bold text-muted">=</span>
        <output
          className="tabnum flex min-h-[56px] items-center justify-center rounded-2xl border border-brand/25 bg-brand-soft px-3 py-3 text-center text-2xl font-extrabold text-brand"
          aria-live="polite"
        >
          {result !== null ? (
            <span>
              {result} <span className="text-lg font-bold">{resultUnit}</span>
            </span>
          ) : (
            <span className="text-lg font-semibold text-muted">–</span>
          )}
        </output>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => {
              setFrom(p.unit);
              setInput(p.value);
            }}
            className="rounded-full border border-border bg-card-muted px-3 py-1 text-xs font-semibold text-ink-soft transition-colors hover:border-brand/40 hover:text-brand"
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
        <p className="text-sm font-medium text-muted">1 tum = 25,4 mm</p>
        {result !== null && <CopyButton value={copyText} label="Kopiera" />}
      </div>
    </div>
  );
}
