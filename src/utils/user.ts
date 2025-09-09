import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const getUserData = createServerFn({method: "GET", response: "data",})
.handler(async () => {
  const { db } = await import("../../drizzle");
  const { schema } = await import("../../drizzle/db");
  
  const result = await db.select().from(schema.user);

  return result;
});

export const getUserDataById = createServerFn({method: "GET", response: "data",})
.validator(z.object({ id: z.string() }))
.handler(async ({ data }) => {
  const { db } = await import("../../drizzle");
  const { schema } = await import("../../drizzle/db");
  const { eq } = await import("drizzle-orm");
  
  const result = await db.select().from(schema.user).where(eq(schema.user.id, data.id)).limit(1);

  return result[0];
});


export async function findUserRoles(userId: string): Promise<string[]> {
  try {
    const { db } = await import("../../drizzle");
    const { schema } = await import("../../drizzle/db");
    const { eq } = await import("drizzle-orm");
    
    const user = await db.select().from(schema.user).where(eq(schema.user.id, userId)).limit(1);
    
    if (!user || user.length === 0) {
      return ["user"]; 
    }
    
    const userRole = user[0].role;
    
    if (userRole === "artist") {
      return ["artist", "user"]; 
    } else if (userRole === "admin") {
      return ["admin", "artist", "user"]; 
    }
    
    return ["user"]; 
  } catch (error) {
    console.error("Error finding user roles:", error);
    return ["user"]; 
  }
}
