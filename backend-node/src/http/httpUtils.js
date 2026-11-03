// Small helpers for reading requests and sending responses.

// An error with an HTTP status code. Services throw it, and server.js turns
// it into a JSON response like { "message": "..." }.
export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

// Shortcut for the most common case: invalid input from the client.
// Matches the Java backend, which answers these with 400 Bad Request.
export function badRequest(message) {
  return new HttpError(400, message);
}

export function sendJson(res, status, data) {
  if (status === 204) {
    res.writeHead(204);
    res.end();
    return;
  }
  const body = JSON.stringify(data);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body)
  });
  res.end(body);
}

const MAX_BODY_BYTES = 1_000_000;

// Reads the request body and parses it as JSON.
export async function readJsonBody(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) {
      throw new HttpError(413, 'Request body is too large.');
    }
    chunks.push(chunk);
  }
  const text = Buffer.concat(chunks).toString('utf8');
  if (text.trim() === '') {
    throw badRequest('Request body is missing.');
  }
  try {
    return JSON.parse(text);
  } catch {
    throw badRequest('Request body is not valid JSON.');
  }
}

// Turns a path parameter such as the "5" in /api/products/5 into a number.
export function parseId(value) {
  if (!/^\d+$/.test(value)) {
    throw badRequest(`Invalid id: ${value}`);
  }
  return Number(value);
}

// Current local date and time as text, e.g. "2026-11-03T20:41:05".
// Same format as Java's LocalDateTime in the JSON responses.
export function formatLocalDateTime(date) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

// Rounds an amount of money to 2 decimals, e.g. 0.1 + 0.2 -> 0.3.
export function roundMoney(amount) {
  return Math.round(amount * 100) / 100;
}
