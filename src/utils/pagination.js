export function encodeCursor(lastKey) {
  if (!lastKey) return null;
  return Buffer.from(JSON.stringify(lastKey)).toString("base64");
}
export function decodeCursor(cursor) {
  if (!cursor) return null;
  return JSON.parse(Buffer.from(cursor, "base64").toString("utf8"));
}
