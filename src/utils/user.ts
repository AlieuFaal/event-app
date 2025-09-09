import { createServerFn } from "@tanstack/react-start";
import { db } from "drizzle";
import { schema } from "drizzle/db";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { userSchema } from "@/lib/zodUserSchema";

export const getUserData = createServerFn({method: "GET", response: "data",})
.handler(async () => {
  const result = await db.select().from(schema.user);

  return result;
});

export const getUserDataById = createServerFn({method: "GET", response: "data",})
.validator(userSchema)
.handler(async (data) => {
  const result = await db.select().from(schema.user).where(eq(schema.user, data.data.id)).limit(1);

  return result[0];
});
