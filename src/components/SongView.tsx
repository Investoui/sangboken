"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Song, SongSection, SongLine } from "@/lib/types";
import { ChordDiagram } from "@/components/ChordDiagram";
import { transposeChord } from "@/lib/transpose";
import Link from "next/link";
import { Logo } from "@/components/Logo";

interface ChordLineProps {
  line: SongLine;
  transpose: number;
}

function ChordLine({ line, transpose }: ChordLineProps) {
  const chordPositions = line.chords.map((c) => ({
    ...c,
    position: Math.min(c.position, line.lyrics.length - 1),
    displayChord: transposeChord(c.chord, transpose),
  }));

  return (
    <div className="relative mb-2">
      {/* Chord row */}
      <div className="relative h-[1.2em] font-mono text-[0.9em]">
        {chordPositions.map((c, idx) => (
          <span
            key={idx}
            className="absolute chord font-bold"
            style={{
              left: `${c.position}ch`,
            }}
          >
            {c.displayChord}
          </span>
        ))}
      </div>
      {/* Lyrics row */}
      <div className="font-mono text-[1em] text-[var(--text-primary)] whitespace-pre">
        {line.lyrics}
      </div>
    </div>
  );
}

// Extract unique chords from ALL sections in order of first appearance
function extractAllUniqueChords(
  sections: SongSection[],
  transpose: number = 0
): string[] {
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
  isLandscape,
  onHide,
}: {
  sections: SongSection[];
  transpose: number;
  visible: boolean;
  isLandscape: boolean;
  onHide: () => void;
}) {
  const uniqueChords = extractAllUniqueChords(sections, transpose);

  if (!visible) return null;

  if (isLandscape) {
    return (
      <div
        className="h-full w-full glass flex flex-col cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          onHide();
        }}
        title="Tap to hide"
      >
        <div className="section-label px-3 py-2 border-b border-[var(--border-subtle)] flex justify-between items-center">
          <span>Akkorder</span>
          <span className="text-[var(--text-muted)] text-[10px] normal-case tracking-normal">
            tap to hide
          </span>
        </div>
        {uniqueChords.length > 0 ? (
          <div className="flex-1 overflow-y-auto p-2">
            <div className="grid grid-cols-2 gap-2">
              {uniqueChords.map((chord, idx) => (
                <div key={idx} className="flex justify-center">
                  <ChordDiagram chordName={chord} size="sm" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-[var(--text-muted)] text-sm">
            Ingen akkorder
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-10"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="glass h-[180px] flex items-center px-4 border-t border-[var(--border-subtle)]">
        {uniqueChords.length > 0 ? (
          <div className="flex gap-6 overflow-x-auto w-full py-4 px-2">
            {uniqueChords.map((chord, idx) => (
              <div key={idx} className="flex-shrink-0">
                <ChordDiagram chordName={chord} size="md" />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-[var(--text-muted)] w-full text-center">
            Ingen akkorder å vise
          </div>
        )}
      </div>
    </div>
  );
}

// Tab Display component
function TabDisplay({ song }: { song: Song }) {
  return (
    <div className="h-screen overflow-auto pb-[220px]">
      <div className="p-8 pt-16">
        <div className="pb-4">
          <h1 className="text-2xl font-display font-bold text-[var(--text-primary)] mb-1">
            {song.title}
          </h1>
          {song.artist && (
            <div className="text-[var(--text-secondary)] text-lg">
              {song.artist}
            </div>
          )}
          {song.key && (
            <div className="text-[var(--accent-secondary)] text-sm mt-1 opacity-70">
              Toneart: {song.key}
            </div>
          )}
        </div>
        <pre className="font-mono text-sm md:text-base lg:text-lg text-[var(--text-secondary)] whitespace-pre overflow-x-auto leading-relaxed">
          {song.rawTab}
        </pre>
      </div>
    </div>
  );
}

// Helper to find max lines in any single verse
function maxLinesPerVerse(sections: SongSection[]): number {
  if (sections.length === 0) return 0;
  return Math.max(...sections.map((section) => section.lines.length));
}

// Song Display component
function SongDisplay({
  song,
  transpose,
  isLandscape,
}: {
  song: Song;
  transpose: number;
  isLandscape: boolean;
}) {
  if (song.format === "tab" && song.rawTab) {
    return <TabDisplay song={song} />;
  }

  const sections = song.sections;
  const maxLines = maxLinesPerVerse(sections);
  const isLongSong = maxLines > 5;

  const containerClass = isLandscape
    ? "h-full overflow-auto"
    : "h-screen overflow-hidden flex flex-col pb-[200px]";

  const contentClass = isLandscape
    ? "h-full flex flex-col p-4 pt-8"
    : "flex-1 flex flex-col p-8 pt-16";

  const fontSize = isLandscape
    ? "clamp(0.7rem, 2vw, 1.5rem)"
    : "clamp(0.5rem, 1.5vw, 2rem)";

  const sectionsLayoutClass =
    isLandscape && !isLongSong
      ? "flex-1 overflow-auto columns-2 gap-8"
      : "flex-1 overflow-auto flex flex-col justify-start gap-4";

  const sectionItemClass =
    isLandscape && !isLongSong ? "break-inside-avoid mb-4" : "";

  return (
    <div className={containerClass}>
      <div className={contentClass} style={{ fontSize }}>
        <div className="pb-2 flex-shrink-0">
          <h1 className="text-[1.5em] font-display font-bold text-[var(--text-primary)] mb-1">
            {song.title}
          </h1>
          {song.artist && (
            <div className="text-[var(--text-secondary)] text-[0.9em]">
              {song.artist}
            </div>
          )}
          {song.key && transpose !== 0 && (
            <div className="text-[var(--accent-secondary)] text-[0.7em] mt-1 opacity-70">
              Transponert {transpose > 0 ? "+" : ""}
              {transpose} halvtoner
            </div>
          )}
        </div>

        <div className={sectionsLayoutClass}>
          {sections.map((section, sectionIdx) => (
            <div key={sectionIdx} className={sectionItemClass}>
              <div className="section-label mb-2">{section.name}</div>
              {section.lines.map((line, lineIdx) => (
                <ChordLine key={lineIdx} line={line} transpose={transpose} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Icon components
function BackIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 19l-7-7 7-7"
      />
    </svg>
  );
}

function ChordIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m6 10V7m0 10a2 2 0 01-2 2h-2a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10V7"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>
  );
}

// Overlay Controls component
function OverlayControls({
  visible,
  onInteraction,
  song,
  transpose,
  onTransposeChange,
  showChordPanel,
  onToggleChordPanel,
  wakeLockEnabled,
  wakeLockActive,
  onToggleWakeLock,
}: {
  visible: boolean;
  onInteraction: () => void;
  song: Song;
  transpose: number;
  onTransposeChange: (value: number) => void;
  showChordPanel: boolean;
  onToggleChordPanel: () => void;
  wakeLockEnabled: boolean;
  wakeLockActive: boolean;
  onToggleWakeLock: () => void;
}) {
  const handleTransposeDown = () => {
    onInteraction();
    if (transpose > -6) {
      onTransposeChange(transpose - 1);
    }
  };

  const handleTransposeUp = () => {
    onInteraction();
    if (transpose < 6) {
      onTransposeChange(transpose + 1);
    }
  };

  const handleToggleChords = () => {
    onInteraction();
    onToggleChordPanel();
  };

  const handleToggleWakeLock = () => {
    onInteraction();
    onToggleWakeLock();
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-30 transition-all duration-300 ease-out ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-full opacity-0 pointer-events-none"
      }`}
      onClick={(e) => {
        e.stopPropagation();
        onInteraction();
      }}
      onTouchStart={(e) => {
        e.stopPropagation();
      }}
    >
      <div className="glass p-4 border-t border-[var(--border-subtle)] safe-area-inset">
        {/* Song title and back button */}
        <div className="flex items-center justify-between mb-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <BackIcon />
            <span className="text-sm">Alle sanger</span>
          </Link>
          <div className="text-center flex-1 mx-4">
            <h2 className="text-[var(--text-primary)] text-xl font-display font-bold truncate">
              {song.title}
            </h2>
            {song.artist && (
              <div className="text-[var(--text-tertiary)] text-sm">
                {song.artist}
              </div>
            )}
          </div>
          <div className="w-[100px]" /> {/* Spacer for balance */}
        </div>

        {/* Controls row */}
        <div className="flex items-center justify-center gap-4 flex-wrap">
          {/* Transpose controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleTransposeDown}
              disabled={transpose <= -6}
              className="btn btn-secondary btn-icon disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <span className="text-xl font-bold">−</span>
            </button>
            <div className="min-w-[70px] text-center">
              <div className="section-label text-[10px]">Transponer</div>
              <div className="text-[var(--text-primary)] text-lg font-mono font-bold">
                {transpose > 0 ? `+${transpose}` : transpose}
              </div>
            </div>
            <button
              onClick={handleTransposeUp}
              disabled={transpose >= 6}
              className="btn btn-secondary btn-icon disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <span className="text-xl font-bold">+</span>
            </button>
          </div>

          {/* Toggle chord diagrams */}
          {song.format !== "tab" && (
            <button
              onClick={handleToggleChords}
              className={`btn btn-icon-lg flex items-center justify-center gap-2 rounded-xl px-4 transition-all ${
                showChordPanel
                  ? "bg-[var(--accent-muted)] text-[var(--accent-primary)] glow-accent"
                  : "btn-secondary"
              }`}
            >
              <ChordIcon />
              <span className="text-sm font-medium">Akkorder</span>
            </button>
          )}

          {/* Keep screen on toggle */}
          <button
            onClick={handleToggleWakeLock}
            className={`btn btn-icon-lg flex items-center justify-center gap-2 rounded-xl px-4 transition-all ${
              wakeLockEnabled
                ? wakeLockActive
                  ? "bg-[rgba(74,222,128,0.15)] text-[var(--success)]"
                  : "bg-[rgba(251,191,36,0.15)] text-[var(--warning)]"
                : "btn-secondary"
            }`}
          >
            {wakeLockEnabled ? <SunIcon /> : <MoonIcon />}
            <span className="text-sm font-medium">Skjerm</span>
          </button>
        </div>
      </div>
    </div>
  );
}

interface SongViewProps {
  song: Song;
}

export function SongView({ song }: SongViewProps) {
  const [transpose, setTranspose] = useState(0);
  const [showChordPanel, setShowChordPanel] = useState(true);
  const [showOverlay, setShowOverlay] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);

  // Wake lock state
  const [wakeLockEnabled, setWakeLockEnabled] = useState(false);
  const [wakeLockActive, setWakeLockActive] = useState(false);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  // Detect landscape orientation
  useEffect(() => {
    const checkOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", () => {
      setTimeout(checkOrientation, 100);
    });

    return () => {
      window.removeEventListener("resize", checkOrientation);
      window.removeEventListener("orientationchange", checkOrientation);
    };
  }, []);

  // Timer ref for auto-hide
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Function to reset the auto-hide timer
  const resetHideTimer = useCallback(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }
    hideTimerRef.current = setTimeout(() => {
      setShowOverlay(false);
    }, 3000);
  }, []);

  // Handle screen tap to toggle overlay
  const handleScreenTap = useCallback(() => {
    if (!showOverlay) {
      setShowOverlay(true);
      resetHideTimer();
    } else {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
      setShowOverlay(false);
    }
  }, [showOverlay, resetHideTimer]);

  // Handle any interaction with the overlay
  const handleOverlayInteraction = useCallback(() => {
    resetHideTimer();
  }, [resetHideTimer]);

  // Wake lock functions
  const requestWakeLock = useCallback(async () => {
    if (!("wakeLock" in navigator)) {
      return false;
    }
    try {
      wakeLockRef.current = await navigator.wakeLock.request("screen");
      setWakeLockActive(true);
      wakeLockRef.current.addEventListener("release", () => {
        setWakeLockActive(false);
      });
      return true;
    } catch {
      setWakeLockActive(false);
      return false;
    }
  }, []);

  const releaseWakeLock = useCallback(async () => {
    if (wakeLockRef.current) {
      await wakeLockRef.current.release();
      wakeLockRef.current = null;
      setWakeLockActive(false);
    }
  }, []);

  const toggleWakeLock = useCallback(async () => {
    if (wakeLockEnabled) {
      await releaseWakeLock();
      setWakeLockEnabled(false);
    } else {
      const success = await requestWakeLock();
      setWakeLockEnabled(success);
    }
  }, [wakeLockEnabled, requestWakeLock, releaseWakeLock]);

  // Re-acquire wake lock when page becomes visible again
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (wakeLockEnabled && document.visibilityState === "visible") {
        await requestWakeLock();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [wakeLockEnabled, requestWakeLock]);

  // Cleanup wake lock on unmount
  useEffect(() => {
    return () => {
      if (wakeLockRef.current) {
        wakeLockRef.current.release();
      }
    };
  }, []);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
      }
    };
  }, []);

  return (
    <div
      className="min-h-screen h-screen bg-[var(--bg-base)] relative cursor-pointer overflow-hidden"
      onClick={handleScreenTap}
    >
      {/* Wake lock indicator */}
      {wakeLockEnabled && (
        <div className="fixed top-2 right-2 z-40 flex items-center gap-1.5 glass px-3 py-1.5 rounded-full animate-fade-down">
          <div
            className={`w-2 h-2 rounded-full ${
              wakeLockActive
                ? "bg-[var(--success)]"
                : "bg-[var(--warning)] animate-pulse"
            }`}
          />
          <span className="text-xs text-[var(--text-secondary)]">
            {wakeLockActive ? "Skjerm på" : "Kobler til..."}
          </span>
        </div>
      )}

      {/* Back button (always visible, top left) */}
      <Link
        href="/"
        className="fixed top-3 left-3 z-50 flex items-center gap-2 bg-black/70 backdrop-blur-sm px-4 py-2.5 rounded-full text-white/80 hover:text-white hover:bg-black/90 transition-colors border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <BackIcon />
        <span className="text-sm font-medium">Tilbake</span>
      </Link>

      {/* Main content area */}
      {isLandscape ? (
        <div className="h-full flex">
          <div className="flex-1 h-full overflow-hidden">
            <SongDisplay song={song} transpose={transpose} isLandscape={true} />
          </div>

          {song.format !== "tab" && showChordPanel && (
            <div className="w-[180px] h-full flex-shrink-0">
              <ChordDiagramPanel
                sections={song.sections}
                transpose={transpose}
                visible={showChordPanel}
                isLandscape={true}
                onHide={() => setShowChordPanel(false)}
              />
            </div>
          )}

          {song.format !== "tab" && !showChordPanel && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowChordPanel(true);
              }}
              className="fixed right-0 top-1/2 -translate-y-1/2 bg-[var(--accent-muted)] hover:bg-[var(--accent-glow)] text-[var(--accent-primary)] px-2 py-4 rounded-l-lg border border-r-0 border-[var(--accent-primary)]/30 transition-colors"
              style={{ writingMode: "vertical-rl" }}
            >
              Vis akkorder
            </button>
          )}
        </div>
      ) : (
        <>
          <SongDisplay song={song} transpose={transpose} isLandscape={false} />

          {song.format !== "tab" && (
            <ChordDiagramPanel
              sections={song.sections}
              transpose={transpose}
              visible={showChordPanel}
              isLandscape={false}
              onHide={() => setShowChordPanel(false)}
            />
          )}
        </>
      )}

      {/* Overlay controls */}
      <OverlayControls
        visible={showOverlay}
        onInteraction={handleOverlayInteraction}
        song={song}
        transpose={transpose}
        onTransposeChange={setTranspose}
        showChordPanel={showChordPanel}
        onToggleChordPanel={() => setShowChordPanel(!showChordPanel)}
        wakeLockEnabled={wakeLockEnabled}
        wakeLockActive={wakeLockActive}
        onToggleWakeLock={toggleWakeLock}
      />
    </div>
  );
}
