import {
  eventInsertSchema,
  calendarEventSchema,
  commentSchema,
} from "@vibespot/database/schema";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { schema } from "@vibespot/database/schema";
import { db } from "@vibespot/database";
import { eq, and, gte, inArray } from "drizzle-orm";
import { authMiddleware } from "@/middlewares/authMiddleware";

const eventSelect = {
  id: schema.event.id,
  title: schema.event.title,
  description: schema.event.description,
  venue: schema.event.venue,
  address: schema.event.address,
  color: schema.event.color,
  genre: schema.event.genre,
  repeat: schema.event.repeat,
  repeatGroupId: schema.event.repeatGroupId,
  repeatEndDate: schema.event.repeatEndDate,
  startDate: schema.event.startDate,
  endDate: schema.event.endDate,
  latitude: schema.event.latitude,
  longitude: schema.event.longitude,
  userId: schema.event.userId,
  createdAt: schema.event.createdAt,
  imageUrl: schema.event.imageUrl,
};

const canManageEvents = (role: string | undefined) =>
  role === "artist" || role === "admin";

const getCommentsByEventIds = async (eventIds: string[]) => {
  if (eventIds.length === 0) {
    return [];
  }

  return db
    .select()
    .from(schema.comment)
    .where(inArray(schema.comment.eventId, eventIds))
    .orderBy(schema.comment.createdAt);
};

const attachComments = async <T extends { id: string }>(events: T[]) => {
  if (events.length === 0) {
    return [] as Array<T & { comments: Array<typeof schema.comment.$inferSelect> }>;
  }

  const comments = await getCommentsByEventIds(events.map((event) => event.id));
  const commentsByEventId = new Map<string, Array<typeof schema.comment.$inferSelect>>();

  for (const comment of comments) {
    const existing = commentsByEventId.get(comment.eventId);
    if (existing) {
      existing.push(comment);
    } else {
      commentsByEventId.set(comment.eventId, [comment]);
    }
  }

  return events.map((event) => ({
    ...event,
    comments: commentsByEventId.get(event.id) ?? [],
  }));
};

export const getEventDataFn = createServerFn({
  method: "GET",
}).handler(async () => {
  return db
    .select()
    .from(schema.event)
    .where(gte(schema.event.endDate, new Date()))
    .orderBy(schema.event.startDate);
});

export const isEventExpired = (endDate: Date): boolean => {
  const now = new Date();
  return endDate < now;
};

export const getEventsWithCommentsFn = createServerFn({
  method: "GET",
}).handler(async () => {
  const events = await db
    .select(eventSelect)
    .from(schema.event)
    .where(gte(schema.event.endDate, new Date()))
    .orderBy(schema.event.startDate);

  return attachComments(events);
});

export const getUserEventsWithCommentsFn = createServerFn({
  method: "GET",
})
  .inputValidator(z.object({ userId: z.uuid() }))
  .handler(async ({ data }) => {
    const events = await db
      .select(eventSelect)
      .from(schema.event)
      .where(eq(schema.event.userId, data.userId))
      .orderBy(schema.event.startDate);

    return attachComments(events);
  });

export const getMapEventsFn = createServerFn({
  method: "GET",
}).handler(async () => {
  return db
    .select(eventSelect)
    .from(schema.event)
    .where(gte(schema.event.endDate, new Date()))
    .orderBy(schema.event.startDate);
});

export const postEventDataFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(eventInsertSchema)
  .handler(async ({ data, context }) => {
    const user = context.currentUser;
    if (!user?.id || !canManageEvents(user.role)) {
      throw new Error("User not authenticated or authorized to handle events");
    }

    const event = await db
      .insert(schema.event)
      .values({
        title: data.title,
        description: data.description,
        venue: data.venue,
        address: data.address,
        color: data.color,
        genre: data.genre,
        repeat: data.repeat,
        startDate: data.startDate,
        endDate: data.endDate,
        latitude: data.latitude,
        longitude: data.longitude,
        userId: user.id,
        createdAt: new Date(),
        imageUrl: data.imageUrl,
      })
      .returning();

    return event;
  });

