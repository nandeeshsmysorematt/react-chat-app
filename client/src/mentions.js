// Finds an "@query" being typed right before the cursor.
// Returns { query, start } (start = index of the "@") or null.
export function getMentionQuery(text, cursor) {
  const before = text.slice(0, cursor);
  const match = before.match(/(?:^|\s)@(\w*)$/);
  if (!match) return null;
  return { query: match[1], start: cursor - match[1].length - 1 };
}