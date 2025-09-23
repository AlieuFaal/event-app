import {
  eventInsertSchema,
  calendarEventSchema,
  commentSchema,
  commentUpdateSchema,
} from "drizzle/db/schema";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { _encode } from "better-auth";
import { schema } from "drizzle/db";
import { db } from "drizzle";
import { eq, and } from "drizzle-orm";
import { authMiddleware } from "@/middlewares/authMiddleware";
import { toast } from "sonner";

export type Event = z.infer<typeof eventInsertSchema>;
export type CalendarEvent = z.infer<typeof calendarEventSchema>;

export const getEventDataFn = createServerFn({
  method: "GET",
  response: "data",
}).handler(async () => {
  const events = await db
    .select()
    .from(schema.event)
    .orderBy(schema.event.startDate);

  const eventsWithStringDates = events.map((event: any) => ({
    ...event,
    startDate: event.startDate,
    endDate: event.endDate,
  }));

  return eventsWithStringDates;
});

export const getEventsWithCommentsFn = createServerFn({
  method: "GET",
  response: "data",
}).handler(async () => {
  const events = await db
    .select({
      id: schema.event.id,
      title: schema.event.title,
      description: schema.event.description,
      location: schema.event.location,
      color: schema.event.color,
      startDate: schema.event.startDate,
      endDate: schema.event.endDate,
      userId: schema.event.userId,
      createdAt: schema.event.createdAt,
    })
    .from(schema.event)
    .orderBy(schema.event.startDate);

  const comments = await db
    .select()
    .from(schema.comment)
    .orderBy(schema.comment.createdAt);

  return events.map((events) => {
    const commentsForEvent = comments.filter(
      (comment) => comment.eventId === events.id
    );
    return {
      ...events,
      comments: commentsForEvent,
    };
  });
});

export const getUserEventsWithCommentsFn = createServerFn({
  method: "GET",
  response: "data",
})
  .validator(z.object({ userId: z.uuid() }))
  .handler(async (data) => {
    const events = await db
      .select({
        id: schema.event.id,
        title: schema.event.title,
        description: schema.event.description,
        location: schema.event.location,
        color: schema.event.color,
        startDate: schema.event.startDate,
        endDate: schema.event.endDate,
        userId: schema.event.userId,
        createdAt: schema.event.createdAt,
      })
      .from(schema.event)
      .where(eq(schema.event.userId, data.data.userId))
      .orderBy(schema.event.startDate);

    const comments = await db
      .select()
      .from(schema.comment)
      .orderBy(schema.comment.createdAt);

    return events.map((events) => {
      const commentsForEvent = comments.filter(
        (comment) => comment.eventId === events.id
      );
      return {
        ...events,
        comments: commentsForEvent,
      };
    });
  });

export const postEventDataFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(eventInsertSchema)
  .handler(async ({ data, context }) => {
    try {
      console.log("Received data:", data);

      const userId = context.session?.user.id;
      if (!userId) {
        throw new Error("User not authenticated");
      }

      const event = await db
        .insert(schema.event)
        .values({
          title: data.title,
          description: data.description,
          location: data.location,
          color: data.color,
          startDate: data.startDate,
          endDate: data.endDate,
          userId: userId,
          createdAt: new Date(),
        })
        .returning();

      return event;
    } catch (error) {
      console.error("Error inserting event:", error);
      throw error;
    }
  });

export const putEventDataFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(calendarEventSchema)
  .handler(async ({ data, context }) => {
    const userId = context.session?.user.id;
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const updatedEvent = await db
      .update(schema.event)
      .set({
        title: data.title,
        description: data.description,
        location: data.location,
        color: data.color,
        startDate: data.startDate,
        endDate: data.endDate,
        userId: userId,
      })
      .where(eq(schema.event.id, data.id));
    console.log("Updated event:", updatedEvent);
    return updatedEvent;
  });

