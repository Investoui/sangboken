"use client";

import { useEffect, useState, useRef, useCallback } from "react";
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
    <div className="relative mb-6">
      {/* Chord row */}
      <div className="relative h-8 font-mono text-lg">
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
      <div className="font-mono text-2xl text-white whitespace-pre">
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef<number | null>(null);

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

  // Auto-scroll functionality
  const performAutoScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container || !roomState?.autoScroll) return;

    // Calculate scroll speed based on autoScrollSpeed (1=slow, 2=medium, 3=fast)
    // Pixels per frame at 60fps: slow=0.5, medium=1.5, fast=3
    const speedMultiplier = roomState.autoScrollSpeed === 1 ? 0.5
      : roomState.autoScrollSpeed === 2 ? 1.5
      : 3;

    const maxScroll = container.scrollHeight - container.clientHeight;
    const currentScroll = container.scrollTop;

    // Stop at end of song
    if (currentScroll >= maxScroll) {
      return;
    }

    // Scroll smoothly
    container.scrollTop = Math.min(currentScroll + speedMultiplier, maxScroll);
  }, [roomState]);

  // Auto-scroll effect
  useEffect(() => {
    if (!roomState?.autoScroll) {
      // Clear any existing interval when auto-scroll is disabled
      if (autoScrollRef.current !== null) {
        cancelAnimationFrame(autoScrollRef.current);
        autoScrollRef.current = null;
      }
      return;
    }

    // Use requestAnimationFrame for smooth scrolling
    let lastTime = 0;
    const animate = (time: number) => {
      // Throttle to ~60fps
      if (time - lastTime >= 16) {
        performAutoScroll();
        lastTime = time;
      }
      autoScrollRef.current = requestAnimationFrame(animate);
    };

    autoScrollRef.current = requestAnimationFrame(animate);

    return () => {
      if (autoScrollRef.current !== null) {
        cancelAnimationFrame(autoScrollRef.current);
        autoScrollRef.current = null;
      }
    };
  }, [roomState?.autoScroll, performAutoScroll]);

  // Reset scroll position when song changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [roomState?.currentSong]);

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

      {/* Song display with scrollable container */}
      {currentSong && sections.length > 0 ? (
        <>
          <div
            ref={scrollContainerRef}
            className="h-screen overflow-y-auto pb-[220px] scroll-smooth"
          >
            {/* Song title */}
            <div className="p-8 pt-16 pb-4">
              <h1 className="text-3xl font-bold text-white mb-1">{currentSong.title}</h1>
              {currentSong.artist && (
                <div className="text-white/50 text-lg">{currentSong.artist}</div>
              )}
              {currentSong.key && roomState.transpose !== 0 && (
                <div className="text-amber-400/60 text-sm mt-2">
                  Transposed {roomState.transpose > 0 ? "+" : ""}{roomState.transpose} semitones
                </div>
              )}
            </div>

            {/* All sections displayed */}
            {sections.map((section, sectionIdx) => (
              <div key={sectionIdx} className="px-8 pb-8">
                <div className="text-amber-500/60 text-sm uppercase tracking-wider mb-4">
                  {section.name}
                </div>
                {section.lines.map((line, lineIdx) => (
                  <ChordLine key={lineIdx} line={line} transpose={roomState.transpose} />
                ))}
              </div>
            ))}

            {/* End of song indicator */}
            <div className="text-center py-16 text-white/20">
              — End —
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
