# Sangboken - Din digitale sangbok

A web app for displaying guitar chords on a TV with phone-based remote control.

## Overview

**Problem:** When playing guitar, you want chords displayed large on a TV screen, but you need to control playback (next song, scroll, tempo) without walking to the computer.

**Solution:** A two-screen web app where:
- 📺 **Display View** runs on the TV (cast from laptop, Chromecast, smart TV browser)
- 📱 **Controller View** runs on your phone, connected via WebSocket

No native app needed. No App Store. Just web.

## User Flow

### Two Modes

The app supports two modes to fit different setups:

#### Mode 1: Mirror Mode (Recommended for iPhone + AirPlay)
Best for: iPhone → AirPlay → TV (no extra devices needed)

1. Open app on iPhone in landscape
2. AirPlay mirror to TV
3. Select song → full screen display
4. Tap screen → controls appear (auto-hide after 3s)
5. Enable Do Not Disturb to avoid notifications on TV

**Why this works:** Single screen optimized for mirroring. Phone shows same as TV, but you're looking at the TV anyway. Controls only briefly visible when interacting.

#### Mode 2: Room Mode (Separate Controller)
Best for: TV with browser, or laptop cast to TV

1. Open `guitar-chords.app` on TV/laptop browser
2. Cast tab to TV if using laptop
3. App shows a **room code** (e.g., `ROCK-42`)
4. Open `guitar-chords.app/join` on phone
5. Enter room code → phone becomes remote
6. Phone shows controls, TV shows display only

### Home Screen
User picks their mode:
- **"Mirror Mode"** → Single-screen experience for AirPlay
- **"Room Mode"** → Separate display + controller

## Features

### Phase 1: MVP
- [x] Display view with lyrics + chords positioned at correct syllables
- [x] **Chord diagram panel** — shows fingering with finger numbers (1-4)
- [x] Toggle: show/hide chord diagrams
- [x] Controller view with basic controls (next/prev section, scroll)
- [x] SSE room system with 4-character codes (Room Mode)
- [x] Song import (ChordPro format)
- [x] Basic song library (localStorage)
- [x] Built-in chord library (common chords with fingerings)
- [ ] **Mirror Mode** — Single-screen for AirPlay/screen mirroring:
  - [ ] Landscape-optimized full-screen display
  - [ ] Tap to show controls overlay, auto-hide after 3 seconds
  - [ ] Song picker integrated into overlay
  - [ ] Large touch targets for guitar-in-hand use
  - [ ] Home screen with mode selection (Mirror vs Room)
- [ ] Auto-scroll with adjustable speed
- [ ] Transpose (+/- semitones) — updates chord names + diagrams

### Phase 2: Enhanced
- [ ] Multiple controller support (jam sessions)
- [ ] Setlist creation and ordering
- [ ] Metronome with visual beat indicator on TV
- [ ] Alternative chord voicings (e.g., G standard vs G easy)
- [ ] Dark/light themes
- [ ] QR code for quick phone join
- [ ] Chord diagram placement options (bottom bar / side panel / overlay)

### Phase 3: Polish
- [ ] Cloud sync (optional account)
- [ ] Public song library / sharing
- [ ] Spotify/Apple Music integration (fetch lyrics/chords)
- [ ] PDF chord sheet import
- [ ] Chromecast native receiver (skip the laptop)

## Technical Architecture

```
┌─────────────────┐                            ┌─────────────────┐
│   Phone         │───── POST /api/command ────►│   Next.js       │
│   (Controller)  │                            │   (Vercel)      │
└─────────────────┘                            └────────┬────────┘
                                                        │
                                                        │ SSE stream
                                                        ▼
                                               ┌─────────────────┐
                                               │   TV/Laptop     │
                                               │   (Display)     │
                                               └─────────────────┘
```

### Stack
- **Frontend:** Next.js 15 (App Router), React, Tailwind CSS
- **Real-time:** Server-Sent Events (SSE) — no external services needed
- **Hosting:** Vercel (free tier sufficient for MVP)
- **Storage:** localStorage (MVP), optional Supabase later

### Why SSE over WebSockets
- Works natively on Vercel (serverless-compatible)
- No extra service (PartyKit, Socket.io server, etc.)
- One-way server→client is all we need for display updates
- Phone→server uses simple POST requests
- Zero additional cost

### Key Components

**Display View (`/room/[code]`)**
- Fullscreen chord display, optimized for 1080p
- Large readable fonts, high contrast
- Connects to SSE endpoint `/api/room/[code]/stream`
- Shows room code in corner for joining
- Auto-reconnects if connection drops

**Controller View (`/join` → `/control/[code]`)**
- Mobile-first responsive UI
- Song picker, transport controls
- Gesture support (swipe to scroll)
- Sends commands via POST to `/api/room/[code]/command`

**API Routes**
- `POST /api/room` — Create new room, returns code
- `GET /api/room/[code]/stream` — SSE endpoint for display
- `POST /api/room/[code]/command` — Receive commands from controller
- Room state held in memory (Map) with TTL expiration

## Display Format

