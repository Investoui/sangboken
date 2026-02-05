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

        {/* Quick actions */}
        <div className="flex justify-center gap-4 mb-8">
          <Link
            href="/mirror"
            className="px-6 py-3 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded-xl transition-colors flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Vis på TV
          </Link>
        </div>

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
                    <p className="text-white/50 text-sm truncate">{song.artist}</p>
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
        <footer className="mt-12 pt-8 border-t border-white/10 text-center">
          <p className="text-white/30 text-sm">
            Gratis sangbok for gitarspillere
          </p>
        </footer>
      </div>
    </div>
  );
}
