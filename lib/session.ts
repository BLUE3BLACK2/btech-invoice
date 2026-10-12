import "server-only";

export const SESSION_COOKIE = "btech_session";
export const SESSION_MAX_AGE = 7 * 24 * 60 * 60;

const MIN_SECRET_LENGTH = 32;
const encoder = new TextEncoder();

function toBase64Url(bytes: ArrayBuffer) {
  return Buffer.from(bytes).toString("base64url");
}

async function signingKey() {
  const secret = process.env.AUTH_SECRET ?? "";
  if (secret.length < MIN_SECRET_LENGTH) return null;
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

export async function createSessionToken() {
  const key = await signingKey();
  if (!key) return null;
  const expiresAt = String(Date.now() + SESSION_MAX_AGE * 1000);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(expiresAt));
  return `${expiresAt}.${toBase64Url(signature)}`;
}

export async function isValidSessionToken(token: string | undefined) {
  const [expiresAt, signature] = token?.split(".") ?? [];
  if (!expiresAt || !signature || Number(expiresAt) < Date.now()) return false;
  const key = await signingKey();
  if (!key) return false;
  return crypto.subtle.verify(
    "HMAC",
    key,
    Buffer.from(signature, "base64url"),
    encoder.encode(expiresAt),
  );
}
