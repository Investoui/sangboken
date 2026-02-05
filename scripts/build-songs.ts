#!/usr/bin/env npx ts-node

/**
 * Build script: Reads .chopro and .tab files from songs/ directory
 * and generates src/lib/songs-data.ts for client-side usage.
 *
 * Run with: npx ts-node scripts/build-songs.ts
 * Or: npm run build:songs
 */

import * as fs from "fs";
import * as path from "path";

const SONGS_DIR = path.join(process.cwd(), "songs");
const OUTPUT_FILE = path.join(process.cwd(), "src/lib/songs-data.ts");

interface SongFile {
  id: string;
  filename: string;
  content: string;
  format: "chordpro" | "tab";
}

function main() {
  // Check if songs directory exists
  if (!fs.existsSync(SONGS_DIR)) {
    console.error(`Error: Songs directory not found: ${SONGS_DIR}`);
    process.exit(1);
  }

  // Read all song files
  const files = fs.readdirSync(SONGS_DIR);
  const songs: SongFile[] = [];

  for (const filename of files) {
    const ext = path.extname(filename).toLowerCase();
    const id = path.basename(filename, ext);
    const filePath = path.join(SONGS_DIR, filename);

    if ([".chopro", ".cho", ".crd"].includes(ext)) {
      const content = fs.readFileSync(filePath, "utf-8");
      songs.push({ id, filename, content, format: "chordpro" });
    } else if (ext === ".tab") {
      const content = fs.readFileSync(filePath, "utf-8");
      songs.push({ id, filename, content, format: "tab" });
    }
  }

  // Sort alphabetically by filename
  songs.sort((a, b) => a.filename.localeCompare(b.filename));

  // Generate TypeScript output
  const output = generateTypeScript(songs);

  // Write output file
  fs.writeFileSync(OUTPUT_FILE, output, "utf-8");

  console.log(`Generated ${OUTPUT_FILE} with ${songs.length} songs:`);
  songs.forEach((s) => console.log(`  - ${s.id} (${s.format})`));
}

function generateTypeScript(songs: SongFile[]): string {
  const lines: string[] = [
    "// AUTO-GENERATED FILE - DO NOT EDIT DIRECTLY",
    "// Run `npm run build:songs` to regenerate from songs/ directory",
    "",
    'import { Song } from "./types";',
    'import { parseChordPro } from "./chordpro-parser";',
    "",
  ];

  // Generate raw content constants
  for (const song of songs) {
    const varName = toVariableName(song.id);
    // Escape backticks and ${} in content for template literals
    const escapedContent = song.content
      .replace(/\\/g, "\\\\")
      .replace(/`/g, "\\`")
      .replace(/\$\{/g, "\\${");

    lines.push(`const ${varName}Raw = \`${escapedContent}\`;`);
    lines.push("");
  }

  // Generate tab parser function
  lines.push(`
function parseTabFile(content: string, id: string): Song {
  const lines = content.split("\\n");
  let title = "Untitled";
  let artist: string | undefined;
  let key: string | undefined;
  const metadataLines: number[] = [];

  lines.forEach((line, index) => {
    const match = line.match(/^\\s*\\{([^:}]+):\\s*([^}]*)\\}\\s*$/);
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

  const rawTab = lines
    .filter((_, index) => !metadataLines.includes(index))
    .join("\\n")
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
`);

  // Generate parsed songs array
  lines.push("// Parse all songs");
  lines.push("const parsedSongs: Song[] = [");

  for (const song of songs) {
    const varName = toVariableName(song.id);
    if (song.format === "tab") {
      lines.push(`  parseTabFile(${varName}Raw, "${song.id}"),`);
    } else {
      lines.push(`  parseChordPro(${varName}Raw, "${song.id}"),`);
    }
  }

  lines.push("];");
  lines.push("");

  // Sort by title
  lines.push('// Sort by title for display');
  lines.push('parsedSongs.sort((a, b) => a.title.localeCompare(b.title, "no"));');
  lines.push("");

  // Export
  lines.push("// Export songs map and list");
  lines.push("export const songs: Map<string, Song> = new Map(");
  lines.push('  parsedSongs.map((song) => [song.id, song])');
  lines.push(");");
  lines.push("");
  lines.push("export const songList: Song[] = parsedSongs;");
  lines.push("");

  return lines.join("\n");
}

function toVariableName(id: string): string {
  // Convert kebab-case to camelCase
  return id.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

main();
