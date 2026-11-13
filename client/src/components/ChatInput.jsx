import { useState } from "react";

export default function ChatInput({ onSend }) {
  const [text, setText] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return; // ignore empty messages
    onSend(trimmed);
    setText("");
  };

  return (
    <form className="chat-input" onSubmit={handleSubmit}>
      <input
        type="text"
        className="chat-input__field"
        placeholder="Type a message..."
        aria-label="Message"
        value={text}
        onChange={(event) => setText(event.target.value)}
        autoFocus
      />
      <button type="submit" className="chat-input__send" disabled={!text.trim()}>
        Send
      </button>
    </form>
  );
}