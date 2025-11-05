// src/components/MessageInput.jsx
import React, { useState } from "react";

const MessageInput = ({ onSend, onTyping }) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (text.trim()) {
      onSend(text);
      setText("");
    }
  };

  return (
    <div className="input-section">
      <input
        type="text"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          onTyping();
          if (e.key === "Enter") handleSend();
        }}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default MessageInput;
