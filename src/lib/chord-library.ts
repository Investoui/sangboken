// Chord finger data library
// Finger numbers: 1=index, 2=middle, 3=ring, 4=pinky, 0=open, -1=muted
// Fret positions: 0=open, 1-12=fret number
// Strings: [E(low), A, D, G, B, e(high)] - index 0 is low E

export interface ChordFingering {
  name: string;
  // Each element represents a string [lowE, A, D, G, B, highE]
  // Value is the fret number (0=open, -1=muted)
  frets: [number, number, number, number, number, number];
  // Finger numbers for each string (0=none/open, 1-4=finger, -1=muted)
  fingers: [number, number, number, number, number, number];
  // Starting fret for display (usually 1, but could be higher for barre chords)
  baseFret: number;
  // Barre info: if present, shows a barre from string to string at a fret
  barre?: {
    fret: number;
    fromString: number; // 0=lowE, 5=highE
    toString: number;
  };
}

export const chordLibrary: Record<string, ChordFingering> = {
  C: {
    name: "C",
    frets: [-1, 3, 2, 0, 1, 0],
    fingers: [-1, 3, 2, 0, 1, 0],
    baseFret: 1,
  },
  D: {
    name: "D",
    frets: [-1, -1, 0, 2, 3, 2],
    fingers: [-1, -1, 0, 1, 3, 2],
    baseFret: 1,
  },
  E: {
    name: "E",
    frets: [0, 2, 2, 1, 0, 0],
    fingers: [0, 2, 3, 1, 0, 0],
    baseFret: 1,
  },
  G: {
    name: "G",
    frets: [3, 2, 0, 0, 0, 3],
    fingers: [2, 1, 0, 0, 0, 3],
    baseFret: 1,
  },
  A: {
    name: "A",
    frets: [-1, 0, 2, 2, 2, 0],
    fingers: [-1, 0, 1, 2, 3, 0],
    baseFret: 1,
  },
  Am: {
    name: "Am",
    frets: [-1, 0, 2, 2, 1, 0],
    fingers: [-1, 0, 2, 3, 1, 0],
    baseFret: 1,
  },
  Em: {
    name: "Em",
    frets: [0, 2, 2, 0, 0, 0],
    fingers: [0, 2, 3, 0, 0, 0],
    baseFret: 1,
  },
  Dm: {
    name: "Dm",
    frets: [-1, -1, 0, 2, 3, 1],
    fingers: [-1, -1, 0, 2, 3, 1],
    baseFret: 1,
  },
  F: {
    name: "F",
    frets: [1, 3, 3, 2, 1, 1],
    fingers: [1, 3, 4, 2, 1, 1],
    baseFret: 1,
    barre: {
      fret: 1,
      fromString: 0,
      toString: 5,
    },
  },
  Bm: {
    name: "Bm",
    frets: [-1, 2, 4, 4, 3, 2],
    fingers: [-1, 1, 3, 4, 2, 1],
    baseFret: 2,
    barre: {
      fret: 2,
      fromString: 1,
      toString: 5,
    },
  },
};

export function getChord(name: string): ChordFingering | null {
  return chordLibrary[name] ?? null;
}

export function getAllChordNames(): string[] {
  return Object.keys(chordLibrary);
}
