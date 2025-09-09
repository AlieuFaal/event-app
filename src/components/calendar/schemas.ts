import { zodCalendarEventSchema } from "@/lib/zodCalendarEventSchema";
import { z } from "zod";

export const eventSchema = z.object({
    id: z.uuid(),
    title: z.string().min(2, {
        message: "Event title must have at least 2 characters.",
    }).max(100, {
        message: "Event name must have at most 100 characters.",
    }),
    description: z.string().min(2, {
        message: "Description must contain atleast 2 characters.",
    }),
    location: z.string().min(2, {
        message: "Location name must be atleast 2 characters."
    }),
    color: z.enum(["blue", "green", "red", "yellow", "purple", "orange"]),
    startDate: z.date(),
    endDate: z.date(),
    userId: z.uuid().or(z.null()).optional(),
	});

export type TEventFormData = z.infer<typeof zodCalendarEventSchema>;
