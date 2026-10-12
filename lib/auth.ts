import "server-only";

import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isValidSessionToken, SESSION_COOKIE } from "./session";

function digest(value: string) {
  return createHash("sha256").update(value).digest();
}

function safeEqual(a: string, b: string) {
  return timingSafeEqual(digest(a), digest(b));
}

export function isAuthConfigured() {
  return Boolean(process.env.AUTH_USERNAME && process.env.AUTH_PASSWORD);
}

export function checkCredentials(username: string, password: string) {
  if (!isAuthConfigured()) return false;
  const validUsername = safeEqual(username, process.env.AUTH_USERNAME ?? "");
  const validPassword = safeEqual(password, process.env.AUTH_PASSWORD ?? "");
  return validUsername && validPassword;
}

export async function verifySession() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!(await isValidSessionToken(token))) redirect("/login");
}

export function safeRedirectPath(path: unknown) {
  return typeof path === "string" && path.startsWith("/") && !path.startsWith("//")
    ? path
    : "/";
}
