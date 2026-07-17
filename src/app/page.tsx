import Hero from "@/components/Hero";
import Section, { IconChip } from "@/components/Section";
import SnickarSearch from "@/components/SnickarSearch";
import Converter from "@/components/Converter";
import TumTabell from "@/components/TumTabell";
import VirkeTabell from "@/components/VirkeTabell";
import SpikTabell from "@/components/SpikTabell";
import SkruvTabell from "@/components/SkruvTabell";
import RorTabell from "@/components/RorTabell";
import Bygguttryck from "@/components/Bygguttryck";
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
  ChatIcon,
  NailIcon,
  ScrewIcon,
  PipeIcon,
  QuoteIcon,
} from "@/components/Icons";

/** Rubrik + ingress för en undersektion i Byggspråk. */
function UnderSektion({
  id,
  icon,
  title,
  intro,
  children,
}: {
  id: string;
  icon: React.ReactNode;
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-rubrik`} className="scroll-mt-24">
      <header className="mb-5 max-w-2xl">
        <h3
          id={`${id}-rubrik`}
          className="flex items-center gap-3 font-display text-xl font-extrabold tracking-tight text-wood-strong sm:text-2xl"
        >
          <IconChip>{icon}</IconChip>
          {title}
        </h3>
        <p className="mt-3 text-base leading-relaxed text-ink-soft">{intro}</p>
      </header>
      {children}
    </section>
  );
}

export default function Home() {
  const jsonLd = buildJsonLd();

  return (
    <>
      <Hero />

      {/* Extra ankare för djuplänkar till snickarspråks-sökningen. */}
      <span id="snickarsprak" aria-hidden="true" />

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

      {/* Extra ankare för djuplänkar till traditionella mått. */}
      <span id="traditionella-matt" aria-hidden="true" />

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

      {/* Byggspråk – gamla mått, uttryck och benämningar */}
      <Section
        id="byggsprak"
        eyebrow="Snickarspråk"
        icon={<ChatIcon width={18} height={18} />}
        title="Byggspråk"
        intro="Gamla mått, uttryck och benämningar som fortfarande används av snickare."
      >
        <div className="space-y-14">
          <UnderSektion
            id="spik"
            icon={<NailIcon width={20} height={20} />}
            title="Spiklängder"
            intro="Spik beställs fortfarande i tum: en fyrtumsspik är 100 mm och kallas därför också 100-spik. Sök på tumnamnet eller millimeterlängden – båda hittar rätt."
          >
            <SpikTabell />
          </UnderSektion>

          <UnderSektion
            id="skruvar"
            icon={<ScrewIcon width={20} height={20} />}
            title="Skruvar"
            intro="Träskruv följer samma tumlogik som spik. Här är de vanligaste längderna och vad de brukar användas till."
          >
            <SkruvTabell />
          </UnderSektion>

          <UnderSektion
            id="rordimensioner"
            icon={<PipeIcon width={20} height={20} />}
            title="Rördimensioner"
            intro="Rör i tum är något helt eget – ett halvtumsrör är varken 12,7 mm invändigt eller utvändigt. Tabellen visar vad tummåtten faktiskt motsvarar."
          >
            <RorTabell />
          </UnderSektion>

          <UnderSektion
            id="bygguttryck"
            icon={<QuoteIcon width={20} height={20} />}
            title="Bygguttryck"
            intro="Syll, hammarband, kortling och lockläkt – uttrycken som hörs på bygget, förklarade med bild, mått och relaterade ord."
          >
            <Bygguttryck />
          </UnderSektion>
        </div>
      </Section>

      {/* Byggordbok */}
      <Section
        id="byggordbok"
        tone="soft"
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
