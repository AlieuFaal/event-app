import { createServerFn } from "@tanstack/react-start";
import { db } from "drizzle";
import {
  schema,
  userFormSchema,
  onboardingSchema,
  User,
  userInsertSchema,
  userSchema,
} from "drizzle/db";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { authClient } from "@/lib/auth-client";
import { authMiddleware } from "@/middlewares/authMiddleware";
import { Navigate, redirect } from "@tanstack/react-router";
import { router } from "@/router";

export const getUserDataFn = createServerFn({
  method: "GET",
  response: "data",
}).handler(async () => {
  const result = await db.select().from(schema.user);

  return result;
});

export const getUserDataByIdFn = createServerFn({
  method: "GET",
  response: "data",
})
  .validator(userSchema.pick({ id: true }))
  .handler(async ({ data }) => {
    const result = await db
      .select()
      .from(schema.user)
      .where(eq(schema.user.id, data.id))
      .limit(1);

    return result[0];
  });

export const updateUserDataFn = createServerFn({
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

export const updateRoleFn = createServerFn({
  method: "POST",
  response: "data",
})
  .validator(onboardingSchema)
  .handler(async ({ data }) => {
    const result = await db
      .update(schema.user)
      .set({
        role: data.role,
      })
      .where(eq(schema.user.id, data.id))
      .returning();

    return result[0];
  });

export const onbUpdateUserDataFn = createServerFn({
  method: "POST",
  response: "data",
})
  .validator(userFormSchema)
  .handler(async ({ data }) => {
    const result = await db
      .update(schema.user)
      .set({
        phone: data.phone,
        location: data.location,
      })
      .where(eq(schema.user.id, data.id))
      .returning();

    return result[0];
  });

// Vid en successfull login, navigera användaren till /onboarding om role är "New User"
// Vid successfull login = om en session existerar.
export const onUserLoginFn = createServerFn()
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const userId = context.session?.user.id;
    if (!userId) {
      throw new Error("User not authenticated");
    }
    console.log("User ID from session:", userId);

    const dbUser = await db
      .select()
      .from(schema.user)
      .where(eq(schema.user.id, userId))
      .limit(1)
      .then((res) => res[0]);

    if (!dbUser || !dbUser.role) {
      console.log("No user in session, cannot determine role.");
      throw new Error("User not authenticated");
    } else if (dbUser?.role === "New User") {
      console.log(
        `Navigating to onboarding for ${dbUser.role} ${dbUser.name}.`
      );

      return { redirectTo: "/onboarding" };
      // redirect({ to: "/onboarding", throw: true });
      // router.navigate({ to: "/"});
    } else {
      console.log(`Navigating to home for ${dbUser.role} ${dbUser.name}.`);
      return { redirectTo: "/" };
    }
  });
