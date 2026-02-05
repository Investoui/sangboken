export interface RoomState {
  code: string;
  currentSong: string | null;
  currentSection: number;
  scrollPosition: number;
  transpose: number;
  controllers: string[];
  autoScroll: boolean;
  autoScrollSpeed: number;
  createdAt: number;
  lastActivity: number;
}

// Command types for controller actions
export type RoomCommand =
  | { type: "setSong"; songId: string }
  | { type: "nextSection" }
  | { type: "prevSection" }
  | { type: "scroll"; position: number }
  | { type: "transpose"; value: number }
  | { type: "setAutoScroll"; enabled: boolean; speed?: number };

// Song data types
export interface ChordPosition {
  chord: string;
  position: number;
}

export interface SongLine {
  lyrics: string;
  chords: ChordPosition[];
}

export interface SongSection {
  name: string;
  lines: SongLine[];
}

export interface Song {
  id: string;
  title: string;
  artist?: string;
  key?: string;
  category?: string;
  format?: "chordpro" | "tab";
  sections: SongSection[];
  rawTab?: string; // For tab format - raw tablature content
}
