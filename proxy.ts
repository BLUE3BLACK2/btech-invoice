import { NextResponse, type NextRequest } from "next/server";
import { isValidSessionToken, SESSION_COOKIE } from "@/lib/session";

const LOGIN_PATH = "/login";

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const authenticated = await isValidSessionToken(request.cookies.get(SESSION_COOKIE)?.value);

  if (pathname === LOGIN_PATH) {
    return authenticated ? NextResponse.redirect(new URL("/", request.url)) : NextResponse.next();
  }

  if (!authenticated) {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    if (pathname !== "/") loginUrl.searchParams.set("from", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images/).*)"],
};
