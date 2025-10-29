import { Hono } from "hono";
import {
  db,
  event,
  schema,
  userFormSchema,
  onboardingSchema,
  userSchema,
} from "@vibespot/database";
import { auth } from "@vibespot/database/src/auth";
import { count, eq, and } from "drizzle-orm";

// const app = new Hono<{
//   Variables: {
//     user: typeof auth.$Infer.Session.user | null;
//     session: typeof auth.$Infer.Session.session | null;
//   };
// }>().get("/", async (c) => {

// //   const userId = c.var.user?.id;
// //   if (!userId) {
// //     console.log("No user in session.");
// //     throw new Error("User not authenticated");
// //   }

//   const users = await db.select().from(schema.user);
//     return c.json(users);
// });

const app = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>()
  .get("/", async (c) => {
    const userId = c.req.param("id");
    //   if (!userId) {
    //     console.log("No user in session.");
    //     throw new Error("User not authenticated");
    //   }

    const users = await db.select().from(schema.user);
    return c.json(users);
  })
  .get("/:id", async (c) => {
    const userId = c.req.param("id");
    //   if (!userId) {
    //     console.log("No user in session.");
    //     throw new Error("User not authenticated");
    //   }

    const userById = await db
      .select()
      .from(schema.user)
      .where(eq(schema.user.id, userId!))
      .limit(1)
      .then((res) => res[0]);

    return c.json(userById);
  })
  .put("/updateroletouser/:id", async (c) => {
    const userId = c.req.param("id");

    const result = await db
      .update(schema.user)
      .set({
        role: "user",
      })
      .where(eq(schema.user.id, userId!))
      .returning();

    return c.json(result[0]);
  })
  .put("/updateroletoartist/:id", async (c) => {
    const userId = c.req.param("id");

    const result = await db
      .update(schema.user)
      .set({
        role: "artist",
      })
      .where(eq(schema.user.id, userId!))
      .returning();

    return c.json(result[0]);
  });

//   .get("/navigate/:id", async (c) => {
//     const userId = c.req.param("id");
//     //   if (!userId) {
//     //     console.log("No user in session.");
//     //     throw new Error("User not authenticated");
//     //   }
//     const dbUser = await db
//       .select()
//       .from(schema.user)
//       .where(eq(schema.user.id, userId!))
//       .limit(1)
//       .then((res) => res[0]);

//     if (!dbUser || !dbUser.role) {
//       console.log("No user in session, cannot determine role.");
//       throw new Error("User not authenticated");
//     } else if (dbUser?.role === "New User") {
//       console.log(
//         `Navigating to onboarding for ${dbUser.role} ${dbUser.name}.`
//       );

//       return c.json({ redirectTo: "/onboarding" });
//     } else {
//       console.log(`Navigating to home for ${dbUser.role} ${dbUser.name}.`);
//       return c.json({ redirectTo: "/" });
//     }
//   });

export default app;
