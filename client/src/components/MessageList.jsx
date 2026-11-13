import { useEffect, useRef } from "react";

export default function MessageList({ messages }) {
  const containerRef = useRef(null);

  // Keep the newest message in view.
  useEffect(() => {
    const el = containerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  return (
    <div className="messages" ref={containerRef}>
      {messages.length === 0 ? (
        <p className="messages__empty">No messages yet. Say hello!</p>
      ) : (
        <ul className="messages__list">
          {messages.map((message) => (
            <li key={message.id} className="message">
              <span className="message__user">{message.user}</span>
              <span className="message__text">{message.text}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}