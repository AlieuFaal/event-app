CREATE INDEX "comment_event_id_created_at_idx" ON "comment" USING btree ("event_id","created_at");--> statement-breakpoint
CREATE INDEX "event_end_date_start_date_idx" ON "event" USING btree ("end_date","start_date");--> statement-breakpoint
CREATE INDEX "event_user_id_start_date_idx" ON "event" USING btree ("user_id","start_date");--> statement-breakpoint
CREATE INDEX "event_repeat_group_id_idx" ON "event" USING btree ("repeat_group_id");