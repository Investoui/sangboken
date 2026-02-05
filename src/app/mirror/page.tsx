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

// Chord Diagram Panel component
function ChordDiagramPanel({
  sections,
  transpose,
  visible,
  onToggle,
}: {
  sections: SongSection[];
  transpose: number;
  visible: boolean;
  onToggle: () => void;
}) {
  const uniqueChords = extractAllUniqueChords(sections, transpose);

  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle();
  };

  return (
    <>
      {/* Toggle button - always visible */}
      <button
        onClick={handleToggleClick}
        className="fixed bottom-4 right-4 z-20 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-white/70 hover:text-white transition-colors text-sm"
      >
        {visible ? "Hide Chords" : "Show Chords"}
      </button>

      {/* Chord panel */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-10 transition-transform duration-300 ${
          visible ? "translate-y-0" : "translate-y-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-black/80 backdrop-blur-sm border-t border-white/10 h-[200px] flex items-center px-4">
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
    </>
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

// Song Display component
function SongDisplay({
  song,
  transpose,
}: {
  song: Song;
  transpose: number;
}) {
  // If it's a tab format, use TabDisplay
  if (song.format === "tab" && song.rawTab) {
    return <TabDisplay song={song} />;
  }

  const sections = song.sections;

  return (
    <div className="h-screen overflow-hidden flex flex-col pb-[220px]">
      <div className="flex-1 flex flex-col p-8 pt-16" style={{ fontSize: 'clamp(0.5rem, 1.5vw, 2rem)' }}>
        {/* Song title */}
        <div className="pb-2">
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

        {/* All sections displayed */}
        <div className="flex-1 flex flex-col justify-start gap-4">
          {sections.map((section, sectionIdx) => (
            <div key={sectionIdx}>
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
      className="min-h-screen bg-black relative cursor-pointer"
      onClick={handleScreenTap}
    >
      {/* Song display */}
      <SongDisplay song={currentSong} transpose={transpose} />

      {/* Chord diagram panel - only for ChordPro format */}
      {currentSong.format !== "tab" && (
        <ChordDiagramPanel
          sections={currentSong.sections}
          transpose={transpose}
          visible={showChordPanel}
          onToggle={() => setShowChordPanel(!showChordPanel)}
        />
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
      />
    </div>
  );
}
