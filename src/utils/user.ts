import { createServerFn } from "@tanstack/react-start";
import { db } from "drizzle";
import { schema, userFormSchema } from "drizzle/db";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { authClient } from "@/lib/auth-client";

export const getUserData = createServerFn({
  method: "GET",
  response: "data",
}).handler(async () => {
  const result = await db.select().from(schema.user);

  return result;
});

export const getUserDataById = createServerFn({
  method: "GET",
  response: "data",
})
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const result = await db
      .select()
      .from(schema.user)
      .where(eq(schema.user.id, data.id))
      .limit(1);

    return result[0];
  });

export const updateUserData = createServerFn({
  method: "POST",
  response: "data",
})
  .validator(userFormSchema)
  .handler(async ({ data }) => {
    const result = await db
      .update(schema.user)
      .set({
        name: data.name,
        phone: data.phone,
        location: data.location,
        bio: data.bio,
        role: data.role,
      })
      .where(eq(schema.user.id, data.id))
      .returning();

    return result[0];
  });
