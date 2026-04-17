import { eventInsertBaseSchema } from "@vibespot/database/schema";
import { z } from "zod";

export const calendarFormSchema = eventInsertBaseSchema
	.omit({
		id: true,
		userId: true,
		createdAt: true,
	})
	.extend({
		startDate: z.date(),
		endDate: z.date(),
		repeatEndDate: z.date().nullish(),
	})
	.superRefine((data, ctx) => {
		if (data.startDate && data.endDate && data.startDate > data.endDate) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "The start date must be before the end date",
				path: ["startDate"],
			});
		}
	});

export type TEventFormData = z.infer<typeof calendarFormSchema>;
