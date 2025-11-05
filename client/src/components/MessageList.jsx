// src/components/MessageList.jsx
import React, { useEffect, useRef } from "react";

const MessageList = ({ messages, currentUser }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [messages]);

  return (
    <div className="messages" ref={ref}>
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`message ${msg.username === currentUser ? "self" : ""}`}
        >
          <strong>{msg.username}</strong>: {msg.text}{" "}
          <span className="time">({msg.time})</span>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
