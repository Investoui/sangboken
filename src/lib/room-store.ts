import { RoomState } from "./types";

const ROOM_TTL_MS = 30 * 60 * 1000; // 30 minutes

const rooms = new Map<string, RoomState>();

// SSE subscribers for each room
type RoomSubscriber = (state: RoomState) => void;
const subscribers = new Map<string, Set<RoomSubscriber>>();

export function subscribeToRoom(
  code: string,
  callback: RoomSubscriber
): () => void {
  const upperCode = code.toUpperCase();
  if (!subscribers.has(upperCode)) {
    subscribers.set(upperCode, new Set());
  }
  subscribers.get(upperCode)!.add(callback);

  // Return unsubscribe function
  return () => {
    const subs = subscribers.get(upperCode);
    if (subs) {
      subs.delete(callback);
      if (subs.size === 0) {
        subscribers.delete(upperCode);
      }
    }
  };
}

function notifySubscribers(code: string, state: RoomState): void {
  const subs = subscribers.get(code.toUpperCase());
  if (subs) {
    for (const callback of subs) {
      callback(state);
    }
  }
}

function generateRoomCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function cleanupInactiveRooms(): void {
  const now = Date.now();
  for (const [code, room] of rooms.entries()) {
    if (now - room.lastActivity > ROOM_TTL_MS) {
      rooms.delete(code);
    }
  }
}

export function createRoom(): RoomState {
  cleanupInactiveRooms();

  let code = generateRoomCode();
  while (rooms.has(code)) {
    code = generateRoomCode();
  }

  const now = Date.now();
  const room: RoomState = {
    code,
    currentSong: null,
    currentSection: 0,
    scrollPosition: 0,
    transpose: 0,
    controllers: [],
    autoScroll: false,
    autoScrollSpeed: 1,
    createdAt: now,
    lastActivity: now,
  };

  rooms.set(code, room);
  return room;
}

export function getRoom(code: string): RoomState | undefined {
  cleanupInactiveRooms();
  const room = rooms.get(code.toUpperCase());
  if (room) {
    room.lastActivity = Date.now();
  }
  return room;
}

export function updateRoom(
  code: string,
  updates: Partial<Omit<RoomState, "code" | "createdAt">>
): RoomState | undefined {
  const room = rooms.get(code.toUpperCase());
  if (!room) {
    return undefined;
  }
  Object.assign(room, updates, { lastActivity: Date.now() });
  notifySubscribers(code, room);
  return room;
}

export function deleteRoom(code: string): boolean {
  return rooms.delete(code.toUpperCase());
}
