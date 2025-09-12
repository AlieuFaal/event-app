import {
  eventInsertSchema,
  calendarEventSchema,
  comment,
  commentSchema,
  commentInsertSchema,
  commentUpdateSchema,
} from "drizzle/db/schema";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { _encode } from "better-auth";
import { schema } from "drizzle/db";
import { db } from "drizzle";
import { eq } from "drizzle-orm";
import { Title } from "@radix-ui/react-dialog";
import { startOfDay } from "date-fns";

export type Event = z.infer<typeof eventInsertSchema>;
export type CalendarEvent = z.infer<typeof calendarEventSchema>;

export const getEventData = createServerFn({
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

export const getEventsWithComments = createServerFn({
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

export const postEventData = createServerFn({ method: "POST" })
  .validator(eventInsertSchema)
  .handler(async ({ data }) => {
    try {
      console.log("Received data:", data);

      const event = await db
        .insert(schema.event)
        .values({
          id: data.id || crypto.randomUUID(),
          title: data.title,
          description: data.description,
          location: data.location,
          color: data.color,
          startDate: data.startDate,
          endDate: data.endDate,
          userId: data.userId,
          createdAt: new Date(),
        })
        .returning();

      return event;
    } catch (error) {
      console.error("Error inserting event:", error);
      throw error;
    }
  });

export const putEventData = createServerFn({ method: "POST" })
  .validator(calendarEventSchema)
  .handler(async ({ data }) => {
    const updatedEvent = await db
      .update(schema.event)
      .set({
        title: data.title,
        description: data.description,
        location: data.location,
        color: data.color,
        startDate: data.startDate,
        endDate: data.endDate,
        userId: data.userId,
      })
      .where(eq(schema.event.id, data.id));
    console.log("Updated event:", updatedEvent);
    return updatedEvent;
  });

export const deleteEventData = createServerFn({ method: "POST" })
  .validator(calendarEventSchema.pick({ id: true }))
  .handler(async ({ data }) => {
    const deletedCount = await db
      .delete(schema.event)
      .where(eq(schema.event.id, data.id));

    return { deletedCount };
  });

export const postCalendarEventData = createServerFn({ method: "POST" })
  .validator(calendarEventSchema)
  .handler(async ({ data }) => {
    try {
      console.log("Received data:", data);

      const event = await db
        .insert(schema.event)
        .values({
          id: data.id || crypto.randomUUID(),
          title: data.title,
          description: data.description,
          location: data.location,
          color: data.color,
          startDate: data.startDate,
          endDate: data.endDate,
          userId: data.userId,
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
export const getCommentsForEvent = createServerFn({
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

export const postCommentForEvent = createServerFn({ method: "POST" })
  .validator(commentSchema)
  .handler(async ({ data }) => {
    try {
      console.log("Received comment data:", data);

      const newComment = await db
        .insert(schema.comment)
        .values({
          id: crypto.randomUUID(),
          userId: data.userId,
          eventId: data.eventId,
          content: data.content,
          // actions: data.actions,
          // selectedActions: data.selectedActions || [],
          // allowUpvote: data.allowUpvote || true,
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

export const updateCommentForEvent = createServerFn({ method: "POST" })
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

export const deleteCommentForEvent = createServerFn({ method: "POST" })
  .validator(commentSchema.pick({ id: true }))
  .handler(async ({ data }) => {
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
