"use client";

import { useEffect, useState } from "react";
import { RoomState } from "@/lib/types";

// Demo song data structure for chord rendering
// This will be replaced with real data from US-009
interface ChordPosition {
  chord: string;
  position: number;
}

interface SongLine {
  lyrics: string;
  chords: ChordPosition[];
}

interface SongSection {
  name: string;
  lines: SongLine[];
}

// Demo song to showcase chord rendering
const demoSong: SongSection[] = [
  {
    name: "Verse",
    lines: [
      {
        lyrics: "Twinkle twinkle little star",
        chords: [
          { chord: "C", position: 0 },
          { chord: "F", position: 15 },
          { chord: "C", position: 22 },
        ],
      },
      {
        lyrics: "How I wonder what you are",
        chords: [
          { chord: "C", position: 0 },
          { chord: "G", position: 15 },
          { chord: "C", position: 24 },
        ],
      },
      {
        lyrics: "Up above the world so high",
        chords: [
          { chord: "F", position: 0 },
          { chord: "C", position: 13 },
          { chord: "G", position: 20 },
        ],
      },
      {
        lyrics: "Like a diamond in the sky",
        chords: [
          { chord: "F", position: 0 },
          { chord: "C", position: 12 },
          { chord: "G", position: 20 },
          { chord: "C", position: 24 },
        ],
      },
    ],
  },
];

function ChordLine({ line }: { line: SongLine }) {
  // Create chord overlay by positioning chords above the right character
  const chordPositions = line.chords.map((c) => ({
    ...c,
    // Clamp position to lyrics length
    position: Math.min(c.position, line.lyrics.length - 1),
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
            {c.chord}
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

function SongDisplay({
  sections,
  currentSection,
}: {
  sections: SongSection[];
  currentSection: number;
}) {
  const section = sections[currentSection];
  if (!section) return null;

  return (
    <div className="p-8 pt-16">
      <div className="text-amber-500/60 text-sm uppercase tracking-wider mb-4">
        {section.name}
      </div>
      {section.lines.map((line, idx) => (
        <ChordLine key={idx} line={line} />
      ))}
    </div>
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
        className={`fixed top-4 right-4 bg-white/10 px-4 py-2 rounded-lg font-mono text-2xl transition-opacity duration-1000 ${
          showCode ? "opacity-100" : "opacity-0"
        }`}
      >
        {roomCode}
      </div>

      {/* Song display */}
      {roomState.currentSong ? (
        <SongDisplay
          sections={demoSong}
          currentSection={roomState.currentSection}
        />
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
