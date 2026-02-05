import fs from "fs";
import path from "path";
import { Song } from "./types";
import { parseChordPro } from "./chordpro-parser";

const SONGS_DIR = path.join(process.cwd(), "songs");

/**
 * Parse a tab file into a Song object
 * Tab files use ChordPro-like metadata but contain raw tablature
 */
function parseTabFile(content: string, id: string): Song {
  const lines = content.split("\n");
  let title = "Untitled";
  let artist: string | undefined;
  let key: string | undefined;
  const metadataLines: number[] = [];

  // Extract metadata from ChordPro-style directives
  lines.forEach((line, index) => {
    const match = line.match(/^\s*\{([^:}]+):\s*([^}]*)\}\s*$/);
    if (match) {
      const directive = match[1].toLowerCase().trim();
      const value = match[2].trim();
      metadataLines.push(index);

      switch (directive) {
        case "title":
        case "t":
          title = value;
          break;
        case "artist":
        case "a":
          artist = value;
          break;
        case "key":
        case "k":
          key = value;
          break;
      }
    }
  });

  // Get raw tab content (everything except metadata)
  const rawTab = lines
    .filter((_, index) => !metadataLines.includes(index))
    .join("\n")
    .trim();

  return {
    id,
    title,
    artist,
    key,
    format: "tab",
    sections: [{ name: "Full Song", lines: [] }],
    rawTab,
  };
}

/**
 * Load all songs from the songs directory
 * This runs at build time in Next.js
 */
export function loadAllSongs(): Song[] {
  if (!fs.existsSync(SONGS_DIR)) {
    console.warn(`Songs directory not found: ${SONGS_DIR}`);
    return [];
  }

  const files = fs.readdirSync(SONGS_DIR);
  const songs: Song[] = [];

  for (const file of files) {
    const filePath = path.join(SONGS_DIR, file);
    const content = fs.readFileSync(filePath, "utf-8");
    const id = path.basename(file, path.extname(file));
    const ext = path.extname(file).toLowerCase();

    if (ext === ".chopro" || ext === ".cho" || ext === ".crd") {
      songs.push(parseChordPro(content, id));
    } else if (ext === ".tab") {
      songs.push(parseTabFile(content, id));
    }
  }

  // Sort alphabetically by title
  songs.sort((a, b) => a.title.localeCompare(b.title, "no"));

  return songs;
}

/**
 * Load a single song by ID
 */
export function loadSong(id: string): Song | null {
  const extensions = [".chopro", ".cho", ".crd", ".tab"];

  for (const ext of extensions) {
    const filePath = path.join(SONGS_DIR, `${id}${ext}`);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      if (ext === ".tab") {
        return parseTabFile(content, id);
      }
      return parseChordPro(content, id);
    }
  }

  return null;
}

/**
 * Get list of all song IDs (useful for static generation)
 */
export function getAllSongIds(): string[] {
  if (!fs.existsSync(SONGS_DIR)) {
    return [];
  }

  const files = fs.readdirSync(SONGS_DIR);
  return files
    .filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return [".chopro", ".cho", ".crd", ".tab"].includes(ext);
    })
    .map((file) => path.basename(file, path.extname(file)));
}
