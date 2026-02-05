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
- `src/lib/songs.ts` - All songs defined here
- `src/lib/chord-library.ts` - Chord fingerings
- `src/app/mirror/page.tsx` - Main display (Mirror Mode)

## Adding Songs
1. Add ChordPro string in `songs.ts`
2. Add to `parsedSongs` array
3. Verify chords exist in chord-library.ts
4. Test in Mirror Mode

## Important Notes
- Lyrics must be **accurate** - don't make up words!
- Chord positions matter - verify against source
- Use traditional/public domain songs to avoid copyright issues
