import z from "zod";

export const zodCalendarEventSchema = z.object({
    title: z.string().min(2, {
        message: "Event title must have at least 2 characters.",
    }).max(100, {
        message: "Event name must have at most 100 characters.",
    }),
    start: z.date(),
    end: z.date(),
});