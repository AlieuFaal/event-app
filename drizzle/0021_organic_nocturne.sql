ALTER TABLE "event" ALTER COLUMN "color" SET DEFAULT 'Blue';--> statement-breakpoint
ALTER TABLE "event" ADD COLUMN "genre" text DEFAULT 'Indie' NOT NULL;