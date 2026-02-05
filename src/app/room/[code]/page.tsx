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
