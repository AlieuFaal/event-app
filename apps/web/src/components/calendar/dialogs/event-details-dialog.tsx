"use client";

import { format } from "date-fns";
import { Calendar, Clock, MapPin, Text, User as UserLucide } from "lucide-react";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { useCalendar } from "@/components/calendar/contexts/calendar-context";
import { AddEditEventDialog } from "@/components/calendar/dialogs/add-edit-event-dialog";
import { formatTime } from "@/components/calendar/helpers";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/shadcn/ui/dialog";
import { ScrollArea } from "@/components/shadcn/ui/scroll-area";
import { Button } from "@/components/shadcn/ui/button";
import { authClient } from "@/lib/auth-client";
import { Event, User } from "drizzle/db";
import { m } from "@/paraglide/messages";
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalFooter } from "@/components/shadcn/ui/responsive-modal";
import { deleteAllRepeatedEventsFn } from "@/services/eventService";

interface IProps {
	event: Event;
	users: User[];
	children: ReactNode;
}

export function EventDetailsDialog({ event, children }: IProps) {
	const startDate = event.startDate;
	const endDate = event.endDate;
	const { use24HourFormat, removeEvent } = useCalendar();
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const session = authClient.useSession();

	const isRepeatedEvent = event && ["daily", "weekly", "monthly", "yearly"].includes((event.repeat as string) || "");

	const handleOpenDeleteDialog = () => {
		if (isRepeatedEvent) {
			setDeleteDialogOpen(true);
		} else {
			removeEvent(event.id);
			toast.success("Event deleted successfully.");
		}
	};

	const deleteEvent = (eventId?: string, deleteAll?: boolean) => {
		try {
			if (!eventId) return;

			if (!session?.data?.user) {
				toast.error("You must be logged in to delete an event.");
				return;
			}

			if (event.userId !== session.data.user.id) {
				toast.error("You can only delete your own events.");
				return;
			}

			if (isRepeatedEvent && deleteAll) {
				deleteAllRepeatedEventsFn({ data: { id: event.id } });
				toast.success("All Events deleted successfully.");
			} else {
				removeEvent(eventId);
				toast.success("Event deleted successfully.");
			}
			return;
		} catch {
			toast.error("Error deleting event.");
		}
	};

	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{event.title}</DialogTitle>
				</DialogHeader>

				<ScrollArea className="max-h-[80vh]">
					<div className="space-y-4 p-4">
						<div className="flex items-start gap-2">
							<MapPin className="mt-1 size-4 shrink-0 text-muted-foreground" />
							<div>
								<p className="text-sm font-medium">{m.form_address_label()}</p>
								<p className="text-sm text-muted-foreground">
									{event.address || "No address provided"}
								</p>
							</div>
						</div>

						<div className="flex items-start gap-2">
							<Calendar className="mt-1 size-4 shrink-0 text-muted-foreground" />
							<div>
								<p className="text-sm font-medium">{m.start_date_label()}</p>
								<p className="text-sm text-muted-foreground">
									{format(startDate, "EEEE dd MMMM")}
									<span className="mx-1">at</span>
									{formatTime(event.startDate, use24HourFormat)}
								</p>
							</div>
						</div>

						<div className="flex items-start gap-2">
							<Clock className="mt-1 size-4 shrink-0 text-muted-foreground" />
							<div>
								<p className="text-sm font-medium">{m.end_date_label()}</p>
								<p className="text-sm text-muted-foreground">
									{format(endDate, "EEEE dd MMMM")}
									<span className="mx-1">at</span>
									{formatTime(event.endDate, use24HourFormat)}
								</p>
							</div>
						</div>

						<div className="flex items-start gap-2">
							<Text className="mt-1 size-4 shrink-0 text-muted-foreground" />
							<div>
								<p className="text-sm font-medium">{m.form_description_label()}</p>
								<p className="text-sm text-muted-foreground">
									{event.description}
								</p>
							</div>
						</div>
					</div>
				</ScrollArea>
				{event.userId !== session?.data?.user.id ? null : (
					<div className="flex justify-end gap-2">
						<AddEditEventDialog event={event}>
							<Button variant="outline" className="hover:scale-110 cursor-pointer">{m.edit_event_button()}</Button>
						</AddEditEventDialog>
						<Button
							variant="destructive"
							className="hover:scale-110 cursor-pointer"
							onClick={() => {
								handleOpenDeleteDialog();
							}}
						>
							{m.button_delete()}
						</Button>
					</div>
				)}
				<DialogClose />
			</DialogContent>

			<Modal open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} modal={true}>
				<ModalContent>
					<ModalHeader>
						<ModalTitle>{m.details_delete_modal_title()}</ModalTitle>
						<ModalDescription>
							{m.details_delete_modal_description()}
						</ModalDescription>
					</ModalHeader>
					<div className="flex w-fit">
						<ModalFooter className="flex justify-center-safe gap-4 mt-4">
							<Button
								variant="outline"
								className="hover:scale-110 cursor-pointer"
								onClick={() => {
									deleteEvent(event.id, true);
								}}
							>
								{m.details_delete_option_all()}
							</Button>
							<Button
								variant="outline"
								className="hover:scale-110 cursor-pointer"
								onClick={() => {
									deleteEvent(event.id, false);
								}}
							>
								{m.details_delete_option_single()}
							</Button>
						</ModalFooter>
					</div>
				</ModalContent>
			</Modal>
		</Dialog>
	);
}
