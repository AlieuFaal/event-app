# VibeSpot

VibeSpot is a Bun monorepo for discovering and creating music events across web and mobile clients, backed by a shared PostgreSQL + Drizzle data layer.

## Features

- Email/password and social auth with shared Better Auth configuration
- Event discovery on list, map, and calendar views
- Event creation with recurrence, images, and location data
- Favorites, comments, onboarding, and profile flows
- Shared validation and schema packages reused by web, API, and mobile

## Monorepo structure

| Path | Purpose |
| --- | --- |
| `apps/web` | TanStack Start SSR web app (port `3000`) |
| `apps/api` | Hono API service for mobile/client API flows (port `3001`) |
| `apps/mobile/vibespot` | Expo dev-client mobile app |
| `packages/database` | Drizzle schema, DB access, Better Auth config |
| `packages/validation` | Shared Zod schemas and enums |

## Prerequisites

- [Bun](https://bun.sh/) `1.3+`
- [Docker](https://www.docker.com/) (for local Postgres)
- For mobile: Xcode/iOS Simulator or Android Studio emulator, plus Expo dev-client

## Quick start (recommended)

### 1. Install dependencies

```bash
bun install
```

### 2. Create local env files

```bash
cp apps/web/.env.example apps/web/.env
cp apps/api/.env.example apps/api/.env
cp packages/database/.env.example packages/database/.env
cp apps/mobile/vibespot/.env.example apps/mobile/vibespot/.env
```

Set at least:
- the **same** `BETTER_AUTH_SECRET` in `apps/web/.env` and `apps/api/.env`
- map provider tokens if you use map features (`VITE_PUBLIC_MAPBOX_ACCESS_TOKEN`, `GOOGLE_MAPS_API_KEY`)

### 3. Start infrastructure

```bash
bun run infra:up
```

This starts local PostgreSQL in Docker.

### 4. Start web + API together

```bash
bun run dev
```

This command runs DB migrations first, then starts:
- web at `http://localhost:3000`
- API at `http://localhost:3001`

If you also want Drizzle Studio running in the same command, use:

```bash
bun run dev:with-studio
```

## Mobile workflow

Mobile is intentionally **not** containerized. Keep infra running, then start Expo dev-client:

```bash
bun run dev:mobile
```

Use a development build (not Expo Go).

## Local services

| Service | URL / Port | Started by |
| --- | --- | --- |
| PostgreSQL | `localhost:5433` | `bun run infra:up` |
| Web app | `http://localhost:3000` | `bun run dev` |
| API | `http://localhost:3001` | `bun run dev` |

## Useful commands

| Command | What it does |
| --- | --- |
| `bun run infra:up` | Start Docker infrastructure |
| `bun run infra:down` | Stop Docker infrastructure |
| `bun run infra:reset` | Recreate infrastructure volume (destructive reset) |
| `bun run infra:logs` | Tail Postgres logs |
| `bun run db:migrate` | Run Drizzle migrations manually |
| `bun run dev` | Run DB migrations, then web + API |
| `bun run dev:with-studio` | Run DB migrations, then web + API + Drizzle Studio |
| `bun run dev:web` | Run web only |
| `bun run dev:api` | Run API only |
| `bun run dev:mobile` | Run Expo dev-client |
| `bun run studio` | Run Drizzle Studio only |
| `bun run lint` | Lint all workspaces |
| `bun run tsc` | Type-check all workspaces |

## Troubleshooting

- **`DATABASE_URL environment variable is not set`**: confirm `.env` files were created from `.env.example`.
- **Connection refused to Postgres**: ensure Docker is running and `bun run infra:up` succeeded.
- **`role "vibespot" does not exist`**: your migration is probably hitting a different local Postgres on `5432`. Set `DATABASE_URL` to `localhost:5433`, then run `bun run infra:up` and `bun run db:migrate`.
- **Migration failure**: verify `packages/database/.env` points to `localhost:5433`, then run `bun run db:migrate`.
- **Mobile app cannot connect to API**: keep API running on `3001`; Android emulator uses `10.0.2.2` automatically in code.
- **Signup verification errors**: set `RESEND_API_KEY` if you need live email verification flows.
