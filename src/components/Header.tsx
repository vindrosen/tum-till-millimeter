"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { CloseIcon, MenuIcon } from "./Icons";
import { withBase } from "@/lib/basepath";

const NAV = [
  { href: "#sok", label: "Sök" },
  { href: "#omvandlare", label: "Omvandlare" },
  { href: "#tabeller", label: "Tabeller" },
  { href: "#virke", label: "Virke" },
  { href: "#byggsprak", label: "Byggspråk" },
  { href: "#byggordbok", label: "Byggordbok" },
  { href: "#faq", label: "FAQ" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors ${
        scrolled
          ? "border-border bg-bg/85 backdrop-blur-md"
          : "border-transparent bg-bg/60 backdrop-blur"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6">
        <Link
          href="#top"
          className="group flex items-center gap-2.5"
          onClick={() => setOpen(false)}
        >
          <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-border bg-white shadow-sm">
            <Image
              src={withBase("/images/logo-cube.webp")}
              alt=""
              width={40}
              height={40}
              className="h-9 w-9 object-contain"
              // Eager men medvetet inte "priority": den ska inte förladdas och
              // konkurrera med hero-bilden (LCP) om bandbredden.
              loading="eager"
            />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-[15px] font-extrabold tracking-tight text-wood-strong">
              Tum till Millimeter
            </span>
            <span className="block text-[11px] font-medium text-muted">Förenklar bygget</span>
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 lg:flex" aria-label="Huvudmeny">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-card-muted hover:text-brand"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Stäng meny" : "Öppna meny"}
            aria-expanded={open}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-wood-strong transition-colors hover:bg-card-muted lg:hidden"
          >
            {open ? <MenuIconClose /> : <MenuIcon width={20} height={20} />}
          </button>
        </div>
      </div>

      {/* Mobilmeny */}
      {open && (
        <div className="lg:hidden">
          <nav
            className="mx-auto grid max-w-6xl gap-1 px-4 pb-4 sm:px-6"
            aria-label="Mobilmeny"
          >
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-base font-semibold text-ink transition-colors hover:bg-card-muted hover:text-brand"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

function MenuIconClose() {
  return <CloseIcon width={20} height={20} />;
}
