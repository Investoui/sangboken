// Re-export from generated songs data
// To add new songs: create a .chopro or .tab file in the songs/ directory
// Then run: npm run build:songs

import { songs, songList } from "./songs-data";
import { Song } from "./types";

export { songs, songList };

// Helper function to get a song by ID
export function getSong(id: string): Song | undefined {
  return songs.get(id);
}

// Helper function to get all songs
export function getAllSongs(): Song[] {
  return songList;
}