export const deleteEventDataFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(calendarEventSchema.pick({ id: true }))
  .handler(async ({ data, context }) => {
    const userId = context.session?.user.id;
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const deletedCount = await db
      .delete(schema.event)
      .where(eq(schema.event.id, data.id));

    return { deletedCount };
  });

export const postCalendarEventDataFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(calendarEventSchema)
  .handler(async ({ data, context }) => {
    try {
      console.log("Received data:", data);

      const userId = context.session?.user.id;
      if (!userId) {
        throw new Error("User not authenticated");
      }

      const event = await db
        .insert(schema.event)
        .values({
          title: data.title,
          description: data.description,
          location: data.location,
          color: data.color,
          startDate: data.startDate,
          endDate: data.endDate,
          userId: userId,
          createdAt: new Date(),
        })
        .returning();

      return event;
    } catch (error) {
      console.error("Error inserting event:", error);
      throw error;
    }
  });

// COMMENTS APIs ----------------------------------------------------------------
export const getCommentsForEventFn = createServerFn({
  method: "GET",
  response: "data",
})
  .validator(commentSchema)
  .handler(async ({ data }) => {
    const comments = await db
      .select()
      .from(schema.comment)
      .where(eq(schema.comment.eventId, data.eventId))
      .orderBy(schema.comment.createdAt);

    return comments;
  });

export const postCommentForEventFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(commentSchema)
  .handler(async ({ context, data }) => {
    try {
      console.log("Received comment data:", data);

      const userId = context.session?.user.id;
      if (!userId) {
        throw new Error("User not authenticated");
      }

      const newComment = await db
        .insert(schema.comment)
        .values({
          userId: userId,
          eventId: data.eventId,
          content: data.content,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return newComment;
    } catch (error) {
      console.error("Error inserting comment:", error);
      throw error;
    }
  });

export const updateCommentForEventFn = createServerFn({ method: "POST" })
  .validator(commentUpdateSchema)
  .handler(async ({ data }) => {
    try {
      console.log("Received comment update data:", data);

      const updatedComment = await db
        .update(schema.comment)
        .set({
          content: data.content,
          updatedAt: new Date(),
        })
        .where(eq(schema.comment.id, data.id!))
        .returning();

      return updatedComment;
    } catch (error) {
      console.error("Error updating comment:", error);
      throw error;
    }
  });

export const deleteCommentForEventFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(commentSchema.pick({ id: true }))
  .handler(async ({ data, context }) => {
    const userId = context.session?.user.id;
    if (!userId) {
      throw new Error("User not authenticated");
    }

    try {
      console.log("Received comment delete request for ID:", data.id);

      const deletedCount = await db
        .delete(schema.comment)
        .where(eq(schema.comment.id, data.id));

      return { deletedCount };
    } catch (error) {
      console.error("Error deleting comment:", error);
      throw error;
    }
  });

// FAVORITE EVENTS APIs ----------------------------------------------------------------
export const getFavoriteEventsFn = createServerFn({
  method: "GET",
  response: "data",
})
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const userId = context.session?.user.id; // aktiv användar ID
    if (!userId) {
      throw new Error("User not authenticated"); // hantera icke-autentiserad användare
    }
    const events = await db // hämtar alla fält från event tabellen
      .select({
        id: schema.event.id,
        title: schema.event.title,
        description: schema.event.description,
        location: schema.event.location,
        color: schema.event.color,
        startDate: schema.event.startDate,
        endDate: schema.event.endDate,
        userId: schema.event.userId,
        createdAt: schema.event.createdAt,
      })
      .from(schema.event)
      .innerJoin(
        // gör en inner join med favoriteEvent tabellen för att bara få de events som är favoriter för den aktuella användaren
        schema.favoriteEvent,
        eq(schema.event.id, schema.favoriteEvent.eventId)
      )
      .where(and(eq(schema.favoriteEvent.userId, userId)))
      .orderBy(schema.event.startDate); // sorterar på startDatum

    const comments = await db // hämtar alla kommentarer
      .select()
      .from(schema.comment)
      .orderBy(schema.comment.createdAt);

    return events.map((events) => {
      // mappar över events och lägger till kommentarer för varje event
      const commentsForEvent = comments.filter(
        (comment) => comment.eventId === events.id
      );
      return {
        // returnar eventet med dess kommentarer
        ...events,
        isStarred: true,
        comments: commentsForEvent,
      };
    });
  });

