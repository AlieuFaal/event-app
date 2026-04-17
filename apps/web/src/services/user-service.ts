import { createServerFn } from "@tanstack/react-start";
import { db } from "@vibespot/database";
import {
  schema,
  userFormSchema,
  onboardingSchema,
  onbFormUpdateSchema,
  userSchema,
} from "@vibespot/database/schema";
import { count, eq, and } from "drizzle-orm";
import { authMiddleware } from "@/middlewares/authMiddleware";

const sanitizeUserForViewer = (
  user: typeof schema.user.$inferSelect,
  viewerId: string
) => {
  if (user.id === viewerId) {
    return user;
  }

  return {
    ...user,
    email: "",
    phone: null,
    location: null,
  };
};

export const getUserDataFn = createServerFn({
  method: "GET",
})
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const viewerId = context.currentUser?.id;
    if (!viewerId) {
      throw new Error("User not authenticated");
    }

    const result = await db.select().from(schema.user);
    return result.map((user) => sanitizeUserForViewer(user, viewerId));
  });

export const getUserDataByIdFn = createServerFn({
  method: "GET",
})
  .middleware([authMiddleware])
  .inputValidator(userSchema.pick({ id: true }))
  .handler(async ({ data, context }) => {
    const viewerId = context.currentUser?.id;
    if (!viewerId) {
      throw new Error("User not authenticated");
    }

    const result = await db
      .select()
      .from(schema.user)
      .where(eq(schema.user.id, data.id))
      .limit(1);

    const user = result[0];
    if (!user) {
      return null;
    }

    return sanitizeUserForViewer(user, viewerId);
  });

export const updateUserDataFn = createServerFn({
  method: "POST",
})
  .middleware([authMiddleware])
  .inputValidator(userFormSchema)
  .handler(async ({ data, context }) => {
    const userId = context.currentUser?.id;
    if (!userId) {
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
      .where(eq(schema.user.id, userId))
      .returning();

    return result[0];
  });

export const updateRoleFn = createServerFn({
  method: "POST",
})
  .middleware([authMiddleware])
  .inputValidator(onboardingSchema)
  .handler(async ({ data, context }) => {
    const userId = context.currentUser?.id;
    if (!userId) {
      throw new Error("User not authenticated");
    }

    if (data.id !== userId) {
      throw new Error("Forbidden");
    }

    const result = await db
      .update(schema.user)
      .set({
        role: data.role,
      })
      .where(eq(schema.user.id, userId))
      .returning();

    return result[0];
  });

export const onbUpdateUserDataFn = createServerFn({
  method: "POST",
})
  .middleware([authMiddleware])
  .inputValidator(onbFormUpdateSchema)
  .handler(async ({ data, context }) => {
    const userId = context.currentUser?.id;
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const result = await db
      .update(schema.user)
      .set({
        phone: data.phone,
        location: data.location,
      })
      .where(eq(schema.user.id, userId))
      .returning();

    return result[0];
  });

export const onUserLoginFn = createServerFn()
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const userId = context.currentUser?.id;
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const dbUser = await db
      .select()
      .from(schema.user)
      .where(eq(schema.user.id, userId))
      .limit(1)
      .then((res) => res[0]);

    if (!dbUser || !dbUser.role) {
      throw new Error("User not authenticated");
    }

    if (dbUser.role === "New User") {
      return { redirectTo: "/onboarding" };
    }

    return { redirectTo: "/" };
  });

export const followUserFn = createServerFn({
  method: "POST",
})
  .middleware([authMiddleware])
  .inputValidator(userSchema.pick({ id: true }))
  .handler(async ({ data, context }) => {
    const userId = context.currentUser?.id;
    if (!userId) {
      throw new Error("User not authenticated");
    }

    if (userId === data.id) {
      throw new Error("You cannot follow yourself");
    }

    const followersResult = await db
      .insert(schema.followersTable)
      .values({
        userId: data.id,
        followerId: userId,
      })
      .returning();

    const followingResult = await db
      .insert(schema.followingTable)
      .values({
        userId,
        followingId: data.id,
      })
      .returning();

    return { followers: followersResult, following: followingResult };
  });

export const unfollowUserFn = createServerFn({
  method: "POST",
})
  .middleware([authMiddleware])
  .inputValidator(userSchema.pick({ id: true }))
  .handler(async ({ data, context }) => {
    const userId = context.currentUser?.id;
    if (!userId) {
      throw new Error("User not authenticated");
    }

    if (userId === data.id) {
      throw new Error("You cannot unfollow yourself");
    }

    const followersResult = await db
      .delete(schema.followersTable)
      .where(
        and(
          eq(schema.followersTable.userId, data.id),
          eq(schema.followersTable.followerId, userId)
        )
      )
      .returning();

    const followingResult = await db
      .delete(schema.followingTable)
      .where(
        and(
          eq(schema.followingTable.userId, userId),
          eq(schema.followingTable.followingId, data.id)
        )
      )
      .returning();

    return { followers: followersResult, following: followingResult };
  });

export const getFollowersFn = createServerFn({
  method: "GET",
})
  .inputValidator(userSchema.pick({ id: true }))
  .handler(async ({ data }) => {
    const result = await db
      .select({ count: count() })
      .from(schema.followersTable)
      .where(eq(schema.followersTable.userId, data.id));

    return result[0]?.count || 0;
  });

export const getFollowingFn = createServerFn({
  method: "GET",
})
  .inputValidator(userSchema.pick({ id: true }))
  .handler(async ({ data }) => {
    const result = await db
      .select({ count: count() })
      .from(schema.followingTable)
      .where(eq(schema.followingTable.userId, data.id));

    return result[0]?.count || 0;
  });

export const getContextFollowersFn = createServerFn({
  method: "GET",
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
      .where(eq(schema.followersTable.userId, userId));

    return result[0]?.count || 0;
  });

export const getContextFollowingFn = createServerFn({
  method: "GET",
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
      .where(eq(schema.followingTable.userId, userId));

    return result[0]?.count || 0;
  });

export const isUserFollowingFn = createServerFn({
  method: "GET",
})
  .middleware([authMiddleware])
  .inputValidator(userSchema.pick({ id: true }))
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
          eq(schema.followersTable.followerId, userId)
        )
      );

    return result.length > 0;
  });

export const getCurrentUserFn = createServerFn({
  method: "GET",
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
