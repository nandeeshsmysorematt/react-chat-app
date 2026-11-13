import { EMOJIS } from "../constants.js";

export default function EmojiPicker({ onSelect }) {
  return (
    <div className="emoji-picker" role="dialog" aria-label="Emoji picker">
      {EMOJIS.map((emoji) => (
        <button
          key={emoji}
          type="button"
          className="emoji-picker__item"
          onClick={() => onSelect(emoji)}
          aria-label={`Insert ${emoji}`}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}