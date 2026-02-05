import { NextRequest } from "next/server";
import { getRoom, subscribeToRoom } from "@/lib/room-store";
import { RoomState } from "@/lib/types";

const KEEPALIVE_INTERVAL_MS = 15 * 1000; // 15 seconds

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const room = getRoom(code);

  if (!room) {
    return new Response(JSON.stringify({ error: "Room not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const encoder = new TextEncoder();
  let unsubscribe: (() => void) | null = null;
  let keepaliveInterval: NodeJS.Timeout | null = null;

  const stream = new ReadableStream({
    start(controller) {
      // Helper to send SSE events
      const sendEvent = (eventType: string, data: RoomState | string) => {
        const payload =
          typeof data === "string" ? data : JSON.stringify(data);
        controller.enqueue(
          encoder.encode(`event: ${eventType}\ndata: ${payload}\n\n`)
        );
      };

      // Send initial state
      sendEvent("state", room);

      // Subscribe to room updates
      unsubscribe = subscribeToRoom(code, (updatedState) => {
        sendEvent("update", updatedState);
      });

      // Setup keepalive pings
      keepaliveInterval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: keepalive\n\n`));
        } catch {
          // Stream closed, cleanup will happen in cancel
        }
      }, KEEPALIVE_INTERVAL_MS);
    },
    cancel() {
      // Cleanup on client disconnect
      if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
      }
      if (keepaliveInterval) {
        clearInterval(keepaliveInterval);
        keepaliveInterval = null;
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
