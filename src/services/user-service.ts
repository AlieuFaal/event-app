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

export const followUserFn = createServerFn({
  method: "POST",
  response: "data",
})
  .middleware([authMiddleware])
  .validator(userSchema.pick({ id: true }))
  .handler(async ({ data, context }) => {
    const userId = context.session?.user.id;
    if (!userId) {
      throw new Error("User not authenticated");
    }
    try {
      // Insert into followers table (user being followed gets a follower)
      const followersResult = await db
        .insert(schema.followersTable)
        .values({
          userId: data.id, // User being followed
          followerId: userId, // Current user doing the following
        })
        .returning();

      // Insert into following table (current user is now following someone)
      const followingResult = await db
        .insert(schema.followingTable)
        .values({
          userId: userId, // Current user doing the following
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
    const userId = context.session?.user.id;
    if (!userId) {
      throw new Error("User not authenticated");
    }
    try {
      // Remove from followers table
      const followersResult = await db
        .delete(schema.followersTable)
        .where(
          and(
            eq(schema.followersTable.userId, data.id),
            eq(schema.followersTable.followerId, userId)
          )
        )
        .returning();

      // Remove from following table
      const followingResult = await db
        .delete(schema.followingTable)
        .where(
          and(
            eq(schema.followingTable.userId, userId),
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
      .select({count: count()})
      .from(schema.followersTable)
      .where(eq(schema.followersTable.userId, data.id));
      
    console.log("Followers count for user", data.id, ":", result[0]?.count || 0);
    return result[0]?.count || 0;
  });

export const getFollowingFn = createServerFn({
  method: "GET",
  response: "data",
})
  .validator(userSchema.pick({ id: true }))
  .handler(async ({ data }) => {
    const result = await db
      .select({count: count()})
      .from(schema.followingTable)
      .where(eq(schema.followingTable.userId, data.id));

    console.log("Following count for user", data.id, ":", result[0]?.count || 0);
    return result[0]?.count || 0;
  });


  export const getContextFollowersFn = createServerFn({
  method: "GET",
  response: "data",
})
.middleware([authMiddleware])
  .handler(async ({ context }) => {
    const result = await db
      .select({count: count()})
      .from(schema.followersTable)
      .where(eq(schema.followersTable.userId, context.session.user.id));
      
    console.log("Followers count for user", context.session.user.id, ":", result[0]?.count || 0);
    return result[0]?.count || 0;
  });

export const getContextFollowingFn = createServerFn({
  method: "GET",
  response: "data",
}).middleware([authMiddleware])
  .handler(async ({ context }) => {
    const result = await db
      .select({count: count()})
      .from(schema.followingTable)
      .where(eq(schema.followingTable.userId, context.session.user.id));

    console.log("Following count for user", context.session.user.id, ":", result[0]?.count || 0);
    return result[0]?.count || 0;
  });
