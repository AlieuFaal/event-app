import { zodResolver } from "@hookform/resolvers/zod";
import { addMinutes, set } from "date-fns";
import { type ReactNode, useEffect, useMemo, useState } from "react";
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
import { COLORS, GENRES } from "@/components/calendar/constants";
import { useCalendar } from "@/components/calendar/contexts/calendar-context";
import { useDisclosure } from "@/components/calendar/hooks";
import { calendarFormSchema, type TEventFormData } from "@/components/calendar/schemas";
import { authClient } from "@/lib/auth-client";
import { Event, User } from "drizzle/db";
import { m } from "@/paraglide/messages";
import { AddressAutofill, useAddressAutofillCore } from "@mapbox/search-js-react";


interface IProps {
	children: ReactNode;
	startDate?: Date;
	startTime?: { hour: number; minute: number };
	event?: Event;
	currentUser?: User | null;
}

export function AddEditEventDialog({
	children,
	startDate,
	startTime,
	event,
	currentUser,
}: IProps) {
	const { isOpen, onClose, onToggle } = useDisclosure();
	const { addEvent, updateEvent } = useCalendar();
	const [autofillResponse, setAutofillResponse] = useState<{ suggestions: any[] }>({ suggestions: [] });
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
			title: "",
			description: "",
			address: "",
			venue: "",
			latitude: "",
			longitude: "",
			color: "Blue",
			genre: "Indie",
			startDate: initialDates.startDate,
			endDate: initialDates.endDate,
		},
	});

	useEffect(() => {
		form.reset({
			title: event?.title ?? "",
			description: event?.description ?? "",
			address: event?.address ?? "",
			venue: event?.venue ?? "",
			latitude: event?.latitude ?? "",
			longitude: event?.longitude ?? "",
			startDate: initialDates.startDate,
			endDate: initialDates.endDate,
			color: event?.color ?? "Blue",
			genre: event?.genre ?? "Indie",
		});
	}, [event, initialDates, form]);

	const { data: session } = authClient.useSession()

	const onSubmit = async (values: TEventFormData) => {
		try {
			const formattedEvent = {
				...values,
				id: event?.id || crypto.randomUUID(),
				userId: session?.user.id,
				venue: values.venue || null,
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
				else if (values.latitude === "" || values.longitude === "") {
					toast.error("Please select a valid address from the suggestions.");
					console.log("Latitude or Longitude is empty:", values.latitude, values.longitude);
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

	// const addressAutofill = useAddressAutofillCore({ accessToken: import.meta.env.VITE_PUBLIC_MAPBOX_ACCESS_TOKEN });

	// const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
	// 	form.setValue("address", e.target.value);

	// 	const searchText = form.getValues("address");
	// 	const autofillResponse = await addressAutofill.suggest(searchText, { sessionToken: currentUser?.id || '' });
	// 	setAutofillResponse(autofillResponse);
	// 	console.log(autofillResponse);
	// };

	return (
		<Modal open={isOpen} onOpenChange={onToggle} modal={true}>
			{currentUser?.role !== "user" && (
				<ModalTrigger onChange={onToggle} asChild>{children}</ModalTrigger>
			)}
			<ModalContent>
				<ModalHeader>
					<ModalTitle>{isEditing ? `${m.edit_event_label()}` : `${m.create_event_title()}`}</ModalTitle>
					<ModalDescription>
						{isEditing ? `${m.edit_event_description()}` : `${m.create_event_description()}`}
					</ModalDescription>
				</ModalHeader>

				<Form {...form}>
					<form
						id="event-form"
						onSubmit={form.handleSubmit(onSubmit)}
						className="grid gap-4 py-4"
						autoComplete="off"
						autoSave="off"
						aria-autocomplete="none"
					>
						<FormField
							control={form.control}
							name="title"
							render={({ field, fieldState }) => (
								<FormItem>
									<FormLabel htmlFor="title" className="required">
										{m.form_title_label()}
									</FormLabel>
									<FormControl>
										<Input
											id="title"
											placeholder={m.form_title_placeholder()}
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
							name="venue"
							render={({ field }) => (
								<FormItem>
									<FormLabel htmlFor="venue">
										{m.form_venue_label()}
									</FormLabel>
									<FormControl>
										<Input
											id="venue"
											placeholder={m.form_venue_placeholder()}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<AddressAutofill
							accessToken={import.meta.env.VITE_PUBLIC_MAPBOX_ACCESS_TOKEN}
							onRetrieve={(res: any) => {
								form.setValue("latitude", res.features[0]?.geometry.coordinates[0].toString() || "");
								form.setValue("longitude", res.features[0]?.geometry.coordinates[1].toString() || "");
							}}
							onSuggestError={(e: any) => console.log(e)}
							browserAutofillEnabled={false}
							confirmOnBrowserAutofill={false}
							options={{ country: 'se', streets: true }}
							theme={{ variables: { borderRadius: '1.3rem', padding: "0.7rem" } }}
						>
							<FormField
								control={form.control}
								name="address"
								render={({ field, fieldState }) => (
									<FormItem>
										<FormLabel htmlFor="address" className="required">
											{m.form_address_label()}
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												id="address"
												placeholder={m.form_address_placeholder()}
												value={field.value}
												// onChange={handleChange}
												autoComplete="address-line3"
												className={fieldState.invalid ? "border-red-500" : ""}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</AddressAutofill>
						{/* {!form.getFieldState("address").isTouched && autofillResponse.suggestions.slice(0, 2).map((suggestion, index) => (
							<div
								key={index}
								className="w-full bg-muted p-1 rounded-2xl hover:scale-105 shadow-lg cursor-pointer "
								onClick={() => {
									form.setValue("address", suggestion.place_name);
									form.setValue("latitude", suggestion.geometry.coordinates[1].toString());
									form.setValue("longitude", suggestion.geometry.coordinates[0].toString());
									setAutofillResponse({ suggestions: [] });
								}}
							>
								{suggestion.place_name}
							</div>
						))} */}

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
									<FormLabel className="required">{m.form_color_label()}</FormLabel>
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
																className={`size-3.5 rounded-full bg-${color.toLowerCase()}-600 dark:bg-${color.toLowerCase()}-700`}
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
							name="genre"
							render={({ field, fieldState }) => (
								<FormItem>
									<FormLabel className="required">Genre</FormLabel>
									<FormControl>
										<Select value={field.value} onValueChange={field.onChange}>
											<SelectTrigger
												className={`w-full ${fieldState.invalid ? "border-red-500" : ""
													}`}
											>
												<SelectValue placeholder="Select a genre" />
											</SelectTrigger>
											<SelectContent className="max-h-[300px]">
												{GENRES.map((genre) => (
													<SelectItem value={genre} key={genre}>
														{genre}
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
									<FormLabel className="required">{m.form_description_label()}</FormLabel>
									<FormControl>
										<Textarea
											{...field}
											placeholder={m.form_description_placeholder()}
											className={`${fieldState.invalid ? "border-red-500" : ""} max-h-40`}
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
							{m.button_cancel()}
						</Button>
					</ModalClose>
					<Button
						form="event-form"
						type="submit"
						onClick={form.handleSubmit(onSubmit)}
					>
						{isEditing ? `${m.save_changes()}` : `${m.calendar_add_event()}`}
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
