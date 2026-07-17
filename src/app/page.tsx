import Hero from "@/components/Hero";
import Section, { IconChip } from "@/components/Section";
import SnickarSearch from "@/components/SnickarSearch";
import Converter from "@/components/Converter";
import TumTabell from "@/components/TumTabell";
import VirkeTabell from "@/components/VirkeTabell";
import Byggordbok from "@/components/Byggordbok";
import FaqAccordion from "@/components/FaqAccordion";
import TipsBar from "@/components/TipsBar";
import Footer from "@/components/Footer";
import { faq } from "@/lib/data";
import { buildJsonLd } from "@/lib/jsonld";
import {
  InfoIcon,
  QuestionIcon,
  RulerIcon,
  WoodIcon,
  BookIcon,
  SearchIcon,
} from "@/components/Icons";

export default function Home() {
  const jsonLd = buildJsonLd();

  return (
    <>
      <Hero />

      {/* Vad säger snickaren? – intelligent sökning */}
      <Section
        id="sok"
        eyebrow="Vad säger snickaren?"
        icon={<SearchIcon width={18} height={18} />}
        title="Skriv fritt – vi tolkar snickarspråket"
        intro="Skriv en dimension, ett mått eller ett snickarord så visar vi hyvlat och ohyvlat mått, illustration, vanlig användning och relaterade dimensioner. Hittar vi ingen exakt träff visar vi närmaste alternativ."
      >
        <SnickarSearch />
      </Section>

      {/* Tre-kortsrad: Varför tum? · Snabbomvandlare · Vanliga frågor */}
      <section id="omvandlare" className="wood-band scroll-mt-20">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="grid gap-5 lg:grid-cols-3">
            {/* Varför tum? */}
            <div className="card p-5 sm:p-6">
              <div className="mb-4 flex items-center gap-3">
                <IconChip>
                  <InfoIcon width={20} height={20} />
                </IconChip>
                <h3 className="font-display text-lg font-extrabold text-wood-strong">Varför tum?</h3>
              </div>
              <p className="text-sm leading-relaxed text-ink-soft">
                I byggsammanhang används ofta tum (″) för att beskriva trädimensioner. Men i Sverige
                mäter vi i millimeter (mm). Tabellerna och verktygen här hjälper dig att snabbt se
                vad som är vad.
              </p>
              <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-xl border border-border bg-card-muted px-3 py-2">
                  <dt className="text-xs font-bold uppercase tracking-wide text-muted">1 tum</dt>
                  <dd className="tabnum font-extrabold text-ink">25,4 mm</dd>
                </div>
                <div className="rounded-xl border border-border bg-card-muted px-3 py-2">
                  <dt className="text-xs font-bold uppercase tracking-wide text-muted">2×4 hyvlat</dt>
                  <dd className="tabnum font-extrabold text-ink">45×95 mm</dd>
                </div>
              </dl>
            </div>

            {/* Snabbomvandlare */}
            <Converter />

            {/* Vanliga frågor (förhandsvisning) */}
            <div className="card p-5 sm:p-6">
              <div className="mb-4 flex items-center gap-3">
                <IconChip>
                  <QuestionIcon width={20} height={20} />
                </IconChip>
                <h3 className="font-display text-lg font-extrabold text-wood-strong">
                  Vanliga frågor
                </h3>
              </div>
              <FaqAccordion items={faq} limit={3} moreHref="#faq" compact />
            </div>
          </div>
        </div>
      </section>

      {/* Standard tum-tabell */}
      <Section
        id="tabeller"
        eyebrow="Tabell"
        icon={<RulerIcon width={18} height={18} />}
        title="Standard tum till millimeter"
        intro="Snabbreferens för de vanligaste tum-måtten och vad de heter i dagligt tal."
      >
        <TumTabell />
      </Section>

      {/* Virkesdimensioner */}
      <Section
        id="virke"
        tone="soft"
        eyebrow="Virkesdimensioner"
        icon={<WoodIcon width={18} height={18} />}
        title="Vanliga virkesdimensioner"
        intro="Jämför hyvlat och ohyvlat mått för reglar, brädor och bjälkar. Växla mellan ytorna och filtrera på kategori."
      >
        <VirkeTabell />
      </Section>

      {/* Byggordbok */}
      <Section
        id="byggordbok"
        eyebrow="Byggordbok"
        icon={<BookIcon width={18} height={18} />}
        title="Snickarord förklarade"
        intro="Slå upp vanliga byggord och snickartermer med enkel beskrivning, bild, exempel, relaterade ord och vanliga dimensioner."
      >
        <Byggordbok />
      </Section>

      {/* FAQ */}
      <Section
        id="faq"
        tone="soft"
        eyebrow="FAQ"
        icon={<QuestionIcon width={18} height={18} />}
        title="Frågor och svar om tum och virke"
        intro="Det du oftast undrar över när gamla tum-mått möter moderna millimeter."
      >
        <div className="max-w-3xl">
          <FaqAccordion items={faq} />
        </div>
      </Section>

      <TipsBar />
      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
