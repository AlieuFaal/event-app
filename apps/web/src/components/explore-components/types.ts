import type { EventWithComments } from "@vibespot/database/schema";

export type ExploreEvent = EventWithComments & {
  attendeeCount: number;
  isGoing: boolean;
  isStarred: boolean;
};

export type ExploreEventAction = (event: ExploreEvent) => void;

