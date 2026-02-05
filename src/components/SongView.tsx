"use client";

import { useState } from "react";
import { Song, SongSection, SongLine } from "@/lib/types";
import { ChordDiagram } from "@/components/ChordDiagram";
import { transposeChord } from "@/lib/transpose";
import Link from "next/link";

interface ChordLineProps {
  line: SongLine;
  transpose: number;
}

function ChordLine({ line, transpose }: ChordLineProps) {
  const chordPositions = line.chords.map((c) => ({
    ...c,
    position: Math.min(c.position, line.lyrics.length - 1),
    displayChord: transposeChord(c.chord, transpose),
  }));

  return (
    <div className="relative mb-2">
      {/* Chord row */}
      <div className="relative h-[1.2em] font-mono text-[0.9em]">
        {chordPositions.map((c, idx) => (
          <span
            key={idx}
            className="absolute text-amber-400 font-bold"
            style={{
              left: `${c.position}ch`,
            }}
          >
            {c.displayChord}
          </span>
        ))}
      </div>
      {/* Lyrics row */}
      <div className="font-mono text-[1em] text-white whitespace-pre">
        {line.lyrics}
      </div>
    </div>
  );
}

// Extract unique chords from ALL sections in order of first appearance
function extractAllUniqueChords(
  sections: SongSection[],
  transpose: number = 0
): string[] {
  const uniqueChords: string[] = [];
  for (const section of sections) {
    for (const line of section.lines) {
      for (const chordPos of line.chords) {
        const transposedChord = transposeChord(chordPos.chord, transpose);
        if (!uniqueChords.includes(transposedChord)) {
          uniqueChords.push(transposedChord);
        }
      }
    }
  }
  return uniqueChords;
}

// Tab Display component - for tablature format
function TabDisplay({ song }: { song: Song }) {
  return (
    <div className="pb-8">
      {/* Tab content - monospace pre-formatted */}
      <pre className="font-mono text-sm md:text-base text-white/90 whitespace-pre overflow-x-auto leading-relaxed">
        {song.rawTab}
      </pre>
    </div>
  );
}

interface SongViewProps {
  song: Song;
  showBackLink?: boolean;
}

export function SongView({ song, showBackLink = true }: SongViewProps) {
  const [transpose, setTranspose] = useState(0);
  const [showChords, setShowChords] = useState(true);

  const uniqueChords = extractAllUniqueChords(song.sections, transpose);
  const isTab = song.format === "tab" && song.rawTab;

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          {showBackLink && (
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-4 transition-colors"
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
              Alle sanger
            </Link>
          )}

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {song.title}
          </h1>
          {song.artist && (
            <p className="text-white/50 text-lg">{song.artist}</p>
          )}
          {song.key && (
            <p className="text-amber-400/60 text-sm mt-1">
              Toneart: {song.key}
              {transpose !== 0 && (
                <span className="ml-2">
                  (transponert {transpose > 0 ? "+" : ""}
                  {transpose})
                </span>
              )}
            </p>
          )}
        </header>

        {/* Controls */}
        {!isTab && (
          <div className="flex flex-wrap items-center gap-4 mb-8 p-4 bg-white/5 rounded-xl">
            {/* Transpose controls */}
            <div className="flex items-center gap-2">
              <span className="text-white/50 text-sm">Transponer:</span>
              <button
                onClick={() => setTranspose((t) => Math.max(t - 1, -6))}
                disabled={transpose <= -6}
                className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:text-white/30 rounded-lg text-white text-xl font-bold transition-colors"
              >
                −
              </button>
              <span className="w-8 text-center text-white font-mono">
                {transpose > 0 ? `+${transpose}` : transpose}
              </span>
              <button
                onClick={() => setTranspose((t) => Math.min(t + 1, 6))}
                disabled={transpose >= 6}
                className="w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:text-white/30 rounded-lg text-white text-xl font-bold transition-colors"
              >
                +
              </button>
            </div>

            {/* Toggle chord diagrams */}
            <button
              onClick={() => setShowChords(!showChords)}
              className={`px-4 h-10 flex items-center gap-2 rounded-lg transition-colors ${
                showChords
                  ? "bg-amber-500/30 text-amber-400"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
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
                  d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m6 10V7m0 10a2 2 0 01-2 2h-2a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10V7"
                />
              </svg>
              Akkorddiagram
            </button>

            {/* Mirror mode link */}
            <Link
              href="/mirror"
              className="px-4 h-10 flex items-center gap-2 rounded-lg bg-white/10 text-white/70 hover:bg-white/20 transition-colors ml-auto"
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
        )}

        {/* Chord diagrams */}
        {!isTab && showChords && uniqueChords.length > 0 && (
          <div className="mb-8 p-4 bg-white/5 rounded-xl">
            <div className="text-white/40 text-xs uppercase tracking-wider mb-3">
              Akkorder
            </div>
            <div className="flex flex-wrap gap-4">
              {uniqueChords.map((chord, idx) => (
                <ChordDiagram key={idx} chordName={chord} size="md" />
              ))}
            </div>
          </div>
        )}

        {/* Song content */}
        <div className="text-base md:text-lg">
          {isTab ? (
            <TabDisplay song={song} />
          ) : (
            <div className="space-y-6">
              {song.sections.map((section, sectionIdx) => (
                <div key={sectionIdx}>
                  <div className="text-amber-500/60 text-sm uppercase tracking-wider mb-3">
                    {section.name}
                  </div>
                  {section.lines.map((line, lineIdx) => (
                    <ChordLine key={lineIdx} line={line} transpose={transpose} />
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
