# Sheba

Multi-role system for a company secretary of a private limited company
(Bangladesh). See [ARCHITECTURE.md](./ARCHITECTURE.md) for the full design
and status.

## Stack (all free / open-source)
- Backend: Node.js + TypeScript + Express + PostgreSQL + Prisma
- Frontend: React + TypeScript + Vite
- Local DB: PostgreSQL via Docker Compose

## First-time setup

```bash
# 1. Start local Postgres (Docker must be running)
docker compose up -d

# 2. Backend
cd backend
cp .env.example .env   # already done if you're reading this after initial setup
npm install
npx prisma migrate dev   # creates the schema in the local DB
npm run dev              # http://localhost:4000

# 3. Frontend (separate terminal)
cd frontend
npm install
npm run dev               # http://localhost:5173
```

## Everyday dev

```bash
docker compose up -d       # start Postgres (if not already running)
cd backend && npm run dev  # API on :4000
cd frontend && npm run dev # app on :5173
```

Open http://localhost:5173, sign up (pick a role — Secretary / Director /
Shareholder; this is a dev-only convenience, see the note in
`frontend/src/pages/SignupPage.tsx` and ARCHITECTURE.md), and you'll land on
the dashboard for that role.

## Useful commands
- `docker compose down` — stop Postgres (data persists in a Docker volume)
- `docker compose down -v` — stop Postgres **and wipe the local dev data**
- `cd backend && npx prisma studio` — browse the local DB in a GUI
- `cd backend && npx prisma migrate dev --name <change>` — create a new migration after editing `prisma/schema.prisma`

## To-do

### Done
- [x] Architecture planned (roles, permissions model, data model)
- [x] Local Postgres via Docker Compose
- [x] Backend: signup / login / refresh / logout / me, JWT in httpOnly cookies
- [x] Role-based auth middleware (`authenticate` + `authorize`) and a central permissions map
- [x] Frontend: signup/login forms, protected routes, one dashboard per role
- [x] Verified end-to-end locally, and shareable over a temporary tunnel

### Next up
- [ ] Replace open self-signup + role dropdown with a real flow: Secretary creates the company, then invites Directors/Shareholders by email
- [ ] Password reset / forgot password flow
- [ ] First real Secretary feature: create & manage a document/record (defines the write-side pattern other features will follow)
- [ ] Director/Shareholder read-only views for whatever the Secretary creates, plus download
- [ ] File storage for uploaded/generated documents (e.g. board resolutions, share certificates)
- [ ] Audit log surfaced in the UI (who changed what, when) — table already exists, not yet shown anywhere
- [ ] Basic form validation/error states polish on the frontend
- [ ] Automated tests (backend auth flow at minimum)
- [ ] Real deployment (free-tier hosting) once ready to move off localhost permanently
- [ ] Revisit single-company assumption if this ever needs to support more than one company
