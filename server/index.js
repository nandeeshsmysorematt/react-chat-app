import http from "node:http";
import { randomUUID } from "node:crypto";
import express from "express";
import cors from "cors";
import { Server } from "socket.io";

const PORT = process.env.PORT || 4000;
const CLIENT_ORIGINS = (
  process.env.CLIENT_ORIGIN || "http://localhost:5173,http://127.0.0.1:5173"
).split(",");

const USER_LIST = ["Alan", "Bob", "Carol", "Dean", "Elin"];
const MAX_MESSAGES = 200; // keep the most recent messages in memory
const MAX_TEXT_LENGTH = 500;

const app = express();
app.use(cors({ origin: CLIENT_ORIGINS }));
app.get("/health", (req, res) => res.json({ status: "ok" }));

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: CLIENT_ORIGINS } });

// In-memory chat history (resets when the server restarts).
const messages = [];

const pickRandomUser = () =>
  USER_LIST[Math.floor(Math.random() * USER_LIST.length)];

io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Send the existing conversation to the newly connected client,
  // and tell everyone how many people are online.
  socket.emit("chat:history", messages);
  io.emit("chat:online", io.engine.clientsCount);

  // Publish: a client sends a new chat message.
  socket.on("chat:send", (payload, ack) => {
    const text = typeof payload?.text === "string" ? payload.text.trim() : "";
    if (!text || text.length > MAX_TEXT_LENGTH) {
      ack?.({ ok: false, error: "Message must be 1-500 characters." });
      return;
    }

    const message = {
      id: randomUUID(),
      text,
      user: pickRandomUser(),
      likes: 0,
      createdAt: new Date().toISOString(),
    };

    messages.push(message);
    if (messages.length > MAX_MESSAGES) messages.shift();

    // Subscribe side: every connected client receives the new message.
    io.emit("chat:message", message);
    ack?.({ ok: true });
  });

  // A client likes a message; everyone gets the new count.
  socket.on("chat:like", (payload, ack) => {
    const message = messages.find((m) => m.id === payload?.id);
    if (!message) {
      ack?.({ ok: false, error: "Message not found." });
      return;
    }
    message.likes += 1;
    io.emit("chat:like", { id: message.id, likes: message.likes });
    ack?.({ ok: true });
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
    io.emit("chat:online", io.engine.clientsCount);
  });
});

server.listen(PORT, () => {
  console.log(`Chat server listening on http://localhost:${PORT}`);
});