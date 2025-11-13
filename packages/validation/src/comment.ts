import { z } from "zod";

// Types
export type Comment = z.infer<typeof commentSchema>;
export type NewComment = z.infer<typeof commentInsertSchema>;
export type UpdateComment = z.infer<typeof commentUpdateSchema>;
export type EventWithComments = z.infer<typeof eventWithCommentsSchema>;

// Comment Schemas
export const commentSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  eventId: z.string().uuid(),
  content: z.string().min(1, "Please enter your comment"),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const commentInsertSchema = z.object({
  content: z.string().min(1, "Please enter your comment"),
});

export const commentUpdateSchema = z.object({
  content: z.string().min(1, "Please enter your comment").optional(),
  updatedAt: z.date().optional(),
});

// Import event schema for this composite type
// Note: We'll use a forward reference to avoid circular dependencies
export const eventWithCommentsSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  venue: z.string().nullish(),
  address: z.string(),
  color: z.string(),
  genre: z.string(),
  repeat: z.string().optional(),
  repeatGroupId: z.string().uuid().nullish(),
  repeatEndDate: z.date().nullish(),
  startDate: z.date(),
  endDate: z.date(),
  userId: z.string().uuid().nullish(),
  createdAt: z.date(),
  latitude: z.string(),
  longitude: z.string(),
  comments: z.array(commentSchema),
  isStarred: z.boolean().optional(),
});
