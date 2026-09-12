import { z } from "zod";
import { Role } from "@prisma/client";

// NOTE: letting the signer pick their own role is a dev/testing convenience
// only (see ARCHITECTURE.md). Before production this should be replaced by
// a Secretary-invites-users flow instead of open self-signup.
export const signupSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.nativeEnum(Role),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
