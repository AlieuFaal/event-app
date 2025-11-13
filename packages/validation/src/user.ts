import { z } from "zod";

// Constants
export const roles = ["user", "artist", "admin", "New User"] as const;

// Types
export type Role = (typeof roles)[number];
export type User = z.infer<typeof userSchema>;
export type NewUser = z.infer<typeof userInsertSchema>;
export type UpdateUser = z.infer<typeof userUpdateSchema>;
export type UserForm = z.infer<typeof userFormSchema>;
export type Session = z.infer<typeof sessionSchema>;
export type OnboardingUpdate = z.infer<typeof onbFormUpdateSchema>;
export type CurrentUser = z.infer<typeof CurrentUserSchema>;
export type PasswordChangeForm = z.infer<typeof passwordChangeSchema>;

// User Schemas
export const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Please enter your name"),
  email: z.string().email("Please enter a valid email address"),
  emailVerified: z.boolean(),
  phone: z.string().nullish(),
  image: z.string().url("Please enter a valid image URL").nullish(),
  location: z.string().nullish(),
  bio: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
  role: z.enum(roles),
});

export const userSocialSchema = userSchema.extend({
  isFollowing: z.boolean().optional(),
});

export const userInsertSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Please enter your name"),
  email: z.string().email("Please enter a valid email address"),
  emailVerified: z.boolean().optional(),
  phone: z.string().nullish(),
  image: z.string().url("Please enter a valid image URL").optional(),
  location: z.string().nullish(),
  bio: z.string().nullish(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  role: z.enum(roles).default("New User"),
});

export const userUpdateSchema = z.object({
  name: z.string().min(1, "Please enter your name").optional(),
  email: z.string().email("Please enter a valid email address").optional(),
  emailVerified: z.boolean().optional(),
  phone: z.string().nullish(),
  image: z.string().url("Please enter a valid image URL").optional(),
  location: z.string().nullish(),
  bio: z.string().nullish(),
  updatedAt: z.date().optional(),
  role: z.enum(roles).optional(),
});

export const userFormSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Please enter your name").optional(),
  phone: z.string().nullish(),
  image: z.string().url("Please enter a valid image URL").optional(),
  location: z.string().nullish(),
  bio: z.string().nullish(),
  role: z.enum(["user", "artist"]).default("user").optional(),
  updatedAt: z.date().optional(),
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

export const roleUpdateSchema = z.object({
  role: z.enum(["user", "artist"]),
});

// Session Schema
export const sessionSchema = z.object({
  id: z.string().uuid(),
  expiresAt: z.date(),
  token: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  ipAddress: z.string().nullish(),
  userAgent: z.string().nullish(),
  userId: z.string().uuid(),
});

// Additional Schemas
export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Please enter your current password"),
    newPassword: z
      .string()
      .min(8, "Your new password must be at least 8 characters long"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "The passwords you entered don't match. Please try again",
    path: ["confirmPassword"],
  });

export const CurrentUserSchema = userSchema
  .extend({
    image: z
      .string()
      .url("Please enter a valid image URL")
      .nullable()
      .optional(),
  })
  .omit({
    role: true,
    bio: true,
    location: true,
    phone: true,
  });
