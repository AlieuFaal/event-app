import { TrashIcon } from "lucide-react";
import { toast } from "sonner";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/shadcn/ui/alert-dialog";
import { Button } from "@/components/shadcn/ui/button";
import { useCalendar } from "@/components/calendar/contexts/calendar-context";
import { m } from "@/paraglide/messages";

interface DeleteEventDialogProps {
	eventId: string;
}

export default function DeleteEventDialog({ eventId }: DeleteEventDialogProps) {
	const { removeEvent } = useCalendar();

	const deleteEvent = () => {
		try {
			removeEvent(eventId);
			toast.success("Event deleted successfully.");
		} catch {
			toast.error("Error deleting event.");
		}
	};

	if (!eventId) {
		return null;
	}

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button variant="destructive">
					<TrashIcon />
					{m.button_delete()}
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{m.account_delete_confirm()}</AlertDialogTitle>
					<AlertDialogDescription>
						{m.delete_event_description()}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>{m.button_cancel()}</AlertDialogCancel>
					<AlertDialogAction onClick={deleteEvent}>{m.onb_Continue_Button()}</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
