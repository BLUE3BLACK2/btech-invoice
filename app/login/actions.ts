"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { checkCredentials, isAuthConfigured, safeRedirectPath } from "@/lib/auth";
import { createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/session";

export type LoginState = { error: string; username: string } | undefined;

const FAILED_LOGIN_DELAY = 800;

export async function login(_state: LoginState, formData: FormData): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!username || !password) {
    return { error: "Username dan password wajib diisi.", username };
  }
  if (!isAuthConfigured()) {
    return { error: "Login belum dikonfigurasi. Hubungi admin.", username };
  }
  if (!checkCredentials(username, password)) {
    await new Promise((resolve) => setTimeout(resolve, FAILED_LOGIN_DELAY));
    return { error: "Username atau password salah.", username };
  }

  const token = await createSessionToken();
  if (!token) {
    return { error: "Login belum dikonfigurasi. Hubungi admin.", username };
  }

  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  const referer = (await headers()).get("referer");
  const from = referer && URL.canParse(referer) ? new URL(referer).searchParams.get("from") : null;
  redirect(safeRedirectPath(from));
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/login");
}
