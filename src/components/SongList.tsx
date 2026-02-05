"use client";

import { useState } from "react";
import Link from "next/link";
import { Song } from "@/lib/types";

// Search icon
function SearchIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

// Clear/X icon
function ClearIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

// Musical note icon for decoration
function MusicNote({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
    </svg>
  );
}

interface SongListProps {
  songs: Song[];
}

export function SongList({ songs }: SongListProps) {
  const [search, setSearch] = useState("");

  const filteredSongs = songs.filter((song) => {
    const query = search.toLowerCase().trim();
    if (!query) return true;

    const titleMatch = song.title.toLowerCase().includes(query);
    const artistMatch = song.artist?.toLowerCase().includes(query) ?? false;

    return titleMatch || artistMatch;
  });

  return (
    <>
      {/* Search bar */}
      <div className="mb-6">
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Søk etter sang eller artist..."
            className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-amber-500/50 focus:bg-white/10 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
              aria-label="Tøm søk"
            >
              <ClearIcon />
            </button>
          )}
        </div>
      </div>

      {/* Song count badge */}
      <div className="flex items-center gap-2 mb-6">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-400 text-sm">
          <MusicNote className="w-3.5 h-3.5" />
          <span>
            {filteredSongs.length === songs.length
              ? `${songs.length} sanger`
              : `${filteredSongs.length} av ${songs.length} sanger`}
          </span>
        </div>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      {/* Song list */}
      <div className="space-y-2">
        {filteredSongs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/50">Ingen sanger funnet for "{search}"</p>
            <button
              onClick={() => setSearch("")}
              className="mt-4 text-amber-400 hover:text-amber-300 transition-colors"
            >
              Vis alle sanger
            </button>
          </div>
        ) : (
          filteredSongs.map((song) => (
            <Link
              key={song.id}
              href={`/sang/${song.id}`}
              className="block p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors group"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium text-lg truncate flex items-center gap-2">
                    {song.title}
                    {song.format === "tab" && (
                      <span className="text-xs bg-purple-500/30 text-purple-300 px-2 py-0.5 rounded">
                        TAB
                      </span>
                    )}
                  </h3>
                  {song.artist && (
                    <p className="text-white/50 text-sm truncate mt-0.5">
                      {song.artist}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  {song.key && (
                    <div className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 font-mono text-xs">
                      {song.key}
                    </div>
                  )}
                  <svg
                    className="w-5 h-5 text-white/30 group-hover:text-amber-400 group-hover:translate-x-1 transition-all"
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
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </>
  );
}
