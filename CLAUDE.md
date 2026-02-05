# Sangboken - Project Instructions

## Overview
Digital songbook app with guitar chords. Works on mobile, tablet, and TV (via AirPlay/Chromecast).
Norwegian-focused. Currently has children's songs, expanding to include allsang and viser.

## Tech Stack
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Hosted on Vercel

## Song Format
Songs use **ChordPro format**:
```
[G]Lyrics with [D]chords [Am]inline
```

## Key Files
- `songs/` - Individual song files (.chopro, .tab)
- `src/lib/songs.ts` - Song API (getSong, getAllSongs)
- `src/lib/songs-data.ts` - Auto-generated (gitignored)
- `src/lib/chord-library.ts` - Chord fingerings
- `src/app/sang/[id]/page.tsx` - Song display page
- `scripts/build-songs.ts` - Generates songs-data.ts from songs/

## Adding Songs
1. Create a `.chopro` file in `songs/` directory:
   ```
   {title: Song Title}
   {artist: Artist Name}
   {key: G}

   {verse: Vers 1}
   [G]Lyrics with [D]chords [Am]inline
   ```
2. Run `npm run build:songs` (or just `npm run build`)
3. Verify chords exist in chord-library.ts
4. Test the song in the app

For tab format songs, use `.tab` extension with same metadata.

## Important Notes
- Lyrics must be **accurate** - don't make up words!
- Chord positions matter - verify against source
- Prefer traditional/public domain songs to avoid copyright issues

## Branding
- Slogan: "Den digitale sangboken med gitarakkorder"
- Key selling points: Free, ad-free, works on all devices
- Target: Everyone who wants to sing (families, friends, kindergartens, etc.)
- Cultural reference: Plays on the traditional Norwegian "Sangboken" that many grew up with

## Roadmap
See `ROADMAP.md` for product strategy, monetization plans, and feature roadmap.
