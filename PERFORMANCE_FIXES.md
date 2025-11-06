# Performance Fixes and Optimizations

## Issues Fixed

### 1. Language Flash (FOUC) Issue ✅

**Problem:** When switching languages, users would see English text briefly before the selected language appeared.

**Root Cause:**
- Locale was only stored in `localStorage` (client-side only)
- Server didn't know the user's language preference
- HTML `lang` attribute was set using client-side `getLocale()` after hydration
- This caused a mismatch between server-rendered and client-rendered content

**Solution:**
- ✅ Added `getLocaleServerFn()` and `setLocaleServerFn()` in `ThemeService.ts` to read/write locale to cookies
- ✅ Updated `__root.tsx` to load locale from server-side cookie
- ✅ Changed HTML `lang` attribute to use server-loaded locale instead of client-side `getLocale()`
- ✅ Updated language switcher to save to both cookie and localStorage
- ✅ Modified vite.config.ts to prioritize `cookie` strategy over `localStorage`
- ✅ Added `suppressHydrationWarning` to prevent hydration warnings during transition

**Strategy Priority (in vite.config.ts):**
```typescript
strategy: ["cookie", "localStorage", "preferredLanguage", "baseLocale"]
```
**Note:** Removed "url" strategy to avoid unwanted URL localization (e.g., `/sv/` paths)

**Latest Fix (Hydration Mismatch):**
- ✅ Added locale synchronization in root document: `setLocale(locale)` on mount
- ✅ This ensures client-side Paraglide uses the same locale as SSR
- ✅ Prevents hydration errors where server renders one language and client expects another

**Latest Fix (Instant Language Switch):**
- ✅ Added `window.location.reload()` after changing locale
- ✅ Ensures translations apply immediately without needing to navigate or manually refresh
- ✅ Cookie is saved first, then page reloads with new language
- ✅ Removed `setLocale()` call before reload to prevent infinite refresh loop
- ✅ **CRITICAL FIX**: Pass `{ reload: false }` to `setLocale()` in root document
- ✅ `setLocale()` has `reload: true` by default, which was causing infinite loop!

**Root Cause of Infinite Loop:**
Paraglide's `setLocale()` function has a hidden `reload: true` default option that triggers `window.location.reload()`. When we called `setLocale(locale)` in the root document after a manual reload, it would reload AGAIN, creating an infinite loop.

**Flow:**
1. User clicks language switcher
2. Save new locale to server cookie (`setLocaleServerFn`)
3. Reload page (`window.location.reload()`)
4. Root document reads locale from cookie and sets it (`setLocale(locale, { reload: false })`)
5. All translations use the new locale immediately
6. **No additional reload** because we passed `{ reload: false }` option

### 2. Performance Optimizations ✅

#### Homepage Optimizations
**Problem:** Heavy GSAP ScrollSmoother causing performance issues

**Solution:**
- ✅ Removed `ScrollSmoother` plugin (was causing unnecessary overhead)
- ✅ Kept only essential GSAP plugins: `ScrollToPlugin`, `ScrollTrigger`
- ✅ Moved GSAP plugin registration to `useEffect` (only runs once on client)
- ✅ Removed smooth wrapper divs that were only needed for ScrollSmoother
- ✅ Optimized background color calculation using `useMemo` instead of state + observer

#### Build Optimizations
**Added to vite.config.ts:**
- ✅ Code splitting with manual chunks for better caching:
  - `vendor-react`: React and React DOM
  - `vendor-tanstack`: TanStack Router, Start, Query
  - `vendor-gsap`: GSAP animations
  - `vendor-ui`: UI libraries (Framer Motion, Lucide icons)
- ✅ Minification settings optimized
- ✅ Dependencies pre-bundled for faster dev server startup

#### Router Optimizations
**Added to router.tsx:**
- ✅ `defaultPreload: false` - **DISABLED** due to incompatibility with server-side auth
  - Route preloading causes server functions to run without HTTP request context
  - Auth middleware can't read session cookies during preload
  - Navigation is still fast due to code splitting and other optimizations
- ✅ `defaultPreloadDelay: 100` - Delays preload (not used since preload is disabled)
- ✅ `defaultPreloadStaleTime: 0` - Always fetch fresh data
- ✅ `defaultStaleTime: 0` - Don't use stale cached data
- ✅ `defaultPendingMs: 100` - Small delay for smooth transitions
- ✅ `defaultPendingMinMs: 500` - Prevents flash of loading state for fast loads

