import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Om oss",
  description:
    "Sangboken er en gratis digital sangbok med gitarakkorder for norske barnesanger. Laget for familier som vil synge sammen.",
};

export default function AboutPage() {
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
            Om Sangboken
          </h1>

          <p className="text-white/70 text-lg leading-relaxed">
            Sangboken er en gratis digital sangbok laget for norske familier som
            vil synge sammen. Vi samler tradisjonelle barnesanger og viser dem
            med gitarakkorder, slik at det blir enkelt å spille og synge.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">
            Hvorfor Sangboken?
          </h2>

          <ul className="text-white/70 space-y-3">
            <li>
              <strong className="text-white">Gratis og reklamefri</strong> -
              Ingen kostnader, ingen distraksjoner.
            </li>
            <li>
              <strong className="text-white">Optimert for TV</strong> - Vis
              sangene på storskjerm via AirPlay eller Chromecast.
            </li>
            <li>
              <strong className="text-white">Akkorddiagrammer</strong> - Se
              hvordan du tar akkordene rett på skjermen.
            </li>
            <li>
              <strong className="text-white">Transponer</strong> - Tilpass
              toneart til din stemme eller instrument.
            </li>
            <li>
              <strong className="text-white">Norske sanger</strong> - Fokus på
              tradisjonelle norske barnesanger.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">
            For hvem?
          </h2>

          <p className="text-white/70 leading-relaxed">
            Sangboken er laget for foreldre, besteforeldre, barnehagelærere og
            alle andre som vil synge med barn. Du trenger ikke være en
            profesjonell musiker - akkordene er enkle, og sangene er velkjente.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">
            Tradisjonelle sanger
          </h2>

          <p className="text-white/70 leading-relaxed">
            Vi fokuserer på sanger som har gått i generasjoner: "Bæ bæ lille
            lam", "Bjørnen sover", "Lille Petter Edderkopp" og mange flere.
            Disse sangene er en del av norsk kulturarv og er fri for opphavsrett.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">
            Kontakt
          </h2>

          <p className="text-white/70 leading-relaxed">
            Har du spørsmål, forslag til sanger, eller finner du feil i tekst
            eller akkorder? Ta kontakt på{" "}
            <a
              href="mailto:hei@sangboken.no"
              className="text-amber-400 hover:text-amber-300"
            >
              hei@sangboken.no
            </a>
            .
          </p>
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
            href="/hvordan-bruke"
            className="text-white/50 hover:text-white transition-colors"
          >
            Slik bruker du Sangboken
          </Link>
        </div>
      </div>
    </div>
  );
}
