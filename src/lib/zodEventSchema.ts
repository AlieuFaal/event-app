import z from "zod";

export const zodEventSchema = z.object({
    eventTitle: z.string().min(2, {
        message: "Event title must have at least 2 characters.",
    }).max(100, {
        message: "Event name must have at most 100 characters.",
    }),
    eventDescription: z.string().min(2, {
        message: "Description must contain atleast 2 characters.",
    }),
    eventLocation: z.string().min(2, {
        message: "Location name must be atleast 2 characters."
    }),
    eventStartDate: z.date().optional(),
    eventEndDate: z.date().optional(),
    userId: z.uuid().optional()
});
