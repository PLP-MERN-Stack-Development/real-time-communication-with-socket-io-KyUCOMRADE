// src/components/OnlineUsers.jsx
import React from "react";

const OnlineUsers = ({ users }) => (
  <div className="online-users">
    🟢 <strong>Online Users:</strong>
    <ul>
      {users.map((name, i) => (
        <li key={i}>{name}</li>
      ))}
    </ul>
  </div>
);

export default OnlineUsers;
