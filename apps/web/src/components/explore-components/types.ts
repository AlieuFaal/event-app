import type { getExploreEventsFn } from "@/services/eventService";
import type {
  getSessionUserFn,
  getUserDataFn,
} from "@/services/user-service";

export type ExploreEvent = Awaited<ReturnType<typeof getExploreEventsFn>>[number];
export type ExploreCurrentUser = Awaited<ReturnType<typeof getSessionUserFn>>;
export type ExploreUser = Awaited<ReturnType<typeof getUserDataFn>>[number];

export type ExploreEventAction = (event: ExploreEvent) => void;
