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
