ALTER TABLE "user" ADD COLUMN "followers" uuid[] DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "following" uuid[] DEFAULT '{}' NOT NULL;