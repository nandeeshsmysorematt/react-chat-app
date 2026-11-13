import { useEffect, useRef } from "react";
import LikeButton from "./LikeButton.jsx";
import MessageText from "./MessageText.jsx";
import { USER_COLORS } from "../constants.js";

const formatTime = (iso) =>
  new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

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
                  <time className="message__time">
                    {formatTime(message.createdAt)}
                  </time>
                </div>
                <MessageText text={message.text} />
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