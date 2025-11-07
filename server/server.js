// server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const helmet = require("helmet");

const Message = require("./models/Message");
const authRoutes = require("./routes/authRoutes");

// Load environment variables from .env
dotenv.config();

const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet()); // ✅ Secure HTTP headers
app.use(morgan("combined")); // ✅ Request logging

// --- Routes ---
app.use("/api/auth", authRoutes);

// ✅ Health Check Endpoint (for monitoring)
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date(),
  });
});

// --- MongoDB Connection ---
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/socketchat";

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err.message));

// --- Create HTTP server for Socket.io ---
const server = http.createServer(app);

// --- Socket.io Setup ---
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

const io = new Server(server, {
  cors: { origin: CLIENT_URL, methods: ["GET", "POST"] },
  pingInterval: 25000,
  pingTimeout: 60000,
});

// --- Namespace for Chat ---
const chatNamespace = io.of("/chat");

// Track online users
const onlineUsers = new Map();

chatNamespace.on("connection", (socket) => {
  console.log(`🟢 [Chat] ${socket.id} connected`);

  socket.on("joinRoom", async ({ username, room }) => {
    socket.join(room);
    onlineUsers.set(socket.id, { username, room });

    // Load previous messages
    const history = await Message.find({ room }).sort({ createdAt: 1 }).limit(50);
    socket.emit("previousMessages", history);

    // Update room users
    const usersInRoom = Array.from(onlineUsers.values())
      .filter((u) => u.room === room)
      .map((u) => u.username);

    chatNamespace.to(room).emit("updateUsers", usersInRoom);
    console.log(`👤 ${username} joined room: ${room}`);
  });

  socket.on("sendMessage", async ({ username, text, room, time }) => {
    const msg = new Message({ username, text, room, time });
    await msg.save();
    chatNamespace.to(room).emit("receiveMessage", msg);
  });

  socket.on("disconnect", () => {
    const user = onlineUsers.get(socket.id);
    if (user) {
      console.log(`🔴 ${user.username} left room: ${user.room}`);
      onlineUsers.delete(socket.id);

      const usersInRoom = Array.from(onlineUsers.values())
        .filter((u) => u.room === user.room)
        .map((u) => u.username);

      chatNamespace.to(user.room).emit("updateUsers", usersInRoom);
    }
  });
});

// --- Start the server ---
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
