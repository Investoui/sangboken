import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Slik bruker du Sangboken",
  description:
    "Lær hvordan du bruker Sangboken til å vise barnesanger med gitarakkorder på TV, transponere toneart, og bruke akkorddiagrammer.",
};

export default function HowToUsePage() {
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors"
        >
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
          Tilbake til sangene
        </Link>

        <article className="prose prose-invert prose-amber max-w-none">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Slik bruker du Sangboken
          </h1>

          <p className="text-white/70 text-lg leading-relaxed">
            Sangboken er enkel å bruke. Her er en rask guide til de viktigste
            funksjonene.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">
            1. Velg en sang
          </h2>

          <p className="text-white/70 leading-relaxed">
            På forsiden ser du en liste over alle tilgjengelige sanger. Trykk på
            en sang for å åpne den. Du kan også se hvilken toneart sangen er i
            (C, D, G osv.).
          </p>

          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">
            2. Vis på storskjerm
          </h2>

          <p className="text-white/70 leading-relaxed">
            For beste opplevelse, vis sangene på TV:
          </p>

          <ul className="text-white/70 space-y-2">
            <li>
              <strong className="text-white">iPhone/iPad:</strong> Bruk AirPlay
              til Apple TV eller AirPlay-kompatibel TV.
            </li>
            <li>
              <strong className="text-white">Android:</strong> Bruk Chromecast
              eller skjermdeling.
            </li>
            <li>
              <strong className="text-white">Laptop:</strong> Koble til TV med
              HDMI eller bruk trådløs skjermdeling.
            </li>
          </ul>

          <p className="text-white/70 leading-relaxed mt-4">
            Sangboken er optimert for både liggende og stående visning, og
            tilpasser seg automatisk skjermstørrelsen.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">
            3. Bruk kontrollene
          </h2>

          <p className="text-white/70 leading-relaxed">
            Trykk hvor som helst på skjermen for å vise kontrollene:
          </p>

          <ul className="text-white/70 space-y-2">
            <li>
              <strong className="text-white">Transponer (+/-)</strong> - Endre
              toneart opp eller ned. Nyttig hvis sangen er for høy eller lav for
              stemmen din.
            </li>
            <li>
              <strong className="text-white">Akkorder (på/av)</strong> - Vis
              eller skjul akkorddiagrammene.
            </li>
            <li>
              <strong className="text-white">Skjerm (på/av)</strong> - Hold
              skjermen på slik at den ikke slukker mens du spiller.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">
            4. Les akkordene
          </h2>

          <p className="text-white/70 leading-relaxed">
            Akkordene vises over teksten, akkurat der du skal bytte grep.
            Akkorddiagrammene på siden viser deg hvordan du tar hvert grep på
            gitaren:
          </p>

          <ul className="text-white/70 space-y-2">
            <li>Vertikale linjer = gitarstrengene (tykkest til venstre)</li>
            <li>Horisontale linjer = båndene på gripebrettet</li>
            <li>Prikker = hvor du plasserer fingrene</li>
            <li>X = ikke spill denne strengen</li>
            <li>O = åpen streng (spill uten å trykke ned)</li>
          </ul>

          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">
            Tips for nybegynnere
          </h2>

          <ul className="text-white/70 space-y-3">
            <li>
              Start med sanger som bare har 2-3 akkorder, som "Bæ bæ lille lam"
              (C og G).
            </li>
            <li>
              Øv på akkordene hver for seg før du prøver å spille hele sangen.
            </li>
            <li>
              Bruk transponer-funksjonen hvis en akkord er for vanskelig - kanskje
              finnes det en enklere variant i en annen toneart.
            </li>
            <li>Det viktigste er å ha det gøy sammen med barna!</li>
          </ul>
        </article>

        {/* Footer navigation */}
        <div className="mt-12 pt-8 border-t border-white/10 flex justify-between">
          <Link
            href="/"
            className="text-white/50 hover:text-white transition-colors"
          >
            Alle sanger
          </Link>
          <Link
            href="/om-oss"
            className="text-white/50 hover:text-white transition-colors"
          >
            Om oss
          </Link>
        </div>
      </div>
    </div>
  );
}