export const getUserFavoriteEventsFn = createServerFn({
  method: "GET",
  response: "data",
})
  .middleware([authMiddleware])
  .validator(z.object({ userId: z.string().uuid() }))
  .handler(async ({ context, data }) => {
    const userId = context.session?.user.id; // aktiv användar ID
    if (!userId) {
      throw new Error("User not authenticated"); // hantera icke-autentiserad användare
    }
    const events = await db // hämtar alla fält från event tabellen
      .select({
        id: schema.event.id,
        title: schema.event.title,
        description: schema.event.description,
        location: schema.event.location,
        color: schema.event.color,
        startDate: schema.event.startDate,
        endDate: schema.event.endDate,
        userId: schema.event.userId,
        createdAt: schema.event.createdAt,
      })
      .from(schema.event)
      .innerJoin(
        // gör en inner join med favoriteEvent tabellen för att bara få de events som är favoriter för den aktuella användaren
        schema.favoriteEvent,
        eq(schema.event.id, schema.favoriteEvent.eventId)
      )
      .where(and(eq(schema.favoriteEvent.userId, data.userId)))
      .orderBy(schema.event.startDate); // sorterar på startDatum

    const comments = await db // hämtar alla kommentarer
      .select()
      .from(schema.comment)
      .orderBy(schema.comment.createdAt);

    return events.map((events) => {
      // mappar över events och lägger till kommentarer för varje event
      const commentsForEvent = comments.filter(
        (comment) => comment.eventId === events.id
      );
      return {
        // returnar eventet med dess kommentarer
        ...events,
        isStarred: true,
        comments: commentsForEvent,
      };
    });
  });

export const addFavoriteEventFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ eventId: z.uuid() }))
  .handler(async ({ data, context }) => {
    const userId = context.session?.user.id;
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const [existingFavorite] = await db
      .select({
        // hämtar fälten userId, eventId, createdAt från favoriteEvent tabellen
        userId: schema.favoriteEvent.userId,
        eventId: schema.favoriteEvent.eventId,
        createdAt: schema.favoriteEvent.createdAt,
      })
      .from(schema.favoriteEvent)
      .where(
        // where klausul som kollar att userId och eventId matchar
        and(
          eq(schema.favoriteEvent.userId, userId),
          eq(schema.favoriteEvent.eventId, data.eventId)
        )
      ); // kollar om eventet redan är en favorit för användaren

    if (existingFavorite) {
      toast.error("Event is already in favorites");
      return existingFavorite;
    }

    const newFavorite = await db // lägger till ett nytt event i favoriteEvent tabellen
      .insert(schema.favoriteEvent)
      .values({
        userId: userId,
        eventId: data.eventId,
        createdAt: new Date(),
      })
      .returning();

    toast.success("Event added to favorites");
    return newFavorite; // returnerar det nya favorit-eventet
  });

export const removeFavoriteEventFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.uuid() }))
  .handler(async ({ data, context }) => {
    const userId = context.session?.user.id;
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const deletedEvent = await db // tar bort ett event från favoriteEvent tabellen baserat på userId och eventId
      .delete(schema.favoriteEvent)
      .where(
        and(
          eq(schema.favoriteEvent.userId, userId),
          eq(schema.favoriteEvent.eventId, data.id)
        )
      );

    if (deletedEvent.rowCount! > 0) {
      // kollar om något event faktiskt togs bort
      toast.success("Event removed from favorites");
    } else {
      toast.error("Event not found in favorites");
    }

    return { deletedEvent }; // returnerar antalet borttagna rader från favoriteEvent tabellen
  });
