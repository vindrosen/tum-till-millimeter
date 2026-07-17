import { dimensioner, byggord, tumtabell } from "./data";
import type { SokTraff } from "./types";

/**
 * Normaliserar en söksträng: gemener, tar bort diakritiska tecken (å/ä/ö),
 * enhetstecken och gör dimensionsseparatorer enhetliga (45×95 → 45x95).
 */
export function normalize(input: string): string {
  return input
    .toLowerCase()
    .replace(/×/g, "x")
    .replace(/["″'’`]/g, "")
    .replace(/,/g, ".")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/(\d)\s*[x*]\s*(\d)/g, "$1x$2")
    .replace(/\s+/g, " ")
    .trim();
}

interface AliasScore {
  score: number;
  exakt: boolean;
}

function bestAliasScore(rawQuery: string, aliases: string[]): AliasScore {
  const q = normalize(rawQuery);
  if (!q) return { score: 0, exakt: false };
  const qCompact = q.replace(/\s+/g, "");
  const qWords = q.split(" ");
  let best = 0;
  let exakt = false;

  for (const alias of aliases) {
    if (!alias) continue;
    const a = normalize(alias);
    if (!a) continue;
    const aCompact = a.replace(/\s+/g, "");

    if (q === a || qCompact === aCompact) {
      best = Math.max(best, 100);
      exakt = true;
      continue;
    }
    // Hela aliaset finns som eget ord i frågan ("regel 2x4" → "2x4")
    if (qWords.includes(a) || (aCompact.length >= 3 && qCompact.includes(aCompact))) {
      best = Math.max(best, 84);
      continue;
    }
    // Frågan finns i aliaset ("tvåf" → "tvåfyra")
    if (a.length >= 3 && q.length >= 2 && a.startsWith(q)) {
      best = Math.max(best, 72);
      continue;
    }
    if (a.length >= 4 && q.length >= 3 && a.includes(q)) {
      best = Math.max(best, 58);
    }
  }
  return { score: best, exakt };
}

/**
 * Fri sökning över dimensioner, byggord och tum-tabellen.
 * Returnerar rankade träffar. Tomt resultat om inget matchar.
 */
export function sok(rawQuery: string): SokTraff[] {
  const q = normalize(rawQuery);
  if (!q) return [];

  const traffar: SokTraff[] = [];

  for (const d of dimensioner) {
    const aliases = [
      ...d.aliases,
      d.namn,
      d.id,
      `${d.hyvlat.t}x${d.hyvlat.b}`,
      `${d.ohyvlat.t}x${d.ohyvlat.b}`,
      d.kategori,
    ];
    const { score, exakt } = bestAliasScore(rawQuery, aliases);
    if (score > 0) traffar.push({ typ: "dimension", score, exakt, dimension: d });
  }

  for (const b of byggord) {
    const aliases = [...b.aliases, b.ord, b.id];
    const { score, exakt } = bestAliasScore(rawQuery, aliases);
    if (score > 0) traffar.push({ typ: "byggord", score: score - 1, exakt, byggord: b });
  }

  for (const t of tumtabell) {
    const aliases = [...(t.aliases ?? []), t.tum, t.namn];
    const { score, exakt } = bestAliasScore(rawQuery, aliases);
    if (score > 0) traffar.push({ typ: "tum", score: score - 3, exakt, tum: t });
  }

  // Lika poäng: låt vanliga dimensioner (2×4, 2×6, 1×6) gå före udda klenare mått,
  // så "regel till innervägg" visar tvåfyran först.
  const popRank = (t: SokTraff) => (t.dimension?.popular ? 1 : 0);
  return traffar.sort((a, b) => b.score - a.score || popRank(b) - popRank(a));
}

/** Har vi minst en exakt träff? Annars ska UI visa "närmaste alternativ". */
export function harExaktTraff(traffar: SokTraff[]): boolean {
  return traffar.some((t) => t.exakt);
}

/** Förslag för autocomplete – korta etiketter. */
export interface Forslag {
  label: string;
  sub: string;
}

export function autocomplete(rawQuery: string, max = 6): Forslag[] {
  const traffar = sok(rawQuery).slice(0, max);
  return traffar.map((t) => {
    if (t.typ === "dimension" && t.dimension) {
      return {
        label: t.dimension.namn,
        sub: `${t.dimension.hyvlat.t}×${t.dimension.hyvlat.b} mm · ${t.dimension.kategori}`,
      };
    }
    if (t.typ === "byggord" && t.byggord) {
      return { label: t.byggord.ord, sub: t.byggord.kort };
    }
    return { label: t.tum!.tum, sub: `${t.tum!.namn}` };
  });
}
