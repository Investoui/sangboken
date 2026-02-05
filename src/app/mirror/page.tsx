"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { SongSection, SongLine, Song } from "@/lib/types";
import { ChordDiagram } from "@/components/ChordDiagram";
import { transposeChord } from "@/lib/transpose";
import { getAllSongs } from "@/lib/songs";

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

// Chord Diagram Panel component - adapts to landscape (right side) or portrait (bottom)
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

  // Landscape: right side panel - tap to hide
  if (isLandscape) {
    return (
      <div
        className="h-full w-full bg-black/40 backdrop-blur-sm border-l border-white/10 flex flex-col cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          onHide();
        }}
        title="Tap to hide"
      >
        <div className="text-white/40 text-xs uppercase tracking-wider px-3 py-2 border-b border-white/10 flex justify-between items-center">
          <span>Chords</span>
          <span className="text-white/20">tap to hide</span>
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
          <div className="flex-1 flex items-center justify-center text-white/30 text-sm">
            No chords
          </div>
        )}
      </div>
    );
  }

  // Portrait: bottom panel
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-10"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-black/80 backdrop-blur-sm border-t border-white/10 h-[180px] flex items-center px-4">
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
  );
}

// Tab Display component - for tablature format
function TabDisplay({ song }: { song: Song }) {
  return (
    <div className="h-screen overflow-auto pb-[220px]">
      <div className="p-8 pt-16">
        {/* Song title */}
        <div className="pb-4">
          <h1 className="text-2xl font-bold text-white mb-1">{song.title}</h1>
          {song.artist && (
            <div className="text-white/50 text-lg">{song.artist}</div>
          )}
          {song.key && (
            <div className="text-amber-400/60 text-sm mt-1">Key: {song.key}</div>
          )}
        </div>

        {/* Tab content - monospace pre-formatted */}
        <pre className="font-mono text-sm md:text-base lg:text-lg text-white/90 whitespace-pre overflow-x-auto leading-relaxed">
          {song.rawTab}
        </pre>
      </div>
    </div>
  );
}

