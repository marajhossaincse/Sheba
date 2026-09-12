import { Response } from "express";
import { env } from "./env";

export const ACCESS_COOKIE = "sheba_access_token";
export const REFRESH_COOKIE = "sheba_refresh_token";

const baseOptions = {
  httpOnly: true,
  secure: env.isProduction,
  sameSite: "lax" as const,
  path: "/",
};

export function setAuthCookies(
  res: Response,
  accessToken: string,
  refreshToken: string
) {
  res.cookie(ACCESS_COOKIE, accessToken, {
    ...baseOptions,
    maxAge: 15 * 60 * 1000, // 15 minutes, matches ACCESS_TOKEN_TTL default
  });
  res.cookie(REFRESH_COOKIE, refreshToken, {
    ...baseOptions,
    maxAge: env.refreshTokenTtlDays * 24 * 60 * 60 * 1000,
  });
}

export function clearAuthCookies(res: Response) {
  res.clearCookie(ACCESS_COOKIE, baseOptions);
  res.clearCookie(REFRESH_COOKIE, baseOptions);
}
