import { useEffect, useRef, useState } from "react";
import EmojiPicker from "./EmojiPicker.jsx";
import MentionList from "./MentionList.jsx";
import { USER_LIST } from "../constants.js";
import { getMentionQuery } from "../mentions.js";

export default function ChatInput({ onSend }) {
  const [text, setText] = useState("");
  const [cursor, setCursor] = useState(0);
  const [showEmoji, setShowEmoji] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hiddenMentionStart, setHiddenMentionStart] = useState(null);
  const inputRef = useRef(null);
  const emojiWrapRef = useRef(null);

  // ---- @mentions ----
  const mention = getMentionQuery(text, cursor);
  const suggestions =
    mention && mention.start !== hiddenMentionStart
      ? USER_LIST.filter((user) =>
          user.toLowerCase().startsWith(mention.query.toLowerCase())
        )
      : [];
  const mentionOpen = suggestions.length > 0;

  const moveCursor = (position) => {
    setCursor(position);
    requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(position, position);
    });
  };

  const selectMention = (user) => {
    if (!mention) return;
    const before = text.slice(0, mention.start);
    const after = text.slice(cursor);
    const inserted = `@${user} `;
    setText(before + inserted + after);
    setActiveIndex(0);
    moveCursor(before.length + inserted.length);
  };

  const handleKeyDown = (event) => {
    if (!mentionOpen) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => (i - 1 + suggestions.length) % suggestions.length);
    } else if (event.key === "Enter" || event.key === "Tab") {
      event.preventDefault(); // select the user instead of sending
      selectMention(suggestions[Math.min(activeIndex, suggestions.length - 1)]);
    } else if (event.key === "Escape") {
      event.preventDefault();
      setHiddenMentionStart(mention.start);
    }
  };

  // ---- emoji picker: close on outside click or Escape ----
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
    setCursor(0);
    setShowEmoji(false);
    setHiddenMentionStart(null);
  };

  // Insert the emoji at the cursor position (or replace the selection).
  const insertEmoji = (emoji) => {
    const input = inputRef.current;
    const start = input?.selectionStart ?? text.length;
    const end = input?.selectionEnd ?? text.length;
    setText(text.slice(0, start) + emoji + text.slice(end));
    moveCursor(start + emoji.length);
  };

  const activeUser = suggestions[Math.min(activeIndex, suggestions.length - 1)];

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

      {mentionOpen && (
        <MentionList
          users={suggestions}
          activeIndex={Math.min(activeIndex, suggestions.length - 1)}
          onSelect={selectMention}
        />
      )}

      <input
        ref={inputRef}
        type="text"
        className="chat-input__field"
        placeholder="Type a message... (use @ to mention)"
        aria-label="Message"
        role="combobox"
        aria-expanded={mentionOpen}
        aria-controls="mention-list"
        aria-activedescendant={
          mentionOpen ? `mention-option-${activeUser}` : undefined
        }
        value={text}
        onChange={(event) => {
          setText(event.target.value);
          setCursor(event.target.selectionStart);
          setActiveIndex(0);
        }}
        onSelect={(event) => setCursor(event.target.selectionStart)}
        onKeyDown={handleKeyDown}
        autoFocus
      />
      <button type="submit" className="chat-input__send" disabled={!text.trim()}>
        Send
      </button>
    </form>
  );
}