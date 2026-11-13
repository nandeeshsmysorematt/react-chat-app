import { useEffect, useRef } from "react";
import LikeButton from "./LikeButton.jsx";
import { USER_COLORS } from "../constants.js";

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
              <span
                className="avatar"
                style={{ background: USER_COLORS[message.user] }}
                aria-hidden="true"
              >
                {message.user[0]}
              </span>
              <div className="message__body">
                <div className="message__meta">
                  <span
                    className="message__user"
                    style={{ color: USER_COLORS[message.user] }}
                  >
                    {message.user}
                  </span>
                  <time className="message__time">{message.time}</time>
                </div>
                <p className="message__text">{message.text}</p>
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