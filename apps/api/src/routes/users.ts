import { zValidator } from "@hono/zod-validator";
import {
	and,
	count,
	db,
	eq,
	onbFormUpdateSchema,
	roleUpdateSchema,
	schema,
	userFormSchema,
} from "@vibespot/database";
import type { AuthType } from "@vibespot/database/src/auth";
import { Hono } from "hono";
import z from "zod";

const userIdParamSchema = z.object({
	id: z.uuid(),
});

const sanitizeUserForViewer = (
	user: typeof schema.user.$inferSelect,
	viewerId: string,
) => {
	if (user.id === viewerId) {
		return user;
	}

	return {
		...user,
		email: "",
		phone: null,
		location: null,
	};
};

const getUserSocialStats = async (userId: string, viewerId: string) => {
	const [followersCount, followingCount, eventsCount, followingRecord] =
		await Promise.all([
			db
				.select({ value: count() })
				.from(schema.followersTable)
				.where(eq(schema.followersTable.userId, userId))
				.then((result) => result[0]?.value ?? 0),
			db
				.select({ value: count() })
				.from(schema.followingTable)
				.where(eq(schema.followingTable.userId, userId))
				.then((result) => result[0]?.value ?? 0),
			db
				.select({ value: count() })
				.from(schema.event)
				.where(eq(schema.event.userId, userId))
				.then((result) => result[0]?.value ?? 0),
			db
				.select({ userId: schema.followersTable.userId })
				.from(schema.followersTable)
				.where(
					and(
						eq(schema.followersTable.userId, userId),
						eq(schema.followersTable.followerId, viewerId),
					),
				)
				.limit(1)
				.then((result) => result[0]),
		]);

	return {
		followersCount,
		followingCount,
		eventsCount,
		isFollowing: Boolean(followingRecord),
	};
};

const getUserById = async (userId: string) => {
	return db
		.select()
		.from(schema.user)
		.where(eq(schema.user.id, userId))
		.limit(1)
		.then((res) => res[0]);
};

