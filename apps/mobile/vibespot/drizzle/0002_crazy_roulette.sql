ALTER TABLE "calendar_event" DROP CONSTRAINT "calendar_event_event_id_event_id_fk";
--> statement-breakpoint
ALTER TABLE "calendar_event" DROP COLUMN "event_id";