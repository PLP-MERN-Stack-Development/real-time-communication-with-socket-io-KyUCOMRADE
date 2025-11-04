import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";

const ChatRoom = () => {
  const { user, logout } = useAuth();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    const socket = io("http://localhost:5000");

    if (user) {
      socket.emit("userConnected", user.username);
    }

    socket.on("previousMessages", (history) => setMessages(history));
    socket.on("updateUsers", (users) => setOnlineUsers(users));
    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.disconnect();
  }, [user]);

  const sendMessage = () => {
    if (message.trim()) {
      const msgData = {
        username: user.username,
        text: message,
        time: new Date().toLocaleTimeString(),
      };
      const socket = io("http://localhost:5000");
      socket.emit("sendMessage", msgData);
      setMessage("");
    }
  };

  return (
    <div className="chat-container">
      <div className="header">
        <h2>
          Welcome,{" "}
          {typeof user?.username === "string"
            ? user.username
            : user?.username?.message || "Guest"}
        </h2>
        <button onClick={logout}>Logout</button>
      </div>

      <div className="online-users">
        🟢 <strong>Online Users:</strong>
        <ul>
          {onlineUsers.map((name, i) => (
            <li key={i}>{name}</li>
          ))}
        </ul>
      </div>

      <div className="messages">
        {messages.map((msg, index) => (
          <p key={index}>
            <strong>{msg.username}</strong>: {msg.text}{" "}
            <span className="time">({msg.time})</span>
          </p>
        ))}
      </div>

      <div className="input-section">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatRoom;
