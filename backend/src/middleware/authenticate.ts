import { Request, Response, NextFunction } from "express";
import { Role } from "@prisma/client";
import { verifyAccessToken } from "../lib/tokens";
import { ACCESS_COOKIE } from "../lib/cookies";

export interface AuthUser {
  id: string;
  role: Role;
  companyId: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.[ACCESS_COOKIE];
  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, role: payload.role, companyId: payload.companyId };
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired session" });
  }
}
