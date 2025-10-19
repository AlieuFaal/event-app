import { relations } from "drizzle-orm/relations";
import { user, comment, event, session, account, followers, following, favoriteEvent } from "./schema";

export const commentRelations = relations(comment, ({one}) => ({
	user: one(user, {
		fields: [comment.userId],
		references: [user.id]
	}),
	event: one(event, {
		fields: [comment.eventId],
		references: [event.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	comments: many(comment),
	events: many(event),
	sessions: many(session),
	accounts: many(account),
	followers_userId: many(followers, {
		relationName: "followers_userId_user_id"
	}),
	followers_followerId: many(followers, {
		relationName: "followers_followerId_user_id"
	}),
	followings_userId: many(following, {
		relationName: "following_userId_user_id"
	}),
	followings_followingId: many(following, {
		relationName: "following_followingId_user_id"
	}),
	favoriteEvents: many(favoriteEvent),
}));

export const eventRelations = relations(event, ({one, many}) => ({
	comments: many(comment),
	user: one(user, {
		fields: [event.userId],
		references: [user.id]
	}),
	favoriteEvents: many(favoriteEvent),
}));

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));

export const followersRelations = relations(followers, ({one}) => ({
	user_userId: one(user, {
		fields: [followers.userId],
		references: [user.id],
		relationName: "followers_userId_user_id"
	}),
	user_followerId: one(user, {
		fields: [followers.followerId],
		references: [user.id],
		relationName: "followers_followerId_user_id"
	}),
}));

export const followingRelations = relations(following, ({one}) => ({
	user_userId: one(user, {
		fields: [following.userId],
		references: [user.id],
		relationName: "following_userId_user_id"
	}),
	user_followingId: one(user, {
		fields: [following.followingId],
		references: [user.id],
		relationName: "following_followingId_user_id"
	}),
}));

export const favoriteEventRelations = relations(favoriteEvent, ({one}) => ({
	user: one(user, {
		fields: [favoriteEvent.userId],
		references: [user.id]
	}),
	event: one(event, {
		fields: [favoriteEvent.eventId],
		references: [event.id]
	}),
}));