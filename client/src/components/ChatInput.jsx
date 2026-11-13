import { useEffect, useRef, useState } from "react";
import EmojiPicker from "./EmojiPicker.jsx";

export default function ChatInput({ onSend }) {
  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const inputRef = useRef(null);
  const emojiWrapRef = useRef(null);

  // Close the emoji picker on outside click or Escape.
  useEffect(() => {
    if (!showEmoji) return;
    const onMouseDown = (event) => {
      if (emojiWrapRef.current && !emojiWrapRef.current.contains(event.target)) {
        setShowEmoji(false);
      }
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") setShowEmoji(false);
    };
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [showEmoji]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return; // ignore empty messages
    onSend(trimmed);
    setText("");
    setShowEmoji(false);
  };

  // Insert the emoji at the cursor position (or replace the selection).
  const insertEmoji = (emoji) => {
    const input = inputRef.current;
    const start = input?.selectionStart ?? text.length;
    const end = input?.selectionEnd ?? text.length;
    setText(text.slice(0, start) + emoji + text.slice(end));
    const cursor = start + emoji.length;
    requestAnimationFrame(() => {
      input?.focus();
      input?.setSelectionRange(cursor, cursor);
    });
  };

  return (
    <form className="chat-input" onSubmit={handleSubmit}>
      <div className="emoji" ref={emojiWrapRef}>
        <button
          type="button"
          className="emoji__toggle"
          onClick={() => setShowEmoji((open) => !open)}
          aria-label="Add emoji"
          aria-expanded={showEmoji}
        >
          😊
        </button>
        {showEmoji && <EmojiPicker onSelect={insertEmoji} />}
      </div>
      <input
        ref={inputRef}
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