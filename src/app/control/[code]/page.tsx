"use client";

import { useEffect, useState, useCallback } from "react";
import { RoomState, RoomCommand } from "@/lib/types";

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

      {/* Current song display */}
      <div className="bg-white/5 rounded-lg p-4 mb-6">
        <div className="text-white/40 text-sm mb-1">Now Playing</div>
        <div className="text-lg">
          {roomState.currentSong || (
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

      {/* Room info */}
      <div className="text-white/30 text-sm text-center mt-12">
        <p>Transpose: {roomState.transpose > 0 ? "+" : ""}{roomState.transpose}</p>
        <p className="mt-1">
          Auto-scroll: {roomState.autoScroll ? "On" : "Off"}
        </p>
      </div>
    </div>
  );
}
