ALTER TABLE "user" DROP CONSTRAINT "role_check";--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'New User';--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "role_check" CHECK ("user"."role" in ('user','artist','admin','New User'));