Based on traditional chord sheet style (see reference: Norwegian children's song sheet):

```
        G              D         C              G
Ku - a  mi,    jeg tak - ker deg.  Dei - lig melk du gir til meg.
```

### Key Display Elements

1. **Lyrics** — Full text, properly spaced/hyphenated for singing
2. **Chords above lyrics** — Positioned at the exact syllable where the chord changes
3. **Chord diagrams** — Shown in a panel (bottom, side, or overlay)
   - Fretboard grid (6 strings × 4-5 frets)
   - Dot positions for fingers
   - **Finger numbers** (1=index, 2=middle, 3=ring, 4=pinky)
   - Open (○) and muted (×) string indicators
   - Optional: barre notation

### Chord Diagram Example
```
    G
  ×○○○○○
  ┌─┬─┬─┐
  │ │ │ │  
  ├─┼─┼─┤
  │ 1 │ │   ← finger 1 on 2nd fret, A string
  ├─┼─┼─┤
  │ │ 2 3   ← fingers 2,3 on 3rd fret, low E and high E
  └─┴─┴─┘
```

### Display Modes

| Mode | Shows | Use case |
|------|-------|----------|
| **Lyrics + Chords** | Text with chord names above | Know the chords already |
| **Lyrics + Chords + Diagrams** | Above + diagram panel | Learning / unfamiliar chords |
| **Diagrams Only** | Just the chord diagrams in sequence | Quick reference |

### Chord Diagram Panel Options
- **Bottom bar** — Fixed panel showing current + next chord
- **Side panel** — All unique chords in the song
- **On-demand overlay** — Tap chord name to see diagram

## Data Models

### Song
```typescript
interface Song {
  id: string;
  title: string;
  artist?: string;
  arranger?: string;
  sections: Section[];
  bpm?: number;
  key?: string;
  capo?: number;
  timeSignature?: string;  // "4/4", "3/4", etc.
}

interface Section {
  name: string;        // "Verse 1", "Chorus", etc.
  lines: Line[];
}

interface Line {
  lyrics: string;
  chords: ChordPosition[];
}

interface ChordPosition {
  chord: string;       // "Am", "G7", "Cmaj7"
  position: number;    // character index in lyrics
}
```

### Chord Library
```typescript
interface ChordDefinition {
  name: string;           // "G", "Am", "Cmaj7"
  strings: (number | null)[];  // fret per string, null = muted [3,2,0,0,0,3]
  fingers: (number | null)[];  // finger per string [2,1,0,0,0,3]
  barres?: Barre[];
  baseFret?: number;      // for positions up the neck
}

interface Barre {
  fret: number;
  fromString: number;
  toString: number;
  finger: number;
}
```

### Room State
```typescript
interface RoomState {
  code: string;
  displayConnected: boolean;
  controllers: string[];      // socket IDs
  currentSong?: Song;
  currentSection: number;
  scrollPosition: number;
  transpose: number;
  autoScrollSpeed: number;    // 0 = off
  isPlaying: boolean;
}
```

## UI/UX Notes

### Display View (TV / Mirror Mode)
- Pure black background (#000) for OLED
- **Chord names:** 48-64px, accent color (e.g., amber), bold, positioned above exact syllable
- **Lyrics:** 36-48px, white, good letter-spacing for readability
- **Current line highlighted** — subtle background or brighter text
- **Chord diagram panel** (when enabled):
  - Bottom bar showing all unique chords in the song
  - Finger numbers clearly visible (1-4)
  - ~200px height, semi-transparent background
- Room code: small, top-right corner, fades after 10s (Room Mode only)
- No chrome, no distractions

### Mirror Mode Overlay Controls
- **Trigger:** Tap anywhere on screen
- **Auto-hide:** 3 seconds after last interaction
- **Layout:** Semi-transparent overlay from bottom
- **Controls:**
  - Song picker (dropdown or slide-up list)
  - Previous/Next song buttons
  - Transpose +/- buttons
  - Toggle chord diagrams on/off
  - Settings gear (future: auto-scroll, themes)
- **Touch targets:** Minimum 60px height (guitar-in-hand use)
- **Animation:** Smooth slide-in/fade-out transitions

### Controller View (Phone)
- Bottom navigation: Songs | Controls | Settings
- Large tap targets (min 48px)
- Haptic feedback on actions
- Works in portrait (one-handed use while holding guitar)

## Deployment

### MVP Infrastructure
- Vercel for Next.js app (includes API routes + SSE)
- No additional servers or services needed
- No database needed (localStorage only, room state in memory)

### Domain
- Suggest: `chords.new` or `guitar.fm` or similar
- Fallback: subdomain of existing domain

## Success Metrics

1. **Works reliably** — connection stays stable during a full song
2. **Fast setup** — under 30 seconds from "open laptop" to "playing"
3. **Readable** — chords visible from 3 meters away
4. **Responsive** — control input → display update < 100ms

## Open Questions

1. **ChordPro vs custom format?** — ChordPro is standard but verbose. Could support both.
2. **Offline support?** — PWA with service worker for the display? Phone needs connection anyway.
3. **Multiple displays?** — Support multiple TVs showing same content? (Jam session in multiple rooms)

## Non-Goals (for MVP)

- Native mobile app
- User accounts / authentication  
- Chord learning / tutorials
- Audio playback
- **Standard musical notation** (staff, notes, time signatures) — maybe Phase 3+
- Piano/keyboard chord diagrams
- Tablature (TAB) notation

---

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open display view
open http://localhost:3000

# Open controller on phone (same network)
# Use your computer's local IP
```

---

*Ready to rock? 🎸*
