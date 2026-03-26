import { DecodedToken } from "@/components/general/withLogin";
import { getTokenCookie } from "@/lib/auth-cookie";
import jwtDecode from "jwt-decode";
import * as next from "next";
import { destroyCookie, parseCookies, setCookie } from "nookies";

const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export type CookieReqContext =
  | Pick<next.NextPageContext, "req">
  | { req: next.NextApiRequest }
  | null
  | undefined;

export type CookieResContext =
  | Pick<next.NextPageContext, "res">
  | { res: next.NextApiResponse }
  | null
  | undefined;

export function saveCookie(
  ctx: CookieResContext,
  key: string,
  value: string,
  ttl?: number,
  sameSite?: string
) {
  setCookie(ctx, key, value, {
    maxAge: ttl || MAX_AGE,
    expires: ttl
      ? new Date(Date.now() + ttl * 1000)
      : new Date(Date.now() + MAX_AGE * 1000),
    httpOnly: false,
    secure: false,
    path: "/",
    sameSite: sameSite ?? "lax",
  });
}

export function saveUtmCookie(
  ctx: CookieResContext,
  key: string,
  value: string,
  ttl?: number
) {
  setCookie(ctx, key, value, {
    maxAge: ttl || MAX_AGE,
    expires: ttl
      ? new Date(Date.now() + ttl * 1000)
      : new Date(Date.now() + MAX_AGE * 1000),
    httpOnly: false,
    secure: false,
    path: "/",
    sameSite: "none",
  });
}

export function deleteCookie(ctx: CookieResContext, key: string) {
  destroyCookie(ctx, key, {
    maxAge: -1,
    path: "/",
  });
}

export function getCookie(ctx: CookieReqContext, key: string): string {
  const cookies = parseCookies(ctx);
  return cookies[key];
}
