import { zValidator } from "@hono/zod-validator";
import { and, db, eq, schema } from "@vibespot/database";
import type { AuthType } from "@vibespot/database/src/auth";
import { eventInsertSchema } from "@vibespot/validation";
import { count, gte, inArray } from "drizzle-orm";
import { Hono } from "hono";
import z from "zod";
import {
	addInterval,
	customRepeatEndDate,
} from "../helpers/repeatedEventHelpers";

async function addAttendanceState<T extends typeof schema.event.$inferSelect>(
	events: T[],
	userId: string,
) {
	if (events.length === 0) return [];

	const eventIds = events.map((event) => event.id);

	const attendanceCounts = await db
		.select({
			eventId: schema.eventAttendance.eventId,
			attendeeCount: count(),
		})
		.from(schema.eventAttendance)
		.where(inArray(schema.eventAttendance.eventId, eventIds))
		.groupBy(schema.eventAttendance.eventId);

	const currentUserAttendance = await db
		.select({ eventId: schema.eventAttendance.eventId })
		.from(schema.eventAttendance)
		.where(
			and(
				eq(schema.eventAttendance.userId, userId),
				inArray(schema.eventAttendance.eventId, eventIds),
			),
		);

	const countByEventId = new Map(
		attendanceCounts.map((row) => [row.eventId, row.attendeeCount]),
	);
	const currentUserEventIds = new Set(
		currentUserAttendance.map((row) => row.eventId),
	);

	return events.map((event) => ({
		...event,
		attendeeCount: countByEventId.get(event.id) ?? 0,
		isGoing: currentUserEventIds.has(event.id),
	}));
}

async function getEventComments(eventId: string) {
	return db
		.select({
			id: schema.comment.id,
			userId: schema.comment.userId,
			eventId: schema.comment.eventId,
			content: schema.comment.content,
			createdAt: schema.comment.createdAt,
			updatedAt: schema.comment.updatedAt,
			user: {
				id: schema.user.id,
				name: schema.user.name,
				image: schema.user.image,
			},
		})
		.from(schema.comment)
		.innerJoin(schema.user, eq(schema.comment.userId, schema.user.id))
		.where(eq(schema.comment.eventId, eventId))
		.orderBy(schema.comment.createdAt);
}

const commentCreateSchema = z.object({
	content: z.string().trim().min(1, "Please enter your comment").max(1000),
});

