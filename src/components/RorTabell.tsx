import Image from "next/image";
import { ror } from "@/lib/data";
import { mmValue } from "@/lib/format";
import { withBase } from "@/lib/basepath";
import { InfoIcon } from "./Icons";
import { IconChip } from "./Section";
import CopyButton from "./CopyButton";

export default function RorTabell() {
  return (
    <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">
              Rördimensioner i tum med DN-beteckning och ungefärlig ytterdiameter
            </caption>
            <thead>
              <tr className="border-b border-border bg-card-muted text-xs font-bold uppercase tracking-wide text-muted">
                <th scope="col" className="px-4 py-3">Nominell storlek</th>
                <th scope="col" className="px-4 py-3">Ytterdiameter (ca)</th>
                <th scope="col" className="px-4 py-3">Vanlig användning</th>
                <th scope="col" className="px-4 py-3 text-right">
                  <span className="sr-only">Kopiera</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {ror.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-border transition-colors last:border-0 hover:bg-card-muted"
                >
                  <th scope="row" className="px-4 py-3 font-extrabold text-ink">
                    {r.namn}{" "}
                    <span className="ml-1 rounded-full bg-wood-soft px-2 py-0.5 text-xs font-bold text-wood-strong">
                      {r.dn}
                    </span>
                  </th>
                  <td className="tabnum px-4 py-3 font-bold text-brand">
                    {mmValue(r.ytterdiameter)} mm
                  </td>
                  <td className="min-w-48 px-4 py-3 text-sm text-ink-soft">{r.anvandning}</td>
                  <td className="px-4 py-3 text-right">
                    <CopyButton
                      value={`${r.tum} rör (${r.dn}) ≈ ${mmValue(r.ytterdiameter)} mm utvändigt`}
                      compact
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="border-t border-border bg-card-muted px-4 py-3 text-sm text-muted">
          Ytterdiametrar enligt standarden för gängade stålrör (EN 10255). Kontrollera alltid mot
          rörets märkning – kopparrör och plaströr har egna måttserier.
        </p>
      </div>

      <div className="card h-fit p-5 sm:p-6">
        <div className="mb-4 flex items-center gap-3">
          <IconChip>
            <InfoIcon width={20} height={20} />
          </IconChip>
          <h4 className="font-display text-lg font-extrabold text-wood-strong">
            Varför stämmer inte rörmåtten?
          </h4>
        </div>
        <span className="mb-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border border-border bg-white">
          <Image
            src={withBase("/images/ror.webp")}
            alt="Illustration av ett gängat stålrör"
            width={120}
            height={120}
            className="h-20 w-20 object-contain"
          />
        </span>
        <p className="text-sm leading-relaxed text-ink-soft">
          Ett halvtumsrör är varken 12,7 mm invändigt eller utvändigt – ytterdiametern är cirka
          21,3 mm. Tumbeteckningen ärvdes från 1800-talets rör, där måttet ungefär motsvarade
          innerdiametern. När godset blev tunnare behöll man ytterdiametern så att gängor och
          kopplingar skulle fortsätta passa.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          Därför är tummåttet i dag bara ett <b className="text-ink">nominellt namn</b> – en
          storleksklass, inte ett verkligt mått. I modern standard motsvaras det av
          DN-beteckningen (Diamètre Nominal), till exempel DN15 för 1/2″.
        </p>
      </div>
    </div>
  );
}