**Protected routes:**
- ✅ Added error handling in root `beforeLoad` for when session can't be read
- ✅ Added toast throttling to prevent multiple auth error toasts
- ✅ Added detailed logging to help debug auth issues

### 3. Hydration Error Prevention ✅

**Potential Issues:**
- Theme mismatch between server and client
- Locale mismatch between server and client

**Solution:**
- ✅ Added `suppressHydrationWarning` to `<html>` and `<body>` tags
- ✅ Server now provides both theme and locale to prevent mismatches
- ✅ Both values come from cookies, ensuring SSR and client hydration match

### 4. Avatar Image Stretching ✅

**Problem:** Profile pictures and avatars were stretching and distorting, not maintaining proper aspect ratios

**Root Causes:**
1. Missing `object-cover` CSS class on avatar images
2. Non-square dimensions on some avatars (e.g., `h-34 w-48`)

**Solution:**
- ✅ Added `object-cover` to base `AvatarImage` component
- ✅ Fixed all non-square avatar dimensions to be square
- ✅ Images now maintain aspect ratio and crop properly to fit

**Changes:**
```typescript
// Before:
className={cn("aspect-square size-full", className)}

// After:
className={cn("aspect-square size-full object-cover", className)}
```

**Fixed Instances:**
- Profile header avatar: `h-34 w-48` → `h-32 w-32`
- Account header avatar: `h-34 w-48` → `h-32 w-32`
- All other avatars already had square dimensions

### 5. Comment Auto-Refresh ✅

**Problem:** After posting a comment on an event, users had to manually refresh the page to see their new comment

**Root Cause:**
- Comment was successfully saved to database
- Component state wasn't updated after mutation
- Router cache wasn't invalidated to refetch the event data

**Solution:**
- ✅ Added `useRouter()` hook to get router instance
- ✅ Call `router.invalidate()` after successful comment post
- ✅ This triggers a refetch of all route loaders, including event data with comments

**Updated Solution (Optimistic Updates):**
- ✅ Added local state to track optimistic comments (`useState<Comment[]>`)
- ✅ Immediately add new comment to UI before server response
- ✅ Merge optimistic comments with server comments using `useMemo`
- ✅ Replace temporary optimistic comment with real server data (with proper ID)
- ✅ Rollback optimistic comment if post fails
- ✅ Router invalidation happens in background (non-blocking)

**Final Implementation (No Page Refresh Required):**
```typescript
// Track optimistic comments
const [optimisticComments, setOptimisticComments] = useState<Comment[]>([]);

// Combine server + optimistic comments
const allComments = useMemo(() => {
  const serverComments = event.comments || [];
  // Filter out optimistic comments that are now in server data
  const optimisticOnly = optimisticComments.filter(
    opt => !serverComments.some(server => server.id === opt.id)
  );
  return [...serverComments, ...optimisticOnly];
}, [event.comments, optimisticComments]);

// After creating comment
const tempId = `temp-${crypto.randomUUID()}`; // Temporary ID for optimistic UI

// Create optimistic comment for UI (with temp ID)
const optimisticComment = { ...values, id: tempId, userId, eventId, ... };

// Create payload for server (without ID - server generates it)
const serverPayload = { content: values.content, eventId, userId };

setOptimisticComments(prev => [...prev, optimisticComment]); // Show immediately
form.reset();

// Then post to server with clean payload (no temp ID)
const response = await postCommentForEventFn({ data: serverPayload });
if (response && response.length > 0) {
  const serverComment = response[0]; // Get comment with real ID from server
  // Replace optimistic comment with server data
  setOptimisticComments(prev => {
    const filtered = prev.filter(c => c.id !== tempId);
    return [...filtered, serverComment];
  });
  router.invalidate(); // Background sync (non-blocking)
} else {
  // Remove optimistic comment on failure
  setOptimisticComments(prev => prev.filter(c => c.id !== tempId));
}
```

**Key Improvements:**
1. **Separate optimistic and server payloads** - UI uses temp ID, server gets clean data
2. **No validation errors** - Server receives only the fields it needs (content, eventId, userId)
3. **No setTimeout delays** - Uses temporary IDs and proper state replacement
4. **Router invalidation is non-blocking** - Happens in background without await
5. **Instant UI feedback** - Comment appears immediately with temp ID
6. **Server data integration** - Temp comment is replaced with real server data
7. **Automatic deduplication** - When server data arrives, optimistic duplicates are filtered out

