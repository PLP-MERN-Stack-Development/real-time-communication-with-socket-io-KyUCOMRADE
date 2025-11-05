const { Server } = require("socket.io");
const Message = require("../models/Message");

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  // Create a dedicated namespace for chat
  const chat = io.of("/chat");
  const onlineUsers = new Set();

  chat.on("connection", async (socket) => {
    console.log("🟢 New user connected:", socket.id);

    // --- Handle user joining ---
    socket.on("userConnected", (username) => {
      socket.username = username;
      onlineUsers.add(username);
      chat.emit("updateUsers", Array.from(onlineUsers));
      console.log(`${username} joined the chat`);
    });

    // --- Handle pagination requests ---
    socket.on("loadMessages", async (page = 1) => {
      try {
        const limit = 20;
        const skip = (page - 1) * limit;

        const messages = await Message.find()
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit);

        // Reverse to show oldest first
        socket.emit("messagesPage", messages.reverse());
      } catch (err) {
        console.error("❌ Error loading messages:", err);
        socket.emit("errorMessage", "Failed to load messages");
      }
    });

    // --- Handle message sending ---
    socket.on("sendMessage", async (data) => {
      try {
        const newMessage = new Message({
          username: data.username,
          text: data.text,
          time: data.time,
        });

        await newMessage.save();

        // Broadcast to all users in the namespace
        chat.emit("receiveMessage", newMessage);
      } catch (err) {
        console.error("❌ Error saving message:", err);
        socket.emit("errorMessage", "Message not delivered");
      }
    });

    // --- Handle user disconnect ---
    socket.on("disconnect", () => {
      if (socket.username) {
        onlineUsers.delete(socket.username);
        chat.emit("updateUsers", Array.from(onlineUsers));
        console.log(`🔴 ${socket.username} disconnected`);
      } else {
        console.log("🔴 A user disconnected:", socket.id);
      }
    });
  });
};

module.exports = { initSocket };
