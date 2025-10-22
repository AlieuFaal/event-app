ALTER TABLE "event" ALTER COLUMN "description" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "event" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "event" ADD COLUMN "color" text DEFAULT 'blue' NOT NULL;