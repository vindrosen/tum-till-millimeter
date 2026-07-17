import { tumtabell } from "@/lib/data";
import { mmValue } from "@/lib/format";
import CopyButton from "./CopyButton";

export default function TumTabell() {
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">Standardtabell för omräkning av tum till millimeter</caption>
          <thead>
            <tr className="border-b border-border bg-card-muted text-xs font-bold uppercase tracking-wide text-muted">
              <th scope="col" className="px-4 py-3">
                Tum (″)
              </th>
              <th scope="col" className="px-4 py-3">
                Millimeter (mm)
              </th>
              <th scope="col" className="px-4 py-3">
                Vanligt namn
              </th>
              <th scope="col" className="px-4 py-3 text-right">
                <span className="sr-only">Kopiera</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {tumtabell.map((rad, i) => (
              <tr
                key={rad.tum}
                className={`border-b border-border last:border-0 transition-colors hover:bg-card-muted ${
                  i % 2 ? "bg-card" : "bg-card"
                }`}
              >
                <th scope="row" className="px-4 py-3 font-extrabold text-ink">
                  {rad.tum}
                </th>
                <td className="tabnum px-4 py-3 font-bold text-brand">{mmValue(rad.mm)} mm</td>
                <td className="px-4 py-3 text-ink-soft">{rad.namn}</td>
                <td className="px-4 py-3 text-right">
                  <CopyButton value={`${rad.tum} = ${mmValue(rad.mm)} mm`} compact />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="border-t border-border bg-card-muted px-4 py-3 text-sm text-muted">
        1 tum = 25,4 mm. Multiplicera antalet tum med 25,4 för att få millimeter.
      </p>
    </div>
  );
}
