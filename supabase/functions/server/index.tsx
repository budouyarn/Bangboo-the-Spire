import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-19145fc9/health", (c) => {
  return c.json({ status: "ok" });
});

// Generate a random 6-character room code
function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Create a new room
app.post("/make-server-19145fc9/rooms/create", async (c) => {
  try {
    const body = await c.req.json();
    const { mode, hostName } = body;

    if (!mode || !hostName) {
      return c.json({ error: "Missing required fields: mode, hostName" }, 400);
    }

    // Generate unique room code
    let roomCode = generateRoomCode();
    let attempts = 0;
    while (attempts < 10) {
      const existing = await kv.get(`room:${roomCode}`);
      if (!existing) break;
      roomCode = generateRoomCode();
      attempts++;
    }

    const room = {
      code: roomCode,
      mode,
      hostName,
      hostId: crypto.randomUUID(),
      guestId: null,
      guestName: null,
      status: 'waiting', // waiting, playing, finished
      createdAt: Date.now(),
      gameState: null,
    };

    await kv.set(`room:${roomCode}`, room);

    return c.json({ success: true, room });
  } catch (error) {
    console.error('Error creating room:', error);
    return c.json({ error: 'Failed to create room', details: error.message }, 500);
  }
});

// Join a room
app.post("/make-server-19145fc9/rooms/join", async (c) => {
  try {
    const body = await c.req.json();
    const { roomCode, guestName } = body;

    if (!roomCode || !guestName) {
      return c.json({ error: "Missing required fields: roomCode, guestName" }, 400);
    }

    const room = await kv.get(`room:${roomCode.toUpperCase()}`);
    
    if (!room) {
      return c.json({ error: "Room not found" }, 404);
    }

    if (room.guestId) {
      return c.json({ error: "Room is full" }, 400);
    }

    if (room.status !== 'waiting') {
      return c.json({ error: "Room is not accepting new players" }, 400);
    }

    room.guestId = crypto.randomUUID();
    room.guestName = guestName;
    room.status = 'playing';

    await kv.set(`room:${roomCode.toUpperCase()}`, room);

    return c.json({ success: true, room });
  } catch (error) {
    console.error('Error joining room:', error);
    return c.json({ error: 'Failed to join room', details: error.message }, 500);
  }
});

// Get room details
app.get("/make-server-19145fc9/rooms/:code", async (c) => {
  try {
    const roomCode = c.req.param('code');
    const room = await kv.get(`room:${roomCode.toUpperCase()}`);
    
    if (!room) {
      return c.json({ error: "Room not found" }, 404);
    }

    return c.json({ success: true, room });
  } catch (error) {
    console.error('Error getting room:', error);
    return c.json({ error: 'Failed to get room', details: error.message }, 500);
  }
});

// Update game state
app.post("/make-server-19145fc9/rooms/:code/state", async (c) => {
  try {
    const roomCode = c.req.param('code');
    const body = await c.req.json();
    const { playerId, gameState } = body;

    if (!playerId || !gameState) {
      return c.json({ error: "Missing required fields: playerId, gameState" }, 400);
    }

    const room = await kv.get(`room:${roomCode.toUpperCase()}`);
    
    if (!room) {
      return c.json({ error: "Room not found" }, 404);
    }

    // Verify player is part of this room
    if (playerId !== room.hostId && playerId !== room.guestId) {
      return c.json({ error: "Unauthorized" }, 403);
    }

    room.gameState = gameState;
    room.lastUpdate = Date.now();

    await kv.set(`room:${roomCode.toUpperCase()}`, room);

    return c.json({ success: true });
  } catch (error) {
    console.error('Error updating game state:', error);
    return c.json({ error: 'Failed to update game state', details: error.message }, 500);
  }
});

// Leave room
app.post("/make-server-19145fc9/rooms/:code/leave", async (c) => {
  try {
    const roomCode = c.req.param('code');
    const body = await c.req.json();
    const { playerId } = body;

    if (!playerId) {
      return c.json({ error: "Missing required field: playerId" }, 400);
    }

    const room = await kv.get(`room:${roomCode.toUpperCase()}`);
    
    if (!room) {
      return c.json({ error: "Room not found" }, 404);
    }

    // If host leaves, delete the room
    if (playerId === room.hostId) {
      await kv.del(`room:${roomCode.toUpperCase()}`);
      return c.json({ success: true, roomDeleted: true });
    }

    // If guest leaves, just clear guest data
    if (playerId === room.guestId) {
      room.guestId = null;
      room.guestName = null;
      room.status = 'waiting';
      await kv.set(`room:${roomCode.toUpperCase()}`, room);
      return c.json({ success: true, roomDeleted: false });
    }

    return c.json({ error: "Player not found in room" }, 404);
  } catch (error) {
    console.error('Error leaving room:', error);
    return c.json({ error: 'Failed to leave room', details: error.message }, 500);
  }
});

Deno.serve(app.fetch);