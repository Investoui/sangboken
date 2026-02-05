import { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Logo";

export const metadata: Metadata = {
  title: "Om oss",
  description:
    "Sangboken er en gratis digital sangbok med gitarakkorder for norske sanger. Fungerer på mobil, nettbrett og storskjerm.",
};

function BackIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 19l-7-7 7-7"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      className="w-5 h-5 text-[var(--accent-primary)] flex-shrink-0 mt-0.5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-radial">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[var(--accent-primary)] opacity-[0.03] rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-3xl mx-auto px-4 py-8 safe-area-inset">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] mb-8 transition-colors animate-fade-down"
        >
          <BackIcon />
          <span>Tilbake til sangene</span>
        </Link>

        <article className="animate-fade-up">
          <header className="mb-10">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-[var(--text-primary)] mb-4">
              Om Sangboken
            </h1>
            <p className="text-[var(--text-secondary)] text-lg leading-relaxed">
              Sangboken er en gratis digital sangbok laget for alle som vil
              synge sammen. Vi samler norske sanger og viser dem med
              gitarakkorder – på mobil, nettbrett eller storskjerm.
            </p>
          </header>

          <section className="mb-10">
            <h2 className="text-2xl font-display font-semibold text-[var(--text-primary)] mb-6">
              Hvorfor Sangboken?
            </h2>

            <div className="space-y-4">
              {[
                {
                  title: "Gratis og reklamefri",
                  desc: "Ingen kostnader, ingen distraksjoner.",
                },
                {
                  title: "Fungerer overalt",
                  desc: "Bruk på mobil, nettbrett eller vis på storskjerm via AirPlay/Chromecast.",
                },
                {
                  title: "Akkorddiagrammer",
                  desc: "Se hvordan du tar akkordene rett på skjermen.",
                },
                {
                  title: "Transponer",
                  desc: "Tilpass toneart til din stemme eller instrument.",
                },
                {
                  title: "Norske sanger",
                  desc: "Barnesanger, allsangklassikere og tradisjonelle viser.",
                },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <CheckIcon />
                  <div>
                    <span className="text-[var(--text-primary)] font-medium">
                      {item.title}
                    </span>
                    <span className="text-[var(--text-tertiary)]">
                      {" "}
                      - {item.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-display font-semibold text-[var(--text-primary)] mb-4">
              For hvem?
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Sangboken er laget for alle som vil synge og spille gitar –
              familier, vennegjenger, barnehager eller bare deg selv. Du trenger
              ikke være en profesjonell musiker – akkordene er enkle, og sangene
              er velkjente.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-display font-semibold text-[var(--text-primary)] mb-4">
              Norske sanger
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Vi fokuserer på norske sanger: barnesanger som "Bæ bæ lille lam"
              og "Bjørnen sover", allsangklassikere, og tradisjonelle viser.
              Sangene er en del av norsk kulturarv.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-display font-semibold text-[var(--text-primary)] mb-4">
              Kontakt
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Har du spørsmål, forslag til sanger, eller finner du feil i tekst
              eller akkorder? Ta kontakt på{" "}
              <a
                href="mailto:hei@sangboken.no"
                className="text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] transition-colors underline underline-offset-2"
              >
                hei@sangboken.no
              </a>
              .
            </p>
          </section>
        </article>

        {/* Footer navigation */}
        <footer className="mt-12 pt-8 border-t border-[var(--border-subtle)] animate-fade-up">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
            >
              Alle sanger
            </Link>
            <Logo size="sm" variant="icon" />
            <Link
              href="/hvordan-bruke"
              className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
            >
              Brukerveiledning
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
