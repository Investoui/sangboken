import { Song, SongSection, SongLine, ChordPosition } from "./types";

/**
 * Basic ChordPro parser
 * Parses text in the format: [G]Lyrics [C]with [D]chords
 *
 * Supports:
 * - Inline chords: [G]word
 * - Section markers: {verse}, {chorus}, {bridge}
 * - Title directive: {title: Song Name} or {t: Song Name}
 * - Artist directive: {artist: Artist Name} or {a: Artist Name}
 * - Key directive: {key: G}
 */

interface ParsedSong {
  title: string;
  artist?: string;
  key?: string;
  sections: SongSection[];
}

/**
 * Parse a single line of ChordPro text into lyrics and chord positions
 */
function parseLine(line: string): SongLine {
  const chords: ChordPosition[] = [];
  let lyrics = "";
  let position = 0;

  // Regex to match [Chord] patterns
  const chordRegex = /\[([^\]]+)\]/g;
  let lastIndex = 0;
  let match;

  while ((match = chordRegex.exec(line)) !== null) {
    // Add any text before this chord
    const textBefore = line.slice(lastIndex, match.index);
    lyrics += textBefore;
    position += textBefore.length;

    // Record chord position (where it appears in the lyrics)
    chords.push({
      chord: match[1],
      position: position,
    });

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text after last chord
  lyrics += line.slice(lastIndex);

  return { lyrics, chords };
}

/**
 * Parse a directive line like {title: Song Name}
 */
function parseDirective(line: string): { type: string; value: string } | null {
  const match = line.match(/^\s*\{([^:}]+)(?::\s*([^}]*))?\}\s*$/);
  if (!match) return null;

  return {
    type: match[1].toLowerCase().trim(),
    value: (match[2] || "").trim(),
  };
}

/**
 * Map directive shortcuts to full names
 */
function normalizeDirectiveType(type: string): string {
  const map: Record<string, string> = {
    t: "title",
    ti: "title",
    a: "artist",
    st: "artist",
    subtitle: "artist",
    k: "key",
    c: "comment",
    v: "verse",
    ch: "chorus",
  };
  return map[type] || type;
}

/**
 * Parse ChordPro text into a Song object
 */
export function parseChordPro(text: string, id: string): Song {
  const lines = text.split("\n");
  const result: ParsedSong = {
    title: "Untitled",
    sections: [],
  };

  let currentSection: SongSection = {
    name: "Verse",
    lines: [],
  };

  for (const line of lines) {
    const trimmedLine = line.trim();

    // Skip empty lines but preserve section breaks
    if (!trimmedLine) {
      continue;
    }

    // Check for directive
    const directive = parseDirective(trimmedLine);
    if (directive) {
      const type = normalizeDirectiveType(directive.type);

      switch (type) {
        case "title":
          result.title = directive.value;
          break;
        case "artist":
          result.artist = directive.value;
          break;
        case "key":
          result.key = directive.value;
          break;
        case "verse":
        case "chorus":
        case "bridge":
        case "intro":
        case "outro":
        case "pre-chorus":
          // Start new section if current has content
          if (currentSection.lines.length > 0) {
            result.sections.push(currentSection);
          }
          currentSection = {
            name: directive.value || type.charAt(0).toUpperCase() + type.slice(1),
            lines: [],
          };
          break;
        // Ignore other directives
      }
      continue;
    }

    // Parse as regular line with chords
    const parsedLine = parseLine(trimmedLine);

    // Only add non-empty lines
    if (parsedLine.lyrics.trim() || parsedLine.chords.length > 0) {
      currentSection.lines.push(parsedLine);
    }
  }

  // Add final section if it has content
  if (currentSection.lines.length > 0) {
    result.sections.push(currentSection);
  }

  return {
    id,
    title: result.title,
    artist: result.artist,
    key: result.key,
    sections: result.sections,
  };
}

/**
 * Parse multiple ChordPro songs from a string separated by double newlines
 */
export function parseMultipleChordPro(
  text: string,
  baseId: string
): Song[] {
  // Split on multiple blank lines
  const songTexts = text.split(/\n{3,}/);
  return songTexts
    .filter((t) => t.trim())
    .map((t, i) => parseChordPro(t, `${baseId}-${i + 1}`));
}
