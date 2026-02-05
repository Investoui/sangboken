"use client";

import { useEffect, useState } from "react";
import { RoomState, SongSection, SongLine } from "@/lib/types";
import { ChordDiagram } from "@/components/ChordDiagram";
import { transposeChord } from "@/lib/transpose";
import { getSong } from "@/lib/songs";

interface ChordLineProps {
  line: SongLine;
  transpose: number;
}

function ChordLine({ line, transpose }: ChordLineProps) {
  // Create chord overlay by positioning chords above the right character
  const chordPositions = line.chords.map((c) => ({
    ...c,
    // Clamp position to lyrics length
    position: Math.min(c.position, line.lyrics.length - 1),
    // Apply transpose to chord name
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

// Extract all chords from a section in order, with optional transposition
function extractChordsFromSection(section: SongSection, transpose: number = 0): string[] {
  const chords: string[] = [];
  for (const line of section.lines) {
    for (const chordPos of line.chords) {
      chords.push(transposeChord(chordPos.chord, transpose));
    }
  }
  return chords;
}

// Chord Diagram Panel component
function ChordDiagramPanel({
  sections,
  currentSection,
  transpose,
  visible,
  onToggle,
}: {
  sections: SongSection[];
  currentSection: number;
  transpose: number;
  visible: boolean;
  onToggle: () => void;
}) {
  const section = sections[currentSection];
  const chords = section ? extractChordsFromSection(section, transpose) : [];

  // Get unique chords in order of first appearance
  const uniqueChords: string[] = [];
  for (const chord of chords) {
    if (!uniqueChords.includes(chord)) {
      uniqueChords.push(chord);
    }
  }

  // Current chord is first, next chord is second (if available)
  const currentChord = uniqueChords[0] || null;
  const nextChord = uniqueChords[1] || null;

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
        <div className="bg-black/80 backdrop-blur-sm border-t border-white/10 h-[200px] flex items-center justify-center gap-16 px-8">
          {currentChord ? (
            <>
              {/* Current chord */}
              <div className="flex flex-col items-center">
                <span className="text-amber-400/60 text-xs uppercase tracking-wider mb-2">
                  Current
                </span>
                <ChordDiagram chordName={currentChord} size="lg" />
              </div>

              {/* Next chord */}
              {nextChord && (
                <div className="flex flex-col items-center opacity-60">
                  <span className="text-white/40 text-xs uppercase tracking-wider mb-2">
                    Next
                  </span>
                  <ChordDiagram chordName={nextChord} size="lg" />
                </div>
              )}
            </>
          ) : (
            <div className="text-white/30">No chords to display</div>
          )}
        </div>
      </div>
    </>
  );
}

export default function RoomDisplayPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const [roomCode, setRoomCode] = useState<string>("");
  const [roomState, setRoomState] = useState<RoomState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCode, setShowCode] = useState(true);
  const [showChordPanel, setShowChordPanel] = useState(true);

  // Get the current song from the library
  const currentSong = roomState?.currentSong ? getSong(roomState.currentSong) : null;
  const sections = currentSong?.sections || [];

  // Resolve params
  useEffect(() => {
    params.then((p) => setRoomCode(p.code.toUpperCase()));
  }, [params]);

  // Connect to SSE stream
  useEffect(() => {
    if (!roomCode) return;

    const eventSource = new EventSource(`/api/room/${roomCode}/stream`);

    eventSource.addEventListener("state", (event) => {
      const state = JSON.parse(event.data) as RoomState;
      setRoomState(state);
      setError(null);
    });

    eventSource.addEventListener("update", (event) => {
      const state = JSON.parse(event.data) as RoomState;
      setRoomState(state);
    });

    eventSource.onerror = () => {
      setError("Connection lost. Reconnecting...");
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [roomCode]);

  // Fade out room code after 10s
  useEffect(() => {
    if (!roomCode) return;

    const timeout = setTimeout(() => {
      setShowCode(false);
    }, 10000);

    return () => {
      clearTimeout(timeout);
    };
  }, [roomCode]);

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-400 text-xl">{error}</div>
      </div>
    );
  }

  if (!roomState) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white/50 text-xl">Connecting...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative">
      {/* Room code badge - fades after 10s */}
      <div
        className={`fixed top-4 right-4 bg-white/10 px-4 py-2 rounded-lg font-mono text-2xl transition-opacity duration-1000 z-30 ${
          showCode ? "opacity-100" : "opacity-0"
        }`}
      >
        {roomCode}
      </div>

      {/* Song display - full song visible at once */}
      {currentSong && sections.length > 0 ? (
        <>
          <div className="h-screen overflow-hidden flex flex-col pb-[220px]">
            <div className="flex-1 flex flex-col p-8 pt-16" style={{ fontSize: 'clamp(0.5rem, 1.5vw, 2rem)' }}>
              {/* Song title */}
              <div className="pb-2">
                <h1 className="text-[1.5em] font-bold text-white mb-1">{currentSong.title}</h1>
                {currentSong.artist && (
                  <div className="text-white/50 text-[0.9em]">{currentSong.artist}</div>
                )}
                {currentSong.key && roomState.transpose !== 0 && (
                  <div className="text-amber-400/60 text-[0.7em] mt-1">
                    Transposed {roomState.transpose > 0 ? "+" : ""}{roomState.transpose} semitones
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
                      <ChordLine key={lineIdx} line={line} transpose={roomState.transpose} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chord diagram panel */}
          <ChordDiagramPanel
            sections={sections}
            currentSection={roomState.currentSection}
            transpose={roomState.transpose}
            visible={showChordPanel}
            onToggle={() => setShowChordPanel(!showChordPanel)}
          />
        </>
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-white/30 text-2xl mb-4">Waiting for song...</div>
            <div className="text-white/20 text-lg">
              Use the controller to select a song
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
