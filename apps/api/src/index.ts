import { Hono } from 'hono';
import { cors } from 'hono/cors';
import events from './routes/events';

const app = new Hono();

app.use('/*', cors({
  origin: '*', // Allow all origins in development
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

app.get('/', (c) => {
  return c.json({ message: 'Welcome to the VibeSpot API!' });
});

// Register routes 
const routes = app.route('/events', events);

// Export the routes type 
export type ApiType = typeof routes;

export default {
  port: 3001,
  fetch: app.fetch,
};