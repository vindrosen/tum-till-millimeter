/**
 * Verifierar att sökmotorn förstår snickarspråk: synonymer, mm-varianter
 * och fuzzy-träffar. Körs med `npm run test:search`.
 */
import { sok, harExaktTraff } from "../src/lib/search";
import type { SokTraff } from "../src/lib/types";

let failures = 0;

function beskriv(t: SokTraff | undefined): string {
  if (!t) return "(ingen träff)";
  return `${t.typ}:${t.dimension?.id ?? t.byggord?.id ?? t.spik?.id ?? t.skruv?.id ?? t.ror?.id ?? t.tum?.tum}`;
}

function check(namn: string, ok: boolean, detalj: string) {
  if (ok) {
    console.log(`  ok   ${namn}`);
  } else {
    failures++;
    console.error(`  FAIL ${namn} → ${detalj}`);
  }
}

/** Alla frågor ska ge samma toppträff (typ + id). */
function sammaTopp(namn: string, queries: string[], typ: string, id: string) {
  for (const q of queries) {
    const topp = sok(q)[0];
    const traffId =
      topp?.dimension?.id ?? topp?.byggord?.id ?? topp?.spik?.id ?? topp?.skruv?.id ?? topp?.ror?.id;
    check(`${namn} ”${q}”`, topp?.typ === typ && traffId === id, beskriv(topp));
  }
}

console.log("Spik-synonymer:");
sammaTopp("fyrtumsspik", ["4 tum spik", "fyrtumsspik", "100 mm spik", "100-spik"], "spik", "spik-4");
sammaTopp("tvåtumsspik", ["2 tum spik", "tvåtumsspik", "50 mm spik", "50-spik"], "spik", "spik-2");

console.log("Skruv:");
sammaTopp("tretumsskruv", ["3 tum skruv", "75 mm skruv", "träskruv 75"], "skruv", "skruv-3");

console.log("Rör:");
sammaTopp("halvtumsrör", ["1/2 rör", "halvtumsrör", "dn15"], "ror", "ror-1-2");

console.log("Dimensioner (befintligt beteende):");
sammaTopp("tvåfyra", ["tvåfyra", "två fyra", "2x4", "45x95", "50x100", "95-regel"], "dimension", "2x4");

console.log("Bygguttryck:");
sammaTopp("halvtum", ["halvtum"], "byggord", "halvtum");
sammaTopp("syll", ["syll", "bottenregel"], "byggord", "syll");
sammaTopp("bärande vägg", ["bärande vägg", "barande vagg"], "byggord", "barande-vagg");
sammaTopp("lockläkt", ["lockläkt", "lockpanel"], "byggord", "locklakt");

console.log("Fuzzy (stavfel → närmaste alternativ):");
{
  const traffar = sok("råspånt");
  const hittadRasspont = traffar.some((t) => t.byggord?.id === "rasspont");
  check("”råspånt” hittar råspont", hittadRasspont, traffar.slice(0, 3).map(beskriv).join(", "));
  check("”råspånt” är inte exakt träff", !harExaktTraff(traffar), "borde visas som närmaste alternativ");
}
{
  const traffar = sok("hammarbandd");
  check(
    "”hammarbandd” hittar hammarband",
    traffar.some((t) => t.byggord?.id === "hammarband"),
    traffar.slice(0, 3).map(beskriv).join(", "),
  );
}

if (failures > 0) {
  console.error(`\n${failures} test misslyckades.`);
  process.exit(1);
}
console.log("\nAlla söktester gick igenom.");
