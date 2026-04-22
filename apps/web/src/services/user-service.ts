import { createServerFn } from "@tanstack/react-start";
import { db } from "@vibespot/database";
import {
  schema,
  userFormSchema,
  onboardingSchema,
  onbFormUpdateSchema,
  userSchema,
} from "@vibespot/database/schema";
import { eq, and } from "drizzle-orm";
import { authMiddleware } from "@/middlewares/authMiddleware";

export type FollowUserListItem = Pick<
  typeof schema.user.$inferSelect,
  "id" | "name" | "image"
>;

const getFollowersDataByUserId = async (userId: string) => {
  const followers: FollowUserListItem[] = await db
    .select({
      id: schema.user.id,
      name: schema.user.name,
      image: schema.user.image,
    })
    .from(schema.followersTable)
    .innerJoin(schema.user, eq(schema.followersTable.followerId, schema.user.id))
    .where(eq(schema.followersTable.userId, userId));

  return {
    followerCount: followers.length,
    followers,
  };
};

const getFollowingDataByUserId = async (userId: string) => {
  const following: FollowUserListItem[] = await db
    .select({
      id: schema.user.id,
      name: schema.user.name,
      image: schema.user.image,
    })
    .from(schema.followingTable)
    .innerJoin(schema.user, eq(schema.followingTable.followingId, schema.user.id))
    .where(eq(schema.followingTable.userId, userId));

  return {
    followingCount: following.length,
    following,
  };
};

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
    return getFollowersDataByUserId(data.id);
  });

export const getFollowingFn = createServerFn({
  method: "GET",
})
  .inputValidator(userSchema.pick({ id: true }))
  .handler(async ({ data }) => {
    return getFollowingDataByUserId(data.id);
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

    return getFollowersDataByUserId(userId);
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

    return getFollowingDataByUserId(userId);
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
