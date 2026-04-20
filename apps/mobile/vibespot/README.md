# VibeSpot Mobile

For full monorepo setup, read the root guide first:

- [`../../../README.md`](../../../README.md)

## App-specific commands

```bash
# from repo root
bun run dev:mobile
bun run ios
bun run android
bun run lint:mobile
bun run typecheck:mobile
```

## Notes

- This app uses **Expo dev-client** (not Expo Go).
- API defaults to `http://localhost:3001` (with emulator/device-aware handling in code).
- Copy `apps/mobile/vibespot/.env.example` to `.env` before running.