**Result:**
- Comments appear **instantly** after posting
- No manual refresh or page reload required
- No timing-based workarounds (setTimeout)
- No validation errors from temp IDs
- Proper error handling with rollback
- Better user experience with optimistic UI

## Files Modified

1. **apps/web/src/services/ThemeService.ts**
   - Added `getLocaleServerFn()` - reads locale from cookie
   - Added `setLocaleServerFn()` - saves locale to cookie with 400-day expiry

2. **apps/web/src/routes/__root.tsx**
   - Updated loader to fetch locale from server
   - Changed `<html lang>` to use server-loaded locale
   - Added `suppressHydrationWarning` attributes
   - Added error handling for session read failures

3. **apps/web/src/components/shadcn/ui/shadcn-io/navbar-05/index.tsx**
   - Updated LanguageMenu to save locale to server cookie before switching
   - Changed navigation links from constant to function to fix translation hydration
   - Now `getNavigationLinks()` is called inside component for proper locale
   - Added `window.location.reload()` to apply language changes immediately
   - **Fixed**: Generate navigation links inside component body, not as default parameter
   - **Fixed**: Use `window.location.href = window.location.href` for hard reload (bypasses cache)
   - This ensures ALL components re-render with fresh translations after language switch

4. **apps/web/vite.config.ts**
   - Added cookie strategy (first priority)
   - Removed URL strategy to prevent `/sv/` paths
   - Added build optimizations (code splitting, minification)
   - Added dependency pre-bundling

5. **apps/web/src/routes/index.tsx**
   - Removed ScrollSmoother for better performance
   - Fixed theme access to use loader data instead of `useTheme` hook (fixes SSR error)
   - Optimized background color calculation with useMemo
   - Reduced unnecessary re-renders

6. **apps/web/src/router.tsx**
   - **DISABLED route preloading** (`defaultPreload: false`) due to auth incompatibility
   - Added route transition settings
   - Improved loading state handling

7. **apps/web/src/routes/(protected)/route.tsx**
   - Added detailed logging for debugging auth issues
   - Added toast throttling to prevent spam
   - Added `cause` parameter logging

8. **apps/web/src/components/event-components/create-event-card.tsx**
   - Lazy loaded Mapbox AddressAutofill component to fix SSR errors
   - Wrapped in Suspense with loading fallback

9. **apps/web/src/components/ClientOnly.tsx** (NEW)
   - Created client-only wrapper component for browser-dependent code

10. **apps/web/src/routes/__root.tsx** (Updated)
    - Added `setLocale()` call in `useEffect` to sync server locale with client
    - Prevents translation hydration mismatch (server renders one locale, client uses another)
    - **CRITICAL**: Pass `{ reload: false }` option to prevent infinite reload loop
    - `setLocale()` has `reload: true` by default which would trigger another reload

11. **apps/web/src/routes/index.tsx** (Homepage)
    - Removed `document` access in background color calculation
    - Simplified to only use theme from loader data
    - Prevents SSR errors when accessing DOM

12. **apps/web/src/routes/(protected)/event-map.tsx**
    - Lazy loaded `EventMap` component to prevent Mapbox SSR errors
    - Wrapped in `Suspense` with Spinner fallback
    - Mapbox imports `document` at module level, lazy loading delays this until client-side

13. **apps/web/src/components/shadcn/ui/avatar.tsx**
    - Added `object-cover` to `AvatarImage` to prevent image stretching
    - Ensures images maintain aspect ratio and fill the avatar properly

14. **apps/web/src/components/profile-components/profile-header.tsx**
    - Fixed avatar dimensions from `h-34 w-48` to `h-32 w-32` (square aspect ratio)
    - Prevents profile image stretching

15. **apps/web/src/components/accounts-components/accounts-header.tsx**
    - Fixed avatar dimensions from `h-34 w-48` to `h-32 w-32` (square aspect ratio)
    - Added `object-cover` class to AvatarImage for proper fit
    - Prevents user profile image stretching

16. **apps/web/src/components/event-components/event-comment-section.tsx** (NEW FIX)
    - Added `useRouter` hook to access router instance
    - Added `router.invalidate()` after successfully posting a comment
    - Comments now appear immediately without manual page refresh
    - Automatically refetches event data with updated comments list