// Helper to find max lines in any single verse
function maxLinesPerVerse(sections: SongSection[]): number {
  if (sections.length === 0) return 0;
  return Math.max(...sections.map(section => section.lines.length));
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
  // If it's a tab format, use TabDisplay
  if (song.format === "tab" && song.rawTab) {
    return <TabDisplay song={song} />;
  }

  const sections = song.sections;
  
  // Determine if verses are "long" - more than 5 lines per verse means vertical scroll
  const maxLines = maxLinesPerVerse(sections);
  const isLongSong = maxLines > 5;

  // Landscape: use more horizontal space, no bottom padding needed
  // Portrait: keep bottom padding for chord panel
  const containerClass = isLandscape
    ? "h-full overflow-auto"
    : "h-screen overflow-hidden flex flex-col pb-[200px]";

  const contentClass = isLandscape
    ? "h-full flex flex-col p-4 pt-8"
    : "flex-1 flex flex-col p-8 pt-16";

  // Larger text in landscape since we have more room
  const fontSize = isLandscape
    ? 'clamp(0.7rem, 2vw, 1.5rem)'
    : 'clamp(0.5rem, 1.5vw, 2rem)';

  // For short songs in landscape: use horizontal columns layout
  // For long songs: use vertical scrolling
  const sectionsLayoutClass = isLandscape && !isLongSong
    ? "flex-1 overflow-auto columns-2 gap-8"
    : "flex-1 overflow-auto flex flex-col justify-start gap-4";

  const sectionItemClass = isLandscape && !isLongSong
    ? "break-inside-avoid mb-4"
    : "";

  return (
    <div className={containerClass}>
      <div className={contentClass} style={{ fontSize }}>
        {/* Song title */}
        <div className="pb-2 flex-shrink-0">
          <h1 className="text-[1.5em] font-bold text-white mb-1">{song.title}</h1>
          {song.artist && (
            <div className="text-white/50 text-[0.9em]">{song.artist}</div>
          )}
          {song.key && transpose !== 0 && (
            <div className="text-amber-400/60 text-[0.7em] mt-1">
              Transposed {transpose > 0 ? "+" : ""}{transpose} semitones
            </div>
          )}
        </div>

        {/* All sections displayed - adaptive layout based on song length */}
        <div className={sectionsLayoutClass}>
          {sections.map((section, sectionIdx) => (
            <div key={sectionIdx} className={sectionItemClass}>
              <div className="text-amber-500/60 text-[0.7em] uppercase tracking-wider mb-2">
                {section.name}
              </div>
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

// Overlay Controls component - slides up from bottom
function OverlayControls({
  visible,
  onInteraction,
  currentSong,
  allSongs,
  currentSongIndex,
  onSongChange,
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
  currentSong: Song;
  allSongs: Song[];
  currentSongIndex: number;
  onSongChange: (index: number) => void;
  transpose: number;
  onTransposeChange: (value: number) => void;
  showChordPanel: boolean;
  onToggleChordPanel: () => void;
  wakeLockEnabled: boolean;
  wakeLockActive: boolean;
  onToggleWakeLock: () => void;
}) {
  const [showSongPicker, setShowSongPicker] = useState(false);

  const handlePrevSong = () => {
    onInteraction();
    if (currentSongIndex > 0) {
      onSongChange(currentSongIndex - 1);
    }
  };

  const handleNextSong = () => {
    onInteraction();
    if (currentSongIndex < allSongs.length - 1) {
      onSongChange(currentSongIndex + 1);
    }
  };

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

  const handleSongSelect = (index: number) => {
    onInteraction();
    onSongChange(index);
    setShowSongPicker(false);
  };

  const handleToggleSongPicker = () => {
    onInteraction();
    setShowSongPicker(!showSongPicker);
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
      <div className="bg-black/90 backdrop-blur-md border-t border-white/10 p-4">
        {/* Current song title - displayed prominently */}
        <div className="text-center mb-4">
          <h2 className="text-white text-xl font-bold truncate">{currentSong.title}</h2>
          {currentSong.artist && (
            <div className="text-white/50 text-sm">{currentSong.artist}</div>
          )}
        </div>

        {/* Main controls row */}
        <div className="flex items-center justify-center gap-3 mb-4">
          {/* Previous song button */}
          <button
            onClick={handlePrevSong}
            disabled={currentSongIndex === 0}
            className="min-h-[60px] min-w-[60px] flex items-center justify-center bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:text-white/30 rounded-xl text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Song picker button */}
          <button
            onClick={handleToggleSongPicker}
            className="min-h-[60px] flex-1 max-w-[200px] flex items-center justify-center gap-2 bg-amber-500/20 hover:bg-amber-500/30 rounded-xl text-amber-400 transition-colors px-4"
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
            <span className="truncate text-sm font-medium">Songs</span>
          </button>

          {/* Next song button */}
          <button
            onClick={handleNextSong}
            disabled={currentSongIndex === allSongs.length - 1}
            className="min-h-[60px] min-w-[60px] flex items-center justify-center bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:text-white/30 rounded-xl text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Secondary controls row: Transpose and Chord toggle */}
        <div className="flex items-center justify-center gap-4">
          {/* Transpose controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleTransposeDown}
              disabled={transpose <= -6}
              className="min-h-[60px] min-w-[60px] flex items-center justify-center bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:text-white/30 rounded-xl text-white text-xl font-bold transition-colors"
            >
              −
            </button>
            <div className="min-w-[80px] text-center">
              <div className="text-white/50 text-xs uppercase tracking-wider">Transpose</div>
              <div className="text-white text-lg font-bold">
                {transpose > 0 ? `+${transpose}` : transpose}
              </div>
            </div>
            <button
              onClick={handleTransposeUp}
              disabled={transpose >= 6}
              className="min-h-[60px] min-w-[60px] flex items-center justify-center bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:text-white/30 rounded-xl text-white text-xl font-bold transition-colors"
            >
              +
            </button>
          </div>

          {/* Toggle chord diagrams - only for ChordPro format */}
          {currentSong.format !== "tab" && (
            <button
              onClick={handleToggleChords}
              className={`min-h-[60px] px-4 flex items-center justify-center gap-2 rounded-xl transition-colors ${
                showChordPanel
                  ? "bg-amber-500/30 text-amber-400"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m6 10V7m0 10a2 2 0 01-2 2h-2a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10V7" />
              </svg>
              <span className="text-sm font-medium">Chords</span>
            </button>
          )}

          {/* Keep screen on toggle */}
          <button
            onClick={handleToggleWakeLock}
            className={`min-h-[60px] px-4 flex items-center justify-center gap-2 rounded-xl transition-colors ${
              wakeLockEnabled
                ? wakeLockActive
                  ? "bg-green-500/30 text-green-400"
                  : "bg-yellow-500/30 text-yellow-400"
                : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {wakeLockEnabled ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              )}
            </svg>
            <span className="text-sm font-medium">Screen</span>
          </button>
        </div>

        {/* Song picker dropdown/list */}
        {showSongPicker && (
          <div className="mt-4 max-h-[200px] overflow-y-auto bg-black/60 rounded-xl border border-white/10">
            {allSongs.map((song, index) => (
              <button
                key={song.id}
                onClick={() => handleSongSelect(index)}
                className={`w-full min-h-[60px] px-4 flex items-center justify-between text-left transition-colors ${
                  index === currentSongIndex
                    ? "bg-amber-500/20 text-amber-400"
                    : "text-white hover:bg-white/10"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate flex items-center gap-2">
                    {song.title}
                    {song.format === "tab" && (
                      <span className="text-xs bg-purple-500/30 text-purple-300 px-2 py-0.5 rounded">TAB</span>
                    )}
                  </div>
                  {song.artist && (
                    <div className="text-sm text-white/50 truncate">{song.artist}</div>
                  )}
                </div>
                {song.key && (
                  <div className="text-xs text-white/40 ml-2">{song.key}</div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function MirrorPage() {
  // Get all songs and default to first one
  const allSongs = getAllSongs();
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
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
    window.addEventListener('resize', checkOrientation);

    // Also listen for orientation change on mobile
    window.addEventListener('orientationchange', () => {
      // Small delay to let the browser update dimensions
      setTimeout(checkOrientation, 100);
    });

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  // Timer ref for auto-hide
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);

  const currentSong = allSongs[currentSongIndex];

  // Function to reset the auto-hide timer
  const resetHideTimer = useCallback(() => {
    // Clear existing timer
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }
    // Set new timer to hide after 3 seconds
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
      // If already visible, hide immediately
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
      console.log("Wake Lock API not supported");
      return false;
    }
    try {
      wakeLockRef.current = await navigator.wakeLock.request("screen");
      setWakeLockActive(true);
      wakeLockRef.current.addEventListener("release", () => {
        setWakeLockActive(false);
      });
      return true;
    } catch (err) {
      console.log("Wake lock request failed:", err);
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

  // If no songs available, show message
  if (!currentSong) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white/50 text-xl">No songs available</div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen h-screen bg-black relative cursor-pointer overflow-hidden"
      onClick={handleScreenTap}
    >
      {/* Wake lock indicator */}
      {wakeLockEnabled && (
        <div className="fixed top-2 right-2 z-40 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
          <div
            className={`w-2 h-2 rounded-full ${
              wakeLockActive ? "bg-green-400" : "bg-yellow-400 animate-pulse"
            }`}
          />
          <span className="text-xs text-white/70">
            {wakeLockActive ? "Screen on" : "Reconnecting..."}
          </span>
        </div>
      )}

      {/* Main content area - side by side in landscape */}
      {isLandscape ? (
        <div className="h-full flex">
          {/* Song display - takes most of the width */}
          <div className="flex-1 h-full overflow-hidden">
            <SongDisplay song={currentSong} transpose={transpose} isLandscape={true} />
          </div>

          {/* Chord diagram panel on the right - only for ChordPro format */}
          {currentSong.format !== "tab" && showChordPanel && (
            <div className="w-[180px] h-full flex-shrink-0">
              <ChordDiagramPanel
                sections={currentSong.sections}
                transpose={transpose}
                visible={showChordPanel}
                isLandscape={true}
                onHide={() => setShowChordPanel(false)}
              />
            </div>
          )}

          {/* Show chords button when panel is hidden */}
          {currentSong.format !== "tab" && !showChordPanel && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowChordPanel(true);
              }}
              className="fixed right-0 top-1/2 -translate-y-1/2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 px-2 py-4 rounded-l-lg border border-r-0 border-amber-500/30 transition-colors"
              style={{ writingMode: 'vertical-rl' }}
            >
              Show Chords
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Portrait: stacked layout */}
          <SongDisplay song={currentSong} transpose={transpose} isLandscape={false} />

          {/* Chord diagram panel at bottom - only for ChordPro format */}
          {currentSong.format !== "tab" && (
            <ChordDiagramPanel
              sections={currentSong.sections}
              transpose={transpose}
              visible={showChordPanel}
              isLandscape={false}
              onHide={() => setShowChordPanel(false)}
            />
          )}
        </>
      )}

      {/* Overlay controls - slides up on tap */}
      <OverlayControls
        visible={showOverlay}
        onInteraction={handleOverlayInteraction}
        currentSong={currentSong}
        allSongs={allSongs}
        currentSongIndex={currentSongIndex}
        onSongChange={(index) => {
          setCurrentSongIndex(index);
          setTranspose(0); // Reset transpose when changing songs
        }}
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
