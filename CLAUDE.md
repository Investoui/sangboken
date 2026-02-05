# Sangboken - Project Instructions

## Overview
Digital songbook app for displaying guitar chords on TV, controlled from phone.
Norwegian-focused, family-friendly (children's songs).

## Tech Stack
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- SSE for real-time (not WebSockets - Vercel compatibility)

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
- `src/app/mirror/page.tsx` - Main display (Mirror Mode)
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
4. Test in Mirror Mode

For tab format songs, use `.tab` extension with same metadata.

## Important Notes
- Lyrics must be **accurate** - don't make up words!
- Chord positions matter - verify against source
- Use traditional/public domain songs to avoid copyright issues
