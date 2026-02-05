import { NextResponse } from "next/server";
import { createRoom } from "@/lib/room-store";

export async function POST() {
  const room = createRoom();
  return NextResponse.json(room, { status: 201 });
}
