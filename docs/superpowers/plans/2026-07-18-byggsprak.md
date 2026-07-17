# Byggspråk Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand Tum till Millimeter with a "Byggspråk" section (spiklängder, skruvar, rördimensioner, bygguttryck), a widened search index with synonyms and fuzzy matching, DefinedTerm structured data and internal linking — without touching existing functionality.

**Architecture:** All content stays in JSON data files (`src/data/`) typed via `src/lib/types.ts` and exposed through `src/lib/data.ts`. The search engine (`src/lib/search.ts`) gains three new hit types (spik/skruv/rör) plus a bounded edit-distance tier for fuzzy matching. The page is a single static page; the new section is composed in `page.tsx` from four new components that reuse the existing card/table design language. Illustrations are generated with the bildgen MCP into `assets/generated/` and converted to WebP in `public/images/` with sharp.

**Tech Stack:** Next.js 16 (App Router, static export), TypeScript, Tailwind v4 tokens from `globals.css`, sharp, bildgen MCP (OpenAI Image API), tsx for the search verification script.

## Global Constraints

- Do NOT redesign or remove any existing functionality (spec).
- All copy in Swedish; follow existing tone (vardaglig, exakt).
- Reuse existing design tokens/classes: `.card`, `.wood-band`, `.tabnum`, color vars, `font-display`.
- Dark mode must work via existing `.dark` variables (no hardcoded colors).
- Images: photorealistic pine-wood on pure white, soft shadow (match existing assets); PNG originals in `assets/generated/`, WebP for the site in `public/images/`; lazy-loaded via `next/image` defaults.
- Anchors required: `#byggsprak #spik #skruvar #rordimensioner #bygguttryck #snickarsprak #traditionella-matt`.
- Static export + basePath compatibility: every image path through `withBase()`.
- Keyboard navigation + ARIA per existing patterns (combobox, aria-labels, table captions, th scope).

---

### Task 1: Data model + JSON data

**Files:**
- Modify: `src/lib/types.ts` — add `Spik`, `Skruv`, `RorDim`; `Byggord` gains optional `grupp?: "ordbok" | "uttryck"`; `SokTraffTyp` gains `"spik" | "skruv" | "ror"` and `SokTraff` optional fields.
- Create: `src/data/spik.json` (6 rows: 2″/50, 2½″/65, 3″/75, 4″/100, 5″/125, 6″/150) with aliases covering `4 tum spik`, `fyrtumsspik`, `100 mm spik`, `100-spik` patterns for every row.
- Create: `src/data/skruv.json` (5 rows: 2″/50, 2½″/65, 3″/75, 4″/100, 5″/125) with the same alias patterns.
- Create: `src/data/ror.json` (9 rows: 1/8″…2″ with DN and outer Ø per EN 10255: 10,2 / 13,5 / 17,2 / 21,3 / 26,9 / 33,7 / 42,4 / 48,3 / 60,3 mm).
- Modify: `src/data/byggord.json` — add 18 terms with `grupp: "uttryck"`: tvaatta, tvatva, halvtum, kvartstum, syll, hammarband, spiklakt, locklakt, takstol, sparre, stolpe, plint, foder, smyg, golvregel, takregel, barande-vagg, icke-barande-vagg. Cross-link `relaterade` in both directions with existing terms.
- Modify: `src/data/faq.json` — add 4 entries (fyrtumsspik-längd, rörmått-förklaring, syll vs hammarband, bärande vägg).
- Modify: `src/lib/data.ts` — export `spik`, `skruv`, `ror`, `bygguttryck` (byggord filtered on grupp), `ordbok` helper lookups.

**Interfaces:**
- Produces: `Spik { id, namn, tum, mm, anvandning, bild, aliases, relaterade }`, `Skruv` (same minus bild? — keep bild for search cards), `RorDim { id, namn, tum, dn, ytterdiameter, anvandning, aliases }`; `spik: Spik[]`, `skruv: Skruv[]`, `ror: RorDim[]` from `@/lib/data`.

Steps: write types → write JSON → wire data.ts → `npx tsc --noEmit` passes → commit.

### Task 2: Search expansion + fuzzy + verification script

