import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  signupHandler,
  loginHandler,
  refreshHandler,
  logoutHandler,
  meHandler,
} from "./auth.controller";
import { authenticate } from "../../middleware/authenticate";

const router = Router();

// Basic brute-force protection on the two credential-guessing endpoints.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/signup", authLimiter, signupHandler);
router.post("/login", authLimiter, loginHandler);
router.post("/refresh", refreshHandler);
router.post("/logout", logoutHandler);
router.get("/me", authenticate, meHandler);

export default router;
