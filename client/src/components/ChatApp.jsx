// src/components/ChatApp.jsx
import React, { useState } from "react";
import ChatRoom from "./ChatRoom";

const ChatApp = ({ user }) => {
  const [room, setRoom] = useState("");
  const [joinedRoom, setJoinedRoom] = useState("");

  const handleJoin = () => {
    if (room.trim()) setJoinedRoom(room.trim());
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {!joinedRoom ? (
        <>
          <h2>Welcome, {user.username} 👋</h2>
          <input
            type="text"
            placeholder="Enter or create a room"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            style={{ padding: "8px", margin: "10px" }}
          />
          <button onClick={handleJoin} style={{ padding: "8px 16px" }}>
            Join Room
          </button>
        </>
      ) : (
        <ChatRoom user={user} room={joinedRoom} />
      )}
    </div>
  );
};

export default ChatApp;
