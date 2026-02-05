import Link from "next/link";
import { getAllSongs } from "@/lib/songs";
import { Logo } from "@/components/Logo";
import { SongList } from "@/components/SongList";

// Guitar icon
function GuitarIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11.5 2.5a2.5 2.5 0 0 1 5 0v2l1.5 1.5-1.5 1.5v3.5a7 7 0 1 1-5-6.7V2.5z" />
      <circle cx="11.5" cy="16" r="1.5" />
      <path d="M11.5 13v-2" />
    </svg>
  );
}

// Guitar neck/fretboard icon
function ChordLibraryIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="10" x2="20" y2="10" />
      <line x1="4" y1="14" x2="20" y2="14" />
      <line x1="4" y1="18" x2="20" y2="18" />
      <line x1="8" y1="2" x2="8" y2="22" />
      <line x1="12" y1="2" x2="12" y2="22" />
      <line x1="16" y1="2" x2="16" y2="22" />
    </svg>
  );
}

// Tuning fork icon
function TunerIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 3v10M16 3v10M8 13c0 2.5 2 4 4 4s4-1.5 4-4M12 17v5" />
    </svg>
  );
}

export default function HomePage() {
  const songs = getAllSongs();

  return (
    <div className="min-h-screen bg-[#111113]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-12">
          <div className="flex flex-col items-center text-center gap-4">
            <Logo size="xl" />
            <p className="text-white/60 text-lg max-w-md">
              Den digitale sangboken med gitarakkorder
            </p>
          </div>

          {/* Quick action buttons */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <Link
              href="/akkorder"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/15 rounded-xl text-white/80 hover:text-white transition-colors"
            >
              <ChordLibraryIcon className="w-5 h-5" />
              <span>Akkordbibliotek</span>
            </Link>
            <Link
              href="/stemmer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/15 rounded-xl text-white/80 hover:text-white transition-colors"
            >
              <TunerIcon className="w-5 h-5" />
              <span>Gitarstemmer</span>
            </Link>
            <Link
              href="/hvordan-bruke"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/15 rounded-xl text-white/80 hover:text-white transition-colors"
            >
              <GuitarIcon className="w-5 h-5" />
              <span>Slik bruker du appen</span>
            </Link>
          </div>
        </header>

        {/* Song list with search */}
        <SongList songs={songs} />

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Logo size="sm" variant="icon" />
              <span className="text-white/40 text-sm">
                Gratis sangbok for gitarspillere
              </span>
            </div>

            <nav className="flex gap-6">
              <Link
                href="/om-oss"
                className="text-white/50 hover:text-white transition-colors text-sm"
              >
                Om oss
              </Link>
              <Link
                href="/hvordan-bruke"
                className="text-white/50 hover:text-white transition-colors text-sm"
              >
                Brukerveiledning
              </Link>
            </nav>
          </div>

          {/* Install prompt hint */}
          <div className="mt-8 text-center">
            <p className="text-white/30 text-xs">
              Tips: Legg til Sangboken på hjemskjermen for en app-opplevelse
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
