import { Hono } from 'hono';
import { db, event } from '@vibespot/database';

const app = new Hono()
  .get('/', async (c) => {
    const events = await db.select().from(event);
    return c.json(events);
  });

export default app;