export const repeatEventsFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(eventInsertSchema)
  .handler(async ({ data, context }) => {
    const user = context.currentUser;
    if (!user?.id || !canManageEvents(user.role)) {
      throw new Error("User not authenticated or authorized to handle events");
    }

    if (data.repeat === "none" || !data.repeat) {
      const event = await db
        .insert(schema.event)
        .values({
          title: data.title,
          description: data.description,
          venue: data.venue,
          address: data.address,
          color: data.color,
          genre: data.genre,
          repeat: "none",
          repeatGroupId: null,
          repeatEndDate: null,
          startDate: data.startDate,
          endDate: data.endDate,
          latitude: data.latitude,
          longitude: data.longitude,
          userId: user.id,
          createdAt: new Date(),
          imageUrl: data.imageUrl,
        })
        .returning();

      return { initialEvent: event, repeatedEvents: [] };
    }

    const repeatGroupId = crypto.randomUUID();

    const customRepeatEndDate = (
      startDate: Date,
      repeat: string,
      customEndDate?: Date | null
    ) => {
      if (customEndDate) {
        return customEndDate;
      }

      const endDate = new Date(startDate);
      switch (repeat) {
        case "daily":
        case "weekly":
          endDate.setFullYear(endDate.getFullYear() + 1);
          break;
        case "monthly":
          endDate.setFullYear(endDate.getFullYear() + 2);
          break;
        case "yearly":
          endDate.setFullYear(endDate.getFullYear() + 10);
          break;
      }
      return endDate;
    };

    const addInterval = (date: Date, repeat: string) => {
      const newDate = new Date(date);
      switch (repeat) {
        case "daily":
          newDate.setDate(newDate.getDate() + 1);
          break;
        case "weekly":
          newDate.setDate(newDate.getDate() + 7);
          break;
        case "monthly":
          newDate.setMonth(newDate.getMonth() + 1);
          break;
        case "yearly":
          newDate.setFullYear(newDate.getFullYear() + 1);
          break;
      }
      return newDate;
    };

    const repeatEndDate = customRepeatEndDate(
      data.startDate,
      data.repeat,
      data.repeatEndDate
    );

    const repeatedEventsValues: Array<typeof schema.event.$inferInsert> = [];
    const maxOccurrences = 500;

    const initialEvent = await db
      .insert(schema.event)
      .values({
        title: data.title,
        description: data.description,
        venue: data.venue,
        address: data.address,
        color: data.color,
        genre: data.genre,
        repeat: data.repeat,
        repeatGroupId,
        repeatEndDate,
        startDate: data.startDate,
        endDate: data.endDate,
        latitude: data.latitude,
        longitude: data.longitude,
        userId: user.id,
        createdAt: new Date(),
        imageUrl: data.imageUrl,
      })
      .returning();

    let currentStartDate = addInterval(new Date(data.startDate), data.repeat);
    let currentEndDate = addInterval(new Date(data.endDate), data.repeat);
    let count = 0;

    while (currentStartDate <= repeatEndDate && count < maxOccurrences) {
      repeatedEventsValues.push({
        title: data.title,
        description: data.description,
        venue: data.venue,
        address: data.address,
        color: data.color,
        genre: data.genre,
        repeat: data.repeat,
        repeatGroupId,
        repeatEndDate,
        startDate: new Date(currentStartDate),
        endDate: new Date(currentEndDate),
        latitude: data.latitude,
        longitude: data.longitude,
        userId: user.id,
        createdAt: new Date(),
        imageUrl: data.imageUrl,
      });
      currentStartDate = addInterval(currentStartDate, data.repeat);
      currentEndDate = addInterval(currentEndDate, data.repeat);
      count++;
    }

    const repeatedEvents = repeatedEventsValues.length
      ? await db.insert(schema.event).values(repeatedEventsValues).returning()
      : [];

    return { initialEvent, repeatedEvents };
  });

export const putEventDataFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(calendarEventSchema)
  .handler(async ({ data, context }) => {
    const user = context.currentUser;
    if (!user?.id || !canManageEvents(user.role)) {
      throw new Error("User not authenticated or authorized to handle events");
    }

    const updatedEvent = await db
      .update(schema.event)
      .set({
        title: data.title,
        description: data.description,
        venue: data.venue,
        address: data.address,
        color: data.color,
        genre: data.genre,
        startDate: data.startDate,
        endDate: data.endDate,
      })
      .where(and(eq(schema.event.id, data.id), eq(schema.event.userId, user.id)))
      .returning();

    if (updatedEvent.length === 0) {
      throw new Error("Event not found or not owned by user");
    }

    return updatedEvent;
  });

export const updateAllRepeatedEventsFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(calendarEventSchema)
  .handler(async ({ data, context }) => {
    const user = context.currentUser;
    if (!user?.id || !canManageEvents(user.role)) {
      throw new Error("User not authenticated or authorized to handle events");
    }

    const [currentEvent] = await db
      .select()
      .from(schema.event)
      .where(and(eq(schema.event.id, data.id), eq(schema.event.userId, user.id)))
      .limit(1);

    if (!currentEvent || !currentEvent.repeatGroupId) {
      throw new Error("Event not found or is not a repeated event");
    }

    return db
      .update(schema.event)
      .set({
        title: data.title,
        description: data.description,
        venue: data.venue,
        address: data.address,
        color: data.color,
        genre: data.genre,
      })
      .where(
        and(
          eq(schema.event.repeatGroupId, currentEvent.repeatGroupId),
          eq(schema.event.userId, user.id)
        )
      )
      .returning();
  });

export const deleteEventDataFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(calendarEventSchema.pick({ id: true }))
  .handler(async ({ data, context }) => {
    const user = context.currentUser;
    if (!user?.id || !canManageEvents(user.role)) {
      throw new Error("User not authenticated or authorized to handle events");
    }

    const deletedCount = await db
      .delete(schema.event)
      .where(and(eq(schema.event.id, data.id), eq(schema.event.userId, user.id)));

    return { deletedCount };
  });

export const deleteAllRepeatedEventsFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(calendarEventSchema.pick({ id: true }))
  .handler(async ({ data, context }) => {
    const user = context.currentUser;
    if (!user?.id || !canManageEvents(user.role)) {
      throw new Error("User not authenticated or authorized to handle events");
    }

    const [currentEvent] = await db
      .select()
      .from(schema.event)
      .where(and(eq(schema.event.id, data.id), eq(schema.event.userId, user.id)))
      .limit(1);

    if (!currentEvent || !currentEvent.repeatGroupId) {
      throw new Error("Event not found or is not a repeated event");
    }

    const deletedEvents = await db
      .delete(schema.event)
      .where(
        and(
          eq(schema.event.repeatGroupId, currentEvent.repeatGroupId),
          eq(schema.event.userId, user.id)
        )
      )
      .returning();

    return { deletedCount: deletedEvents.length };
  });

export const updateRepeatEndDateFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(
    z.object({
      id: z.string().uuid(),
      repeatEndDate: z.date(),
    })
  )
  .handler(async ({ data, context }) => {
    const user = context.currentUser;
    if (!user?.id || !canManageEvents(user.role)) {
      throw new Error("User not authenticated or authorized to handle events");
    }

    const [currentEvent] = await db
      .select()
      .from(schema.event)
      .where(and(eq(schema.event.id, data.id), eq(schema.event.userId, user.id)))
      .limit(1);

    if (!currentEvent || !currentEvent.repeatGroupId) {
      throw new Error("Event not found or is not a repeated event");
    }

    const deletedEvents = await db
      .delete(schema.event)
      .where(
        and(
          eq(schema.event.repeatGroupId, currentEvent.repeatGroupId),
          eq(schema.event.userId, user.id),
          gte(schema.event.startDate, data.repeatEndDate)
        )
      )
      .returning();

    const updatedEvents = await db
      .update(schema.event)
      .set({
        repeatEndDate: data.repeatEndDate,
      })
      .where(
        and(
          eq(schema.event.repeatGroupId, currentEvent.repeatGroupId),
          eq(schema.event.userId, user.id)
        )
      )
      .returning();

    return {
      updatedCount: updatedEvents.length,
      deletedCount: deletedEvents.length,
    };
  });

export const postCalendarEventDataFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(calendarEventSchema)
  .handler(async ({ data, context }) => {
    const user = context.currentUser;
    if (!user?.id || !canManageEvents(user.role)) {
      throw new Error("User not authenticated or authorized to handle events");
    }

    return db
      .insert(schema.event)
      .values({
        title: data.title,
        description: data.description,
        venue: data.venue,
        address: data.address,
        color: data.color,
        genre: data.genre,
        startDate: data.startDate,
        endDate: data.endDate,
        latitude: data.latitude,
        longitude: data.longitude,
        userId: user.id,
        createdAt: new Date(),
      })
      .returning();
  });

