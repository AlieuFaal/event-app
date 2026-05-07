import type { Event } from "@vibespot/database/schema";

export type EventWithAttendance = Event & {
  attendeeCount: number;
  isGoing: boolean;
};
