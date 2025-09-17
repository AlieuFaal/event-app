ALTER TABLE "user" DROP CONSTRAINT "role_check";--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "role" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "role" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "role_check" CHECK ("user"."role" in ('user','artist','admin','null'));