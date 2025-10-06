import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  check,
  uuid,
  primaryKey,
} from "drizzle-orm/pg-core";
import {
  createSelectSchema,
  createInsertSchema,
  createUpdateSchema,
} from "drizzle-zod";
import z from "zod";

// User Types -----------------------------------------------------------------------------------------------------------------
export type User = z.infer<typeof userSchema>;

// export type UserSession = z.infer<typeof userSessionSchema>;

// export type UserSocial = z.infer<typeof userSocialSchema>;
export type NewUser = z.infer<typeof userInsertSchema>;
export type UpdateUser = z.infer<typeof userUpdateSchema>;
export type UserForm = z.infer<typeof userFormSchema>;
export type Session = z.infer<typeof sessionSchema>;
export type OnboardingUpdate = z.infer<typeof onbFormUpdateSchema>;
export type Role = (typeof roles)[number];

// Event and Comment Types -----------------------------------------------------------------------------------------------------------------
export type Event = z.infer<typeof eventSchema>;
export type NewEvent = z.infer<typeof eventInsertSchema>;
export type UpdateEvent = z.infer<typeof eventUpdateSchema>;
export type CalendarEvent = z.infer<typeof calendarEventSchema>;
export type EventColor = (typeof eventColors)[number];

export type Comment = z.infer<typeof commentSchema>;
export type NewComment = z.infer<typeof commentInsertSchema>;
export type UpdateComment = z.infer<typeof commentUpdateSchema>;
export type EventWithComments = z.infer<typeof eventWithCommentsSchema>;

// Additional Types without db tables -----------------------------------------------------------------------------------------------------------------

// export type CurrentUser = z.infer<typeof CurrentUserSchema>;
export type PasswordChangeForm = z.infer<typeof passwordChangeSchema>;


