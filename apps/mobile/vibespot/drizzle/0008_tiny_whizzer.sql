ALTER TABLE "comment" ADD COLUMN "replies" text;--> statement-breakpoint
ALTER TABLE "comment" ADD COLUMN "actions" text;--> statement-breakpoint
ALTER TABLE "comment" ADD COLUMN "selected_actions" text;--> statement-breakpoint
ALTER TABLE "comment" ADD COLUMN "allow_upvote" boolean NOT NULL;