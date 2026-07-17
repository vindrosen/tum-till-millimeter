# Tum till Millimeter

Sveriges enkla guide för virkesdimensioner, tum-mått och byggtermer. Byggd för hemmafixare,
snickare och alla som stöter på gamla tum-beteckningar som 2×4, 2×6 och 1×6 och snabbt vill
veta vad de motsvarar i millimeter.

> "Kan du hämta en tvåfyra?" → 2×4 = 45 × 95 mm hyvlat, 50 × 100 mm ohyvlat.

## Kom igång

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # produktionsbygge
npm start        # kör produktionsbygget
```

## Funktioner

| Sektion | Beskrivning |
| --- | --- |
| **Hero** | Brädgårdsmotiv med svävande dimensioner (skarp HTML-text ovanpå bilden). |
| **Vad säger snickaren?** | Fritextsökning som tolkar snickarspråk: `2x4`, `tvåfyra`, `45x95`, `1 tum`, `trekvarts`, `regel till innervägg`. Visar hyvlat/ohyvlat, illustration, användning och relaterade dimensioner. Saknas exakt träff visas närmaste alternativ. |
| **Snabbomvandlare** | Tum ⇄ mm live medan du skriver. Stödjer decimaler (`2,5`) och bråk (`3/4`, `1 1/2`). |
| **Tum-tabell** | Standardtabell tum → mm med vanliga namn och kopiering per rad. |
| **Virkesdimensioner** | Hyvlat/ohyvlat-växling, kategorifilter och illustration per dimension. |
| **Byggordbok** | 14 snickarord med beskrivning, bild, exempel, relaterade ord och dimensioner. |
| **FAQ** | Vanliga frågor, även som Schema.org `FAQPage`. |

Dessutom: mörkt läge, sticky navigation, favoriter och sökhistorik (localStorage),
kopiera dimension, dela, "spara till hemskärmen" (PWA) och offline-stöd via service worker.

## Data

All data ligger i JSON och är enkel att utöka – lägg bara till ett objekt:

```
src/data/
  dimensioner.json   # virkesdimensioner (hyvlat/ohyvlat, alias, relaterade)
  byggord.json       # byggordboken
  tumtabell.json     # tum → mm
  faq.json           # frågor och svar
```

Typerna finns i `src/lib/types.ts`. Sökmotorn (`src/lib/search.ts`) normaliserar svenska
tecken (å/ä/ö), enhetstecken och separatorer, så `45×95`, `45x95` och `45 x 95` ger samma träff.
Nya alias läggs till i `aliases`-fältet.

## Teknik

- **Next.js 16** (App Router) + **TypeScript** + **Tailwind CSS v4**
- Temafärger som CSS-variabler i `src/app/globals.css` (`@theme inline`), mörkt läge via `.dark`
- Bilder genererade med OpenAI Image API och optimerade till WebP (hela bildmappen: 248 KB)
- SEO: metadata, Open Graph (`public/og.png`), `robots.txt`, `sitemap.xml`, Schema.org, canonical

## Lighthouse

| | Desktop | Mobil (strypt 4G) |
| --- | --- | --- |
| Performance | 99 | 77–89 |
| Accessibility | 100 | 100 |
| Best Practices | 100 | 100 |
| SEO | 100 | 100 |

CLS 0, total sidvikt 337 KB. Mobilsiffran varierar med maskinens belastning under mätningen;
LCP är hero-fotot, som förladdas och levereras i ~30–40 KB.

## Bildassets

Källbilderna ligger i `assets/generated/` (originalen från bildgenereringen). De optimerade
versioner som webbplatsen använder ligger i `public/images/`. Ikoner och OG-bild genererades
från logotypen med `sharp`.

## Måttens giltighet

Måtten är ungefärliga standardmått. Hyvlat virke är några millimeter mindre än det sågade
(ohyvlade) måttet – en 2×4 är nominellt 50 × 100 mm men mäter 45 × 95 mm hyvlad. Mät alltid
själv vid kritiska mått.
