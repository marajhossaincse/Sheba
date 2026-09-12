# Sheba — Company Secretary Multi-Role System — Architecture

## Purpose
Internal system for the secretary of a private limited company (Bangladesh).
Only the **Secretary** role can create/edit/delete anything. All other roles
(Director, Shareholder, and future roles) are **view + download only**.

## Stack decision
- Backend: Node.js + TypeScript + Express + PostgreSQL + Prisma ORM
- Frontend: React + TypeScript + Vite + React Router
- Auth: JWT access token (short-lived) + refresh token, both in httpOnly
  secure cookies (not localStorage)
- Validation: Zod
- Password hashing: bcrypt

## Key early decisions
1. **Multi-tenant-ready schema, single-tenant for now.** Every user belongs
   to a `company_id`. Only one company row exists today, but this avoids a
   painful migration if the system later serves multiple companies.
2. **Role assignment.** Phase 1 (dev/testing): signup form includes a role
   dropdown (Secretary / Director / Shareholder). Before production, replace
   with: Secretary creates company + own account → invites other users by
   email → invited user sets password on first login. Public self-signup
   picking your own role is NOT acceptable for production.
3. **Audit log from day one.** Corporate/statutory record-keeping (board
   resolutions, share transfers, minutes, etc.) will need a "who changed
   what, when" trail. Added `audit_log` table now rather than retrofitting.

## Data model (phase 1)
```
companies
  id, name, created_at

users
  id, company_id (fk), name, email (unique), password_hash,
  role (enum: SECRETARY | DIRECTOR | SHAREHOLDER),
  is_active, created_at, updated_at

refresh_tokens
  id, user_id (fk), token_hash, expires_at, revoked_at

audit_log
  id, user_id (fk), action, entity, entity_id, metadata (jsonb), created_at
```

## Permissions model
Single capability map, not scattered role checks:
```ts
const PERMISSIONS = {
  SECRETARY:   { canWrite: true,  canView: true, canDownload: true },
  DIRECTOR:    { canWrite: false, canView: true, canDownload: true },
  SHAREHOLDER: { canWrite: false, canView: true, canDownload: true },
} as const;
```
Backend: `authenticate` middleware (verifies JWT, sets `req.user`), then
`authorize('canWrite')` guards any write route. Every future write endpoint
must be wrapped in `authorize('canWrite')`.

## Auth endpoints (phase 1)
- `POST /api/auth/signup` — name, email, password (+ role dropdown, dev-only)
- `POST /api/auth/login` — email + password → access + refresh tokens
- `POST /api/auth/refresh` — rotate access token via refresh cookie
- `POST /api/auth/logout` — revoke refresh token
- `GET  /api/auth/me` — returns `{ id, name, email, role }`

## Frontend routing per role
```
/login, /signup                — public
/app                            — protected shell, redirects by role
  /app/secretary/...            — full dashboard, edit/create
  /app/director/...             — read-only dashboard
  /app/shareholder/...          — read-only dashboard
```
`AuthContext` / `useAuth()` holds `{ user, role }`. `<ProtectedRoute role="...">`
redirects unauthenticated users to `/login`; redirects an authenticated user
landing on `/app` straight to their own dashboard root.

## Repo layout
```
sheba/
  backend/
    src/
      modules/auth/        (routes, controller, service)
      middleware/           (authenticate, authorize)
      lib/prisma.ts
      prisma/schema.prisma
    package.json
  frontend/
    src/
      auth/                 (AuthContext, ProtectedRoute)
      pages/secretary/, director/, shareholder/, login/, signup/
      api/                  (fetch wrapper w/ auto refresh + 401 handling)
    package.json
```

## Security baseline
- bcrypt/argon2 password hashing
- Rate limiting on login/signup (brute force protection)
- Zod input validation on every endpoint
- helmet + properly scoped CORS
- httpOnly, secure, sameSite cookies for tokens
- Secrets in `.env`, never committed

## Status
- [x] Architecture decided (2026-09-12)
- [x] Repo scaffolded (backend + frontend) (2026-09-12)
- [x] Signup/login working end-to-end (2026-09-12)
- [x] Three role-based dashboards rendering after login (2026-09-12)

## Notable implementation detail: Prisma 7
Prisma 7 removed the `url` field from the `datasource` block in
`schema.prisma`, and `PrismaClient` no longer connects using an implicit
env-based URL. Instead:
- `backend/prisma.config.ts` supplies the connection URL to the Prisma CLI
  (`migrate`, `studio`, etc.)
- `backend/src/lib/prisma.ts` constructs `PrismaClient` with an explicit
  `@prisma/adapter-pg` driver adapter for the app's runtime connection

Both read `DATABASE_URL` from `.env`, so there's nothing to configure beyond
the usual `.env` setup — just be aware of this if you see older Prisma
tutorials/docs that put the URL directly in the schema file.
