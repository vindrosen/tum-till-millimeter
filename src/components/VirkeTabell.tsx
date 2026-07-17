"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { dimensioner } from "@/lib/data";
import { withBase } from "@/lib/basepath";
import CopyButton from "./CopyButton";

type Yta = "hyvlat" | "ohyvlat";

const KATEGORIER = ["Alla", "Regel", "Bräda", "Bjälke", "Läkt & list", "Stolpe"] as const;

export default function VirkeTabell() {
  const [yta, setYta] = useState<Yta>("hyvlat");
  const [kategori, setKategori] = useState<(typeof KATEGORIER)[number]>("Alla");

  const rows = useMemo(
    () => (kategori === "Alla" ? dimensioner : dimensioner.filter((d) => d.kategori === kategori)),
    [kategori],
  );

  return (
    <div>
      {/* Kontroller */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div
          className="inline-flex rounded-full border border-border bg-card p-1 shadow-sm"
          role="group"
          aria-label="Välj yta"
        >
          {(["hyvlat", "ohyvlat"] as Yta[]).map((y) => (
            <button
              key={y}
              type="button"
              onClick={() => setYta(y)}
              aria-pressed={yta === y}
              className={`rounded-full px-4 py-1.5 text-sm font-bold capitalize transition-colors ${
                yta === y
                  ? "bg-wood-strong text-bg shadow"
                  : "text-ink-soft hover:text-wood-strong"
              }`}
            >
              {y}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {KATEGORIER.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setKategori(k)}
              aria-pressed={kategori === k}
              className={`rounded-full border px-3 py-1 text-xs font-bold transition-colors ${
                kategori === k
                  ? "border-brand bg-brand-soft text-brand"
                  : "border-border bg-card text-ink-soft hover:border-brand/40 hover:text-brand"
              }`}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop-tabell */}
      <div className="card hidden overflow-hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">
              Vanliga virkesdimensioner med hyvlat och ohyvlat mått
            </caption>
            <thead>
              <tr className="border-b border-border bg-card-muted text-xs font-bold uppercase tracking-wide text-muted">
                <th scope="col" className="px-4 py-3">Benämning</th>
                <th scope="col" className="px-4 py-3">Tum</th>
                <th scope="col" className={`px-4 py-3 ${yta === "hyvlat" ? "text-wood-strong" : ""}`}>
                  Hyvlat (ca)
                </th>
                <th scope="col" className={`px-4 py-3 ${yta === "ohyvlat" ? "text-wood-strong" : ""}`}>
                  Ohyvlat (ca)
                </th>
                <th scope="col" className="px-4 py-3">Beskrivning</th>
                <th scope="col" className="px-4 py-3 text-center">Illustration</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((d) => (
                <tr key={d.id} className="border-b border-border last:border-0 hover:bg-card-muted">
                  <th scope="row" className="px-4 py-3">
                    <span className="font-display text-lg font-extrabold text-wood-strong">
                      {d.namn}
                    </span>
                  </th>
                  <td className="px-4 py-3 text-sm font-semibold text-muted">{d.tum}</td>
                  <td
                    className={`tabnum px-4 py-3 font-bold ${
                      yta === "hyvlat" ? "text-brand" : "text-ink-soft"
                    }`}
                  >
                    {d.hyvlat.t}×{d.hyvlat.b} mm
                  </td>
                  <td
                    className={`tabnum px-4 py-3 font-bold ${
                      yta === "ohyvlat" ? "text-brand" : "text-ink-soft"
                    }`}
                  >
                    {d.ohyvlat.t}×{d.ohyvlat.b} mm
                  </td>
                  <td className="max-w-xs px-4 py-3 text-sm text-ink-soft">{d.anvandning}</td>
                  <td className="px-4 py-3">
                    <div className="mx-auto flex h-14 w-20 items-center justify-center rounded-lg border border-border bg-white">
                      <Image
                        src={withBase(d.bild)}
                        alt={`Illustration av ${d.namn}`}
                        width={64}
                        height={64}
                        className="h-11 w-auto object-contain"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobil-kort */}
      <div className="grid gap-3 md:hidden">
        {rows.map((d) => (
          <div key={d.id} className="card flex items-center gap-4 p-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-border bg-white">
              <Image
                src={withBase(d.bild)}
                alt={`Illustration av ${d.namn}`}
                width={80}
                height={80}
                className="h-12 w-auto object-contain"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-display text-xl font-extrabold text-wood-strong">
                  {d.namn}
                </span>
                <span className="text-xs font-semibold text-muted">{d.tum}</span>
              </div>
              <p className="tabnum mt-0.5 text-lg font-extrabold text-brand">
                {(yta === "hyvlat" ? d.hyvlat : d.ohyvlat).t}×
                {(yta === "hyvlat" ? d.hyvlat : d.ohyvlat).b} mm
                <span className="ml-1 text-xs font-semibold text-muted">{yta}</span>
              </p>
              <p className="mt-1 text-sm text-ink-soft">{d.anvandning}</p>
            </div>
            <CopyButton
              value={`${d.namn} = ${(yta === "hyvlat" ? d.hyvlat : d.ohyvlat).t}×${
                (yta === "hyvlat" ? d.hyvlat : d.ohyvlat).b
              } mm (${yta})`}
              compact
            />
          </div>
        ))}
      </div>

      <p className="mt-4 flex items-start gap-2 text-sm text-muted">
        <span aria-hidden>💡</span>
        <span>
          Måtten är ungefärliga standardmått. Hyvlat virke är några millimeter mindre än det
          sågade (ohyvlade) måttet. Mät alltid själv vid kritiska mått.
        </span>
      </p>
    </div>
  );
}
