"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";

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

  // Get the base URL for the QR code
  const joinUrl = typeof window !== "undefined"
    ? `${window.location.origin}/join`
    : "/join";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <main className="flex flex-col items-center gap-8 text-center max-w-md">
        <h1 className="text-5xl font-bold tracking-tight">
          Guitar Chords
        </h1>
        <p className="text-xl text-zinc-400">
          Cast &amp; Control
        </p>

        <button
          onClick={createRoom}
          disabled={isCreating}
          className="px-8 py-4 text-xl font-semibold bg-amber-500 hover:bg-amber-400 disabled:bg-amber-600 disabled:cursor-wait text-black rounded-lg transition-colors"
        >
          {isCreating ? "Creating..." : "Create Room"}
        </button>

        {error && (
          <p className="text-red-400">{error}</p>
        )}

        <div className="mt-8 p-6 bg-zinc-900 rounded-xl">
          <p className="text-zinc-400 mb-4">
            Open this URL on your TV, then join from your phone:
          </p>

          <div className="bg-white p-4 rounded-lg inline-block">
            <QRCodeSVG
              value={joinUrl}
              size={160}
              level="M"
            />
          </div>

          <p className="mt-4 text-sm text-zinc-500 font-mono">
            {joinUrl}
          </p>
        </div>

        <p className="text-sm text-zinc-600 max-w-sm">
          Display chords on your TV and control playback, transpose, and auto-scroll from your phone.
        </p>
      </main>
    </div>
  );
}
