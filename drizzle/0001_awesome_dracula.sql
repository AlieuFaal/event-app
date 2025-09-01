ALTER TABLE "event" ALTER COLUMN "start_date" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "event" ALTER COLUMN "end_date" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "event" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;