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
  // ============================================
  // MAJOR CHORDS
  // ============================================
  C: {
    name: "C",
    frets: [-1, 3, 2, 0, 1, 0],
    fingers: [-1, 3, 2, 0, 1, 0],
    baseFret: 1,
  },
  "C#": {
    name: "C#",
    frets: [-1, 4, 6, 6, 6, 4],
    fingers: [-1, 1, 3, 3, 3, 1],
    baseFret: 4,
    barre: {
      fret: 4,
      fromString: 1,
      toString: 5,
    },
  },
  Db: {
    name: "Db",
    frets: [-1, 4, 6, 6, 6, 4],
    fingers: [-1, 1, 3, 3, 3, 1],
    baseFret: 4,
    barre: {
      fret: 4,
      fromString: 1,
      toString: 5,
    },
  },
  D: {
    name: "D",
    frets: [-1, -1, 0, 2, 3, 2],
    fingers: [-1, -1, 0, 1, 3, 2],
    baseFret: 1,
  },
  "D#": {
    name: "D#",
    frets: [-1, 6, 8, 8, 8, 6],
    fingers: [-1, 1, 3, 3, 3, 1],
    baseFret: 6,
    barre: {
      fret: 6,
      fromString: 1,
      toString: 5,
    },
  },
  Eb: {
    name: "Eb",
    frets: [-1, 6, 8, 8, 8, 6],
    fingers: [-1, 1, 3, 3, 3, 1],
    baseFret: 6,
    barre: {
      fret: 6,
      fromString: 1,
      toString: 5,
    },
  },
  E: {
    name: "E",
    frets: [0, 2, 2, 1, 0, 0],
    fingers: [0, 2, 3, 1, 0, 0],
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
  "F#": {
    name: "F#",
    frets: [2, 4, 4, 3, 2, 2],
    fingers: [1, 3, 4, 2, 1, 1],
    baseFret: 2,
    barre: {
      fret: 2,
      fromString: 0,
      toString: 5,
    },
  },
  Gb: {
    name: "Gb",
    frets: [2, 4, 4, 3, 2, 2],
    fingers: [1, 3, 4, 2, 1, 1],
    baseFret: 2,
    barre: {
      fret: 2,
      fromString: 0,
      toString: 5,
    },
  },
  G: {
    name: "G",
    frets: [3, 2, 0, 0, 0, 3],
    fingers: [2, 1, 0, 0, 0, 3],
    baseFret: 1,
  },
  "G#": {
    name: "G#",
    frets: [4, 6, 6, 5, 4, 4],
    fingers: [1, 3, 4, 2, 1, 1],
    baseFret: 4,
    barre: {
      fret: 4,
      fromString: 0,
      toString: 5,
    },
  },
  Ab: {
    name: "Ab",
    frets: [4, 6, 6, 5, 4, 4],
    fingers: [1, 3, 4, 2, 1, 1],
    baseFret: 4,
    barre: {
      fret: 4,
      fromString: 0,
      toString: 5,
    },
  },
  A: {
    name: "A",
    frets: [-1, 0, 2, 2, 2, 0],
    fingers: [-1, 0, 1, 2, 3, 0],
    baseFret: 1,
  },
  "A#": {
    name: "A#",
    frets: [-1, 1, 3, 3, 3, 1],
    fingers: [-1, 1, 2, 3, 4, 1],
    baseFret: 1,
    barre: {
      fret: 1,
      fromString: 1,
      toString: 5,
    },
  },
  Bb: {
    name: "Bb",
    frets: [-1, 1, 3, 3, 3, 1],
    fingers: [-1, 1, 2, 3, 4, 1],
    baseFret: 1,
    barre: {
      fret: 1,
      fromString: 1,
      toString: 5,
    },
  },
  B: {
    name: "B",
    frets: [-1, 2, 4, 4, 4, 2],
    fingers: [-1, 1, 2, 3, 4, 1],
    baseFret: 2,
    barre: {
      fret: 2,
      fromString: 1,
      toString: 5,
    },
  },

  // ============================================
  // MINOR CHORDS
  // ============================================
  Cm: {
    name: "Cm",
    frets: [-1, 3, 5, 5, 4, 3],
    fingers: [-1, 1, 3, 4, 2, 1],
    baseFret: 3,
    barre: {
      fret: 3,
      fromString: 1,
      toString: 5,
    },
  },
  "C#m": {
    name: "C#m",
    frets: [-1, 4, 6, 6, 5, 4],
    fingers: [-1, 1, 3, 4, 2, 1],
    baseFret: 4,
    barre: {
      fret: 4,
      fromString: 1,
      toString: 5,
    },
  },
  Dbm: {
    name: "Dbm",
    frets: [-1, 4, 6, 6, 5, 4],
    fingers: [-1, 1, 3, 4, 2, 1],
    baseFret: 4,
    barre: {
      fret: 4,
      fromString: 1,
      toString: 5,
    },
  },
  Dm: {
    name: "Dm",
    frets: [-1, -1, 0, 2, 3, 1],
    fingers: [-1, -1, 0, 2, 3, 1],
    baseFret: 1,
  },
  "D#m": {
    name: "D#m",
    frets: [-1, 6, 8, 8, 7, 6],
    fingers: [-1, 1, 3, 4, 2, 1],
    baseFret: 6,
    barre: {
      fret: 6,
      fromString: 1,
      toString: 5,
    },
  },
  Ebm: {
    name: "Ebm",
    frets: [-1, 6, 8, 8, 7, 6],
    fingers: [-1, 1, 3, 4, 2, 1],
    baseFret: 6,
    barre: {
      fret: 6,
      fromString: 1,
      toString: 5,
    },
  },
  Em: {
    name: "Em",
    frets: [0, 2, 2, 0, 0, 0],
    fingers: [0, 2, 3, 0, 0, 0],
    baseFret: 1,
  },
  Fm: {
    name: "Fm",
    frets: [1, 3, 3, 1, 1, 1],
    fingers: [1, 3, 4, 1, 1, 1],
    baseFret: 1,
    barre: {
      fret: 1,
      fromString: 0,
      toString: 5,
    },
  },
  "F#m": {
    name: "F#m",
    frets: [2, 4, 4, 2, 2, 2],
    fingers: [1, 3, 4, 1, 1, 1],
    baseFret: 2,
    barre: {
      fret: 2,
      fromString: 0,
      toString: 5,
    },
  },
  Gbm: {
    name: "Gbm",
    frets: [2, 4, 4, 2, 2, 2],
    fingers: [1, 3, 4, 1, 1, 1],
    baseFret: 2,
    barre: {
      fret: 2,
      fromString: 0,
      toString: 5,
    },
  },
  Gm: {
    name: "Gm",
    frets: [3, 5, 5, 3, 3, 3],
    fingers: [1, 3, 4, 1, 1, 1],
    baseFret: 3,
    barre: {
      fret: 3,
      fromString: 0,
      toString: 5,
    },
  },
  "G#m": {
    name: "G#m",
    frets: [4, 6, 6, 4, 4, 4],
    fingers: [1, 3, 4, 1, 1, 1],
    baseFret: 4,
    barre: {
      fret: 4,
      fromString: 0,
      toString: 5,
    },
  },
  Abm: {
    name: "Abm",
    frets: [4, 6, 6, 4, 4, 4],
    fingers: [1, 3, 4, 1, 1, 1],
    baseFret: 4,
    barre: {
      fret: 4,
      fromString: 0,
      toString: 5,
    },
  },
  Am: {
    name: "Am",
    frets: [-1, 0, 2, 2, 1, 0],
    fingers: [-1, 0, 2, 3, 1, 0],
    baseFret: 1,
  },
  "A#m": {
    name: "A#m",
    frets: [-1, 1, 3, 3, 2, 1],
    fingers: [-1, 1, 3, 4, 2, 1],
    baseFret: 1,
    barre: {
      fret: 1,
      fromString: 1,
      toString: 5,
    },
  },
  Bbm: {
    name: "Bbm",
    frets: [-1, 1, 3, 3, 2, 1],
    fingers: [-1, 1, 3, 4, 2, 1],
    baseFret: 1,
    barre: {
      fret: 1,
      fromString: 1,
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

  // ============================================
  // DOMINANT 7TH CHORDS
  // ============================================
  C7: {
    name: "C7",
    frets: [-1, 3, 2, 3, 1, 0],
    fingers: [-1, 3, 2, 4, 1, 0],
    baseFret: 1,
  },
  "C#7": {
    name: "C#7",
    frets: [-1, 4, 6, 4, 6, 4],
    fingers: [-1, 1, 3, 1, 4, 1],
    baseFret: 4,
    barre: {
      fret: 4,
      fromString: 1,
      toString: 5,
    },
  },
  Db7: {
    name: "Db7",
    frets: [-1, 4, 6, 4, 6, 4],
    fingers: [-1, 1, 3, 1, 4, 1],
    baseFret: 4,
    barre: {
      fret: 4,
      fromString: 1,
      toString: 5,
    },
  },
  D7: {
    name: "D7",
    frets: [-1, -1, 0, 2, 1, 2],
    fingers: [-1, -1, 0, 2, 1, 3],
    baseFret: 1,
  },
  "D#7": {
    name: "D#7",
    frets: [-1, 6, 8, 6, 8, 6],
    fingers: [-1, 1, 3, 1, 4, 1],
    baseFret: 6,
    barre: {
      fret: 6,
      fromString: 1,
      toString: 5,
    },
  },
  Eb7: {
    name: "Eb7",
    frets: [-1, 6, 8, 6, 8, 6],
    fingers: [-1, 1, 3, 1, 4, 1],
    baseFret: 6,
    barre: {
      fret: 6,
      fromString: 1,
      toString: 5,
    },
  },
  E7: {
    name: "E7",
    frets: [0, 2, 0, 1, 0, 0],
    fingers: [0, 2, 0, 1, 0, 0],
    baseFret: 1,
  },
  F7: {
    name: "F7",
    frets: [1, 3, 1, 2, 1, 1],
    fingers: [1, 3, 1, 2, 1, 1],
    baseFret: 1,
    barre: {
      fret: 1,
      fromString: 0,
      toString: 5,
    },
  },
  "F#7": {
    name: "F#7",
    frets: [2, 4, 2, 3, 2, 2],
    fingers: [1, 3, 1, 2, 1, 1],
    baseFret: 2,
    barre: {
      fret: 2,
      fromString: 0,
      toString: 5,
    },
  },
  Gb7: {
    name: "Gb7",
    frets: [2, 4, 2, 3, 2, 2],
    fingers: [1, 3, 1, 2, 1, 1],
    baseFret: 2,
    barre: {
      fret: 2,
      fromString: 0,
      toString: 5,
    },
  },
  G7: {
    name: "G7",
    frets: [3, 2, 0, 0, 0, 1],
    fingers: [3, 2, 0, 0, 0, 1],
    baseFret: 1,
  },
  "G#7": {
    name: "G#7",
    frets: [4, 6, 4, 5, 4, 4],
    fingers: [1, 3, 1, 2, 1, 1],
    baseFret: 4,
    barre: {
      fret: 4,
      fromString: 0,
      toString: 5,
    },
  },
  Ab7: {
    name: "Ab7",
    frets: [4, 6, 4, 5, 4, 4],
    fingers: [1, 3, 1, 2, 1, 1],
    baseFret: 4,
    barre: {
      fret: 4,
      fromString: 0,
      toString: 5,
    },
  },
  A7: {
    name: "A7",
    frets: [-1, 0, 2, 0, 2, 0],
    fingers: [-1, 0, 2, 0, 3, 0],
    baseFret: 1,
  },
  "A#7": {
    name: "A#7",
    frets: [-1, 1, 3, 1, 3, 1],
    fingers: [-1, 1, 3, 1, 4, 1],
    baseFret: 1,
    barre: {
      fret: 1,
      fromString: 1,
      toString: 5,
    },
  },
  Bb7: {
    name: "Bb7",
    frets: [-1, 1, 3, 1, 3, 1],
    fingers: [-1, 1, 3, 1, 4, 1],
    baseFret: 1,
    barre: {
      fret: 1,
      fromString: 1,
      toString: 5,
    },
  },
  B7: {
    name: "B7",
    frets: [-1, 2, 1, 2, 0, 2],
    fingers: [-1, 2, 1, 3, 0, 4],
    baseFret: 1,
  },

  // ============================================
  // MINOR 7TH CHORDS
  // ============================================
  Cm7: {
    name: "Cm7",
    frets: [-1, 3, 5, 3, 4, 3],
    fingers: [-1, 1, 3, 1, 2, 1],
    baseFret: 3,
    barre: {
      fret: 3,
      fromString: 1,
      toString: 5,
    },
  },
  "C#m7": {
    name: "C#m7",
    frets: [-1, 4, 6, 4, 5, 4],
    fingers: [-1, 1, 3, 1, 2, 1],
    baseFret: 4,
    barre: {
      fret: 4,
      fromString: 1,
      toString: 5,
    },
  },
  Dbm7: {
    name: "Dbm7",
    frets: [-1, 4, 6, 4, 5, 4],
    fingers: [-1, 1, 3, 1, 2, 1],
    baseFret: 4,
    barre: {
      fret: 4,
      fromString: 1,
      toString: 5,
    },
  },
  Dm7: {
    name: "Dm7",
    frets: [-1, -1, 0, 2, 1, 1],
    fingers: [-1, -1, 0, 2, 1, 1],
    baseFret: 1,
  },
  "D#m7": {
    name: "D#m7",
    frets: [-1, 6, 8, 6, 7, 6],
    fingers: [-1, 1, 3, 1, 2, 1],
    baseFret: 6,
    barre: {
      fret: 6,
      fromString: 1,
      toString: 5,
    },
  },
  Ebm7: {
    name: "Ebm7",
    frets: [-1, 6, 8, 6, 7, 6],
    fingers: [-1, 1, 3, 1, 2, 1],
    baseFret: 6,
    barre: {
      fret: 6,
      fromString: 1,
      toString: 5,
    },
  },
  Em7: {
    name: "Em7",
    frets: [0, 2, 0, 0, 0, 0],
    fingers: [0, 2, 0, 0, 0, 0],
    baseFret: 1,
  },
  Fm7: {
    name: "Fm7",
    frets: [1, 3, 1, 1, 1, 1],
    fingers: [1, 3, 1, 1, 1, 1],
    baseFret: 1,
    barre: {
      fret: 1,
      fromString: 0,
      toString: 5,
    },
  },
  "F#m7": {
    name: "F#m7",
    frets: [2, 4, 2, 2, 2, 2],
    fingers: [1, 3, 1, 1, 1, 1],
    baseFret: 2,
    barre: {
      fret: 2,
      fromString: 0,
      toString: 5,
    },
  },
  Gbm7: {
    name: "Gbm7",
    frets: [2, 4, 2, 2, 2, 2],
    fingers: [1, 3, 1, 1, 1, 1],
    baseFret: 2,
    barre: {
      fret: 2,
      fromString: 0,
      toString: 5,
    },
  },
  Gm7: {
    name: "Gm7",
    frets: [3, 5, 3, 3, 3, 3],
    fingers: [1, 3, 1, 1, 1, 1],
    baseFret: 3,
    barre: {
      fret: 3,
      fromString: 0,
      toString: 5,
    },
  },
  "G#m7": {
    name: "G#m7",
    frets: [4, 6, 4, 4, 4, 4],
    fingers: [1, 3, 1, 1, 1, 1],
    baseFret: 4,
    barre: {
      fret: 4,
      fromString: 0,
      toString: 5,
    },
  },
  Abm7: {
    name: "Abm7",
    frets: [4, 6, 4, 4, 4, 4],
    fingers: [1, 3, 1, 1, 1, 1],
    baseFret: 4,
    barre: {
      fret: 4,
      fromString: 0,
      toString: 5,
    },
  },
  Am7: {
    name: "Am7",
    frets: [-1, 0, 2, 0, 1, 0],
    fingers: [-1, 0, 2, 0, 1, 0],
    baseFret: 1,
  },
  "A#m7": {
    name: "A#m7",
    frets: [-1, 1, 3, 1, 2, 1],
    fingers: [-1, 1, 3, 1, 2, 1],
    baseFret: 1,
    barre: {
      fret: 1,
      fromString: 1,
      toString: 5,
    },
  },
  Bbm7: {
    name: "Bbm7",
    frets: [-1, 1, 3, 1, 2, 1],
    fingers: [-1, 1, 3, 1, 2, 1],
    baseFret: 1,
    barre: {
      fret: 1,
      fromString: 1,
      toString: 5,
    },
  },
  Bm7: {
    name: "Bm7",
    frets: [-1, 2, 4, 2, 3, 2],
    fingers: [-1, 1, 3, 1, 2, 1],
    baseFret: 2,
    barre: {
      fret: 2,
      fromString: 1,
      toString: 5,
    },
  },

  // ============================================
  // MAJOR 7TH CHORDS
  // ============================================
  Cmaj7: {
    name: "Cmaj7",
    frets: [-1, 3, 2, 0, 0, 0],
    fingers: [-1, 3, 2, 0, 0, 0],
    baseFret: 1,
  },
  "C#maj7": {
    name: "C#maj7",
    frets: [-1, 4, 6, 5, 6, 4],
    fingers: [-1, 1, 3, 2, 4, 1],
    baseFret: 4,
    barre: {
      fret: 4,
      fromString: 1,
      toString: 5,
    },
  },
  Dbmaj7: {
    name: "Dbmaj7",
    frets: [-1, 4, 6, 5, 6, 4],
    fingers: [-1, 1, 3, 2, 4, 1],
    baseFret: 4,
    barre: {
      fret: 4,
      fromString: 1,
      toString: 5,
    },
  },
  Dmaj7: {
    name: "Dmaj7",
    frets: [-1, -1, 0, 2, 2, 2],
    fingers: [-1, -1, 0, 1, 1, 1],
    baseFret: 1,
  },
  "D#maj7": {
    name: "D#maj7",
    frets: [-1, 6, 8, 7, 8, 6],
    fingers: [-1, 1, 3, 2, 4, 1],
    baseFret: 6,
    barre: {
      fret: 6,
      fromString: 1,
      toString: 5,
    },
  },
  Ebmaj7: {
    name: "Ebmaj7",
    frets: [-1, 6, 8, 7, 8, 6],
    fingers: [-1, 1, 3, 2, 4, 1],
    baseFret: 6,
    barre: {
      fret: 6,
      fromString: 1,
      toString: 5,
    },
  },
  Emaj7: {
    name: "Emaj7",
    frets: [0, 2, 1, 1, 0, 0],
    fingers: [0, 3, 1, 2, 0, 0],
    baseFret: 1,
  },
  Fmaj7: {
    name: "Fmaj7",
    frets: [1, 3, 2, 2, 1, 1],
    fingers: [1, 4, 2, 3, 1, 1],
    baseFret: 1,
    barre: {
      fret: 1,
      fromString: 0,
      toString: 5,
    },
  },
  "F#maj7": {
    name: "F#maj7",
    frets: [2, 4, 3, 3, 2, 2],
    fingers: [1, 4, 2, 3, 1, 1],
    baseFret: 2,
    barre: {
      fret: 2,
      fromString: 0,
      toString: 5,
    },
  },
  Gbmaj7: {
    name: "Gbmaj7",
    frets: [2, 4, 3, 3, 2, 2],
    fingers: [1, 4, 2, 3, 1, 1],
    baseFret: 2,
    barre: {
      fret: 2,
      fromString: 0,
      toString: 5,
    },
  },
  Gmaj7: {
    name: "Gmaj7",
    frets: [3, 2, 0, 0, 0, 2],
    fingers: [3, 2, 0, 0, 0, 1],
    baseFret: 1,
  },
  "G#maj7": {
    name: "G#maj7",
    frets: [4, 6, 5, 5, 4, 4],
    fingers: [1, 4, 2, 3, 1, 1],
    baseFret: 4,
    barre: {
      fret: 4,
      fromString: 0,
      toString: 5,
    },
  },
  Abmaj7: {
    name: "Abmaj7",
    frets: [4, 6, 5, 5, 4, 4],
    fingers: [1, 4, 2, 3, 1, 1],
    baseFret: 4,
    barre: {
      fret: 4,
      fromString: 0,
      toString: 5,
    },
  },
  Amaj7: {
    name: "Amaj7",
    frets: [-1, 0, 2, 1, 2, 0],
    fingers: [-1, 0, 3, 1, 2, 0],
    baseFret: 1,
  },
  "A#maj7": {
    name: "A#maj7",
    frets: [-1, 1, 3, 2, 3, 1],
    fingers: [-1, 1, 3, 2, 4, 1],
    baseFret: 1,
    barre: {
      fret: 1,
      fromString: 1,
      toString: 5,
    },
  },
  Bbmaj7: {
    name: "Bbmaj7",
    frets: [-1, 1, 3, 2, 3, 1],
    fingers: [-1, 1, 3, 2, 4, 1],
    baseFret: 1,
    barre: {
      fret: 1,
      fromString: 1,
      toString: 5,
    },
  },
  Bmaj7: {
    name: "Bmaj7",
    frets: [-1, 2, 4, 3, 4, 2],
    fingers: [-1, 1, 3, 2, 4, 1],
    baseFret: 2,
    barre: {
      fret: 2,
      fromString: 1,
      toString: 5,
    },
  },

  // ============================================
  // SUS2 CHORDS
  // ============================================
  Csus2: {
    name: "Csus2",
    frets: [-1, 3, 0, 0, 1, 3],
    fingers: [-1, 2, 0, 0, 1, 3],
    baseFret: 1,
  },
  "C#sus2": {
    name: "C#sus2",
    frets: [-1, 4, 6, 6, 4, 4],
    fingers: [-1, 1, 3, 4, 1, 1],
    baseFret: 4,
    barre: {
      fret: 4,
      fromString: 1,
      toString: 5,
    },
  },
  Dbsus2: {
    name: "Dbsus2",
    frets: [-1, 4, 6, 6, 4, 4],
    fingers: [-1, 1, 3, 4, 1, 1],
    baseFret: 4,
    barre: {
      fret: 4,
      fromString: 1,
      toString: 5,
    },
  },
  Dsus2: {
    name: "Dsus2",
    frets: [-1, -1, 0, 2, 3, 0],
    fingers: [-1, -1, 0, 1, 2, 0],
    baseFret: 1,
  },
  "D#sus2": {
    name: "D#sus2",
    frets: [-1, 6, 8, 8, 6, 6],
    fingers: [-1, 1, 3, 4, 1, 1],
    baseFret: 6,
    barre: {
      fret: 6,
      fromString: 1,
      toString: 5,
    },
  },
  Ebsus2: {
    name: "Ebsus2",
    frets: [-1, 6, 8, 8, 6, 6],
    fingers: [-1, 1, 3, 4, 1, 1],
    baseFret: 6,
    barre: {
      fret: 6,
      fromString: 1,
      toString: 5,
    },
  },
  Esus2: {
    name: "Esus2",
    frets: [0, 2, 4, 4, 0, 0],
    fingers: [0, 1, 3, 4, 0, 0],
    baseFret: 1,
  },
  Fsus2: {
    name: "Fsus2",
    frets: [-1, -1, 3, 0, 1, 1],
    fingers: [-1, -1, 3, 0, 1, 1],
    baseFret: 1,
  },
  "F#sus2": {
    name: "F#sus2",
    frets: [-1, -1, 4, 1, 2, 2],
    fingers: [-1, -1, 4, 1, 2, 3],
    baseFret: 1,
  },
  Gbsus2: {
    name: "Gbsus2",
    frets: [-1, -1, 4, 1, 2, 2],
    fingers: [-1, -1, 4, 1, 2, 3],
    baseFret: 1,
  },
  Gsus2: {
    name: "Gsus2",
    frets: [3, 0, 0, 0, 3, 3],
    fingers: [1, 0, 0, 0, 3, 4],
    baseFret: 1,
  },
  "G#sus2": {
    name: "G#sus2",
    frets: [4, 6, 8, 8, 4, 4],
    fingers: [1, 2, 3, 4, 1, 1],
    baseFret: 4,
    barre: {
      fret: 4,
      fromString: 0,
      toString: 5,
    },
  },
  Absus2: {
    name: "Absus2",
    frets: [4, 6, 8, 8, 4, 4],
    fingers: [1, 2, 3, 4, 1, 1],
    baseFret: 4,
    barre: {
      fret: 4,
      fromString: 0,
      toString: 5,
    },
  },
  Asus2: {
    name: "Asus2",
    frets: [-1, 0, 2, 2, 0, 0],
    fingers: [-1, 0, 1, 2, 0, 0],
    baseFret: 1,
  },
  "A#sus2": {
    name: "A#sus2",
    frets: [-1, 1, 3, 3, 1, 1],
    fingers: [-1, 1, 3, 4, 1, 1],
    baseFret: 1,
    barre: {
      fret: 1,
      fromString: 1,
      toString: 5,
    },
  },
  Bbsus2: {
    name: "Bbsus2",
    frets: [-1, 1, 3, 3, 1, 1],
    fingers: [-1, 1, 3, 4, 1, 1],
    baseFret: 1,
    barre: {
      fret: 1,
      fromString: 1,
      toString: 5,
    },
  },
  Bsus2: {
    name: "Bsus2",
    frets: [-1, 2, 4, 4, 2, 2],
    fingers: [-1, 1, 3, 4, 1, 1],
    baseFret: 2,
    barre: {
      fret: 2,
      fromString: 1,
      toString: 5,
    },
  },

  // ============================================
  // SUS4 CHORDS
  // ============================================
  Csus4: {
    name: "Csus4",
    frets: [-1, 3, 3, 0, 1, 1],
    fingers: [-1, 2, 3, 0, 1, 1],
    baseFret: 1,
  },
  "C#sus4": {
    name: "C#sus4",
    frets: [-1, 4, 6, 6, 7, 4],
    fingers: [-1, 1, 2, 3, 4, 1],
    baseFret: 4,
    barre: {
      fret: 4,
      fromString: 1,
      toString: 5,
    },
  },
  Dbsus4: {
    name: "Dbsus4",
    frets: [-1, 4, 6, 6, 7, 4],
    fingers: [-1, 1, 2, 3, 4, 1],
    baseFret: 4,
    barre: {
      fret: 4,
      fromString: 1,
      toString: 5,
    },
  },
  Dsus4: {
    name: "Dsus4",
    frets: [-1, -1, 0, 2, 3, 3],
    fingers: [-1, -1, 0, 1, 2, 3],
    baseFret: 1,
  },
  "D#sus4": {
    name: "D#sus4",
    frets: [-1, 6, 8, 8, 9, 6],
    fingers: [-1, 1, 2, 3, 4, 1],
    baseFret: 6,
    barre: {
      fret: 6,
      fromString: 1,
      toString: 5,
    },
  },
  Ebsus4: {
    name: "Ebsus4",
    frets: [-1, 6, 8, 8, 9, 6],
    fingers: [-1, 1, 2, 3, 4, 1],
    baseFret: 6,
    barre: {
      fret: 6,
      fromString: 1,
      toString: 5,
    },
  },
  Esus4: {
    name: "Esus4",
    frets: [0, 2, 2, 2, 0, 0],
    fingers: [0, 2, 3, 4, 0, 0],
    baseFret: 1,
  },
  Fsus4: {
    name: "Fsus4",
    frets: [1, 3, 3, 3, 1, 1],
    fingers: [1, 2, 3, 4, 1, 1],
    baseFret: 1,
    barre: {
      fret: 1,
      fromString: 0,
      toString: 5,
    },
  },
  "F#sus4": {
    name: "F#sus4",
    frets: [2, 4, 4, 4, 2, 2],
    fingers: [1, 2, 3, 4, 1, 1],
    baseFret: 2,
    barre: {
      fret: 2,
      fromString: 0,
      toString: 5,
    },
  },
  Gbsus4: {
    name: "Gbsus4",
    frets: [2, 4, 4, 4, 2, 2],
    fingers: [1, 2, 3, 4, 1, 1],
    baseFret: 2,
    barre: {
      fret: 2,
      fromString: 0,
      toString: 5,
    },
  },
  Gsus4: {
    name: "Gsus4",
    frets: [3, 3, 0, 0, 1, 3],
    fingers: [2, 3, 0, 0, 1, 4],
    baseFret: 1,
  },
  "G#sus4": {
    name: "G#sus4",
    frets: [4, 6, 6, 6, 4, 4],
    fingers: [1, 2, 3, 4, 1, 1],
    baseFret: 4,
    barre: {
      fret: 4,
      fromString: 0,
      toString: 5,
    },
  },
  Absus4: {
    name: "Absus4",
    frets: [4, 6, 6, 6, 4, 4],
    fingers: [1, 2, 3, 4, 1, 1],
    baseFret: 4,
    barre: {
      fret: 4,
      fromString: 0,
      toString: 5,
    },
  },
  Asus4: {
    name: "Asus4",
    frets: [-1, 0, 2, 2, 3, 0],
    fingers: [-1, 0, 1, 2, 3, 0],
    baseFret: 1,
  },
  "A#sus4": {
    name: "A#sus4",
    frets: [-1, 1, 3, 3, 4, 1],
    fingers: [-1, 1, 2, 3, 4, 1],
    baseFret: 1,
    barre: {
      fret: 1,
      fromString: 1,
      toString: 5,
    },
  },
  Bbsus4: {
    name: "Bbsus4",
    frets: [-1, 1, 3, 3, 4, 1],
    fingers: [-1, 1, 2, 3, 4, 1],
    baseFret: 1,
    barre: {
      fret: 1,
      fromString: 1,
      toString: 5,
    },
  },
  Bsus4: {
    name: "Bsus4",
    frets: [-1, 2, 4, 4, 5, 2],
    fingers: [-1, 1, 2, 3, 4, 1],
    baseFret: 2,
    barre: {
      fret: 2,
      fromString: 1,
      toString: 5,
    },
  },

  // ============================================
  // ADD9 CHORDS
  // ============================================
  Cadd9: {
    name: "Cadd9",
    frets: [-1, 3, 2, 0, 3, 0],
    fingers: [-1, 2, 1, 0, 3, 0],
    baseFret: 1,
  },
  "C#add9": {
    name: "C#add9",
    frets: [-1, 4, 3, 1, 4, 1],
    fingers: [-1, 3, 2, 1, 4, 1],
    baseFret: 1,
    barre: {
      fret: 1,
      fromString: 3,
      toString: 5,
    },
  },
  Dbadd9: {
    name: "Dbadd9",
    frets: [-1, 4, 3, 1, 4, 1],
    fingers: [-1, 3, 2, 1, 4, 1],
    baseFret: 1,
    barre: {
      fret: 1,
      fromString: 3,
      toString: 5,
    },
  },
  Dadd9: {
    name: "Dadd9",
    frets: [-1, -1, 0, 2, 3, 0],
    fingers: [-1, -1, 0, 1, 2, 0],
    baseFret: 1,
  },
  "D#add9": {
    name: "D#add9",
    frets: [-1, 6, 5, 3, 6, 3],
    fingers: [-1, 3, 2, 1, 4, 1],
    baseFret: 3,
    barre: {
      fret: 3,
      fromString: 3,
      toString: 5,
    },
  },
  Ebadd9: {
    name: "Ebadd9",
    frets: [-1, 6, 5, 3, 6, 3],
    fingers: [-1, 3, 2, 1, 4, 1],
    baseFret: 3,
    barre: {
      fret: 3,
      fromString: 3,
      toString: 5,
    },
  },
  Eadd9: {
    name: "Eadd9",
    frets: [0, 2, 2, 1, 0, 2],
    fingers: [0, 2, 3, 1, 0, 4],
    baseFret: 1,
  },
  Fadd9: {
    name: "Fadd9",
    frets: [1, 0, 3, 2, 1, 1],
    fingers: [1, 0, 4, 3, 1, 2],
    baseFret: 1,
  },
  "F#add9": {
    name: "F#add9",
    frets: [2, 4, 4, 3, 2, 4],
    fingers: [1, 2, 3, 2, 1, 4],
    baseFret: 2,
    barre: {
      fret: 2,
      fromString: 0,
      toString: 4,
    },
  },
  Gbadd9: {
    name: "Gbadd9",
    frets: [2, 4, 4, 3, 2, 4],
    fingers: [1, 2, 3, 2, 1, 4],
    baseFret: 2,
    barre: {
      fret: 2,
      fromString: 0,
      toString: 4,
    },
  },
  Gadd9: {
    name: "Gadd9",
    frets: [3, 0, 0, 0, 0, 3],
    fingers: [2, 0, 0, 0, 0, 3],
    baseFret: 1,
  },
  "G#add9": {
    name: "G#add9",
    frets: [4, 6, 6, 5, 4, 6],
    fingers: [1, 2, 3, 2, 1, 4],
    baseFret: 4,
    barre: {
      fret: 4,
      fromString: 0,
      toString: 4,
    },
  },
  Abadd9: {
    name: "Abadd9",
    frets: [4, 6, 6, 5, 4, 6],
    fingers: [1, 2, 3, 2, 1, 4],
    baseFret: 4,
    barre: {
      fret: 4,
      fromString: 0,
      toString: 4,
    },
  },
  Aadd9: {
    name: "Aadd9",
    frets: [-1, 0, 2, 2, 0, 0],
    fingers: [-1, 0, 1, 2, 0, 0],
    baseFret: 1,
  },
  "A#add9": {
    name: "A#add9",
    frets: [-1, 1, 0, 3, 1, 1],
    fingers: [-1, 1, 0, 4, 2, 3],
    baseFret: 1,
  },
  Bbadd9: {
    name: "Bbadd9",
    frets: [-1, 1, 0, 3, 1, 1],
    fingers: [-1, 1, 0, 4, 2, 3],
    baseFret: 1,
  },
  Badd9: {
    name: "Badd9",
    frets: [-1, 2, 4, 4, 2, 4],
    fingers: [-1, 1, 2, 3, 1, 4],
    baseFret: 2,
    barre: {
      fret: 2,
      fromString: 1,
      toString: 4,
    },
  },

  // ============================================
  // DIMINISHED CHORDS
  // ============================================
  Cdim: {
    name: "Cdim",
    frets: [-1, 3, 4, 2, 4, 2],
    fingers: [-1, 2, 3, 1, 4, 1],
    baseFret: 2,
  },
  "C#dim": {
    name: "C#dim",
    frets: [-1, 4, 5, 3, 5, 3],
    fingers: [-1, 2, 3, 1, 4, 1],
    baseFret: 3,
  },
  Dbdim: {
    name: "Dbdim",
    frets: [-1, 4, 5, 3, 5, 3],
    fingers: [-1, 2, 3, 1, 4, 1],
    baseFret: 3,
  },
  Ddim: {
    name: "Ddim",
    frets: [-1, -1, 0, 1, 3, 1],
    fingers: [-1, -1, 0, 1, 3, 2],
    baseFret: 1,
  },
  "D#dim": {
    name: "D#dim",
    frets: [-1, 6, 7, 5, 7, 5],
    fingers: [-1, 2, 3, 1, 4, 1],
    baseFret: 5,
  },
  Ebdim: {
    name: "Ebdim",
    frets: [-1, 6, 7, 5, 7, 5],
    fingers: [-1, 2, 3, 1, 4, 1],
    baseFret: 5,
  },
  Edim: {
    name: "Edim",
    frets: [0, 1, 2, 0, 2, 0],
    fingers: [0, 1, 2, 0, 3, 0],
    baseFret: 1,
  },
  Fdim: {
    name: "Fdim",
    frets: [1, 2, 3, 1, 3, 1],
    fingers: [1, 2, 3, 1, 4, 1],
    baseFret: 1,
    barre: {
      fret: 1,
      fromString: 0,
      toString: 5,
    },
  },
  "F#dim": {
    name: "F#dim",
    frets: [2, 3, 4, 2, 4, 2],
    fingers: [1, 2, 3, 1, 4, 1],
    baseFret: 2,
    barre: {
      fret: 2,
      fromString: 0,
      toString: 5,
    },
  },
  Gbdim: {
    name: "Gbdim",
    frets: [2, 3, 4, 2, 4, 2],
    fingers: [1, 2, 3, 1, 4, 1],
    baseFret: 2,
    barre: {
      fret: 2,
      fromString: 0,
      toString: 5,
    },
  },
  Gdim: {
    name: "Gdim",
    frets: [3, 4, 5, 3, 5, 3],
    fingers: [1, 2, 3, 1, 4, 1],
    baseFret: 3,
    barre: {
      fret: 3,
      fromString: 0,
      toString: 5,
    },
  },
  "G#dim": {
    name: "G#dim",
    frets: [4, 5, 6, 4, 6, 4],
    fingers: [1, 2, 3, 1, 4, 1],
    baseFret: 4,
    barre: {
      fret: 4,
      fromString: 0,
      toString: 5,
    },
  },
  Abdim: {
    name: "Abdim",
    frets: [4, 5, 6, 4, 6, 4],
    fingers: [1, 2, 3, 1, 4, 1],
    baseFret: 4,
    barre: {
      fret: 4,
      fromString: 0,
      toString: 5,
    },
  },
  Adim: {
    name: "Adim",
    frets: [-1, 0, 1, 2, 1, -1],
    fingers: [-1, 0, 1, 3, 2, -1],
    baseFret: 1,
  },
  "A#dim": {
    name: "A#dim",
    frets: [-1, 1, 2, 3, 2, -1],
    fingers: [-1, 1, 2, 4, 3, -1],
    baseFret: 1,
  },
  Bbdim: {
    name: "Bbdim",
    frets: [-1, 1, 2, 3, 2, -1],
    fingers: [-1, 1, 2, 4, 3, -1],
    baseFret: 1,
  },
  Bdim: {
    name: "Bdim",
    frets: [-1, 2, 3, 4, 3, -1],
    fingers: [-1, 1, 2, 4, 3, -1],
    baseFret: 2,
  },

  // ============================================
  // AUGMENTED CHORDS
  // ============================================
  Caug: {
    name: "Caug",
    frets: [-1, 3, 2, 1, 1, 0],
    fingers: [-1, 4, 3, 1, 2, 0],
    baseFret: 1,
  },
  "C#aug": {
    name: "C#aug",
    frets: [-1, 4, 3, 2, 2, 1],
    fingers: [-1, 4, 3, 1, 2, 1],
    baseFret: 1,
    barre: {
      fret: 1,
      fromString: 3,
      toString: 5,
    },
  },
  Dbaug: {
    name: "Dbaug",
    frets: [-1, 4, 3, 2, 2, 1],
    fingers: [-1, 4, 3, 1, 2, 1],
    baseFret: 1,
    barre: {
      fret: 1,
      fromString: 3,
      toString: 5,
    },
  },
  Daug: {
    name: "Daug",
    frets: [-1, -1, 0, 3, 3, 2],
    fingers: [-1, -1, 0, 2, 3, 1],
    baseFret: 1,
  },
  "D#aug": {
    name: "D#aug",
    frets: [-1, -1, 1, 4, 4, 3],
    fingers: [-1, -1, 1, 3, 4, 2],
    baseFret: 1,
  },
  Ebaug: {
    name: "Ebaug",
    frets: [-1, -1, 1, 4, 4, 3],
    fingers: [-1, -1, 1, 3, 4, 2],
    baseFret: 1,
  },
  Eaug: {
    name: "Eaug",
    frets: [0, 3, 2, 1, 1, 0],
    fingers: [0, 4, 3, 1, 2, 0],
    baseFret: 1,
  },
  Faug: {
    name: "Faug",
    frets: [1, 4, 3, 2, 2, 1],
    fingers: [1, 4, 3, 2, 2, 1],
    baseFret: 1,
    barre: {
      fret: 1,
      fromString: 0,
      toString: 5,
    },
  },
  "F#aug": {
    name: "F#aug",
    frets: [2, 5, 4, 3, 3, 2],
    fingers: [1, 4, 3, 2, 2, 1],
    baseFret: 2,
    barre: {
      fret: 2,
      fromString: 0,
      toString: 5,
    },
  },
  Gbaug: {
    name: "Gbaug",
    frets: [2, 5, 4, 3, 3, 2],
    fingers: [1, 4, 3, 2, 2, 1],
    baseFret: 2,
    barre: {
      fret: 2,
      fromString: 0,
      toString: 5,
    },
  },
  Gaug: {
    name: "Gaug",
    frets: [3, 2, 1, 0, 0, 3],
    fingers: [3, 2, 1, 0, 0, 4],
    baseFret: 1,
  },
  "G#aug": {
    name: "G#aug",
    frets: [4, 7, 6, 5, 5, 4],
    fingers: [1, 4, 3, 2, 2, 1],
    baseFret: 4,
    barre: {
      fret: 4,
      fromString: 0,
      toString: 5,
    },
  },
  Abaug: {
    name: "Abaug",
    frets: [4, 7, 6, 5, 5, 4],
    fingers: [1, 4, 3, 2, 2, 1],
    baseFret: 4,
    barre: {
      fret: 4,
      fromString: 0,
      toString: 5,
    },
  },
  Aaug: {
    name: "Aaug",
    frets: [-1, 0, 3, 2, 2, 1],
    fingers: [-1, 0, 4, 2, 3, 1],
    baseFret: 1,
  },
  "A#aug": {
    name: "A#aug",
    frets: [-1, 1, 4, 3, 3, 2],
    fingers: [-1, 1, 4, 2, 3, 1],
    baseFret: 1,
  },
  Bbaug: {
    name: "Bbaug",
    frets: [-1, 1, 4, 3, 3, 2],
    fingers: [-1, 1, 4, 2, 3, 1],
    baseFret: 1,
  },
  Baug: {
    name: "Baug",
    frets: [-1, 2, 5, 4, 4, 3],
    fingers: [-1, 1, 4, 2, 3, 1],
    baseFret: 2,
  },

  // ============================================
  // DIMINISHED 7TH CHORDS
  // ============================================
  Cdim7: {
    name: "Cdim7",
    frets: [-1, 3, 4, 2, 4, 2],
    fingers: [-1, 2, 3, 1, 4, 1],
    baseFret: 2,
  },
  "C#dim7": {
    name: "C#dim7",
    frets: [-1, 4, 5, 3, 5, 3],
    fingers: [-1, 2, 3, 1, 4, 1],
    baseFret: 3,
  },
  Dbdim7: {
    name: "Dbdim7",
    frets: [-1, 4, 5, 3, 5, 3],
    fingers: [-1, 2, 3, 1, 4, 1],
    baseFret: 3,
  },
  Ddim7: {
    name: "Ddim7",
    frets: [-1, -1, 0, 1, 0, 1],
    fingers: [-1, -1, 0, 1, 0, 2],
    baseFret: 1,
  },
  "D#dim7": {
    name: "D#dim7",
    frets: [-1, -1, 1, 2, 1, 2],
    fingers: [-1, -1, 1, 3, 2, 4],
    baseFret: 1,
  },
  Ebdim7: {
    name: "Ebdim7",
    frets: [-1, -1, 1, 2, 1, 2],
    fingers: [-1, -1, 1, 3, 2, 4],
    baseFret: 1,
  },
  Edim7: {
    name: "Edim7",
    frets: [0, 1, 2, 0, 2, 0],
    fingers: [0, 1, 2, 0, 3, 0],
    baseFret: 1,
  },
  Fdim7: {
    name: "Fdim7",
    frets: [1, 2, 3, 1, 3, 1],
    fingers: [1, 2, 3, 1, 4, 1],
    baseFret: 1,
    barre: {
      fret: 1,
      fromString: 0,
      toString: 5,
    },
  },
  "F#dim7": {
    name: "F#dim7",
    frets: [2, 3, 4, 2, 4, 2],
    fingers: [1, 2, 3, 1, 4, 1],
    baseFret: 2,
    barre: {
      fret: 2,
      fromString: 0,
      toString: 5,
    },
  },
  Gbdim7: {
    name: "Gbdim7",
    frets: [2, 3, 4, 2, 4, 2],
    fingers: [1, 2, 3, 1, 4, 1],
    baseFret: 2,
    barre: {
      fret: 2,
      fromString: 0,
      toString: 5,
    },
  },
  Gdim7: {
    name: "Gdim7",
    frets: [3, 4, 5, 3, 5, 3],
    fingers: [1, 2, 3, 1, 4, 1],
    baseFret: 3,
    barre: {
      fret: 3,
      fromString: 0,
      toString: 5,
    },
  },
  "G#dim7": {
    name: "G#dim7",
    frets: [4, 5, 6, 4, 6, 4],
    fingers: [1, 2, 3, 1, 4, 1],
    baseFret: 4,
    barre: {
      fret: 4,
      fromString: 0,
      toString: 5,
    },
  },
  Abdim7: {
    name: "Abdim7",
    frets: [4, 5, 6, 4, 6, 4],
    fingers: [1, 2, 3, 1, 4, 1],
    baseFret: 4,
    barre: {
      fret: 4,
      fromString: 0,
      toString: 5,
    },
  },
  Adim7: {
    name: "Adim7",
    frets: [-1, 0, 1, 2, 1, 2],
    fingers: [-1, 0, 1, 3, 2, 4],
    baseFret: 1,
  },
  "A#dim7": {
    name: "A#dim7",
    frets: [-1, 1, 2, 0, 2, 0],
    fingers: [-1, 1, 2, 0, 3, 0],
    baseFret: 1,
  },
  Bbdim7: {
    name: "Bbdim7",
    frets: [-1, 1, 2, 0, 2, 0],
    fingers: [-1, 1, 2, 0, 3, 0],
    baseFret: 1,
  },
  Bdim7: {
    name: "Bdim7",
    frets: [-1, 2, 3, 1, 3, 1],
    fingers: [-1, 2, 3, 1, 4, 1],
    baseFret: 1,
    barre: {
      fret: 1,
      fromString: 3,
      toString: 5,
    },
  },

  // ============================================
  // 6TH CHORDS
  // ============================================
  C6: {
    name: "C6",
    frets: [-1, 3, 2, 2, 1, 0],
    fingers: [-1, 4, 2, 3, 1, 0],
    baseFret: 1,
  },
  "C#6": {
    name: "C#6",
    frets: [-1, 4, 6, 6, 6, 6],
    fingers: [-1, 1, 3, 3, 3, 3],
    baseFret: 4,
    barre: {
      fret: 6,
      fromString: 2,
      toString: 5,
    },
  },
  Db6: {
    name: "Db6",
    frets: [-1, 4, 6, 6, 6, 6],
    fingers: [-1, 1, 3, 3, 3, 3],
    baseFret: 4,
    barre: {
      fret: 6,
      fromString: 2,
      toString: 5,
    },
  },
  D6: {
    name: "D6",
    frets: [-1, -1, 0, 2, 0, 2],
    fingers: [-1, -1, 0, 1, 0, 2],
    baseFret: 1,
  },
  "D#6": {
    name: "D#6",
    frets: [-1, 6, 8, 8, 8, 8],
    fingers: [-1, 1, 3, 3, 3, 3],
    baseFret: 6,
    barre: {
      fret: 8,
      fromString: 2,
      toString: 5,
    },
  },
  Eb6: {
    name: "Eb6",
    frets: [-1, 6, 8, 8, 8, 8],
    fingers: [-1, 1, 3, 3, 3, 3],
    baseFret: 6,
    barre: {
      fret: 8,
      fromString: 2,
      toString: 5,
    },
  },
  E6: {
    name: "E6",
    frets: [0, 2, 2, 1, 2, 0],
    fingers: [0, 2, 3, 1, 4, 0],
    baseFret: 1,
  },
  F6: {
    name: "F6",
    frets: [1, 3, 3, 2, 3, 1],
    fingers: [1, 2, 3, 1, 4, 1],
    baseFret: 1,
    barre: {
      fret: 1,
      fromString: 0,
      toString: 5,
    },
  },
  "F#6": {
    name: "F#6",
    frets: [2, 4, 4, 3, 4, 2],
    fingers: [1, 2, 3, 1, 4, 1],
    baseFret: 2,
    barre: {
      fret: 2,
      fromString: 0,
      toString: 5,
    },
  },
  Gb6: {
    name: "Gb6",
    frets: [2, 4, 4, 3, 4, 2],
    fingers: [1, 2, 3, 1, 4, 1],
    baseFret: 2,
    barre: {
      fret: 2,
      fromString: 0,
      toString: 5,
    },
  },
  G6: {
    name: "G6",
    frets: [3, 2, 0, 0, 0, 0],
    fingers: [2, 1, 0, 0, 0, 0],
    baseFret: 1,
  },
  "G#6": {
    name: "G#6",
    frets: [4, 6, 6, 5, 6, 4],
    fingers: [1, 2, 3, 1, 4, 1],
    baseFret: 4,
    barre: {
      fret: 4,
      fromString: 0,
      toString: 5,
    },
  },
  Ab6: {
    name: "Ab6",
    frets: [4, 6, 6, 5, 6, 4],
    fingers: [1, 2, 3, 1, 4, 1],
    baseFret: 4,
    barre: {
      fret: 4,
      fromString: 0,
      toString: 5,
    },
  },
  A6: {
    name: "A6",
    frets: [-1, 0, 2, 2, 2, 2],
    fingers: [-1, 0, 1, 1, 1, 1],
    baseFret: 1,
    barre: {
      fret: 2,
      fromString: 2,
      toString: 5,
    },
  },
  "A#6": {
    name: "A#6",
    frets: [-1, 1, 3, 3, 3, 3],
    fingers: [-1, 1, 3, 3, 3, 3],
    baseFret: 1,
    barre: {
      fret: 3,
      fromString: 2,
      toString: 5,
    },
  },
  Bb6: {
    name: "Bb6",
    frets: [-1, 1, 3, 3, 3, 3],
    fingers: [-1, 1, 3, 3, 3, 3],
    baseFret: 1,
    barre: {
      fret: 3,
      fromString: 2,
      toString: 5,
    },
  },
  B6: {
    name: "B6",
    frets: [-1, 2, 4, 4, 4, 4],
    fingers: [-1, 1, 3, 3, 3, 3],
    baseFret: 2,
    barre: {
      fret: 4,
      fromString: 2,
      toString: 5,
    },
  },

  // ============================================
  // MINOR 6TH CHORDS
  // ============================================
  Cm6: {
    name: "Cm6",
    frets: [-1, 3, 1, 2, 1, 3],
    fingers: [-1, 3, 1, 2, 1, 4],
    baseFret: 1,
    barre: {
      fret: 1,
      fromString: 2,
      toString: 4,
    },
  },
  "C#m6": {
    name: "C#m6",
    frets: [-1, 4, 2, 3, 2, 4],
    fingers: [-1, 3, 1, 2, 1, 4],
    baseFret: 2,
    barre: {
      fret: 2,
      fromString: 2,
      toString: 4,
    },
  },
  Dbm6: {
    name: "Dbm6",
    frets: [-1, 4, 2, 3, 2, 4],
    fingers: [-1, 3, 1, 2, 1, 4],
    baseFret: 2,
    barre: {
      fret: 2,
      fromString: 2,
      toString: 4,
    },
  },
  Dm6: {
    name: "Dm6",
    frets: [-1, -1, 0, 2, 0, 1],
    fingers: [-1, -1, 0, 2, 0, 1],
    baseFret: 1,
  },
  "D#m6": {
    name: "D#m6",
    frets: [-1, 6, 4, 5, 4, 6],
    fingers: [-1, 3, 1, 2, 1, 4],
    baseFret: 4,
    barre: {
      fret: 4,
      fromString: 2,
      toString: 4,
    },
  },
  Ebm6: {
    name: "Ebm6",
    frets: [-1, 6, 4, 5, 4, 6],
    fingers: [-1, 3, 1, 2, 1, 4],
    baseFret: 4,
    barre: {
      fret: 4,
      fromString: 2,
      toString: 4,
    },
  },
  Em6: {
    name: "Em6",
    frets: [0, 2, 2, 0, 2, 0],
    fingers: [0, 1, 2, 0, 3, 0],
    baseFret: 1,
  },
  Fm6: {
    name: "Fm6",
    frets: [1, 3, 3, 1, 3, 1],
    fingers: [1, 2, 3, 1, 4, 1],
    baseFret: 1,
    barre: {
      fret: 1,
      fromString: 0,
      toString: 5,
    },
  },
  "F#m6": {
    name: "F#m6",
    frets: [2, 4, 4, 2, 4, 2],
    fingers: [1, 2, 3, 1, 4, 1],
    baseFret: 2,
    barre: {
      fret: 2,
      fromString: 0,
      toString: 5,
    },
  },
  Gbm6: {
    name: "Gbm6",
    frets: [2, 4, 4, 2, 4, 2],
    fingers: [1, 2, 3, 1, 4, 1],
    baseFret: 2,
    barre: {
      fret: 2,
      fromString: 0,
      toString: 5,
    },
  },
  Gm6: {
    name: "Gm6",
    frets: [3, 5, 5, 3, 5, 3],
    fingers: [1, 2, 3, 1, 4, 1],
    baseFret: 3,
    barre: {
      fret: 3,
      fromString: 0,
      toString: 5,
    },
  },
  "G#m6": {
    name: "G#m6",
    frets: [4, 6, 6, 4, 6, 4],
    fingers: [1, 2, 3, 1, 4, 1],
    baseFret: 4,
    barre: {
      fret: 4,
      fromString: 0,
      toString: 5,
    },
  },
  Abm6: {
    name: "Abm6",
    frets: [4, 6, 6, 4, 6, 4],
    fingers: [1, 2, 3, 1, 4, 1],
    baseFret: 4,
    barre: {
      fret: 4,
      fromString: 0,
      toString: 5,
    },
  },
  Am6: {
    name: "Am6",
    frets: [-1, 0, 2, 2, 1, 2],
    fingers: [-1, 0, 2, 3, 1, 4],
    baseFret: 1,
  },
  "A#m6": {
    name: "A#m6",
    frets: [-1, 1, 3, 3, 2, 3],
    fingers: [-1, 1, 2, 3, 1, 4],
    baseFret: 1,
    barre: {
      fret: 1,
      fromString: 1,
      toString: 4,
    },
  },
  Bbm6: {
    name: "Bbm6",
    frets: [-1, 1, 3, 3, 2, 3],
    fingers: [-1, 1, 2, 3, 1, 4],
    baseFret: 1,
    barre: {
      fret: 1,
      fromString: 1,
      toString: 4,
    },
  },
  Bm6: {
    name: "Bm6",
    frets: [-1, 2, 4, 4, 3, 4],
    fingers: [-1, 1, 2, 3, 1, 4],
    baseFret: 2,
    barre: {
      fret: 2,
      fromString: 1,
      toString: 4,
    },
  },

  // ============================================
  // 9TH CHORDS
  // ============================================
  C9: {
    name: "C9",
    frets: [-1, 3, 2, 3, 3, 3],
    fingers: [-1, 2, 1, 3, 3, 3],
    baseFret: 1,
    barre: {
      fret: 3,
      fromString: 3,
      toString: 5,
    },
  },
  "C#9": {
    name: "C#9",
    frets: [-1, 4, 3, 4, 4, 4],
    fingers: [-1, 2, 1, 3, 3, 3],
    baseFret: 3,
    barre: {
      fret: 4,
      fromString: 3,
      toString: 5,
    },
  },
  Db9: {
    name: "Db9",
    frets: [-1, 4, 3, 4, 4, 4],
    fingers: [-1, 2, 1, 3, 3, 3],
    baseFret: 3,
    barre: {
      fret: 4,
      fromString: 3,
      toString: 5,
    },
  },
  D9: {
    name: "D9",
    frets: [-1, -1, 0, 2, 1, 0],
    fingers: [-1, -1, 0, 2, 1, 0],
    baseFret: 1,
  },
  "D#9": {
    name: "D#9",
    frets: [-1, 6, 5, 6, 6, 6],
    fingers: [-1, 2, 1, 3, 3, 3],
    baseFret: 5,
    barre: {
      fret: 6,
      fromString: 3,
      toString: 5,
    },
  },
  Eb9: {
    name: "Eb9",
    frets: [-1, 6, 5, 6, 6, 6],
    fingers: [-1, 2, 1, 3, 3, 3],
    baseFret: 5,
    barre: {
      fret: 6,
      fromString: 3,
      toString: 5,
    },
  },
  E9: {
    name: "E9",
    frets: [0, 2, 0, 1, 0, 2],
    fingers: [0, 2, 0, 1, 0, 3],
    baseFret: 1,
  },
  F9: {
    name: "F9",
    frets: [1, 3, 1, 2, 1, 3],
    fingers: [1, 3, 1, 2, 1, 4],
    baseFret: 1,
    barre: {
      fret: 1,
      fromString: 0,
      toString: 4,
    },
  },
  "F#9": {
    name: "F#9",
    frets: [2, 4, 2, 3, 2, 4],
    fingers: [1, 3, 1, 2, 1, 4],
    baseFret: 2,
    barre: {
      fret: 2,
      fromString: 0,
      toString: 4,
    },
  },
  Gb9: {
    name: "Gb9",
    frets: [2, 4, 2, 3, 2, 4],
    fingers: [1, 3, 1, 2, 1, 4],
    baseFret: 2,
    barre: {
      fret: 2,
      fromString: 0,
      toString: 4,
    },
  },
  G9: {
    name: "G9",
    frets: [3, 2, 0, 2, 0, 1],
    fingers: [3, 2, 0, 4, 0, 1],
    baseFret: 1,
  },
  "G#9": {
    name: "G#9",
    frets: [4, 6, 4, 5, 4, 6],
    fingers: [1, 3, 1, 2, 1, 4],
    baseFret: 4,
    barre: {
      fret: 4,
      fromString: 0,
      toString: 4,
    },
  },
  Ab9: {
    name: "Ab9",
    frets: [4, 6, 4, 5, 4, 6],
    fingers: [1, 3, 1, 2, 1, 4],
    baseFret: 4,
    barre: {
      fret: 4,
      fromString: 0,
      toString: 4,
    },
  },
  A9: {
    name: "A9",
    frets: [-1, 0, 2, 0, 2, 0],
    fingers: [-1, 0, 1, 0, 2, 0],
    baseFret: 1,
  },
  "A#9": {
    name: "A#9",
    frets: [-1, 1, 0, 1, 1, 1],
    fingers: [-1, 1, 0, 2, 3, 4],
    baseFret: 1,
  },
  Bb9: {
    name: "Bb9",
    frets: [-1, 1, 0, 1, 1, 1],
    fingers: [-1, 1, 0, 2, 3, 4],
    baseFret: 1,
  },
  B9: {
    name: "B9",
    frets: [-1, 2, 1, 2, 2, 2],
    fingers: [-1, 2, 1, 3, 3, 3],
    baseFret: 1,
    barre: {
      fret: 2,
      fromString: 3,
      toString: 5,
    },
  },

  // ============================================
  // POWER CHORDS (5th)
  // ============================================
  C5: {
    name: "C5",
    frets: [-1, 3, 5, 5, -1, -1],
    fingers: [-1, 1, 3, 4, -1, -1],
    baseFret: 3,
  },
  "C#5": {
    name: "C#5",
    frets: [-1, 4, 6, 6, -1, -1],
    fingers: [-1, 1, 3, 4, -1, -1],
    baseFret: 4,
  },
  Db5: {
    name: "Db5",
    frets: [-1, 4, 6, 6, -1, -1],
    fingers: [-1, 1, 3, 4, -1, -1],
    baseFret: 4,
  },
  D5: {
    name: "D5",
    frets: [-1, -1, 0, 2, 3, -1],
    fingers: [-1, -1, 0, 1, 3, -1],
    baseFret: 1,
  },
  "D#5": {
    name: "D#5",
    frets: [-1, 6, 8, 8, -1, -1],
    fingers: [-1, 1, 3, 4, -1, -1],
    baseFret: 6,
  },
  Eb5: {
    name: "Eb5",
    frets: [-1, 6, 8, 8, -1, -1],
    fingers: [-1, 1, 3, 4, -1, -1],
    baseFret: 6,
  },
  E5: {
    name: "E5",
    frets: [0, 2, 2, -1, -1, -1],
    fingers: [0, 1, 2, -1, -1, -1],
    baseFret: 1,
  },
  F5: {
    name: "F5",
    frets: [1, 3, 3, -1, -1, -1],
    fingers: [1, 3, 4, -1, -1, -1],
    baseFret: 1,
  },
  "F#5": {
    name: "F#5",
    frets: [2, 4, 4, -1, -1, -1],
    fingers: [1, 3, 4, -1, -1, -1],
    baseFret: 2,
  },
  Gb5: {
    name: "Gb5",
    frets: [2, 4, 4, -1, -1, -1],
    fingers: [1, 3, 4, -1, -1, -1],
    baseFret: 2,
  },
  G5: {
    name: "G5",
    frets: [3, 5, 5, -1, -1, -1],
    fingers: [1, 3, 4, -1, -1, -1],
    baseFret: 3,
  },
  "G#5": {
    name: "G#5",
    frets: [4, 6, 6, -1, -1, -1],
    fingers: [1, 3, 4, -1, -1, -1],
    baseFret: 4,
  },
  Ab5: {
    name: "Ab5",
    frets: [4, 6, 6, -1, -1, -1],
    fingers: [1, 3, 4, -1, -1, -1],
    baseFret: 4,
  },
  A5: {
    name: "A5",
    frets: [-1, 0, 2, 2, -1, -1],
    fingers: [-1, 0, 1, 2, -1, -1],
    baseFret: 1,
  },
  "A#5": {
    name: "A#5",
    frets: [-1, 1, 3, 3, -1, -1],
    fingers: [-1, 1, 3, 4, -1, -1],
    baseFret: 1,
  },
  Bb5: {
    name: "Bb5",
    frets: [-1, 1, 3, 3, -1, -1],
    fingers: [-1, 1, 3, 4, -1, -1],
    baseFret: 1,
  },
  B5: {
    name: "B5",
    frets: [-1, 2, 4, 4, -1, -1],
    fingers: [-1, 1, 3, 4, -1, -1],
    baseFret: 2,
  },

  // ============================================
  // SLASH CHORDS (chord with alternate bass)
  // ============================================
  "F/A": {
    name: "F/A",
    frets: [-1, 0, 3, 2, 1, 1],
    fingers: [-1, 0, 4, 3, 1, 2],
    baseFret: 1,
  },
  "C/G": {
    name: "C/G",
    frets: [3, 3, 2, 0, 1, 0],
    fingers: [3, 4, 2, 0, 1, 0],
    baseFret: 1,
  },
  "C/E": {
    name: "C/E",
    frets: [0, 3, 2, 0, 1, 0],
    fingers: [0, 3, 2, 0, 1, 0],
    baseFret: 1,
  },
  "D/F#": {
    name: "D/F#",
    frets: [2, 0, 0, 2, 3, 2],
    fingers: [1, 0, 0, 2, 4, 3],
    baseFret: 1,
  },
  "G/B": {
    name: "G/B",
    frets: [-1, 2, 0, 0, 0, 3],
    fingers: [-1, 1, 0, 0, 0, 2],
    baseFret: 1,
  },
  "G/D": {
    name: "G/D",
    frets: [-1, -1, 0, 0, 0, 3],
    fingers: [-1, -1, 0, 0, 0, 1],
    baseFret: 1,
  },
  "Am/G": {
    name: "Am/G",
    frets: [3, 0, 2, 2, 1, 0],
    fingers: [3, 0, 2, 3, 1, 0],
    baseFret: 1,
  },
  "Am/E": {
    name: "Am/E",
    frets: [0, 0, 2, 2, 1, 0],
    fingers: [0, 0, 2, 3, 1, 0],
    baseFret: 1,
  },
  "Em/D": {
    name: "Em/D",
    frets: [-1, -1, 0, 0, 0, 0],
    fingers: [-1, -1, 0, 0, 0, 0],
    baseFret: 1,
  },
  "A/E": {
    name: "A/E",
    frets: [0, 0, 2, 2, 2, 0],
    fingers: [0, 0, 1, 2, 3, 0],
    baseFret: 1,
  },
  "A/C#": {
    name: "A/C#",
    frets: [-1, 4, 2, 2, 2, 0],
    fingers: [-1, 4, 1, 2, 3, 0],
    baseFret: 1,
  },
  "E/G#": {
    name: "E/G#",
    frets: [4, 2, 2, 1, 0, 0],
    fingers: [4, 2, 3, 1, 0, 0],
    baseFret: 1,
  },
  "B/D#": {
    name: "B/D#",
    frets: [-1, 6, 4, 4, 4, -1],
    fingers: [-1, 3, 1, 1, 1, -1],
    baseFret: 4,
    barre: {
      fret: 4,
      fromString: 2,
      toString: 4,
    },
  },
  "Dm/F": {
    name: "Dm/F",
    frets: [1, 0, 0, 2, 3, 1],
    fingers: [1, 0, 0, 2, 4, 1],
    baseFret: 1,
  },
  "F/C": {
    name: "F/C",
    frets: [-1, 3, 3, 2, 1, 1],
    fingers: [-1, 3, 4, 2, 1, 1],
    baseFret: 1,
    barre: {
      fret: 1,
      fromString: 4,
      toString: 5,
    },
  },

  // ============================================
  // SCANDINAVIAN NOTATION (H = B natural)
  // ============================================
  H: {
    name: "H",
    frets: [-1, 2, 4, 4, 4, 2],
    fingers: [-1, 1, 2, 3, 4, 1],
    baseFret: 2,
    barre: {
      fret: 2,
      fromString: 1,
      toString: 5,
    },
  },
  Hm: {
    name: "Hm",
    frets: [-1, 2, 4, 4, 3, 2],
    fingers: [-1, 1, 3, 4, 2, 1],
    baseFret: 2,
    barre: {
      fret: 2,
      fromString: 1,
      toString: 5,
    },
  },
  H7: {
    name: "H7",
    frets: [-1, 2, 1, 2, 0, 2],
    fingers: [-1, 2, 1, 3, 0, 4],
    baseFret: 1,
  },
  Hm7: {
    name: "Hm7",
    frets: [-1, 2, 4, 2, 3, 2],
    fingers: [-1, 1, 3, 1, 2, 1],
    baseFret: 2,
    barre: {
      fret: 2,
      fromString: 1,
      toString: 5,
    },
  },
  Hmaj7: {
    name: "Hmaj7",
    frets: [-1, 2, 4, 3, 4, 2],
    fingers: [-1, 1, 3, 2, 4, 1],
    baseFret: 2,
    barre: {
      fret: 2,
      fromString: 1,
      toString: 5,
    },
  },
  Hsus4: {
    name: "Hsus4",
    frets: [-1, 2, 4, 4, 5, 2],
    fingers: [-1, 1, 2, 3, 4, 1],
    baseFret: 2,
    barre: {
      fret: 2,
      fromString: 1,
      toString: 5,
    },
  },
  Hdim: {
    name: "Hdim",
    frets: [-1, 2, 3, 4, 3, -1],
    fingers: [-1, 1, 2, 4, 3, -1],
    baseFret: 2,
  },
};

export function getChord(name: string): ChordFingering | null {
  return chordLibrary[name] ?? null;
}

export function getAllChordNames(): string[] {
  return Object.keys(chordLibrary);
}
