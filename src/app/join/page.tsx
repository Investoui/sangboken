"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function JoinPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const roomCode = code.trim().toUpperCase();
    if (roomCode.length !== 4) {
      setError("Room code must be 4 characters");
      return;
    }

    setLoading(true);

    // Verify room exists
    const response = await fetch(`/api/room/${roomCode}`);
    if (!response.ok) {
      setError("Room not found");
      setLoading(false);
      return;
    }

    // Redirect to controller
    router.push(`/control/${roomCode}`);
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-bold text-center mb-8">Join Room</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="code"
              className="block text-sm text-white/60 mb-2"
            >
              Room Code
            </label>
            <input
              id="code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="ABCD"
              maxLength={4}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-2xl font-mono text-center tracking-widest uppercase placeholder:text-white/20 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              autoComplete="off"
              autoFocus
            />
          </div>

          {error && (
            <div className="text-red-400 text-center text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading || code.length !== 4}
            className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-white/10 disabled:text-white/30 text-black font-semibold py-3 rounded-lg transition-colors"
          >
            {loading ? "Joining..." : "Join"}
          </button>
        </form>

        <p className="text-white/40 text-center mt-8 text-sm">
          Enter the 4-letter code shown on the TV display
        </p>
      </div>
    </div>
  );
}
