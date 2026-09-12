import { Request, Response, NextFunction } from "express";
import { Capability, roleHas } from "../lib/permissions";

// Use on any route after `authenticate`, e.g.:
//   router.post("/documents", authenticate, authorize("canWrite"), createDocument)
export function authorize(capability: Capability) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    if (!roleHas(req.user.role, capability)) {
      return res.status(403).json({ error: "Not permitted for your role" });
    }
    next();
  };
}
