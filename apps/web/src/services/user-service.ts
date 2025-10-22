import { createServerFn } from "@tanstack/react-start";
import { db } from "drizzle";
import {
  schema,
  userFormSchema,
  onboardingSchema,
  userSchema,
} from "drizzle/db";
import { count, eq, and } from "drizzle-orm";
import { authMiddleware } from "@/middlewares/authMiddleware";

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
  .middleware([authMiddleware])
  .validator(userFormSchema)
  .handler(async ({ data, context }) => {
    const user = context.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }

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
  .middleware([authMiddleware])
  .validator(onboardingSchema)
  .handler(async ({ data, context }) => {
    const user = context.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }

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
  .middleware([authMiddleware])
  .validator(userFormSchema)
  .handler(async ({ data, context }) => {
    const user = context.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }

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

export const onUserLoginFn = createServerFn()
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const userId = context.currentUser?.id;
    if (!userId) {
      console.log("No user in session, cannot determine role.");
      throw new Error("User not authenticated");
    }

    console.log("User ID from session:", userId);

    const dbUser = await db
      .select()
      .from(schema.user)
      .where(eq(schema.user.id, userId!))
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
    } else {
      console.log(`Navigating to home for ${dbUser.role} ${dbUser.name}.`);
      return { redirectTo: "/" };
    }
  });

export const followUserFn = createServerFn({
  method: "POST",
  response: "data",
})
  .middleware([authMiddleware])
  .validator(userSchema.pick({ id: true }))
  .handler(async ({ data, context }) => {
    const userId = context.currentUser?.id;
    if (!userId) {
      throw new Error("User not authenticated");
    }

    try {
      const followersResult = await db
        .insert(schema.followersTable)
        .values({
          userId: data.id, // User being followed
          followerId: userId!, // Current user doing the following
        })
        .returning();

      const followingResult = await db
        .insert(schema.followingTable)
        .values({
          userId: userId!, // Current user doing the following
          followingId: data.id, // User being followed
        })
        .returning();

      console.log("Followed user:", followersResult, followingResult);
      return { followers: followersResult, following: followingResult };
    } catch (error) {
      console.error("Error following user:", error);
      throw new Error("Failed to follow user");
    }
  });

export const unfollowUserFn = createServerFn({
  method: "POST",
  response: "data",
})
  .middleware([authMiddleware])
  .validator(userSchema.pick({ id: true }))
  .handler(async ({ data, context }) => {
    const userId = context.currentUser?.id;
    if (!userId) {
      throw new Error("User not authenticated");
    }

    try {
      const followersResult = await db
        .delete(schema.followersTable)
        .where(
          and(
            eq(schema.followersTable.userId, data.id),
            eq(schema.followersTable.followerId, userId!)
          )
        )
        .returning();

      const followingResult = await db
        .delete(schema.followingTable)
        .where(
          and(
            eq(schema.followingTable.userId, userId!),
            eq(schema.followingTable.followingId, data.id)
          )
        )
        .returning();

      console.log("Unfollowed user:", followersResult, followingResult);
      return { followers: followersResult, following: followingResult };
    } catch (error) {
      console.error("Error unfollowing user:", error);
      throw new Error("Failed to unfollow user");
    }
  });

export const getFollowersFn = createServerFn({
  method: "GET",
  response: "data",
})
  .validator(userSchema.pick({ id: true }))
  .handler(async ({ data }) => {
    const result = await db
      .select({ count: count() })
      .from(schema.followersTable)
      .where(eq(schema.followersTable.userId, data.id));

    console.log(
      "Followers count for user",
      data.id,
      ":",
      result[0]?.count || 0
    );
    return result[0]?.count || 0;
  });

export const getFollowingFn = createServerFn({
  method: "GET",
  response: "data",
})
  .validator(userSchema.pick({ id: true }))
  .handler(async ({ data }) => {
    const result = await db
      .select({ count: count() })
      .from(schema.followingTable)
      .where(eq(schema.followingTable.userId, data.id));

    return result[0]?.count || 0;
  });

export const getContextFollowersFn = createServerFn({
  method: "GET",
  response: "data",
})
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const userId = context.currentUser?.id;
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const result = await db
      .select({ count: count() })
      .from(schema.followersTable)
      .where(eq(schema.followersTable.userId, userId!));

    return result[0]?.count || 0;
  });

export const getContextFollowingFn = createServerFn({
  method: "GET",
  response: "data",
})
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const userId = context.currentUser?.id;
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const result = await db
      .select({ count: count() })
      .from(schema.followingTable)
      .where(eq(schema.followingTable.userId, userId!));

    return result[0]?.count || 0;
  });

export const isUserFollowingFn = createServerFn({
  method: "GET",
  response: "data",
})
  .middleware([authMiddleware])
  .validator(userSchema.pick({ id: true }))
  .handler(async ({ data, context }) => {
    const userId = context.currentUser?.id;
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const result = await db
      .select()
      .from(schema.followersTable)
      .where(
        and(
          eq(schema.followersTable.userId, data.id),
          eq(schema.followersTable.followerId, userId!)
        )
      );

    console.log(result.length);

    if (result.length === 1) {
      return true;
    } else if (result.length === 0) {
      return false;
    }
  });

export const getCurrentUserFn = createServerFn({
  method: "GET",
  response: "data",
})
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const userId = context.currentUser?.id;
    if (!userId) {
      return null;
    }

    const result = await db
      .select()
      .from(schema.user)
      .where(eq(schema.user.id, userId))
      .limit(1);

    return result[0];
  });


export const getSessionUserFn = createServerFn({
  method: "GET",
  response: "data",
})
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sessionUser = context.currentUser;
    if (!sessionUser?.id) {
      return null;
    }

    const result = await db
      .select()
      .from(schema.user)
      .where(eq(schema.user.id, sessionUser.id))
      .limit(1);

    return result[0] || null;
  });
