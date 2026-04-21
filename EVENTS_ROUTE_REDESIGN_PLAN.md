# Events Route Redesign Plan

## Problem
The current `/events` route has oversized, dated UI patterns (hero card, search bar, event cards) and weak hierarchy. The event dialog redesign should remain untouched.

## Visual direction
**Editorial nightlife aesthetic**: compact, modern, playful, and sleek. The hero should bleed into page background in light/dark modes. Preserve current purple-led base palette for now.

## Scope
- Redesign route-level composition and hierarchy
- Redesign event page hero/search/filter block
- Redesign event list cards and month section styling
- Keep event dialog redesign intact (already done)

## Files
- `apps/web/src/routes/(protected)/events.tsx`
- `apps/web/src/components/event-components/event-page-header.tsx`
- `apps/web/src/components/event-components/filter.tsx`
- `apps/web/src/components/event-components/event-list.tsx`
- `apps/web/src/components/event-components/event-cards.tsx`
- `apps/web/src/components/event-components/event-card.tsx` (list card UI area only)

## Implementation steps
1. Refactor events page layout and spacing.
2. Replace hero card with a blended/bleeding hero section.
3. Integrate compact search and filter placement in header flow.
4. Redesign event cards with cleaner hierarchy, icons, and subtle accent use.
5. Redesign month group headers/separators and improve vertical rhythm.
6. Add subtle event-color accents in card UI details.
7. Verify responsive behavior and run web checks.

## Constraints
- Keep month-grouped sections.
- Keep all existing route data loading and event actions working.
- No `any` types.

## Environment note
Playwright review used `http://localhost:3001` because `localhost:3000` is occupied in this environment.
