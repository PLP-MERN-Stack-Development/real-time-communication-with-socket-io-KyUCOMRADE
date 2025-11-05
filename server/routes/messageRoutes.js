// server/routes/messageRoutes.js
const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

// GET /api/messages?limit=20&before=2025-11-03T12:00:00.000Z
router.get("/", async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit || "20", 10), 100); // max 100
    const before = req.query.before ? new Date(req.query.before) : null;

    const query = before ? { createdAt: { $lt: before } } : {};

    // fetch newest first then reverse so client gets chronological order (oldest -> newest)
    const docs = await Message.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    // reverse to chronological order
    const messages = docs.reverse();

    res.json({ messages });
  } catch (err) {
    console.error("GET /api/messages error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
