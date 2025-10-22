ALTER TABLE "calendar_event" DROP CONSTRAINT "calendar_event_id_event_id_fk";
--> statement-breakpoint
ALTER TABLE "calendar_event" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "calendar_event" ADD COLUMN "event_id" uuid;--> statement-breakpoint
ALTER TABLE "calendar_event" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "calendar_event" ADD CONSTRAINT "calendar_event_event_id_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE cascade ON UPDATE no action;