# VibeSpot Web

For full project setup (Docker infra + shared commands), use the root README:

- [`../../README.md`](../../README.md)

## App-specific commands

```bash
# from repo root
bun run dev:web
bun run build:web
bun run lint:web
bun run typecheck:web
```

## Notes

- Runs on `http://localhost:3000`
- Uses Better Auth route handler at `/api/auth/$`
- Requires `apps/web/.env` (copy from `.env.example`)
