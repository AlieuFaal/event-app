import z from "zod";

export type User = z.infer<typeof userFormSchema>;

export const userFormSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  phone: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().optional(),
  role: z.enum(["user", "artist"]).default("user").optional(),
});