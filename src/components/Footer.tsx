import Image from "next/image";
import { site } from "@/lib/site";
import { withBase } from "@/lib/basepath";

const LÄNKAR = [
  { href: "#sok", label: "Vad säger snickaren?" },
  { href: "#omvandlare", label: "Omvandlare" },
  { href: "#tabeller", label: "Tum-tabell" },
  { href: "#virke", label: "Virkesdimensioner" },
  { href: "#byggsprak", label: "Byggspråk" },
  { href: "#byggordbok", label: "Byggordbok" },
  { href: "#faq", label: "Vanliga frågor" },
];

export default function Footer() {
  const år = 2026;
  return (
    <footer className="mt-6 border-t border-border wood-band">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-border bg-white">
                <Image
                  src={withBase("/images/logo-cube.webp")}
                  alt=""
                  width={40}
                  height={40}
                  className="h-9 w-9 object-contain"
                />
              </span>
              <span className="leading-tight">
                <span className="block font-display text-base font-extrabold text-wood-strong">
                  {site.name}
                </span>
                <span className="block text-xs font-medium text-muted">{site.slogan}</span>
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-soft">
              En enkel svensk guide som översätter tum till millimeter och förklarar
              virkesdimensioner och byggord. Gjord för hemmafixare, snickare och alla som stöter på
              gamla tum-beteckningar som 2×4, 2×6 och 1×6.
            </p>
          </div>

          <nav aria-label="Sidfot" className="text-sm">
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-muted">Innehåll</p>
            <ul className="space-y-2">
              {LÄNKAR.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="font-semibold text-ink-soft transition-colors hover:text-brand">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="text-sm">
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-muted">Snabbfakta</p>
            <ul className="space-y-2 text-ink-soft">
              <li><b className="text-ink">1 tum</b> = 25,4 mm</li>
              <li><b className="text-ink">2×4</b> = 45 × 95 mm (hyvlat)</li>
              <li><b className="text-ink">2×6</b> = 45 × 145 mm (hyvlat)</li>
              <li><b className="text-ink">1×6</b> = 22 × 145 mm (hyvlat)</li>
              <li><b className="text-ink">3/4″</b> ≈ 19,1 mm</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {år} {site.name}. Måtten är ungefärliga standardmått – mät alltid själv vid behov.</p>
          <p>Byggd med omtanke för svenska brädgårdar 🪵</p>
        </div>
      </div>
    </footer>
  );
}