const app = new Hono<{ Variables: AuthType }>()
	.get("/", async (c) => {
		const userId = c.var.user?.id;

		if (!userId) {
			return c.json({ error: "User not authenticated" }, 401);
		}
		const now = new Date();

		const events = await db
			.select()
			.from(schema.event)
			.where(
				gte(
					schema.event.endDate,
					new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
				),
			)
			.orderBy(schema.event.startDate);

		return c.json(await addAttendanceState(events, userId));
	})
	.get("/my", async (c) => {
		const userId = c.var.user?.id;

		if (!userId) {
			return c.json({ error: "User not authenticated" }, 401);
		}

		const events = await db
			.select()
			.from(schema.event)
			.where(eq(schema.event.userId, userId))
			.orderBy(schema.event.startDate);

		return c.json(events);
	})
	.get("/:id", zValidator("param", z.object({ id: z.uuid() })), async (c) => {
		const { id: eventId } = c.req.valid("param");
		const userId = c.var.user?.id;

		if (!userId) {
			return c.json({ error: "User not authenticated" }, 401);
		}

		const eventById = await db
			.select()
			.from(schema.event)
			.where(eq(schema.event.id, eventId))
			.limit(1)
			.then((res) => res[0]);

		if (!eventById) {
			return c.json({ error: "Event not found" }, 404);
		}

		const [eventWithAttendance] = await addAttendanceState([eventById], userId);
		const comments = await getEventComments(eventId);

		return c.json({
			...eventWithAttendance,
			comments,
		});
	})
	.get(
		"/:eventId/comments",
		zValidator("param", z.object({ eventId: z.uuid() })),
		async (c) => {
			const { eventId } = c.req.valid("param");
			const userId = c.var.user?.id;

			if (!userId) {
				return c.json({ error: "User not authenticated" }, 401);
			}

			const eventById = await db
				.select({ id: schema.event.id })
				.from(schema.event)
				.where(eq(schema.event.id, eventId))
				.limit(1)
				.then((res) => res[0]);

			if (!eventById) {
				return c.json({ error: "Event not found" }, 404);
			}

			return c.json(await getEventComments(eventId));
		},
	)
	.post(
		"/:eventId/comments",
		zValidator("param", z.object({ eventId: z.uuid() })),
		zValidator("json", commentCreateSchema),
		async (c) => {
			const { eventId } = c.req.valid("param");
			const { content } = c.req.valid("json");
			const userId = c.var.user?.id;

			if (!userId) {
				return c.json({ error: "User not authenticated" }, 401);
			}

			const eventById = await db
				.select({ id: schema.event.id })
				.from(schema.event)
				.where(eq(schema.event.id, eventId))
				.limit(1)
				.then((res) => res[0]);

			if (!eventById) {
				return c.json({ error: "Event not found" }, 404);
			}

			await db.insert(schema.comment).values({
				userId,
				eventId,
				content,
				createdAt: new Date(),
				updatedAt: new Date(),
			});

			return c.json(await getEventComments(eventId));
		},
	)
	.get(
		"/favorites/:userid",
		zValidator("param", z.object({ userid: z.uuid() })),
		async (c) => {
			const sessionUserId = c.var.user?.id;
			const { userid } = c.req.valid("param");

			if (!sessionUserId) {
				return c.json({ error: "User not authenticated" }, 401);
			}

			if (sessionUserId !== userid) {
				return c.json({ error: "Forbidden" }, 403);
			}

			const favoriteEvents = await db
				.select()
				.from(schema.event)
				.innerJoin(
					schema.favoriteEvent,
					eq(schema.event.id, schema.favoriteEvent.eventId),
				)
				.where(
					and(
						eq(schema.favoriteEvent.userId, sessionUserId),
						gte(schema.event.endDate, new Date()),
					),
				)
				.orderBy(schema.event.startDate);

			return c.json(favoriteEvents);
		},
	)
	.post(
		"/favorites/:eventId",
		zValidator("param", z.object({ eventId: z.uuid() })),
		async (c) => {
			const { eventId } = c.req.valid("param");

			const userId = c.var.user?.id;

			if (!userId) {
				return c.json({ error: "User not authenticated" }, 401);
			}

			const [isFavoriteExisting] = await db
				.select()
				.from(schema.favoriteEvent)
				.where(
					and(
						eq(schema.favoriteEvent.userId, userId),
						eq(schema.favoriteEvent.eventId, eventId),
					),
				)
				.limit(1);

			if (isFavoriteExisting) {
				const savedEvent = await db
					.delete(schema.favoriteEvent)
					.where(
						and(
							eq(schema.favoriteEvent.userId, userId),
							eq(schema.favoriteEvent.eventId, eventId),
						),
					)
					.returning();

				return c.json(savedEvent);
			}

			const newFavorite = await db
				.insert(schema.favoriteEvent)
				.values({
					userId: userId,
					eventId: eventId,
					createdAt: new Date(),
				})
				.returning();

			return c.json(newFavorite);
		},
	)
	.post(
		"/:eventId/attendance",
		zValidator("param", z.object({ eventId: z.uuid() })),
		async (c) => {
			const { eventId } = c.req.valid("param");
			const userId = c.var.user?.id;

			if (!userId) {
				return c.json({ error: "User not authenticated" }, 401);
			}

			const eventById = await db
				.select()
				.from(schema.event)
				.where(eq(schema.event.id, eventId))
				.limit(1)
				.then((res) => res[0]);

			if (!eventById) {
				return c.json({ error: "Event not found" }, 404);
			}

			const [existingAttendance] = await db
				.select()
				.from(schema.eventAttendance)
				.where(
					and(
						eq(schema.eventAttendance.userId, userId),
						eq(schema.eventAttendance.eventId, eventId),
					),
				)
				.limit(1);

			if (existingAttendance) {
				await db
					.delete(schema.eventAttendance)
					.where(
						and(
							eq(schema.eventAttendance.userId, userId),
							eq(schema.eventAttendance.eventId, eventId),
						),
					);

				const [eventWithAttendance] = await addAttendanceState(
					[eventById],
					userId,
				);

				return c.json(eventWithAttendance);
			}

			if (eventById.endDate < new Date()) {
				return c.json({ error: "Cannot RSVP to past events" }, 400);
			}

			await db.insert(schema.eventAttendance).values({
				userId,
				eventId,
				createdAt: new Date(),
			});

			const [eventWithAttendance] = await addAttendanceState(
				[eventById],
				userId,
			);

			return c.json(eventWithAttendance);
		},
	)
	.post("/events", zValidator("json", eventInsertSchema), async (c) => {
		const eventData = c.req.valid("json");
		const repeat = eventData.repeat;

		const userId = c.var.user?.id;

		if (!userId) {
			return c.json({ error: "User not authenticated" }, 401);
		}

		const sessionUser = await db
			.select({ role: schema.user.role })
			.from(schema.user)
			.where(eq(schema.user.id, userId))
			.limit(1)
			.then((result) => result[0]);

		if (!sessionUser) {
			return c.json({ error: "User not found" }, 404);
		}

		if (sessionUser.role !== "artist" && sessionUser.role !== "admin") {
			return c.json({ error: "Only artists can create events" }, 403);
		}

		const startDate = new Date(eventData.startDate);
		const endDate = new Date(eventData.endDate);
		const repeatEndDate = eventData.repeatEndDate
			? new Date(eventData.repeatEndDate)
			: null;

		try {
			if (repeat === "none" || !repeat) {
				const newEvent = await db
					.insert(schema.event)
					.values({
						title: eventData.title,
						description: eventData.description,
						venue: eventData.venue,
						address: eventData.address,
						color: eventData.color,
						genre: eventData.genre,
						repeat: "none",
						repeatGroupId: null,
						repeatEndDate: null,
						startDate: startDate,
						endDate: endDate,
						latitude: eventData.latitude,
						longitude: eventData.longitude,
						userId: userId,
						createdAt: new Date(),
						imageUrl: eventData.imageUrl,
					})
					.returning();

				return c.json(newEvent);
			}

			const repeatGroupId = crypto.randomUUID();
			const calculatedRepeatEndDate = customRepeatEndDate(
				startDate,
				repeat,
				repeatEndDate,
			);
			const maxOccurrences = 500;
			const repeatedEvents: Array<(typeof schema.event.$inferSelect)[]> = [];

			const result = await db.transaction(async (tx) => {
				const initialRepeatedEvent = await tx
					.insert(schema.event)
					.values({
						title: eventData.title,
						description: eventData.description,
						venue: eventData.venue,
						address: eventData.address,
						color: eventData.color,
						genre: eventData.genre,
						repeat: eventData.repeat,
						repeatGroupId: repeatGroupId,
						repeatEndDate: calculatedRepeatEndDate,
						startDate: startDate,
						endDate: endDate,
						latitude: eventData.latitude,
						longitude: eventData.longitude,
						userId: userId,
						createdAt: new Date(),
						imageUrl: eventData.imageUrl,
					})
					.returning();

				let nextStartDate = addInterval(startDate, repeat);
				let nextEndDate = addInterval(endDate, repeat);
				let count = 0;

				while (
					nextStartDate <= calculatedRepeatEndDate &&
					count < maxOccurrences
				) {
					const repeatedEvent = await tx
						.insert(schema.event)
						.values({
							title: eventData.title,
							description: eventData.description,
							venue: eventData.venue,
							address: eventData.address,
							color: eventData.color,
							genre: eventData.genre,
							repeat: repeat,
							repeatGroupId: repeatGroupId,
							repeatEndDate: calculatedRepeatEndDate,
							startDate: nextStartDate,
							endDate: nextEndDate,
							latitude: eventData.latitude,
							longitude: eventData.longitude,
							userId: userId,
							createdAt: new Date(),
							imageUrl: eventData.imageUrl,
						})
						.returning();

					repeatedEvents.push(repeatedEvent);
					nextStartDate = addInterval(nextStartDate, repeat);
					nextEndDate = addInterval(nextEndDate, repeat);
					count++;
				}

				return [initialRepeatedEvent, ...repeatedEvents];
			});

			return c.json(result);
		} catch (error) {
			console.error("Error inserting event:", error);
			return c.json({ error: "Failed to create event" }, 500);
		}
	})
	.delete(
		"/:id",
		zValidator("param", z.object({ id: z.uuid() })),
		async (c) => {
			const { id: eventId } = c.req.valid("param");
			const userId = c.var.user?.id;

			if (!userId) {
				return c.json({ error: "User not authenticated" }, 401);
			}

			try {
				const deletedEvent = await db
					.delete(schema.event)
					.where(
						and(eq(schema.event.id, eventId), eq(schema.event.userId, userId)),
					)
					.returning();

				if (!deletedEvent.length) {
					return c.json({ error: "Event not found or not owned by user" }, 404);
				}

				return c.json(deletedEvent[0]);
			} catch (error) {
				console.error("Error deleting event:", error);
				return c.json({ error: "Failed to delete event" }, 500);
			}
		},
	);

export default app;
