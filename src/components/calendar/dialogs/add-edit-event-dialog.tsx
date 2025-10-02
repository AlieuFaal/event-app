import { zodResolver } from "@hookform/resolvers/zod";
import { addMinutes, set } from "date-fns";
import { type ReactNode, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/shadcn/ui/button";
import { DateTimePicker } from "@/components/shadcn/ui/date-time-picker2";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/shadcn/ui/form";
import { Input } from "@/components/shadcn/ui/input";
import {
	Modal,
	ModalClose,
	ModalContent,
	ModalDescription,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	ModalTrigger,
} from "@/components/shadcn/ui/responsive-modal";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/shadcn/ui/select";
import { Textarea } from "@/components/shadcn/ui/textarea";
import { COLORS } from "@/components/calendar/constants";
import { useCalendar } from "@/components/calendar/contexts/calendar-context";
import { useDisclosure } from "@/components/calendar/hooks";
import { calendarFormSchema, type TEventFormData } from "@/components/calendar/schemas";
import { authClient } from "@/lib/auth-client";
import { Event } from "drizzle/db";

interface IProps {
	children: ReactNode;
	startDate?: Date;
	startTime?: { hour: number; minute: number };
	event?: Event;
}

export function AddEditEventDialog({
	children,
	startDate,
	startTime,
	event,
}: IProps) {
	const { isOpen, onClose, onToggle } = useDisclosure();
	const { addEvent, updateEvent } = useCalendar();
	const isEditing = !!event;

	const initialDates = useMemo(() => {
		if (!isEditing && !event) {
			if (!startDate) {
				const now = new Date();
				return { startDate: now, endDate: addMinutes(now, 30) };
			}
			const start = startTime
				? set(new Date(startDate), {
					hours: startTime.hour,
					minutes: startTime.minute,
					seconds: 0,
				})
				: new Date(startDate);
			const end = addMinutes(start, 30);
			return { startDate: start, endDate: end };
		}

		return {
			startDate: new Date(event.startDate),
			endDate: new Date(event.endDate),
		};
	}, [startDate, startTime, event, isEditing]);

	const form = useForm<TEventFormData>({
		resolver: zodResolver(calendarFormSchema),
		defaultValues: {
			startDate: initialDates.startDate,
			endDate: initialDates.endDate,
		},
	});

	useEffect(() => {
		form.reset({
			title: event?.title ?? "",
			description: event?.description ?? "",
			address: event?.address ?? "",
			startDate: initialDates.startDate,
			endDate: initialDates.endDate,
			color: event?.color ?? "blue",
		});
	}, [event, initialDates, form]);

	const { data: session } = authClient.useSession()

	const onSubmit = async (values: TEventFormData) => {
		try {
			const formattedEvent = {
				...values,
				id: event?.id || crypto.randomUUID(),
				userId: session?.user.id,
				createdAt: event?.createdAt || new Date(),
			};

			if (isEditing) {
				if (!session) {
					toast.error("You must be logged in to edit an event.");
					return;
				}
				await updateEvent(formattedEvent);
				toast.success("Event updated successfully");
			} else {
				if (!session) {
					toast.error("You must be logged in to create an event.");
					return;
				}
				await addEvent(formattedEvent);
				toast.success("Event created successfully");
			}

			onClose();
			form.reset();
		} catch (error) {
			console.error("Error submitting form:", error);
			toast.error("Failed to save event. Please try again.");
		}
	};

	return (
		<Modal open={isOpen} onOpenChange={onToggle} modal={false}>
			<ModalTrigger asChild>{children}</ModalTrigger>
			<ModalContent>
				<ModalHeader>
					<ModalTitle>{isEditing ? "Edit Event" : "Add New Event"}</ModalTitle>
					<ModalDescription>
						{isEditing
							? "Modify your existing event."
							: "Create a new event for your calendar."}
					</ModalDescription>
				</ModalHeader>

				<Form {...form}>
					<form
						id="event-form"
						onSubmit={form.handleSubmit(onSubmit)}
						className="grid gap-4 py-4"
					>
						<FormField
							control={form.control}
							name="title"
							render={({ field, fieldState }) => (
								<FormItem>
									<FormLabel htmlFor="title" className="required">
										Title
									</FormLabel>
									<FormControl>
										<Input
											id="title"
											placeholder="Enter a title"
											{...field}
											className={fieldState.invalid ? "border-red-500" : ""}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="address"
							render={({ field, fieldState }) => (
								<FormItem>
									<FormLabel htmlFor="address" className="required">
										Location
									</FormLabel>
									<FormControl>
										<Input
											id="address"
											placeholder="Where's the event?"
											{...field}
											className={fieldState.invalid ? "border-red-500" : ""}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="startDate"
							render={({ field }) => (
								<DateTimePicker form={form} field={field} />
							)}
						/>
						<FormField
							control={form.control}
							name="endDate"
							render={({ field }) => (
								<DateTimePicker form={form} field={field} />
							)}
						/>
						<FormField
							control={form.control}
							name="color"
							render={({ field, fieldState }) => (
								<FormItem>
									<FormLabel className="required">Color</FormLabel>
									<FormControl>
										<Select value={field.value} onValueChange={field.onChange}>
											<SelectTrigger
												className={`w-full ${fieldState.invalid ? "border-red-500" : ""
													}`}
											>
												<SelectValue placeholder="Select a variant" />
											</SelectTrigger>
											<SelectContent>
												{COLORS.map((color) => (
													<SelectItem value={color} key={color}>
														<div className="flex items-center gap-2">
															<div
																className={`size-3.5 rounded-full bg-${color}-600 dark:bg-${color}-700`}
															/>
															{color.charAt(0).toUpperCase() + color.slice(1)}
														</div>
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="description"
							render={({ field, fieldState }) => (
								<FormItem>
									<FormLabel className="required">Description</FormLabel>
									<FormControl>
										<Textarea
											{...field}
											placeholder="Enter a description"
											className={fieldState.invalid ? "border-red-500" : ""}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</form>
				</Form>
				
				<ModalFooter className="flex justify-end gap-2">
					<ModalClose asChild>
						<Button type="button" variant="outline">
							Cancel
						</Button>
					</ModalClose>
					<Button 
						form="event-form" 
						type="submit"
						onClick={form.handleSubmit(onSubmit)}
					>
						{isEditing ? "Save Changes" : "Create Event"}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
