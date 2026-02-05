import { NextRequest, NextResponse } from "next/server";
import { getRoom, updateRoom } from "@/lib/room-store";
import { RoomCommand } from "@/lib/types";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const room = getRoom(code);

  if (!room) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  let command: RoomCommand;
  try {
    command = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!command || typeof command.type !== "string") {
    return NextResponse.json({ error: "Invalid command format" }, { status: 400 });
  }

  switch (command.type) {
    case "setSong":
      updateRoom(code, { currentSong: command.songId, currentSection: 0, scrollPosition: 0 });
      break;

    case "nextSection":
      updateRoom(code, { currentSection: room.currentSection + 1 });
      break;

    case "prevSection":
      updateRoom(code, { currentSection: Math.max(0, room.currentSection - 1) });
      break;

    case "scroll":
      updateRoom(code, { scrollPosition: command.position });
      break;

    case "transpose":
      updateRoom(code, { transpose: command.value });
      break;

    case "setAutoScroll":
      updateRoom(code, {
        autoScroll: command.enabled,
        ...(command.speed !== undefined && { autoScrollSpeed: command.speed }),
      });
      break;

    default:
      return NextResponse.json(
        { error: `Unknown command type: ${(command as { type: string }).type}` },
        { status: 400 }
      );
  }

  const updatedRoom = getRoom(code);
  return NextResponse.json({ success: true, room: updatedRoom });
}