**Files:**
- Modify: `src/lib/search.ts` — index spik/skruv/rör; add bounded Levenshtein (≤2, len≥4) tier scoring ~40 so typos ("råspånt") land as närmaste alternativ; keep existing scoring untouched otherwise. Extend `autocomplete` labels for new types.
- Create: `scripts/verify-search.ts` — assertions: synonym groups (`4 tum spik` = `fyrtumsspik` = `100 mm spik` = `100-spik` → spik-4; `tvåfyra`=`två fyra`=`2x4`=`45x95`=`50x100` → dimension 2x4; `halvtum` → byggord halvtum; `1/2 rör` → ror-1-2; fuzzy `råspånt` → råspont as top/near hit; `95-regel` → 2x4).
- Modify: `package.json` — devDep `tsx`, script `"test:search": "tsx scripts/verify-search.ts"`.

Steps: write failing script → run (fails: data/types not indexed) → implement search changes → run passes → commit.

### Task 3: Illustrations (bildgen → sharp → WebP)

**Files:**
- Create: `assets/generated/spik-{2,2-5,3,4,5,6}.png` (6 nail images, per-size proportions in prompt), `skruv.png`, `ror.png`, `byggord-stomme.png` (syll+hammarband), `byggord-takstol.png` (takstol+sparre), `byggord-stolpe-plint.png`, `byggord-foder-smyg.png`, `byggord-locklakt.png`, `byggord-vagg.png` (bärande/icke bärande), `byggord-tumstock.png` (halvtum/kvartstum).
- Create: `scripts/convert-images.mjs` — sharp PNG→WebP at the same max dimension as existing `public/images/plank-*.webp` (inspect first), output `public/images/*.webp`.
- Reuse existing images where the codebase already does (tvååtta→plank-beam, tvåtvå/golvregel/takregel→plank-regel, spikläkt→plank-lakt).

Style prompt base: "Photorealistic product photo of X, light pine wood, isolated on pure white background, soft shadow, studio lighting, no text."

Steps: inspect existing webp dims → generate 15 images → convert → verify file sizes reasonable (<30 KB/webp) → commit.

### Task 4: Components + page composition + nav

**Files:**
- Create: `src/components/SpikTabell.tsx` — searchable `card` table: Traditionellt namn / Millimeter / Vanlig användning / Illustration (image + proportional length bar), filter input reusing Byggordbok filter pattern, uses search `normalize`.
- Create: `src/components/SkruvTabell.tsx` — same pattern, columns Traditionellt namn / Längd (mm) / Vanlig användning.
- Create: `src/components/RorTabell.tsx` — static table Nominell storlek (tum + DN) / Ytterdiameter / Vanlig användning + explainer card "Varför stämmer inte rörmåtten?".
- Create: `src/components/Bygguttryck.tsx` — ByggordCard grid over `bygguttryck` + chip row linking the 14 ordbok terms to `#byggordbok`.
- Modify: `src/components/SnickarSearch.tsx` — render spik/skruv/rör hits (compact card rows with bild, mm, användning, anchor link till sektionen); add example chips (`fyrtumsspik`, `halvtum`).
- Modify: `src/components/Header.tsx` — NAV gains `{ href: "#byggsprak", label: "Byggspråk" }` between Virke and Byggordbok.
- Modify: `src/app/page.tsx` — parent `Section id="byggsprak"` (eyebrow Byggspråk, subtitle per spec) containing four `<section>` sub-blocks with ids `spik`, `skruvar`, `rordimensioner`, `bygguttryck` and h3 headings; hidden anchor targets `#snickarsprak` (före sök) and `#traditionella-matt` (före tabeller).

Steps: build each component → tsc/lint clean → commit.

### Task 5: SEO (structured data, keywords, README)

**Files:**
- Modify: `src/lib/jsonld.ts` — `DefinedTermSet` för `#byggordbok` + `#byggsprak`; `DefinedTerm` för alla byggord (incl. uttryck), spik-, skruv- och rör-rader; behåll befintliga noder.
- Modify: `src/lib/site.ts` — keywords: spiklängder, fyrtumsspik, byggspråk, snickarspråk, rördimensioner, syll, hammarband, takstol m.fl.
- Modify: `src/app/sitemap.ts` — bump lastModified.
- Modify: `README.md` — feature list + data files + antal ord.

Steps: implement → `npm run build` green → commit.

### Task 6: Verification

- `npm run test:search` passes.
- `npm run lint` + `npm run build` green.
- Dev server via launch.json; verify in browser pane: nav item, all four sub-sections render, filter works, search synonyms return same result, dark mode, mobile viewport, no console errors; JSON-LD parses (read script tag).
- Playwright MCP screenshot for proof (browser-pane screenshot hangs on this machine).
- Update this plan's checkboxes; final commit.
