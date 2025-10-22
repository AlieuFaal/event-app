import { eventInsertSchema } from "drizzle/db/schema";
import { z } from "zod";

export const calendarFormSchema = eventInsertSchema.omit({ 
    id: true, 
    userId: true, 
    createdAt: true 
});

export type TEventFormData = z.infer<typeof calendarFormSchema>;
