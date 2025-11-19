# VibeSpot - AI Coding Agent Instructions

## Architecture Overview

**Monorepo Structure**: Bun workspace with 3 apps + shared packages
- `apps/web` - TanStack Start SSR web app (Vite, React 19, Vercel deployment)
- `apps/mobile/vibespot` - Expo dev-client mobile app (React Native, file-based routing)
- `apps/api` - API service (minimal setup)
- `packages/database` - Shared Drizzle ORM schema + Better Auth config
- `packages/validation` - Shared Zod schemas (events, users, comments)

**Authentication**: Better Auth with Drizzle adapter, configured in `packages/database/src/auth.ts`. Supports both web (react-start cookies) and mobile (Expo plugin). Session guards implemented via `Stack.Protected` in mobile, route loaders in web.

**Database**: PostgreSQL via Drizzle ORM. Schema lives in `packages/database/src/schema.ts`. Migrations in `packages/database/drizzle/`. Use `bun run studio` from web/database package to inspect DB.

**State Management**: TanStack Query for server state (5min stale time default). No global client state library - rely on route loaders and query cache.

## Critical Workflows

### Development Commands
```bash
# Root-level commands (from monorepo root)
bun run dev:web          # Start web dev server on :3000
bun run dev:mobile       # Start Expo dev-client
bun run ios              # Build & run iOS (Mac only)
bun run android          # Build & run Android

# Web-specific (from apps/web)
bun run dev              # Vite dev server
bun run build:vercel     # Production build for Vercel
bun run studio           # Drizzle Studio

# Mobile-specific (from apps/mobile/vibespot)
expo start --dev-client  # Start with custom native code
expo run:ios             # Rebuild native iOS
expo prebuild --clean    # Regenerate android/ios folders
```

**IMPORTANT**: Mobile uses `expo-dev-client`, NOT Expo Go. Always use `--dev-client` flag. Rebuild native code when adding native modules or changing `app.json` plugins.

### Database Migrations
```bash
cd packages/database
bun run generate     # Generate migration from schema changes
bun run migrate      # Apply migrations to DB
```

Web app auto-runs migrations on build via `build:vercel` script. Schema types auto-sync via workspace references.

## Routing Patterns

### Web (TanStack Router)
File-based routing in `apps/web/src/routes/`. Route files export `Route = createFileRoute('path')({ ... })`.

**Protected Routes**: Use `(protected)` folder. Parent `route.tsx` has `beforeLoad` that checks session and redirects to `/signin`.

**Data Loading**: Use route `loader` functions, NOT client-side useQuery. Example:
```tsx
export const Route = createFileRoute('/events')({
  loader: async (ctx) => {
    const events = await getEventsWithCommentsFn(); // server function
    return { events };
  }
})
```

**Server Functions**: Use `createServerFn` from `@tanstack/react-start` in service files. See `apps/web/src/services/eventService.ts` pattern.

### Mobile (Expo Router)
File-based routing in `apps/mobile/vibespot/app/`. Uses Stack/Tabs navigators.

**Protected Routes**: `app/_layout.tsx` wraps routes in `Stack.Protected guard={!!session.data}`.

**Navigation**: Use typed hooks: `router.navigate('/(protected)/(tabs)/events')`. Paths must match file structure exactly.

**Multi-Step Forms**: See `app/(protected)/(tabs)/create-event/` - uses nested Stack navigator for wizard steps (GenreSelection → EventDetails → LocationPicker → DateTimePicker).

## Shared Package Patterns

### Validation Package
All Zod schemas in `packages/validation/src/`. Web and mobile import schemas for form validation.

**Enums**: Defined as `const` arrays with TypeScript types:
```typescript
export const genres = ["Hip-Hop", "Rock", "Indie", ...] as const;
export type Genre = typeof genres[number];
```

**Schema Exports**: `eventSchema`, `eventInsertSchema`, `eventUpdateSchema` pattern. Use `drizzle-zod` for DB schema generation.

### Database Package
Exports: `db`, `schema`, `auth` from `packages/database/src/index.ts`.

**Better Auth Setup**: Web and mobile share same auth config. Expo uses `@better-auth/expo` plugin. Trust origins commented out - configure per environment.

**Schema Types**: Re-export validation types. Web/mobile import from `@vibespot/database` for consistency.

## Mobile-Specific Quirks

**React Version**: Forced to 19.1.0 via root `resolutions`. Expo 54+ supports React 19.

**Native Dependencies**: 
- `react-native-maps` requires dev build (not Expo Go)
- Location services need permission prompts (see `expo-location` usage)
- Native modules trigger `expo prebuild --clean` requirement

**Styling**: NativeWind (Tailwind for RN) + `rn-primitives` for cross-platform components. Global styles in `global.css`.

**MacOS iOS Development**: See `apps/mobile/vibespot/MACOS_SETUP.md` for Xcode/CocoaPods setup. Requires `pod install` in `ios/` folder.

## Web-Specific Quirks

**i18n**: Paraglide middleware in `apps/web/src/server.ts`. Messages in `messages/{locale}.json`. Auto-generates types in `src/paraglide/`.

**SSR**: TanStack Start handles SSR. Server functions run on server, route loaders pre-fetch. Avoid `window` access in loaders.

**Styling**: Tailwind v4 via `@tailwindcss/vite`. Global styles in `src/styles.css`. Uses Radix UI primitives.

**Maps**: Mapbox for web (see `@mapbox/search-js-react`), react-native-maps for mobile. Different API patterns.

## Event Creation Flow

**Web**: Single-page form with react-hook-form in `apps/web/src/routes/(protected)/create-event.tsx`.

**Mobile**: Multi-step wizard documented in `docs/MOBILE_CREATE_EVENT_PLAN.md`. Uses `@stepperize/react` pattern (though not yet in package.json). Steps: Genre → Details → Location → DateTime.

**Validation**: Both use same `eventInsertSchema` from validation package. Genre/color constants from `packages/validation/src/event.ts`.

## Key File References

- **DB Schema**: `packages/database/src/schema.ts` - Single source of truth for DB structure
- **Auth Config**: `packages/database/src/auth.ts` - Better Auth setup
- **Web Router**: `apps/web/src/router.tsx` - TanStack Router setup
- **Mobile Root**: `apps/mobile/vibespot/app/_layout.tsx` - Auth guards + providers
- **Shared Enums**: `packages/validation/src/event.ts` - Genres, colors, repeat options

## Common Pitfalls

1. **Don't use Expo Go** - This project requires dev-client for native maps
2. **Mobile React version mismatch** - Always check root `resolutions` if dependency conflicts
3. **Schema changes** - Run migrations in `packages/database`, then restart both web/mobile dev servers
4. **Server functions** - Web uses TanStack Start's `createServerFn`, mobile uses direct API calls (check patterns in service files)
5. **Protected routes** - Different patterns for web (loader redirect) vs mobile (Stack.Protected guard)

## When Adding Features

- **New DB table**: Add to `packages/database/src/schema.ts`, generate migration, update types
- **New form**: Use shared validation schema from `packages/validation`, implement per platform UX
- **New route**: Follow file-based routing conventions, add to protected folder if auth required
- **New native module** (mobile): Add to package.json → `expo prebuild --clean` → rebuild native
- **Server function** (web): Create in `services/` folder, use `createServerFn`, call in route loader

Refer to `docs/MOBILE_CREATE_EVENT_PLAN.md` for detailed feature planning examples.
