"use client";

import { useState } from "react";
import { SongSection, SongLine, Song } from "@/lib/types";
import { ChordDiagram } from "@/components/ChordDiagram";
import { transposeChord } from "@/lib/transpose";
import { getAllSongs } from "@/lib/songs";

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
function extractAllUniqueChords(sections: SongSection[], transpose: number = 0): string[] {
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

// Chord Diagram Panel component
function ChordDiagramPanel({
  sections,
  transpose,
  visible,
  onToggle,
}: {
  sections: SongSection[];
  transpose: number;
  visible: boolean;
  onToggle: () => void;
}) {
  const uniqueChords = extractAllUniqueChords(sections, transpose);

  return (
    <>
      {/* Toggle button - always visible */}
      <button
        onClick={onToggle}
        className="fixed bottom-4 right-4 z-20 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-white/70 hover:text-white transition-colors text-sm"
      >
        {visible ? "Hide Chords" : "Show Chords"}
      </button>

      {/* Chord panel */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-10 transition-transform duration-300 ${
          visible ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="bg-black/80 backdrop-blur-sm border-t border-white/10 h-[200px] flex items-center px-4">
          {uniqueChords.length > 0 ? (
            <div className="flex gap-6 overflow-x-auto w-full py-4 px-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
              {uniqueChords.map((chord, idx) => (
                <div key={idx} className="flex-shrink-0">
                  <ChordDiagram chordName={chord} size="md" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-white/30 w-full text-center">No chords to display</div>
          )}
        </div>
      </div>
    </>
  );
}

// Song Display component
function SongDisplay({
  song,
  transpose,
}: {
  song: Song;
  transpose: number;
}) {
  const sections = song.sections;

  return (
    <div className="h-screen overflow-hidden flex flex-col pb-[220px]">
      <div className="flex-1 flex flex-col p-8 pt-16" style={{ fontSize: 'clamp(0.5rem, 1.5vw, 2rem)' }}>
        {/* Song title */}
        <div className="pb-2">
          <h1 className="text-[1.5em] font-bold text-white mb-1">{song.title}</h1>
          {song.artist && (
            <div className="text-white/50 text-[0.9em]">{song.artist}</div>
          )}
          {song.key && transpose !== 0 && (
            <div className="text-amber-400/60 text-[0.7em] mt-1">
              Transposed {transpose > 0 ? "+" : ""}{transpose} semitones
            </div>
          )}
        </div>

        {/* All sections displayed */}
        <div className="flex-1 flex flex-col justify-start gap-4">
          {sections.map((section, sectionIdx) => (
            <div key={sectionIdx}>
              <div className="text-amber-500/60 text-[0.7em] uppercase tracking-wider mb-2">
                {section.name}
              </div>
              {section.lines.map((line, lineIdx) => (
                <ChordLine key={lineIdx} line={line} transpose={transpose} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MirrorPage() {
  // Get all songs and default to first one
  const allSongs = getAllSongs();
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [transpose, setTranspose] = useState(0);
  const [showChordPanel, setShowChordPanel] = useState(true);

  const currentSong = allSongs[currentSongIndex];

  // If no songs available, show message
  if (!currentSong) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white/50 text-xl">No songs available</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative">
      {/* Song display */}
      <SongDisplay song={currentSong} transpose={transpose} />

      {/* Chord diagram panel */}
      <ChordDiagramPanel
        sections={currentSong.sections}
        transpose={transpose}
        visible={showChordPanel}
        onToggle={() => setShowChordPanel(!showChordPanel)}
      />
    </div>
  );
}