## Testing Checklist

- [x] Language flash fixed - locale synced from server to client
- [x] Language switch applies immediately without manual refresh
- [x] No infinite refresh loop when switching languages
- [x] No SSR errors with Mapbox - lazy loaded properly
- [x] No theme SSR errors - removed document access
- [x] Navigation links use correct translations on initial render
- [x] Profile images don't stretch and maintain aspect ratio
- [x] All avatars are properly sized and circular
- [x] Comments appear instantly after posting (no page refresh needed)
- [ ] Switch language and refresh page - should maintain selected language
- [ ] No flash of English text when loading in Swedish (or vice versa)
- [ ] Homepage loads smoothly without jank
- [ ] No hydration errors in console
- [ ] Theme persists correctly across page loads
- [ ] Language persists correctly across page loads
- [ ] Event map loads without SSR errors
- [ ] Mapbox geocoder works properly
- [ ] Event markers display correctly
- [ ] User profile page displays avatar correctly
- [ ] Account page displays avatar correctly
- [ ] Comments roll back properly if posting fails

## Next Steps (Optional Further Optimizations)

1. **Image Optimization:**
   - Consider using WebP format for placeholder images
   - Add lazy loading to images below the fold
   - Use responsive images with srcset

2. **Data Fetching:**
   - Consider adding React Query with stale-while-revalidate
   - Implement pagination for events list
   - Add loading skeletons for better perceived performance

3. **CSS Optimization:**
   - Consider PurgeCSS to remove unused styles
   - Use critical CSS for above-the-fold content

4. **Monitoring:**
   - Add performance monitoring (e.g., Web Vitals)
   - Track Core Web Vitals: LCP, FID, CLS

## Common Issues & Solutions

### Issue: Getting redirected to `/sv/` or other locale paths

**Cause:** The "url" strategy in paraglide tries to add locale to URLs.

**Solution:** We've removed the "url" strategy from vite.config.ts. If you still see this:
1. Clear your browser cache and cookies for localhost
2. Clear localStorage: Open DevTools → Application → Local Storage → Clear
3. Delete the `PARAGLIDE_LOCALE` cookie
4. Restart the dev server

```bash
# Clear and restart
rm -rf .output node_modules/.vite
bun run dev
```

### Issue: "You must be signed in" toast appearing when already authenticated

**Root Cause:** Route preloading combined with server functions that rely on request context (`authMiddleware`). 

**The Actual Problem:**
1. `getSessionUserFn()` uses `authMiddleware` which reads session from HTTP request headers
2. Route preloading (`defaultPreload: 'intent'`) triggers `beforeLoad` functions without an actual HTTP request
3. Without request context, `authMiddleware` can't read the session → returns `null`
4. This makes the root `beforeLoad` think the user is unauthenticated
5. Protected routes then receive `IsAuthenticated: false` even though the user is logged in

**Evidence from logs:**
```
Root beforeLoad - User: Alieu Faal IsAuthenticated: true   ← Real navigation
Root beforeLoad - User: undefined IsAuthenticated: false   ← Preload without request
Protected route beforeLoad - context: IsAuthenticated: false ← Gets stale/false context
```

**Solution:** 
- ✅ **Disabled route preloading** (`defaultPreload: false`)
  - Preloading is incompatible with server functions that need request context
  - Navigation is still fast due to other optimizations
  
- ✅ **Added error handling** in root `beforeLoad`
  - Catches errors when session can't be read
  - Returns safe unauthenticated state instead of crashing
  
- ✅ **Kept toast throttling** (max once every 2 seconds)
  - Prevents spam if issue somehow still occurs

**Technical Details:**
- TanStack Start server functions need HTTP request context to read cookies/headers
- Route preloading happens client-side without making actual HTTP requests
- The `authMiddleware` can't access session during preload → returns null
- This is a fundamental incompatibility, not a timing issue
- Solution: Disable preloading or move auth to client-side state management

## Commands to Run

```bash
# Regenerate paraglide runtime with new cookie strategy
bun run machine-translate

# Clear build cache and rebuild
rm -rf .output node_modules/.vite
bun install
bun run build

# Start dev server to test
bun run dev
```

## Notes

- The locale cookie is set to expire in 400 days (matching paraglide default)
- Cookie is set with `path: "/"` to be accessible across all routes
- The strategy order ensures cookies take precedence over localStorage for SSR compatibility
