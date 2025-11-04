const { Server } = require("socket.io");
const Message = require("../models/Message");

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  const onlineUsers = new Set();

  io.on("connection", async (socket) => {
    console.log("🟢 New user connected:", socket.id);

    // Send past messages to the new client
    const messages = await Message.find().sort({ createdAt: 1 }).limit(50);
    socket.emit("previousMessages", messages);

    socket.on("userConnected", (username) => {
      onlineUsers.add(username);
      io.emit("updateUsers", Array.from(onlineUsers));
      console.log(`${username} joined the chat`);
    });

    socket.on("sendMessage", async (data) => {
      // Save to MongoDB
      const newMessage = new Message({
        username: data.username,
        text: data.text,
        time: data.time,
      });
      await newMessage.save();

      // Broadcast to everyone
      io.emit("receiveMessage", newMessage);
    });

    socket.on("disconnect", () => {
      console.log("🔴 User disconnected:", socket.id);
    });
  });
};

module.exports = { initSocket };
