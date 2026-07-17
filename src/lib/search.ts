import { dimensioner, byggord, tumtabell, spik, skruv, ror } from "./data";
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

/**
 * Begränsad Levenshtein-distans med tidigt avbrott – returnerar max + 1
 * om avståndet överstiger max. Räcker för korta sökord och alias.
 */
function editDistance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const curr = [i];
    let radMin = i;
    for (let j = 1; j <= b.length; j++) {
      const kostnad = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + kostnad);
      radMin = Math.min(radMin, curr[j]);
    }
    if (radMin > max) return max + 1;
    prev = curr;
  }
  return prev[b.length];
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

  // Fuzzy-nivå: fångar stavfel ("råspånt" → "råspont") när inget annat
  // matchar. Aldrig en exakt träff – UI:t visar "närmaste alternativ".
  if (best === 0 && q.length >= 4) {
    const max = q.length <= 6 ? 1 : 2;
    for (const alias of aliases) {
      const a = normalize(alias ?? "");
      if (a.length < 4) continue;
      if (editDistance(q, a, max) <= max) {
        best = 42;
        break;
      }
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

  for (const s of spik) {
    const { score, exakt } = bestAliasScore(rawQuery, [...s.aliases, s.namn]);
    if (score > 0) traffar.push({ typ: "spik", score, exakt, spik: s });
  }

  for (const s of skruv) {
    const { score, exakt } = bestAliasScore(rawQuery, [...s.aliases, s.namn]);
    if (score > 0) traffar.push({ typ: "skruv", score, exakt, skruv: s });
  }

  for (const r of ror) {
    const { score, exakt } = bestAliasScore(rawQuery, [...r.aliases, r.dn, `${r.tum} rör`]);
    if (score > 0) traffar.push({ typ: "ror", score: score - 1, exakt, ror: r });
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
    if (t.typ === "spik" && t.spik) {
      return { label: t.spik.namn, sub: `${t.spik.mm} mm · spik` };
    }
    if (t.typ === "skruv" && t.skruv) {
      return { label: t.skruv.namn, sub: `${t.skruv.mm} mm · skruv` };
    }
    if (t.typ === "ror" && t.ror) {
      return { label: `${t.ror.namn} rör`, sub: `${t.ror.dn} · utv. Ø ${t.ror.ytterdiameter} mm` };
    }
    return { label: t.tum!.tum, sub: `${t.tum!.namn}` };
  });
}
