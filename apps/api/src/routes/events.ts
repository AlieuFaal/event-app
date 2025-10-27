import { Hono } from 'hono';
import { db, event } from '@vibespot/database';
import { auth } from '@vibespot/database/src/auth';

const app = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>()
  .get('/', async (c) => {
    const events = await db.select().from(event);
    return c.json(events);
  });

export default app;
