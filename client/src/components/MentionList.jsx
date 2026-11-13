import { USER_COLORS } from "../constants.js";

export default function MentionList({ users, activeIndex, onSelect }) {
  return (
    <ul
      className="mention-list"
      id="mention-list"
      role="listbox"
      aria-label="Mention a user"
    >
      {users.map((user, index) => (
        <li
          key={user}
          id={`mention-option-${user}`}
          role="option"
          aria-selected={index === activeIndex}
          className={
            "mention-list__item" +
            (index === activeIndex ? " mention-list__item--active" : "")
          }
          onMouseDown={(event) => {
            event.preventDefault(); // keep focus in the text box
            onSelect(user);
          }}
        >
          <span
            className="avatar avatar--small"
            style={{ background: USER_COLORS[user] }}
            aria-hidden="true"
          >
            {user[0]}
          </span>
          {user}
        </li>
      ))}
    </ul>
  );
}