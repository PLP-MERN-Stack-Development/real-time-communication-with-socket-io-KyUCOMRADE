const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { initSocket } = require("./socket/socket");
const authRoutes = require("./routes/authRoutes");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST"],
  credentials: true,
}));
app.use(express.json());

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/socketchat")
  .then(() => console.log("✅ MongoDB (socketchat) connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("🚀 Server is running...");
});

// Initialize socket
initSocket(server);

// Start the server
server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
