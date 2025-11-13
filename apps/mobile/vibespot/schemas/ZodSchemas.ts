import z from "zod";

// export {
//   // User
//   type User,
//   type NewUser,
//   type UpdateUser,
//   type UserForm,
//   type Session,
//   type OnboardingUpdate,
//   type Role,
//   type CurrentUser,
//   type PasswordChangeForm,

//   // Event
//   type Event,
//   type NewEvent,
//   type UpdateEvent,
//   type CalendarEvent,
//   type EventColor,
//   type Genre,
//   type RepeatOption,

//   // Comment
//   type Comment,
//   type NewComment,
//   type UpdateComment,
//   type EventWithComments,

//   // User Schemas
//   userSchema,
//   userSocialSchema,
//   userInsertSchema,
//   userUpdateSchema,
//   userFormSchema,
//   onbFormUpdateSchema,
//   onboardingSchema,
//   roleUpdateSchema,
//   CurrentUserSchema,
//   passwordChangeSchema,

//   // Session Schemas
//   sessionSchema,

//   // Event Schemas
//   eventSchema,
//   eventUpdateSchema,
//   calendarEventSchema,
//   geocodingSchema,

//   // Comment Schemas
//   commentSchema,
//   commentInsertSchema,
//   commentUpdateSchema,
//   eventWithCommentsSchema,
// } from "@vibespot/database";

export type Genre = (typeof genres)[number];

export const eventColors = [
  "Blue",
  "Green",
  "Red",
  "Yellow",
  "Purple",
  "Orange",
] as const;

export const genres = [
  "Indie",
  "Hip-Hop",
  "Rock",
  "Pop",
  "Blues",
  "Jazz",
  "R&B",
  "Soul",
  "Instrumental",
  "Progressive Rock",
  "Hard Rock",
  "Soft Rock",
  "Acoustic",
  "Classical",
  "Electronic",
  "Country",
  "Reggae",
  "Afrobeat",
  "Folk",
  "Metal",
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
] as const;

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
      .min(2, "Please provide a description for your event (at least 2 characters)")
      .max(100, "Event description cannot be longer than 100 characters"),
    venue: z.string().nullish(),
    repeat: z.enum(["none", "daily", "weekly", "monthly", "yearly"]).optional(),
    repeatGroupId: z.string().uuid().nullish(),
    repeatEndDate: z.date().nullish(),
    address: z
      .string()
      .min(2,"Please enter the event location address (at least 2 characters)"),
    color: z.enum(["Blue", "Green", "Red", "Yellow", "Purple", "Orange"]),
    genre: z.enum([
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
    ]),
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
