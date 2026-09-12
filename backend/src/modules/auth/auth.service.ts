import bcrypt from "bcrypt";
import { prisma } from "../../lib/prisma";
import { signAccessToken, generateRefreshToken, hashToken } from "../../lib/tokens";
import { SignupInput, LoginInput } from "./auth.validators";

const SALT_ROUNDS = 12;

class AuthError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export { AuthError };

// Dev/testing only: every signup joins the single demo company, creating it
// on the very first signup. Replace with real company onboarding + invites
// before production (see ARCHITECTURE.md).
async function getOrCreateDefaultCompany() {
  const existing = await prisma.company.findFirst();
  if (existing) return existing;
  return prisma.company.create({ data: { name: "Demo Company" } });
}

function publicUser(user: {
  id: string;
  name: string;
  email: string;
  role: string;
  companyId: string;
}) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    companyId: user.companyId,
  };
}

async function issueTokens(user: { id: string; role: any; companyId: string }) {
  const accessToken = signAccessToken({
    sub: user.id,
    role: user.role,
    companyId: user.companyId,
  });
  const { token: refreshToken, tokenHash, expiresAt } = generateRefreshToken();
  await prisma.refreshToken.create({
    data: { userId: user.id, tokenHash, expiresAt },
  });
  return { accessToken, refreshToken };
}

export async function signup(input: SignupInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw new AuthError(409, "An account with this email already exists");
  }

  const company = await getOrCreateDefaultCompany();
  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role,
      companyId: company.id,
    },
  });

  await prisma.auditLog.create({
    data: { userId: user.id, action: "SIGNUP", entity: "User", entityId: user.id },
  });

  const tokens = await issueTokens(user);
  return { user: publicUser(user), ...tokens };
}

export async function login(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user || !user.isActive) {
    throw new AuthError(401, "Invalid email or password");
  }

  const valid = await bcrypt.compare(input.password, user.passwordHash);
  if (!valid) {
    throw new AuthError(401, "Invalid email or password");
  }

  await prisma.auditLog.create({
    data: { userId: user.id, action: "LOGIN", entity: "User", entityId: user.id },
  });

  const tokens = await issueTokens(user);
  return { user: publicUser(user), ...tokens };
}

export async function refresh(refreshTokenPlain: string) {
  const tokenHash = hashToken(refreshTokenPlain);
  const stored = await prisma.refreshToken.findFirst({
    where: { tokenHash, revokedAt: null },
    include: { user: true },
  });

  if (!stored || stored.expiresAt < new Date() || !stored.user.isActive) {
    throw new AuthError(401, "Session expired, please log in again");
  }

  // Rotate: revoke the used refresh token and issue a fresh pair.
  await prisma.refreshToken.update({
    where: { id: stored.id },
    data: { revokedAt: new Date() },
  });

  const tokens = await issueTokens(stored.user);
  return { user: publicUser(stored.user), ...tokens };
}

export async function logout(refreshTokenPlain: string | undefined) {
  if (!refreshTokenPlain) return;
  const tokenHash = hashToken(refreshTokenPlain);
  await prisma.refreshToken.updateMany({
    where: { tokenHash, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.isActive) {
    throw new AuthError(401, "Not authenticated");
  }
  return publicUser(user);
}
