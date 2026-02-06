import { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Logo";

export const metadata: Metadata = {
  title: "Slik bruker du Sangboken",
  description:
    "Lær hvordan du bruker Sangboken til å vise sanger med gitarakkorder – på mobil, nettbrett eller storskjerm.",
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

function NumberBadge({ number }: { number: number }) {
  return (
    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--accent-muted)] text-[var(--accent-primary)] font-display font-bold text-sm flex-shrink-0">
      {number}
    </span>
  );
}

export default function HowToUsePage() {
  return (
    <div className="min-h-screen bg-gradient-radial">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-[var(--accent-primary)] opacity-[0.03] rounded-full blur-3xl" />
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
              Slik bruker du Sangboken
            </h1>
            <p className="text-[var(--text-secondary)] text-lg leading-relaxed">
              Sangboken er enkel å bruke. Her er en rask guide til de viktigste
              funksjonene.
            </p>
          </header>

          {/* Step 1 */}
          <section className="mb-10">
            <div className="flex items-start gap-4">
              <NumberBadge number={1} />
              <div>
                <h2 className="text-xl font-display font-semibold text-[var(--text-primary)] mb-3">
                  Velg en sang
                </h2>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  På forsiden ser du en liste over alle tilgjengelige sanger.
                  Trykk på en sang for å åpne den. Du kan også se hvilken
                  toneart sangen er i (C, D, G osv.).
                </p>
              </div>
            </div>
          </section>

          {/* Step 2 */}
          <section className="mb-10">
            <div className="flex items-start gap-4">
              <NumberBadge number={2} />
              <div>
                <h2 className="text-xl font-display font-semibold text-[var(--text-primary)] mb-3">
                  Bruk på din enhet
                </h2>
                <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                  Sangboken fungerer på alle skjermstørrelser. For gruppesynging
                  kan du også vise på TV:
                </p>

                <div className="space-y-3 card p-4">
                  <div>
                    <span className="text-[var(--text-primary)] font-medium">
                      iPhone/iPad:
                    </span>
                    <span className="text-[var(--text-tertiary)]">
                      {" "}
                      Bruk AirPlay til Apple TV eller AirPlay-kompatibel TV.
                    </span>
                  </div>
                  <div>
                    <span className="text-[var(--text-primary)] font-medium">
                      Android:
                    </span>
                    <span className="text-[var(--text-tertiary)]">
                      {" "}
                      Bruk Chromecast eller skjermdeling.
                    </span>
                  </div>
                  <div>
                    <span className="text-[var(--text-primary)] font-medium">
                      Laptop:
                    </span>
                    <span className="text-[var(--text-tertiary)]">
                      {" "}
                      Koble til TV med HDMI eller bruk trådløs skjermdeling.
                    </span>
                  </div>
                </div>

                <p className="text-[var(--text-tertiary)] text-sm mt-4">
                  Sangboken tilpasser seg automatisk til både liggende og
                  stående visning.
                </p>
              </div>
            </div>
          </section>

          {/* Step 3 */}
          <section className="mb-10">
            <div className="flex items-start gap-4">
              <NumberBadge number={3} />
              <div>
                <h2 className="text-xl font-display font-semibold text-[var(--text-primary)] mb-3">
                  Bruk kontrollene
                </h2>
                <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                  Trykk hvor som helst på skjermen for å vise kontrollene:
                </p>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="badge badge-accent text-xs">+/-</span>
                    <div>
                      <span className="text-[var(--text-primary)] font-medium">
                        Transponer
                      </span>
                      <span className="text-[var(--text-tertiary)]">
                        {" "}
                        - Endre toneart opp eller ned.
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="badge badge-accent text-xs">Akkorder</span>
                    <div>
                      <span className="text-[var(--text-primary)] font-medium">
                        Vis/skjul
                      </span>
                      <span className="text-[var(--text-tertiary)]">
                        {" "}
                        - Slå akkorddiagrammene av eller på.
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="badge badge-accent text-xs">Skjerm</span>
                    <div>
                      <span className="text-[var(--text-primary)] font-medium">
                        Hold på
                      </span>
                      <span className="text-[var(--text-tertiary)]">
                        {" "}
                        - Forhindrer at skjermen slukker.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Step 4 */}
          <section className="mb-10">
            <div className="flex items-start gap-4">
              <NumberBadge number={4} />
              <div>
                <h2 className="text-xl font-display font-semibold text-[var(--text-primary)] mb-3">
                  Les akkordene
                </h2>
                <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                  Akkordene vises over teksten, akkurat der du skal bytte grep.
                  Akkorddiagrammene viser deg hvordan du tar hvert grep:
                </p>

                <div className="card p-4 space-y-2 font-mono text-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-[var(--text-muted)]">│││││</span>
                    <span className="text-[var(--text-tertiary)]">
                      Vertikale linjer = gitarstrenger
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[var(--text-muted)]">─────</span>
                    <span className="text-[var(--text-tertiary)]">
                      Horisontale linjer = bånd
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[var(--accent-primary)]">●</span>
                    <span className="text-[var(--text-tertiary)]">
                      Prikker = fingerplassering
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[var(--text-muted)]">×</span>
                    <span className="text-[var(--text-tertiary)]">
                      X = ikke spill denne strengen
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[var(--text-secondary)]">○</span>
                    <span className="text-[var(--text-tertiary)]">
                      O = åpen streng
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Install as app */}
          <section className="card p-6 mb-10">
            <div className="flex items-start gap-4">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--bg-elevated)] text-xl flex-shrink-0">
                📲
              </span>
              <div>
                <h2 className="text-xl font-display font-semibold text-[var(--text-primary)] mb-2">
                  Installer som app
                </h2>
                <p className="text-[var(--text-secondary)] leading-relaxed mb-3">
                  Legg Sangboken på hjemskjermen for raskere tilgang – uten å åpne
                  nettleseren først.
                </p>
                <Link
                  href="/installer"
                  className="inline-flex items-center gap-2 text-[var(--accent-primary)] font-medium hover:underline"
                >
                  Se hvordan
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
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </section>

          {/* Tips */}
          <section className="card p-6 bg-[var(--accent-muted)] border-[var(--accent-primary)]/20">
            <h2 className="text-xl font-display font-semibold text-[var(--accent-primary)] mb-4">
              Tips for nybegynnere
            </h2>

            <ul className="space-y-3 text-[var(--text-secondary)]">
              <li className="flex gap-2">
                <span className="text-[var(--accent-primary)]">•</span>
                Start med sanger som bare har 2-3 akkorder, som "Bæ bæ lille
                lam" (C og G).
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--accent-primary)]">•</span>
                Øv på akkordene hver for seg før du prøver å spille hele sangen.
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--accent-primary)]">•</span>
                Bruk transponer-funksjonen hvis en akkord er for vanskelig.
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--accent-primary)]">•</span>
                <strong className="text-[var(--text-primary)]">
                  Det viktigste er å ha det gøy!
                </strong>
              </li>
            </ul>
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
              href="/om-oss"
              className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
            >
              Om oss
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
