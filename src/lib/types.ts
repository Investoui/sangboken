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
