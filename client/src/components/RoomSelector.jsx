// src/components/RoomSelector.jsx
import React, { useState } from "react";

const RoomSelector = ({ setRoom }) => {
  const [newRoom, setNewRoom] = useState("");

  const handleJoin = () => {
    if (newRoom.trim()) {
      setRoom(newRoom.trim());
      setNewRoom("");
    }
  };

  return (
    <div className="room-selector">
      <input
        type="text"
        placeholder="Enter room name..."
        value={newRoom}
        onChange={(e) => setNewRoom(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleJoin()}
      />
      <button onClick={handleJoin}>Join</button>
    </div>
  );
};

export default RoomSelector;
