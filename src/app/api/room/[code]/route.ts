import { NextRequest, NextResponse } from "next/server";
import { getRoom } from "@/lib/room-store";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const room = getRoom(code);

  if (!room) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  return NextResponse.json(room);
}
