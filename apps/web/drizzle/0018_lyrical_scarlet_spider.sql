ALTER TABLE "event" RENAME COLUMN "location" TO "address";--> statement-breakpoint
ALTER TABLE "event" ADD COLUMN "venue" text;--> statement-breakpoint
ALTER TABLE "event" ADD COLUMN "latitude" text;--> statement-breakpoint
ALTER TABLE "event" ADD COLUMN "longitude" text;