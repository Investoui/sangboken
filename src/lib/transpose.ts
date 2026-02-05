// Chord transposition utility

// Musical note order (using sharps)
const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

// Map flats to their sharp equivalents
const FLAT_TO_SHARP: Record<string, string> = {
  Db: "C#",
  Eb: "D#",
  Fb: "E",
  Gb: "F#",
  Ab: "G#",
  Bb: "A#",
  Cb: "B",
};

/**
 * Transpose a chord by a number of semitones
 * @param chord - The chord name (e.g., "C", "Am", "F#m7")
 * @param semitones - Number of semitones to transpose (positive = up, negative = down)
 * @returns The transposed chord name
 */
export function transposeChord(chord: string, semitones: number): string {
  if (semitones === 0) return chord;

  // Extract root note and suffix (e.g., "F#m7" -> root="F#", suffix="m7")
  const match = chord.match(/^([A-G][#b]?)(.*)$/);
  if (!match) return chord; // Return unchanged if not a valid chord

  let [, root] = match;
  const suffix = match[2];

  // Convert flat to sharp
  if (root.includes("b") && FLAT_TO_SHARP[root]) {
    root = FLAT_TO_SHARP[root];
  }

  // Find current note index
  const noteIndex = NOTES.indexOf(root);
  if (noteIndex === -1) return chord; // Return unchanged if note not found

  // Calculate new note index (handle wrapping with modulo)
  let newIndex = (noteIndex + semitones) % 12;
  if (newIndex < 0) newIndex += 12;

  // Get new root note
  const newRoot = NOTES[newIndex];

  return newRoot + suffix;
}

/**
 * Transpose all chords in a text by a number of semitones
 * Useful for transposing chord progressions or song sections
 * @param text - Text containing chord names in brackets [Chord]
 * @param semitones - Number of semitones to transpose
 * @returns Text with transposed chords
 */
export function transposeChordText(text: string, semitones: number): string {
  if (semitones === 0) return text;

  return text.replace(/\[([A-G][#b]?[^\]]*)\]/g, (_, chord) => {
    return `[${transposeChord(chord, semitones)}]`;
  });
}