const app = new Hono<{ Variables: AuthType }>()
	.get("/", async (c) => {
		const sessionUserId = c.var.user?.id;

		if (!sessionUserId) {
			return c.json({ error: "User not authenticated" }, 401);
		}

		const userById = await db
			.select()
			.from(schema.user)
			.where(eq(schema.user.id, sessionUserId))
			.limit(1)
			.then((result) => result[0]);

		if (!userById) {
			return c.json({ error: "User not found" }, 404);
		}

		return c.json(userById);
	})
	.get("/:id", zValidator("param", userIdParamSchema), async (c) => {
		const sessionUserId = c.var.user?.id;
		const { id: userId } = c.req.valid("param");

		if (!sessionUserId) {
			return c.json({ error: "User not authenticated" }, 401);
		}

		const userById = await getUserById(userId);

		if (!userById) {
			return c.json({ error: "User not found" }, 404);
		}

		const socialStats = await getUserSocialStats(userId, sessionUserId);

		return c.json({
			...sanitizeUserForViewer(userById, sessionUserId),
			...socialStats,
		});
	})
	.get(
		"/:id/follow-status",
		zValidator("param", userIdParamSchema),
		async (c) => {
			const sessionUserId = c.var.user?.id;
			const { id: userId } = c.req.valid("param");

			if (!sessionUserId) {
				return c.json({ error: "User not authenticated" }, 401);
			}

			const userById = await getUserById(userId);

			if (!userById) {
				return c.json({ error: "User not found" }, 404);
			}

			const followingRecord = await db
				.select({ userId: schema.followersTable.userId })
				.from(schema.followersTable)
				.where(
					and(
						eq(schema.followersTable.userId, userId),
						eq(schema.followersTable.followerId, sessionUserId),
					),
				)
				.limit(1)
				.then((result) => result[0]);

			return c.json({ isFollowing: Boolean(followingRecord) });
		},
	)
	.post("/:id/follow", zValidator("param", userIdParamSchema), async (c) => {
		const sessionUserId = c.var.user?.id;
		const { id: userId } = c.req.valid("param");

		if (!sessionUserId) {
			return c.json({ error: "User not authenticated" }, 401);
		}

		if (sessionUserId === userId) {
			return c.json({ error: "You cannot follow yourself" }, 400);
		}

		const userById = await getUserById(userId);

		if (!userById) {
			return c.json({ error: "User not found" }, 404);
		}

		await db.transaction(async (tx) => {
			await tx
				.insert(schema.followersTable)
				.values({
					userId,
					followerId: sessionUserId,
				})
				.onConflictDoNothing();

			await tx
				.insert(schema.followingTable)
				.values({
					userId: sessionUserId,
					followingId: userId,
				})
				.onConflictDoNothing();
		});

		return c.json({ isFollowing: true });
	})
	.delete("/:id/follow", zValidator("param", userIdParamSchema), async (c) => {
		const sessionUserId = c.var.user?.id;
		const { id: userId } = c.req.valid("param");

		if (!sessionUserId) {
			return c.json({ error: "User not authenticated" }, 401);
		}

		if (sessionUserId === userId) {
			return c.json({ error: "You cannot unfollow yourself" }, 400);
		}

		const userById = await getUserById(userId);

		if (!userById) {
			return c.json({ error: "User not found" }, 404);
		}

		await db.transaction(async (tx) => {
			await tx
				.delete(schema.followersTable)
				.where(
					and(
						eq(schema.followersTable.userId, userId),
						eq(schema.followersTable.followerId, sessionUserId),
					),
				);

			await tx
				.delete(schema.followingTable)
				.where(
					and(
						eq(schema.followingTable.userId, sessionUserId),
						eq(schema.followingTable.followingId, userId),
					),
				);
		});

		return c.json({ isFollowing: false });
	})
	.get("/:id/followers", zValidator("param", userIdParamSchema), async (c) => {
		const sessionUserId = c.var.user?.id;
		const { id: userId } = c.req.valid("param");

		if (!sessionUserId) {
			return c.json({ error: "User not authenticated" }, 401);
		}

		const followers = await db
			.select({
				id: schema.user.id,
				name: schema.user.name,
				image: schema.user.image,
				bio: schema.user.bio,
			})
			.from(schema.followersTable)
			.innerJoin(
				schema.user,
				eq(schema.followersTable.followerId, schema.user.id),
			)
			.where(eq(schema.followersTable.userId, userId));

		return c.json(followers);
	})
	.get("/:id/following", zValidator("param", userIdParamSchema), async (c) => {
		const sessionUserId = c.var.user?.id;
		const { id: userId } = c.req.valid("param");

		if (!sessionUserId) {
			return c.json({ error: "User not authenticated" }, 401);
		}

		const following = await db
			.select({
				id: schema.user.id,
				name: schema.user.name,
				image: schema.user.image,
				bio: schema.user.bio,
			})
			.from(schema.followingTable)
			.innerJoin(
				schema.user,
				eq(schema.followingTable.followingId, schema.user.id),
			)
			.where(eq(schema.followingTable.userId, userId));

		return c.json(following);
	})
	.get("/:id/export", zValidator("param", userIdParamSchema), async (c) => {
		const sessionUserId = c.var.user?.id;
		const { id: userId } = c.req.valid("param");

		if (!sessionUserId) {
			return c.json({ error: "User not authenticated" }, 401);
		}

		if (sessionUserId !== userId) {
			return c.json({ error: "Forbidden" }, 403);
		}

		const userById = await db
			.select()
			.from(schema.user)
			.where(eq(schema.user.id, sessionUserId))
			.limit(1)
			.then((result) => result[0]);

		if (!userById) {
			return c.json({ error: "User not found" }, 404);
		}

		const ownedEvents = await db
			.select()
			.from(schema.event)
			.where(eq(schema.event.userId, sessionUserId))
			.orderBy(schema.event.startDate);

		const favoriteEvents = await db
			.select({
				favoriteCreatedAt: schema.favoriteEvent.createdAt,
				eventId: schema.event.id,
				title: schema.event.title,
				description: schema.event.description,
				venue: schema.event.venue,
				address: schema.event.address,
				startDate: schema.event.startDate,
				endDate: schema.event.endDate,
				genre: schema.event.genre,
				color: schema.event.color,
				imageUrl: schema.event.imageUrl,
				ownerId: schema.event.userId,
			})
			.from(schema.favoriteEvent)
			.innerJoin(
				schema.event,
				eq(schema.favoriteEvent.eventId, schema.event.id),
			)
			.where(eq(schema.favoriteEvent.userId, sessionUserId))
			.orderBy(schema.favoriteEvent.createdAt);

		return c.json({
			exportedAt: new Date().toISOString(),
			user: userById,
			events: {
				owned: ownedEvents,
				favorites: favoriteEvents,
			},
		});
	})
	.put(
		"/updateroletouser/:id",
		zValidator("param", userIdParamSchema),
		async (c) => {
			const sessionUserId = c.var.user?.id;
			const { id: userId } = c.req.valid("param");

			if (!sessionUserId) {
				return c.json({ error: "User not authenticated" }, 401);
			}

			if (sessionUserId !== userId) {
				return c.json({ error: "Forbidden" }, 403);
			}

			const result = await db
				.update(schema.user)
				.set({
					role: "user",
				})
				.where(eq(schema.user.id, sessionUserId))
				.returning();

			return c.json(result[0]);
		},
	)
	.put(
		"/updateroletoartist/:id",
		zValidator("param", userIdParamSchema),
		async (c) => {
			const sessionUserId = c.var.user?.id;
			const { id: userId } = c.req.valid("param");

			if (!sessionUserId) {
				return c.json({ error: "User not authenticated" }, 401);
			}

			if (sessionUserId !== userId) {
				return c.json({ error: "Forbidden" }, 403);
			}

			const result = await db
				.update(schema.user)
				.set({
					role: "artist",
				})
				.where(eq(schema.user.id, sessionUserId))
				.returning();

			return c.json(result[0]);
		},
	)
	.put(
		"/updaterole/:id",
		zValidator("param", userIdParamSchema),
		zValidator("json", roleUpdateSchema),
		async (c) => {
			const sessionUserId = c.var.user?.id;
			const { id: userId } = c.req.valid("param");
			const data = c.req.valid("json");

			if (!sessionUserId) {
				return c.json({ error: "User not authenticated" }, 401);
			}

			if (sessionUserId !== userId) {
				return c.json({ error: "Forbidden" }, 403);
			}

			const result = await db
				.update(schema.user)
				.set({
					role: data.role,
				})
				.where(eq(schema.user.id, sessionUserId))
				.returning();

			return c.json(result[0]);
		},
	)
	.put(
		"/updateonboardinginfo/:id",
		zValidator("param", userIdParamSchema),
		zValidator("json", onbFormUpdateSchema),
		async (c) => {
			const sessionUserId = c.var.user?.id;
			const { id: userId } = c.req.valid("param");
			const data = c.req.valid("json");

			if (!sessionUserId) {
				return c.json({ error: "User not authenticated" }, 401);
			}

			if (sessionUserId !== userId) {
				return c.json({ error: "Forbidden" }, 403);
			}

			const result = await db
				.update(schema.user)
				.set({
					phone: data.phone,
					location: data.location,
				})
				.where(eq(schema.user.id, sessionUserId))
				.returning();

			return c.json(result[0]);
		},
	)
	.put(
		"/updateprofile/:id",
		zValidator("param", userIdParamSchema),
		zValidator("json", userFormSchema),
		async (c) => {
			const sessionUserId = c.var.user?.id;
			const { id: userId } = c.req.valid("param");
			const data = c.req.valid("json");

			if (!sessionUserId) {
				return c.json({ error: "User not authenticated" }, 401);
			}

			if (sessionUserId !== userId) {
				return c.json({ error: "Forbidden" }, 403);
			}

			const result = await db
				.update(schema.user)
				.set({
					name: data.name,
					phone: data.phone,
					location: data.location,
					bio: data.bio,
					image: data.image,
				})
				.where(eq(schema.user.id, sessionUserId))
				.returning();

			return c.json(result[0]);
		},
	);

export default app;
