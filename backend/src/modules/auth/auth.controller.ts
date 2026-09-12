import { Request, Response } from "express";
import { ZodError } from "zod";
import * as authService from "./auth.service";
import { signupSchema, loginSchema } from "./auth.validators";
import { setAuthCookies, clearAuthCookies, REFRESH_COOKIE } from "../../lib/cookies";

function handleZodError(err: unknown, res: Response): boolean {
  if (err instanceof ZodError) {
    res.status(400).json({ error: "Validation failed", issues: err.issues });
    return true;
  }
  return false;
}

export async function signupHandler(req: Request, res: Response) {
  try {
    const input = signupSchema.parse(req.body);
    const { user, accessToken, refreshToken } = await authService.signup(input);
    setAuthCookies(res, accessToken, refreshToken);
    res.status(201).json({ user });
  } catch (err) {
    if (handleZodError(err, res)) return;
    if (err instanceof authService.AuthError) {
      return res.status(err.status).json({ error: err.message });
    }
    console.error("signup error", err);
    res.status(500).json({ error: "Something went wrong" });
  }
}

export async function loginHandler(req: Request, res: Response) {
  try {
    const input = loginSchema.parse(req.body);
    const { user, accessToken, refreshToken } = await authService.login(input);
    setAuthCookies(res, accessToken, refreshToken);
    res.json({ user });
  } catch (err) {
    if (handleZodError(err, res)) return;
    if (err instanceof authService.AuthError) {
      return res.status(err.status).json({ error: err.message });
    }
    console.error("login error", err);
    res.status(500).json({ error: "Something went wrong" });
  }
}

export async function refreshHandler(req: Request, res: Response) {
  try {
    const token = req.cookies?.[REFRESH_COOKIE];
    if (!token) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const { user, accessToken, refreshToken } = await authService.refresh(token);
    setAuthCookies(res, accessToken, refreshToken);
    res.json({ user });
  } catch (err) {
    if (err instanceof authService.AuthError) {
      clearAuthCookies(res);
      return res.status(err.status).json({ error: err.message });
    }
    console.error("refresh error", err);
    res.status(500).json({ error: "Something went wrong" });
  }
}

export async function logoutHandler(req: Request, res: Response) {
  try {
    await authService.logout(req.cookies?.[REFRESH_COOKIE]);
  } finally {
    clearAuthCookies(res);
    res.status(204).send();
  }
}

export async function meHandler(req: Request, res: Response) {
  try {
    const user = await authService.getMe(req.user!.id);
    res.json({ user });
  } catch (err) {
    if (err instanceof authService.AuthError) {
      return res.status(err.status).json({ error: err.message });
    }
    console.error("me error", err);
    res.status(500).json({ error: "Something went wrong" });
  }
}
