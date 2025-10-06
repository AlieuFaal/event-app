import { pgTable, foreignKey, uuid, text, timestamp, unique, check, boolean, primaryKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const comment = pgTable("comment", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	eventId: uuid("event_id").notNull(),
	content: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "comment_user_id_user_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.eventId],
			foreignColumns: [event.id],
			name: "comment_event_id_event_id_fk"
		}).onDelete("cascade"),
]);

export const event = pgTable("event", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	title: text().notNull(),
	description: text().notNull(),
	venue: text(),
	address: text().notNull(),
	color: text().default('blue').notNull(),
	startDate: timestamp("start_date", { mode: 'string' }).notNull(),
	endDate: timestamp("end_date", { mode: 'string' }).notNull(),
	userId: uuid("user_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	latitude: text().notNull(),
	longitude: text().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "event_user_id_user_id_fk"
		}).onDelete("cascade"),
]);

export const verification = pgTable("verification", {
	id: uuid().primaryKey().notNull(),
	identifier: text().notNull(),
	value: text().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
});

export const user = pgTable("user", {
	id: uuid().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	emailVerified: boolean("email_verified").notNull(),
	phone: text(),
	image: text(),
	location: text(),
	bio: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
	role: text().default('New User').notNull(),
}, (table) => [
	unique("user_email_unique").on(table.email),
	check("role_check", sql`role = ANY (ARRAY['user'::text, 'artist'::text, 'admin'::text, 'New User'::text])`),
]);

export const session = pgTable("session", {
	id: uuid().primaryKey().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	token: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: uuid("user_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "session_user_id_user_id_fk"
		}).onDelete("cascade"),
	unique("session_token_unique").on(table.token),
]);

export const account = pgTable("account", {
	id: uuid().primaryKey().notNull(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: uuid("user_id").notNull(),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at", { mode: 'string' }),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { mode: 'string' }),
	scope: text(),
	password: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "account_user_id_user_id_fk"
		}).onDelete("cascade"),
]);

export const followers = pgTable("followers", {
	userId: uuid("user_id").notNull(),
	followerId: uuid("follower_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "followers_user_id_user_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.followerId],
			foreignColumns: [user.id],
			name: "followers_follower_id_user_id_fk"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.userId, table.followerId], name: "followers_user_id_follower_id_pk"}),
]);

export const following = pgTable("following", {
	userId: uuid("user_id").notNull(),
	followingId: uuid("following_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "following_user_id_user_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.followingId],
			foreignColumns: [user.id],
			name: "following_following_id_user_id_fk"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.userId, table.followingId], name: "following_user_id_following_id_pk"}),
]);

export const favoriteEvent = pgTable("favorite_event", {
	userId: uuid("user_id").notNull(),
	eventId: uuid("event_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "favorite_event_user_id_user_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.eventId],
			foreignColumns: [event.id],
			name: "favorite_event_event_id_event_id_fk"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.userId, table.eventId], name: "favorite_event_user_id_event_id_pk"}),
]);
