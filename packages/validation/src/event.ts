import { z } from "zod";

// Constants
export const eventColors = [
  "Blue",
  "Green",
  "Red",
  "Yellow",
  "Purple",
  "Orange",
] as const;

export const genres = [
  "Hip-Hop",
  "Rock",
  "Indie",
  "Pop",
  "Jazz",
  "Classical",
  "Electronic",
  "Country",
  "Reggae",
  "Blues",
  "Folk",
  "Metal",
  "R&B",
  "Soul",
  "Afrobeat",
  "Punk",
  "Disco",
  "Funk",
  "Gospel",
  "Techno",
  "House",
  "Trance",
  "Dubstep",
  "Ambient",
  "Alternative",
  "Grunge",
  "New Wave",
  "Synthpop",
  "Progressive Rock",
  "Hard Rock",
  "Soft Rock",
  "Acoustic",
  "Instrumental",
] as const;

export const repeatOptions = ["none", "daily", "weekly", "monthly", "yearly"] as const;

// Types
export type EventColor = (typeof eventColors)[number];
export type Genre = (typeof genres)[number];
export type RepeatOption = (typeof repeatOptions)[number];
export type Event = z.infer<typeof eventSchema>;
export type NewEvent = z.infer<typeof eventInsertSchema>;
export type UpdateEvent = z.infer<typeof eventUpdateSchema>;
export type CalendarEvent = z.infer<typeof calendarEventSchema>;

// Event Schemas
export const eventSchema = z.object({
  id: z.string().uuid(),
  title: z
    .string()
    .min(2, "Please enter an event title (at least 2 characters)")
    .max(100, "Event title cannot be longer than 100 characters"),
  description: z
    .string()
    .min(2, "Please provide a description for your event (at least 2 characters)"),
  venue: z.string().nullish(),
  address: z
    .string()
    .min(2, "Please enter the event location address (at least 2 characters)"),
  color: z.enum(eventColors),
  genre: z.enum(genres),
  repeat: z.enum(repeatOptions).optional(),
  repeatGroupId: z.string().uuid().nullish(),
  repeatEndDate: z.date().nullish(),
  startDate: z.date(),
  endDate: z.date(),
  userId: z.string().uuid().nullish(),
  createdAt: z.date(),
  latitude: z.string(),
  longitude: z.string(),
});

export const geocodingSchema = eventSchema.pick({
  address: true,
});

export const eventInsertSchema = z
  .object({
    id: z.string().uuid().optional(),
    userId: z.string().uuid().nullish(),
    title: z
      .string()
      .min(2, "Please enter an event title (at least 2 characters)")
      .max(100, "Event title cannot be longer than 100 characters"),
    description: z
      .string()
      .min(2, "Please provide a description for your event (at least 2 characters)"),
    venue: z.string().nullish(),
    repeat: z.enum(repeatOptions).optional(),
    repeatGroupId: z.string().uuid().nullish(),
    repeatEndDate: z.date().nullish(),
    address: z
      .string()
      .min(2, "Please enter the event location address (at least 2 characters)"),
    color: z.enum(eventColors),
    genre: z.enum(genres),
    startDate: z.date(),
    endDate: z.date(),
    latitude: z.string(),
    longitude: z.string(),
    createdAt: z.date().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.startDate && data.endDate && data.startDate > data.endDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "The start date must be before the end date",
        path: ["startDate"],
      });
    }
  });

export const eventUpdateSchema = z
  .object({
    title: z
      .string()
      .min(2, "Please enter an event title (at least 2 characters)")
      .max(100, "Event title cannot be longer than 100 characters")
      .optional(),
    description: z
      .string()
      .min(2, "Please provide a description for your event (at least 2 characters)")
      .optional(),
    address: z
      .string()
      .min(2, "Please enter the event location address (at least 2 characters)")
      .optional(),
    venue: z.string().nullish(),
    latitude: z.string().optional(),
    longitude: z.string().optional(),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    repeat: z.enum(repeatOptions).optional(),
    repeatGroupId: z.string().uuid().nullish(),
    repeatEndDate: z.date().nullish(),
    updatedAt: z.date().optional(),
    color: z.enum(eventColors).optional(),
    genre: z.enum(genres).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.startDate && data.endDate && data.startDate > data.endDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "The start date must be before the end date",
        path: ["startDate"],
      });
    }
  });

export const calendarEventSchema = eventSchema.extend({
  id: z.string().uuid(),
  userId: z.string().uuid().nullish(),
  repeat: z.enum(repeatOptions).optional(),
  repeatGroupId: z.string().uuid().nullish(),
  repeatEndDate: z.date().nullish(),
  createdAt: z.date().optional(),
});
