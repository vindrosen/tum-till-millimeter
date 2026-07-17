import Image from "next/image";
import { ArrowRightIcon, RulerIcon, SwapIcon } from "./Icons";
import { withBase } from "@/lib/basepath";

interface Badge {
  /** Placeras endast i ytor som är fria från textkolumnen (md och uppåt). */
  pos: string;
  main: string;
  sub: string;
  delay: string;
}

const BADGES: Badge[] = [
  { pos: "left-[18%] top-[5%]", main: "2×4", sub: "45×95 mm", delay: "0.8s" },
  { pos: "left-[41%] top-[7%]", main: "1½″", sub: "38,1 mm", delay: "0s" },
  { pos: "right-[5%] top-[8%]", main: "25×100", sub: "mm", delay: "1.6s" },
  { pos: "right-[3%] top-[31%]", main: "1″", sub: "25,4 mm", delay: "0.4s" },
  { pos: "right-[6%] top-[54%]", main: "2×6", sub: "45×145 mm", delay: "2.4s" },
  { pos: "left-[54%] top-[76%]", main: "3/4″", sub: "19,1 mm", delay: "1.2s" },
];

export default function Hero() {
  return (
    <section className="wood-band" aria-labelledby="hero-rubrik">
      <div className="mx-auto max-w-6xl px-4 pt-6 pb-10 sm:px-6 sm:pt-10 sm:pb-14">
        <div className="relative overflow-hidden rounded-3xl border border-border shadow-lg">
          {/* Bakgrundsbild */}
          <Image
            src={withBase("/images/hero-carpenter.webp")}
            alt="Snickare på en svensk brädgård med travar av virke som räknar ut hur tum och millimeter hänger ihop"
            fill
            priority
            quality={68}
            sizes="(max-width: 1152px) 100vw, 1152px"
            className="object-cover object-[68%_center]"
          />

          {/* Läsbarhets-scrim */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(96deg, rgba(24,15,7,0.82) 0%, rgba(24,15,7,0.55) 34%, rgba(24,15,7,0.12) 58%, rgba(24,15,7,0) 74%)",
            }}
          />
          <div
            className="absolute inset-0 sm:hidden"
            style={{
              background:
                "linear-gradient(180deg, rgba(24,15,7,0.15) 0%, rgba(24,15,7,0.35) 55%, rgba(24,15,7,0.85) 100%)",
            }}
          />

          {/* Flytande dimensioner – döljs på mobil där texten tar hela ytan */}
          <div className="pointer-events-none absolute inset-0 hidden md:block" aria-hidden="true">
            {BADGES.map((b) => (
              <span
                key={b.main + b.pos}
                className={`animate-floaty absolute ${b.pos} flex flex-col items-center rounded-2xl border border-white/25 bg-white/12 px-3 py-1.5 text-center backdrop-blur-sm`}
                style={{ animationDelay: b.delay }}
              >
                <span className="font-display text-base font-extrabold leading-none text-white drop-shadow lg:text-lg">
                  {b.main}
                </span>
                <span className="text-[11px] font-semibold leading-tight text-amber-200/95">
                  {b.sub}
                </span>
              </span>
            ))}
          </div>

          {/* Text */}
          <div className="relative flex min-h-[440px] flex-col justify-end p-6 sm:min-h-[500px] sm:justify-center sm:p-10 lg:min-h-[560px] lg:p-14">
            <div className="max-w-lg">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/25 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-100 backdrop-blur-sm">
                Brädgård · Rätt virke till rätt projekt
              </span>
              <h1
                id="hero-rubrik"
                className="mt-4 font-display text-4xl font-extrabold leading-[1.04] tracking-tight text-white drop-shadow-sm sm:text-5xl lg:text-6xl"
              >
                Tum eller mm?
                <span className="block text-amber-200">Här ser du vad det egentligen är.</span>
              </h1>
              <p className="mt-4 max-w-md text-base font-medium text-amber-50/90 sm:text-lg">
                En enkel guide för reglar, brädor och tum-mått.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#tabeller"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-base font-bold text-brand-ink shadow-lg transition-transform hover:bg-brand-hover hover:scale-[1.02] active:scale-100"
                >
                  <RulerIcon width={20} height={20} />
                  Visa tabeller
                </a>
                <a
                  href="#omvandlare"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-base font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                >
                  <SwapIcon width={20} height={20} />
                  Öppna omvandlaren
                  <ArrowRightIcon width={18} height={18} className="opacity-80" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
