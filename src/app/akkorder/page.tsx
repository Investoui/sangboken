"use client";

import { useState } from "react";
import Link from "next/link";
import { ChordDiagram } from "@/components/ChordDiagram";
import { chordLibrary } from "@/lib/chord-library";
import { Logo } from "@/components/Logo";

// Group chords by their root note
const rootNotes = ["C", "D", "E", "F", "G", "A", "B"] as const;

// Get all chord names and group them
function groupChordsByRoot() {
  const chordNames = Object.keys(chordLibrary);
  const groups: Record<string, string[]> = {};

  for (const root of rootNotes) {
    groups[root] = [];
  }

  for (const chord of chordNames) {
    // Skip slash chords for main grouping
    if (chord.includes("/")) continue;

    // Find root note
    let root = chord[0];
    // Handle sharps and flats - group them with the natural note
    if (chord[1] === "#" || chord[1] === "b") {
      // Sharps go with the base note, flats go with the note above
      if (chord[1] === "#") {
        root = chord[0];
      } else {
        // Flats: Db->C group, Eb->D group, etc.
        const flatMapping: Record<string, string> = {
          D: "C", // Db -> C
          E: "D", // Eb -> D
          G: "F", // Gb -> F
          A: "G", // Ab -> G
          B: "A", // Bb -> A
        };
        root = flatMapping[chord[0]] || chord[0];
      }
    }

    if (groups[root]) {
      groups[root].push(chord);
    }
  }

  // Sort each group: Major, minor, 7, m7, maj7, sus2, sus4, dim, aug, etc.
  const typeOrder = [
    "", // Major
    "#",
    "b",
    "m",
    "#m",
    "bm",
    "7",
    "#7",
    "b7",
    "m7",
    "#m7",
    "bm7",
    "maj7",
    "#maj7",
    "bmaj7",
    "sus2",
    "#sus2",
    "bsus2",
    "sus4",
    "#sus4",
    "bsus4",
    "dim",
    "#dim",
    "bdim",
    "aug",
    "#aug",
    "baug",
    "add9",
    "#add9",
    "badd9",
    "6",
    "#6",
    "b6",
    "m6",
    "#m6",
    "bm6",
    "9",
    "#9",
    "b9",
  ];

  for (const root of rootNotes) {
    groups[root].sort((a, b) => {
      const suffixA = a.slice(1);
      const suffixB = b.slice(1);
      const indexA = typeOrder.indexOf(suffixA);
      const indexB = typeOrder.indexOf(suffixB);
      return (
        (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB)
      );
    });
  }

  return groups;
}

// Get slash chords separately
function getSlashChords() {
  return Object.keys(chordLibrary).filter((chord) => chord.includes("/"));
}

function BackIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function GuitarNeckIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="10" x2="20" y2="10" />
      <line x1="4" y1="14" x2="20" y2="14" />
      <line x1="4" y1="18" x2="20" y2="18" />
      <line x1="8" y1="2" x2="8" y2="22" />
      <line x1="12" y1="2" x2="12" y2="22" />
      <line x1="16" y1="2" x2="16" y2="22" />
    </svg>
  );
}

export default function ChordsPage() {
  const [activeRoot, setActiveRoot] = useState<string>("C");
  const groups = groupChordsByRoot();
  const slashChords = getSlashChords();

  return (
    <div className="min-h-screen bg-gradient-radial">
      {/* Decorative background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[var(--accent-primary)] opacity-[0.03] rounded-full blur-3xl" />
        <div className="absolute bottom-20 -left-40 w-60 h-60 bg-[var(--accent-primary)] opacity-[0.02] rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-6 safe-area-inset">
        {/* Header */}
        <header className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-6"
          >
            <BackIcon />
            <span>Tilbake</span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20">
              <GuitarNeckIcon className="w-8 h-8 text-[var(--accent-primary)]" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-[var(--text-primary)]">
                Akkordbibliotek
              </h1>
              <p className="text-[var(--text-secondary)] mt-1">
                {Object.keys(chordLibrary).length} akkorder med grep
              </p>
            </div>
          </div>
        </header>

        {/* Root note tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {rootNotes.map((root) => (
              <button
                key={root}
                onClick={() => setActiveRoot(root)}
                className={`px-4 py-2 rounded-lg font-mono font-bold text-lg transition-all ${
                  activeRoot === root
                    ? "bg-[var(--accent-primary)] text-[var(--bg-deep)] shadow-lg shadow-[var(--accent-primary)]/30"
                    : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]"
                }`}
              >
                {root}
              </button>
            ))}
            <button
              onClick={() => setActiveRoot("slash")}
              className={`px-4 py-2 rounded-lg font-mono text-sm transition-all ${
                activeRoot === "slash"
                  ? "bg-[var(--accent-primary)] text-[var(--bg-deep)] shadow-lg shadow-[var(--accent-primary)]/30"
                  : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]"
              }`}
            >
              Slash (/)
            </button>
          </div>
        </div>

        {/* Chord grid */}
        <div className="card p-6">
          {activeRoot === "slash" ? (
            <>
              <h2 className="text-xl font-display font-semibold text-[var(--text-primary)] mb-6">
                Slashakkorder
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {slashChords.map((chord) => (
                  <div
                    key={chord}
                    className="flex flex-col items-center p-4 rounded-xl bg-[var(--bg-elevated)] hover:bg-[var(--bg-card)] transition-colors"
                  >
                    <ChordDiagram chordName={chord} size="md" />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl font-display font-semibold text-[var(--text-primary)] mb-6">
                {activeRoot}-akkorder
                <span className="text-[var(--text-muted)] font-normal text-base ml-2">
                  ({groups[activeRoot].length} varianter)
                </span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {groups[activeRoot].map((chord) => (
                  <div
                    key={chord}
                    className="flex flex-col items-center p-4 rounded-xl bg-[var(--bg-elevated)] hover:bg-[var(--bg-card)] transition-colors"
                  >
                    <ChordDiagram chordName={chord} size="md" />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-[var(--border-subtle)]">
          <div className="flex items-center justify-between">
            <Logo size="sm" variant="icon" />
            <p className="text-[var(--text-muted)] text-sm">
              Akkorddiagrammer for gitar
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
