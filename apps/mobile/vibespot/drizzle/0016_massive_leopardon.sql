ALTER TABLE "followers" DROP CONSTRAINT "followers_follower_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "following" DROP CONSTRAINT "following_following_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "followers" DROP CONSTRAINT "followers_user_id_follower_id_pk";--> statement-breakpoint
ALTER TABLE "following" DROP CONSTRAINT "following_user_id_following_id_pk";--> statement-breakpoint
ALTER TABLE "followers" ADD CONSTRAINT "followers_user_id_pk" PRIMARY KEY("user_id");--> statement-breakpoint
ALTER TABLE "following" ADD CONSTRAINT "following_user_id_pk" PRIMARY KEY("user_id");--> statement-breakpoint
ALTER TABLE "followers" DROP COLUMN "follower_id";--> statement-breakpoint
ALTER TABLE "following" DROP COLUMN "following_id";