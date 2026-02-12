import { IncomingMessage } from "http";
import { NextPageContext } from "next";
import { parseCookies, setCookie, destroyCookie } from "nookies";

const TOKEN_NAME = "toyota_token";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export function setTokenCookie(
  ctx: NextPageContext | null,
  token: string
): void {
  const cookieSettings = {
    maxAge: MAX_AGE,
    expires: new Date(Date.now() + MAX_AGE * 1000),
    httpOnly: false,
    secure: false,
    path: "/",
    sameSite: "lax",
  };

  setCookie(ctx, TOKEN_NAME, token, cookieSettings);
}

export function removeTokenCookie(ctx: NextPageContext | null): void {
  destroyCookie(ctx, TOKEN_NAME, {
    maxAge: -1,
    path: "/",
  });
}

export function getTokenCookie(req: any): string | undefined {
  const cookies = parseCookies({ req });
  return cookies[TOKEN_NAME];
}
