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
