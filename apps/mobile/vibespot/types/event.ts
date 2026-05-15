import type { Event } from "@vibespot/database/schema";

export type EventComment = {
	id: string;
	userId: string;
	eventId: string;
	content: string;
	createdAt: Date;
	updatedAt: Date;
	user: {
		id: string;
		name: string;
		image: string | null;
	};
};

export type EventWithAttendance = Event & {
	attendeeCount: number;
	isGoing: boolean;
	comments?: EventComment[];
};
