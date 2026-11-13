export default function LikeButton({ count, onClick, label }) {
  return (
    <button type="button" className="like" onClick={onClick} aria-label={label}>
      <span aria-hidden="true">👍</span>
      <span className="like__count">{count}</span>
    </button>
  );
}