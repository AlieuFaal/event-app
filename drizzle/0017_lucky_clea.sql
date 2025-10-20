ALTER TABLE "followers" DROP CONSTRAINT "followers_user_id_pk";--> statement-breakpoint
ALTER TABLE "following" DROP CONSTRAINT "following_user_id_pk";--> statement-breakpoint
ALTER TABLE "followers" ADD COLUMN "follower_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "following" ADD COLUMN "following_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "followers" ADD CONSTRAINT "followers_user_id_follower_id_pk" PRIMARY KEY("user_id","follower_id");--> statement-breakpoint
ALTER TABLE "following" ADD CONSTRAINT "following_user_id_following_id_pk" PRIMARY KEY("user_id","following_id");--> statement-breakpoint
ALTER TABLE "followers" ADD CONSTRAINT "followers_follower_id_user_id_fk" FOREIGN KEY ("follower_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "following" ADD CONSTRAINT "following_following_id_user_id_fk" FOREIGN KEY ("following_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
