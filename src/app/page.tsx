"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createRoom = async () => {
    setIsCreating(true);
    setError(null);

    try {
      const response = await fetch("/api/room", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to create room");
      }

      const data = await response.json();
      router.push(`/room/${data.code}`);
    } catch {
      setError("Failed to create room. Please try again.");
      setIsCreating(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <main className="flex flex-col items-center gap-8 text-center max-w-lg w-full">
        <h1 className="text-5xl font-bold tracking-tight">
          Guitar Chords
        </h1>
        <p className="text-xl text-zinc-400">
          Cast &amp; Control
        </p>

        <div className="w-full flex flex-col gap-4 mt-4">
          {/* Mirror Mode */}
          <Link
            href="/mirror"
            className="w-full p-6 bg-zinc-900 hover:bg-zinc-800 rounded-xl transition-colors text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-amber-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Mirror Mode</h2>
                <p className="text-sm text-zinc-400 mt-1">
                  Single screen with tap-to-control overlay. Perfect for AirPlay or screen mirroring.
                </p>
              </div>
            </div>
          </Link>

          {/* Room Mode */}
          <button
            onClick={createRoom}
            disabled={isCreating}
            className="w-full p-6 bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-900 disabled:cursor-wait rounded-xl transition-colors text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-amber-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">
                  {isCreating ? "Creating Room..." : "Room Mode"}
                </h2>
                <p className="text-sm text-zinc-400 mt-1">
                  Display on TV, control from your phone. Great for jam sessions with others.
                </p>
              </div>
            </div>
          </button>
        </div>

        {error && (
          <p className="text-red-400">{error}</p>
        )}

        <p className="text-sm text-zinc-600 max-w-sm mt-4">
          Display chords on your TV and control playback, transpose, and auto-scroll.
        </p>
      </main>
    </div>
  );
}
