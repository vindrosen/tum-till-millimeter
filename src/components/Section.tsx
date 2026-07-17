import type { ReactNode } from "react";

interface SectionProps {
  id?: string;
  icon?: ReactNode;
  eyebrow?: string;
  title: string;
  intro?: string;
  children: ReactNode;
  className?: string;
  tone?: "default" | "soft";
}

export default function Section({
  id,
  icon,
  eyebrow,
  title,
  intro,
  children,
  className = "",
  tone = "default",
}: SectionProps) {
  return (
    <section
      id={id}
      className={`${tone === "soft" ? "wood-band" : ""} scroll-mt-20 ${className}`}
    >
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <header className="mb-8 max-w-2xl">
          {eyebrow && (
            <span className="mb-2 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-wood">
              {icon}
              {eyebrow}
            </span>
          )}
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-wood-strong sm:text-3xl">
            {title}
          </h2>
          {intro && <p className="mt-3 text-base leading-relaxed text-ink-soft">{intro}</p>}
        </header>
        {children}
      </div>
    </section>
  );
}

/** Liten ikon-chip som föregår rubriker (som i mockupen). */
export function IconChip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-wood-soft text-wood-strong">
      {children}
    </span>
  );
}
