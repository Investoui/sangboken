"use client";

import { useEffect, useState, useCallback } from "react";
import { RoomState, RoomCommand } from "@/lib/types";
import { getAllSongs } from "@/lib/songs";

export default function ControllerPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const [roomCode, setRoomCode] = useState<string>("");
  const [roomState, setRoomState] = useState<RoomState | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Resolve params
  useEffect(() => {
    params.then((p) => setRoomCode(p.code.toUpperCase()));
  }, [params]);

  // Connect to SSE stream to get room updates
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
      setError("Connection lost");
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [roomCode]);

  // Send command to the room
  const sendCommand = useCallback(
    async (command: RoomCommand) => {
      if (!roomCode) return;

      try {
        const response = await fetch(`/api/room/${roomCode}/command`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(command),
        });

        if (!response.ok) {
          console.error("Command failed:", await response.text());
        }
      } catch (err) {
        console.error("Failed to send command:", err);
      }
    },
    [roomCode]
  );

  const handlePrevSection = () => {
    sendCommand({ type: "prevSection" });
  };

  const handleNextSection = () => {
    sendCommand({ type: "nextSection" });
  };

  const handleScrollChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const position = parseInt(e.target.value, 10);
    sendCommand({ type: "scroll", position });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        <div className="text-red-400 text-xl mb-4">{error}</div>
        <a
          href="/join"
          className="text-amber-400 hover:text-amber-300 underline"
        >
          Try again
        </a>
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
    <div className="min-h-screen bg-black p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-semibold">Controller</h1>
        <div className="bg-white/10 px-3 py-1 rounded font-mono text-lg">
          {roomCode}
        </div>
      </div>

      {/* Song selection */}
      <div className="mb-6">
        <div className="text-white/60 text-sm mb-3">Select Song</div>
        <div className="space-y-2">
          {getAllSongs().map((song) => (
            <button
              key={song.id}
              onClick={() => sendCommand({ type: "setSong", songId: song.id })}
              className={`w-full text-left p-4 rounded-lg transition-colors ${
                roomState.currentSong === song.id
                  ? "bg-amber-400/20 border border-amber-400/50"
                  : "bg-white/5 hover:bg-white/10 active:bg-white/15"
              }`}
            >
              <div className={`font-medium ${
                roomState.currentSong === song.id ? "text-amber-400" : "text-white"
              }`}>
                {song.title}
              </div>
              {song.artist && (
                <div className="text-white/40 text-sm mt-0.5">{song.artist}</div>
              )}
              {song.key && (
                <div className="text-white/30 text-xs mt-1">Key: {song.key}</div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Current section info */}
      <div className="bg-white/5 rounded-lg p-4 mb-6">
        <div className="text-white/40 text-sm mb-1">Now Playing</div>
        <div className="text-lg">
          {roomState.currentSong ? (
            getAllSongs().find(s => s.id === roomState.currentSong)?.title || roomState.currentSong
          ) : (
            <span className="text-white/30">No song selected</span>
          )}
        </div>
        <div className="text-white/40 text-sm mt-2">
          Section {roomState.currentSection + 1}
        </div>
      </div>

      {/* Section navigation */}
      <div className="mb-8">
        <div className="text-white/60 text-sm mb-3">Section Navigation</div>
        <div className="flex gap-4">
          <button
            onClick={handlePrevSection}
            className="flex-1 bg-white/10 hover:bg-white/20 active:bg-white/30 py-4 rounded-lg text-lg font-medium transition-colors"
          >
            ← Prev
          </button>
          <button
            onClick={handleNextSection}
            className="flex-1 bg-white/10 hover:bg-white/20 active:bg-white/30 py-4 rounded-lg text-lg font-medium transition-colors"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Scroll position */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white/60 text-sm">Scroll Position</span>
          <span className="text-white/40 text-sm font-mono">
            {roomState.scrollPosition}%
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={roomState.scrollPosition}
          onChange={handleScrollChange}
          className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-400"
        />
      </div>

      {/* Transpose controls */}
      <div className="mb-8">
        <div className="text-white/60 text-sm mb-3">Transpose</div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => sendCommand({ type: "transpose", value: roomState.transpose - 1 })}
            disabled={roomState.transpose <= -6}
            className="flex-1 bg-white/10 hover:bg-white/20 active:bg-white/30 disabled:bg-white/5 disabled:text-white/30 py-4 rounded-lg text-2xl font-bold transition-colors"
          >
            −
          </button>
          <div className="w-20 text-center">
            <div className="text-3xl font-mono font-bold text-amber-400">
              {roomState.transpose > 0 ? "+" : ""}{roomState.transpose}
            </div>
            <div className="text-white/40 text-xs mt-1">semitones</div>
          </div>
          <button
            onClick={() => sendCommand({ type: "transpose", value: roomState.transpose + 1 })}
            disabled={roomState.transpose >= 6}
            className="flex-1 bg-white/10 hover:bg-white/20 active:bg-white/30 disabled:bg-white/5 disabled:text-white/30 py-4 rounded-lg text-2xl font-bold transition-colors"
          >
            +
          </button>
        </div>
      </div>

      {/* Auto-scroll controls */}
      <div className="mb-8">
        <div className="text-white/60 text-sm mb-3">Auto-Scroll</div>

        {/* Toggle button */}
        <button
          onClick={() => sendCommand({
            type: "setAutoScroll",
            enabled: !roomState.autoScroll,
            speed: roomState.autoScrollSpeed
          })}
          className={`w-full py-4 rounded-lg text-lg font-medium transition-colors mb-4 ${
            roomState.autoScroll
              ? "bg-amber-400/20 border border-amber-400/50 text-amber-400"
              : "bg-white/10 hover:bg-white/20 active:bg-white/30 text-white"
          }`}
        >
          {roomState.autoScroll ? "⏸ Stop Scrolling" : "▶ Start Scrolling"}
        </button>

        {/* Speed control */}
        <div className="bg-white/5 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white/60 text-sm">Speed</span>
            <span className="text-amber-400 text-sm font-medium">
              {roomState.autoScrollSpeed === 1 ? "Slow" : roomState.autoScrollSpeed === 2 ? "Medium" : "Fast"}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => sendCommand({ type: "setAutoScroll", enabled: roomState.autoScroll, speed: 1 })}
              className={`flex-1 py-3 rounded-lg text-sm font-medium transition-colors ${
                roomState.autoScrollSpeed === 1
                  ? "bg-amber-400/20 border border-amber-400/50 text-amber-400"
                  : "bg-white/10 hover:bg-white/20 text-white/70"
              }`}
            >
              Slow
            </button>
            <button
              onClick={() => sendCommand({ type: "setAutoScroll", enabled: roomState.autoScroll, speed: 2 })}
              className={`flex-1 py-3 rounded-lg text-sm font-medium transition-colors ${
                roomState.autoScrollSpeed === 2
                  ? "bg-amber-400/20 border border-amber-400/50 text-amber-400"
                  : "bg-white/10 hover:bg-white/20 text-white/70"
              }`}
            >
              Medium
            </button>
            <button
              onClick={() => sendCommand({ type: "setAutoScroll", enabled: roomState.autoScroll, speed: 3 })}
              className={`flex-1 py-3 rounded-lg text-sm font-medium transition-colors ${
                roomState.autoScrollSpeed === 3
                  ? "bg-amber-400/20 border border-amber-400/50 text-amber-400"
                  : "bg-white/10 hover:bg-white/20 text-white/70"
              }`}
            >
              Fast
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
