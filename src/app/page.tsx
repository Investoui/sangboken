import Link from "next/link";
import { getAllSongs } from "@/lib/songs";

export default function HomePage() {
  const songs = getAllSongs();

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Sangboken
          </h1>
          <p className="text-white/50 text-lg">
            Norske barnesanger med gitarakkorder
          </p>
        </header>

        {/* Song list */}
        <div className="space-y-2">
          <h2 className="text-white/40 text-xs uppercase tracking-wider mb-4 px-2">
            {songs.length} sanger
          </h2>

          {songs.map((song) => (
            <Link
              key={song.id}
              href={`/sang/${song.id}`}
              className="block p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium truncate flex items-center gap-2">
                    {song.title}
                    {song.format === "tab" && (
                      <span className="text-xs bg-purple-500/30 text-purple-300 px-2 py-0.5 rounded">
                        TAB
                      </span>
                    )}
                  </h3>
                  {song.artist && (
                    <p className="text-white/50 text-sm truncate">
                      {song.artist}
                    </p>
                  )}
                </div>
                {song.key && (
                  <div className="text-amber-400/60 text-sm ml-4 flex-shrink-0">
                    {song.key}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <p className="text-white/30">Gratis sangbok for gitarspillere</p>
            <nav className="flex gap-6">
              <Link
                href="/om-oss"
                className="text-white/50 hover:text-white transition-colors"
              >
                Om oss
              </Link>
              <Link
                href="/hvordan-bruke"
                className="text-white/50 hover:text-white transition-colors"
              >
                Slik bruker du Sangboken
              </Link>
            </nav>
          </div>
        </footer>
      </div>
    </div>
  );
}
