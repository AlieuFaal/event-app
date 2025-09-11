import z from "zod";

export type User = z.infer<typeof userSchema>;

export const userSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  email: z.string().optional(),
  emailVerified: z.boolean(),
  phone: z.string().optional(),
  image: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  role: z.enum(["user", "artist", "admin"]),
});
