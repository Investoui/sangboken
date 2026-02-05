# Architectural Decisions

## 2026-02-05: ChordPro format for songs

**Decision:** Use ChordPro format for storing songs with chords.

**Why:** 
- Industry standard for chord sheets
- Simple text format: `[G]Lyrics with [D]chords inline`
- Easy to parse and render
- No licensing issues - it's just a notation format

**Alternatives considered:**
- Custom JSON format - more flexible but harder to author
- MusicXML - too complex for our needs
- Plain text with chords above - hard to parse positioning

---

## 2026-02-05: SSE over WebSockets for Room Mode

**Decision:** Use Server-Sent Events (SSE) instead of WebSockets for real-time communication.

**Why:**
- Works on Vercel serverless (WebSockets require persistent connections)
- No extra services needed (no Socket.io server, PartyKit, etc.)
- One-way server→client is sufficient for display updates
- Phone→server uses simple POST requests
- Zero additional cost

**Alternatives considered:**
- WebSockets - requires additional server/service
- Polling - inefficient, poor UX
- PartyKit - additional cost and complexity

---

## 2026-02-05: Adaptive layout based on verse length

**Decision:** Use max lines per verse (not total song lines) to determine layout.

**Why:**
- Short verses (≤5 lines) fit well in columns side-by-side
- Long verses (>5 lines) need vertical scrolling to avoid overlap
- Per-verse measurement gives better results than total song length

**Alternatives considered:**
- Total lines per song - caused long songs with short verses to scroll unnecessarily
- Character count - more complex, less intuitive
- Manual override per song - extra maintenance