// User Table -------------------------------------------------------------------------------------------------------------
export const user = pgTable(
  "user",
  {
    id: uuid("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
    phone: text("phone"),
    image: text("image"),
    location: text("location"),
    bio: text("bio"),
    createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
    updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
    role: text("role").$type<Role>().notNull().default("New User"),
  },
  (table) => [
    check(
      "role_check",
      sql`${table.role} in (${sql.raw(roles.map((r) => `'${r}'`).join(","))})`
    ),
  ]
);

const roles = ["user", "artist", "admin", "New User"] as const;

export const userSchema = createSelectSchema(user, {
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email format"),
  image: z.url("Invalid image URL").optional().nullable(),
});

export const userSocialSchema = userSchema.extend({
  isFollowing: z.boolean().optional(),
});

export const userInsertSchema = createInsertSchema(user, {
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email format"),
  image: z.url("Invalid image URL").optional(),
});

export const userUpdateSchema = createUpdateSchema(user, {
  name: z.string().min(1, "Name is required").optional(),
  email: z.email("Invalid email format").optional(),
  image: z.url("Invalid image URL").optional(),
});

export const userFormSchema = userUpdateSchema
.extend({
  id: z.string(),
  role: z.enum(["user", "artist"]).default("user").optional(),
})
.omit({
  email: true,
  emailVerified: true,
  createdAt: true,
  updatedAt: true,
});

export const onbFormUpdateSchema = userFormSchema.omit({
  id: true,
  name: true,
  bio: true,
  role: true,
});

export const onboardingSchema = userFormSchema.pick({
  id: true,
  role: true,
});

// export const userSessionSchema = userSchema.pick({
//   id: true,
//   name: true,
//   email: true,
//   emailVerified: true,
//   image: true,
//   createdAt: true,
//   updatedAt: true,
// });

export const session = pgTable("session", {
  id: uuid("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: uuid("user_id")
  .notNull()
  .references(() => user.id, { onDelete: "cascade" }),
});

export const sessionSchema = createSelectSchema(session);

export const account = pgTable("account", {
  id: uuid("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: uuid("user_id")
  .notNull()
  .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: uuid("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
  updatedAt: timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
});

// Event Table -------------------------------------------------------------------------------------------------------------
export const event = pgTable("event", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  venue: text("venue"),
  address: text("address").notNull(),
  color: text("color").$type<EventColor>().notNull().default("blue"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  userId: uuid("user_id").references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull(),
  latitude: text("latitude").notNull(),
  longitude: text("longitude").notNull(),
  
});

const eventColors = [
  "blue",
  "green",
  "red",
  "yellow",
  "purple",
  "orange",
] as const;

export const eventSchema = createSelectSchema(event, {
  title: z
  .string()
  .min(2, "Event title must have at least 2 characters.")
  .max(100, "Event name must have at most 100 characters."),
  description: z
  .string()
  .min(2, "Description must contain atleast 2 characters."),
  address: z.string().min(2, "Address must be atleast 2 characters."),
  color: z.enum(["blue", "green", "red", "yellow", "purple", "orange"]),
  venue: z.string().nullable(),
});

export const geocodingSchema = eventSchema.pick({
  address: true,
});

export const eventInsertSchema = createInsertSchema(event, {
  id: z.uuid().optional(),
  userId: z.uuid().nullable().optional(),
  title: z
  .string()
  .min(2, "Event title must have at least 2 characters.")
  .max(100, "Event name must have at most 100 characters."),
  description: z
  .string()
  .min(2, "Description must contain atleast 2 characters."),
  venue: z.string().optional().nullable(),
  address: z.string().min(2, "Address must be atleast 2 characters."),
  color: z.enum(["blue", "green", "red", "yellow", "purple", "orange"]),
  latitude: z.string(),
  longitude: z.string(),
  createdAt: z.date().optional(),
}).superRefine((data, ctx) => {
  if (data.startDate && data.endDate && data.startDate > data.endDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Start date must be before end date",
      path: ["startDate"],
    });
  }
});

export const eventUpdateSchema = createUpdateSchema(event, {
  title: z
  .string()
  .min(2, "Event title must have at least 2 characters.")
  .max(100, "Event name must have at most 100 characters.")
  .optional(),
  description: z
  .string()
  .min(2, "Description must contain atleast 2 characters.")
  .optional(),
  address: z
  .string()
  .min(2, "Address must be atleast 2 characters."),
  venue: z.string().nullable(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  updatedAt: z.date().optional(),
  color: z    
  .enum(["blue", "green", "red", "yellow", "purple", "orange"])
  .optional(),
}).superRefine((data, ctx) => {
  if (data.startDate && data.endDate && data.startDate > data.endDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Start date must be before end date",
      path: ["startDate"],
    });
  }
});

export const calendarEventSchema = eventSchema.extend({
  id: z.uuid(),
  userId: z.uuid().nullable().optional(),
  createdAt: z.date().optional(), // Optional for new events
});

// Comment table -------------------------------------------------------------------------------------------------------------
export const comment = pgTable("comment", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
  .notNull()
  .references(() => user.id, { onDelete: "cascade" }),
  eventId: uuid("event_id")
  .notNull()
  .references(() => event.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  createdAt: timestamp("created_at")
  .$defaultFn(() => /* @__PURE__ */ new Date())
  .notNull(),
  updatedAt: timestamp("updated_at")
  .$defaultFn(() => /* @__PURE__ */ new Date())
  .notNull(),
});

export const commentSchema = createSelectSchema(comment, {
  content: z.string().min(1, "Comment content cannot be empty"),
});


export const commentInsertSchema = createInsertSchema(comment,
  {
    content: z.string().min(1, "Comment content cannot be empty"),
  }
).omit({
  id: true,
  eventId: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export const commentUpdateSchema = createUpdateSchema(comment, {
  content: z.string().min(1, "Comment content cannot be empty").optional(),
  updatedAt: z.date().optional(),
});

export const eventWithCommentsSchema = eventSchema.extend({
  comments: z.array(commentSchema),
  isStarred: z.boolean().optional(),
});


// Favorite events table -------------------------------------------------------------------------------------------------------------
export const favoriteEvent = pgTable("favorite_event", {
  userId: uuid("user_id")
  .notNull()
  .references(() => user.id, { onDelete: "cascade" }),
  eventId: uuid("event_id")
  .notNull()
  .references(() => event.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at")
  .$defaultFn(() => /* @__PURE__ */ new Date())
  .notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.eventId] }),
}));

// Followers and Following Tables -------------------------------------------------------------------------------------------------------------
export const followersTable = pgTable("followers",
  {
    userId: uuid("user_id").notNull().references(() => user.id, { onDelete: "cascade" }), 
    followerId: uuid("follower_id").notNull().references(() => user.id, { onDelete: "cascade" }), 
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.followerId] }),
  })
);

export const followingTable = pgTable("following",
  {
    userId: uuid("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    followingId: uuid("following_id").notNull().references(() => user.id, { onDelete: "cascade" }), 
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.followingId] }),
  })
);

// Additional Schemas without db tables -------------------------------------------------------------------------------------------------------------
export const passwordChangeSchema = z
.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
  .string()
  .min(8, "New password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your new password"),
})
.refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// export const CurrentUserSchema = userSchema
// .extend({
//   image: z.url("Invalid image URL").nullable().optional(),
// })
// .omit({
//   role: true,
//   bio: true,
//   location: true,
//   phone: true,
//   followers: true,
//   following: true,
// });

export const schema = {
  user,
  session,
  account,
  verification,
  event,
  comment,
  // venue,
  favoriteEvent,
  followersTable,
  followingTable,
};
