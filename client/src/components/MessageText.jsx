import { USER_LIST } from "../constants.js";

// Renders message text and highlights @mentions of known users.
export default function MessageText({ text }) {
  const parts = text.split(/(@\w+)/g);
  return (
    <p className="message__text">
      {parts.map((part, index) =>
        part.startsWith("@") && USER_LIST.includes(part.slice(1)) ? (
          <span key={index} className="mention">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </p>
  );
}