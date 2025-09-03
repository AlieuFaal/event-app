import { createServerFn } from "@tanstack/react-start";
import { db } from "drizzle";
import { schema } from "drizzle/db";

export const getUserData = createServerFn({method: "GET", response: "data",})
.handler(async () => {
  const result = await db.select().from(schema.user);

  return result;
});
