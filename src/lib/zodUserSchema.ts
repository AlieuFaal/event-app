import z from "zod";

export type User = z.infer<typeof userSchema>;

export const userSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  email: z.string(),
  emailVerified: z.boolean(),
  phone: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  role: z.enum(["user", "artist", "admin"]),
});