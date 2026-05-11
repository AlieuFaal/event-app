import { db } from "@vibespot/database";
import { schema } from "@vibespot/database/schema";
import { and, isNotNull, like, not } from "drizzle-orm";

const shouldWrite = process.argv.includes("--write");

const invalidUserImagesWhere = and(
  isNotNull(schema.user.image),
  not(like(schema.user.image, "https://%")),
);
const invalidEventImagesWhere = and(
  isNotNull(schema.event.imageUrl),
  not(like(schema.event.imageUrl, "https://%")),
);

const invalidUsers = await db
  .select({ id: schema.user.id, image: schema.user.image })
  .from(schema.user)
  .where(invalidUserImagesWhere);

const invalidEvents = await db
  .select({ id: schema.event.id, imageUrl: schema.event.imageUrl })
  .from(schema.event)
  .where(invalidEventImagesWhere);

console.log(
  `Found ${invalidUsers.length} users and ${invalidEvents.length} events with non-HTTPS image values.`,
);

if (!shouldWrite) {
  console.log("Dry run only. Re-run with --write to clear these fields.");
  process.exit(0);
}

if (invalidUsers.length > 0) {
  await db
    .update(schema.user)
    .set({ image: null })
    .where(invalidUserImagesWhere);
}

if (invalidEvents.length > 0) {
  await db
    .update(schema.event)
    .set({ imageUrl: null })
    .where(invalidEventImagesWhere);
}

console.log("Cleared non-HTTPS image values.");
