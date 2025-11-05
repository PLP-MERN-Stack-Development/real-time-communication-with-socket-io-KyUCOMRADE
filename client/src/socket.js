// src/socket.js
import { io } from "socket.io-client";

const socket = io("http://localhost:5000/chat", {
  transports: ["websocket"],
  reconnection: true,
});

export default socket;