const commentCreateSchema = z.object({
  eventId: z.string().uuid(),
  content: z.string().min(1, "Please enter your comment"),
});

const commentUpdateInputSchema = z.object({
  id: z.string().uuid(),
  content: z.string().min(1, "Please enter your comment"),
});

export const getCommentsForEventFn = createServerFn({
  method: "GET",
})
  .inputValidator(commentSchema.pick({ eventId: true }))
  .handler(async ({ data }) => {
    return db
      .select()
      .from(schema.comment)
      .where(eq(schema.comment.eventId, data.eventId))
      .orderBy(schema.comment.createdAt);
  });

export const postCommentForEventFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(commentCreateSchema)
  .handler(async ({ context, data }) => {
    const userId = context.currentUser?.id;
    if (!userId) {
      throw new Error("User not authenticated");
    }

    return db
      .insert(schema.comment)
      .values({
        userId,
        eventId: data.eventId,
        content: data.content,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
  });

export const updateCommentForEventFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(commentUpdateInputSchema)
  .handler(async ({ data, context }) => {
    const userId = context.currentUser?.id;
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const updatedComment = await db
      .update(schema.comment)
      .set({
        content: data.content,
        updatedAt: new Date(),
      })
      .where(and(eq(schema.comment.id, data.id), eq(schema.comment.userId, userId)))
      .returning();

    if (updatedComment.length === 0) {
      throw new Error("Comment not found or not owned by user");
    }

    return updatedComment;
  });

export const deleteCommentForEventFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(commentSchema.pick({ id: true }))
  .handler(async ({ data, context }) => {
    const userId = context.currentUser?.id;
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const deletedComment = await db
      .delete(schema.comment)
      .where(and(eq(schema.comment.id, data.id), eq(schema.comment.userId, userId)));

    return { deletedComment };
  });

export const getFavoriteEventsFn = createServerFn({
  method: "GET",
})
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const userId = context.currentUser?.id;
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const events = await db
      .select(eventSelect)
      .from(schema.event)
      .innerJoin(
        schema.favoriteEvent,
        eq(schema.event.id, schema.favoriteEvent.eventId)
      )
      .where(eq(schema.favoriteEvent.userId, userId))
      .orderBy(schema.event.startDate);

    const eventsWithComments = await attachComments(events);
    return eventsWithComments.map((event) => ({
      ...event,
      isStarred: true,
    }));
  });

export const getUserFavoriteEventsFn = createServerFn({
  method: "GET",
})
  .inputValidator(z.object({ userId: z.string().uuid() }))
  .handler(async ({ data }) => {
    const events = await db
      .select(eventSelect)
      .from(schema.event)
      .innerJoin(
        schema.favoriteEvent,
        eq(schema.event.id, schema.favoriteEvent.eventId)
      )
      .where(eq(schema.favoriteEvent.userId, data.userId))
      .orderBy(schema.event.startDate);

    const eventsWithComments = await attachComments(events);
    return eventsWithComments.map((event) => ({
      ...event,
      isStarred: true,
    }));
  });

export const addFavoriteEventFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(z.object({ eventId: z.uuid() }))
  .handler(async ({ data, context }) => {
    const userId = context.currentUser?.id;
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const [existingFavorite] = await db
      .select({
        userId: schema.favoriteEvent.userId,
        eventId: schema.favoriteEvent.eventId,
        createdAt: schema.favoriteEvent.createdAt,
      })
      .from(schema.favoriteEvent)
      .where(
        and(
          eq(schema.favoriteEvent.userId, userId),
          eq(schema.favoriteEvent.eventId, data.eventId)
        )
      );

    if (existingFavorite) {
      return existingFavorite;
    }

    return db
      .insert(schema.favoriteEvent)
      .values({
        userId,
        eventId: data.eventId,
        createdAt: new Date(),
      })
      .returning();
  });

export const removeFavoriteEventFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator(z.object({ id: z.uuid() }))
  .handler(async ({ data, context }) => {
    const userId = context.currentUser?.id;
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const deletedEvents = await db
      .delete(schema.favoriteEvent)
      .where(
        and(
          eq(schema.favoriteEvent.userId, userId),
          eq(schema.favoriteEvent.eventId, data.id)
        )
      )
      .returning({
        eventId: schema.favoriteEvent.eventId,
      });

    return { deletedCount: deletedEvents.length };
  });
