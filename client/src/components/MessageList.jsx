import { useEffect, useRef } from "react";
import LikeButton from "./LikeButton.jsx";

export default function MessageList({ messages, onLike }) {
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
              <div className="message__body">
                <span className="message__user">{message.user}</span>
                <span className="message__text">{message.text}</span>
              </div>
              <LikeButton
                count={message.likes}
                onClick={() => onLike(message.id)}
                label={`Like message from ${message.user}`}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}