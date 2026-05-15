import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { EventComment, EventWithAttendance } from "@/types/event";

type EventDetailsResponse = Omit<
	EventWithAttendance,
	"startDate" | "endDate" | "repeatEndDate" | "createdAt" | "comments"
> & {
	startDate: string | Date;
	endDate: string | Date;
	repeatEndDate?: string | Date | null;
	createdAt: string | Date;
	comments?: Array<
		Omit<EventComment, "createdAt" | "updatedAt"> & {
			createdAt: string | Date;
			updatedAt: string | Date;
		}
	>;
};

function normalizeEventDetails(
	data: EventDetailsResponse,
): EventWithAttendance {
	return {
		...data,
		startDate: new Date(data.startDate),
		endDate: new Date(data.endDate),
		repeatEndDate: data.repeatEndDate ? new Date(data.repeatEndDate) : null,
		createdAt: new Date(data.createdAt),
		comments: data.comments?.map((comment) => ({
			...comment,
			createdAt: new Date(comment.createdAt),
			updatedAt: new Date(comment.updatedAt),
		})),
	};
}

export const useGetEventById = (id: string | undefined) => {
	const { isPending, error, data } = useQuery<EventWithAttendance, Error>({
		queryKey: ["event", id],
		queryFn: async () => {
			const res = await apiClient.events[":id"].$get({
				param: { id: id ?? "" },
			});

			if (res.ok) {
				const data = await res.json();
				return normalizeEventDetails(data);
			} else {
				throw new Error("Failed to fetch event");
			}
		},
		enabled: !!id,
	});

	return { isPending, error, data };
};
