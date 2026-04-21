import { zodResolver } from "@hookform/resolvers/zod";
import { eventInsertBaseSchema, type User } from "@vibespot/database/schema";
import {
	CalendarClock,
	FileText,
	MapPin,
	Palette,
	Sparkles,
} from "lucide-react";
import { lazy, type ComponentProps, Suspense, useEffect, useState } from "react";
import { useForm, useWatch, type FieldErrors } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";
import { m } from "@/paraglide/messages";
import { router } from "@/router";
import { repeatEventsFn } from "@/services/eventService";
import { GENRES } from "../calendar/constants";
import { ColorPicker } from "../color-picker-component/color-picker";
import { Button } from "../shadcn/ui/button";
import { Calendar24 } from "../shadcn/ui/date-time-picker";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../shadcn/ui/form";
import { Input } from "../shadcn/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../shadcn/ui/select";
import { Textarea } from "../shadcn/ui/textarea";

type AddressAutofillComponent =
	typeof import("@mapbox/search-js-react")["AddressAutofill"];
type AddressAutofillProps = ComponentProps<AddressAutofillComponent>;
type AddressRetrieveResult = {
	features?: Array<{
		geometry?: {
			coordinates?: number[];
		};
	}>;
};

const AddressAutofill = lazy(async () => {
	const ServerAddressAutofill = ({ children }: AddressAutofillProps) => (
		<>{children}</>
	);

	if (typeof window === "undefined") {
		return {
			default: ServerAddressAutofill as unknown as AddressAutofillComponent,
		};
	}

	const mod = await import("@mapbox/search-js-react");
	return { default: mod.AddressAutofill };
});

const createEventFormSchema = eventInsertBaseSchema
	.omit({
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

type CreateEventFormData = z.infer<typeof createEventFormSchema>;

interface EventCardProps {
	currentUser: User | null;
}

type StepId = "basics" | "location" | "schedule" | "details";

const STEP_CONFIG: Array<{
	id: StepId;
	title: string;
	description: string;
	icon: typeof Sparkles;
}> = [
	{
		id: "basics",
		title: "Basics",
		description: "Title, genre, color",
		icon: Sparkles,
	},
	{
		id: "location",
		title: "Location",
		description: "Venue + address",
		icon: MapPin,
	},
	{
		id: "schedule",
		title: "Schedule",
		description: "Date, time, repeat",
		icon: CalendarClock,
	},
	{
		id: "details",
		title: "Details",
		description: "Description",
		icon: FileText,
	},
];

const STEP_FIELD_MAP: Record<StepId, Array<keyof CreateEventFormData>> = {
	basics: ["title", "genre", "color"],
	location: ["address", "latitude", "longitude"],
	schedule: ["startDate", "endDate", "repeat", "repeatEndDate"],
	details: ["description"],
};

const FIELD_STEP_INDEX: Record<keyof CreateEventFormData, number> = {
	id: 0,
	title: 0,
	description: 3,
	venue: 1,
	address: 1,
	startDate: 2,
	endDate: 2,
	color: 0,
	genre: 0,
	latitude: 1,
	longitude: 1,
	userId: 0,
	repeat: 2,
	repeatEndDate: 2,
	repeatGroupId: 2,
	imageUrl: 1,
};

export default function EventCard({
	currentUser: _currentUser,
}: EventCardProps) {
	const [currentStep, setCurrentStep] = useState(0);
	const [showRepeatEndDate, setShowRepeatEndDate] = useState(false);

	const getDefaultStartDate = () => {
		const tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		tomorrow.setHours(18, 0, 0, 0);
		return tomorrow;
	};

	const getDefaultEndDate = () => {
		const tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		tomorrow.setHours(22, 30, 0, 0);
		return tomorrow;
	};

	const form = useForm<CreateEventFormData>({
		mode: "onBlur",
		resolver: zodResolver(createEventFormSchema),
		defaultValues: {
			title: "",
			description: "",
			address: "",
			venue: "",
			latitude: "",
			longitude: "",
			color: "Blue",
			genre: "Indie",
			startDate: getDefaultStartDate(),
			endDate: getDefaultEndDate(),
			repeat: "none",
			repeatEndDate: undefined,
		},
	});

	const repeatValue = useWatch({
		control: form.control,
		name: "repeat",
	});

	useEffect(() => {
		const shouldShowRepeatEndDate = repeatValue !== "none";
		setShowRepeatEndDate(shouldShowRepeatEndDate);

		if (!shouldShowRepeatEndDate) {
			form.setValue("repeatEndDate", undefined);
		}
	}, [repeatValue, form]);

	const { data: session } = authClient.useSession();

	const onSubmit = async (values: CreateEventFormData) => {
		try {
			if (!session?.user.id) {
				toast.error(m.toast_login_required());
				return;
			}

			const dataToSend = {
				...values,
				userId: session.user.id,
				id: crypto.randomUUID(),
			};

			if (dataToSend.latitude === "" || dataToSend.longitude === "") {
				toast.error("Please select a valid address from the suggestions.");
				setCurrentStep(1);
				return;
			}

			await repeatEventsFn({
				data: dataToSend,
			});

			toast.success(m.toast_event_created());
			await router.navigate({ to: "/events", replace: true });
		} catch (error) {
			console.error("Error submitting event:", error);
			toast.error(m.toast_event_failed());
		}
	};

	const onInvalid = (errors: FieldErrors<CreateEventFormData>) => {
		const firstFieldWithError = Object.keys(errors)[0] as
			| keyof CreateEventFormData
			| undefined;

		if (!firstFieldWithError) return;
		setCurrentStep(FIELD_STEP_INDEX[firstFieldWithError] ?? 0);
	};

	const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		form.setValue("address", e.target.value);
	};

	const stepId = STEP_CONFIG[currentStep]?.id;
	const isLastStep = currentStep === STEP_CONFIG.length - 1;

	const validateCurrentStep = async () => {
		const fieldsForStep = STEP_FIELD_MAP[stepId];
		const validationFields =
			stepId === "schedule" && !showRepeatEndDate
				? fieldsForStep.filter((fieldName) => fieldName !== "repeatEndDate")
				: fieldsForStep;

		return form.trigger(validationFields, { shouldFocus: true });
	};

	const goToNextStep = async () => {
		const isStepValid = await validateCurrentStep();
		if (!isStepValid) return;
		setCurrentStep((prevStep) => Math.min(prevStep + 1, STEP_CONFIG.length - 1));
	};

	const goToPreviousStep = () => {
		setCurrentStep((prevStep) => Math.max(prevStep - 1, 0));
	};

	return (
		<div className="relative mx-auto w-full px-4 py-6 md:px-12 md:py-8">

			<section className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-background/70 px-5 py-6 shadow-sm backdrop-blur-sm md:px-8 md:py-8">
				<div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-primary/25 blur-3xl" />

				<div className="relative z-10 space-y-4">
					<div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-primary">
						<Palette className="size-3.5" />
						Design your next vibe
					</div>

					<div className="space-y-2">
						<h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl md:text-5xl">
							Create an event people won&apos;t forget!
						</h1>
						<p className="max-w-3xl text-sm text-muted-foreground sm:text-base">
							This is isn&apos;t just any event, it&apos;s YOUR event! Build the right
							mood, lock in the details, and publish your next standout event.
						</p>
					</div>
				</div>
			</section>

			<section className="mt-6 rounded-[1.75rem] border border-border/60 bg-card/80 p-4 shadow-sm backdrop-blur-sm md:p-6">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit, onInvalid)}
						className="space-y-6"
						autoComplete="off"
					>
						<div className="grid grid-cols-2 gap-2 md:grid-cols-4">
							{STEP_CONFIG.map((step, index) => {
								const Icon = step.icon;
								const isActive = index === currentStep;
								const isPassed = index < currentStep;

								return (
									<button
										key={step.id}
										type="button"
										onClick={() => {
											if (index <= currentStep) setCurrentStep(index);
										}}
										className={`rounded-xl border px-3 py-3 text-left transition ${
											isActive
												? "border-primary/60 bg-primary/10"
												: isPassed
													? "border-border/70 bg-muted/30"
													: "border-border/50 bg-background/40"
										}`}
									>
										<div className="mb-1 flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
											<Icon className="size-3.5" />
											Step {index + 1}
										</div>
										<p className="text-sm font-semibold text-foreground">{step.title}</p>
										<p className="mt-1 text-xs text-muted-foreground">
											{step.description}
										</p>
									</button>
								);
							})}
						</div>

						<div className="rounded-2xl border border-border/60 bg-background/70 p-4 md:p-6">
							{stepId === "basics" && (
								<div className="space-y-5">
									<div className="space-y-1">
										<h2 className="text-xl font-bold tracking-tight">Set the vibe</h2>
										<p className="text-sm text-muted-foreground">
											Give your event a title, mood color and genre identity.
										</p>
									</div>

									<div className="grid gap-5 md:grid-cols-2">
										<FormField
											control={form.control}
											name="title"
											render={({ field }) => (
												<FormItem>
													<FormLabel>{m.form_title_label()}</FormLabel>
													<FormControl>
														<Input
															placeholder={m.form_title_placeholder()}
															{...field}
														/>
													</FormControl>
													<FormDescription>{m.form_title_description()}</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="genre"
											render={({ field }) => (
												<FormItem>
													<FormLabel>{m.form_genre_label()}</FormLabel>
													<Select
														onValueChange={field.onChange}
														defaultValue={field.value}
													>
														<FormControl>
															<SelectTrigger>
																<SelectValue placeholder="Select a genre" />
															</SelectTrigger>
														</FormControl>
														<SelectContent className="max-h-[320px]">
															{GENRES.map((genre) => (
																<SelectItem key={genre} value={genre}>
																	{genre}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
													<FormDescription>{m.form_genre_description()}</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									<FormField
										control={form.control}
										name="color"
										render={({ field }) => (
											<FormItem>
												<FormLabel>{m.form_color_label()}</FormLabel>
												<FormControl>
													<ColorPicker
														color={field.value}
														onChange={(color) => field.onChange(color)}
													/>
												</FormControl>
												<FormDescription>{m.form_color_description()}</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							)}

							{stepId === "location" && (
								<div className="space-y-5">
									<div className="space-y-1">
										<h2 className="text-xl font-bold tracking-tight">Place the scene</h2>
										<p className="text-sm text-muted-foreground">
											Set venue details and pick an address suggestion to lock map
											coordinates.
										</p>
									</div>

									<div className="grid gap-5 md:grid-cols-2">
										<FormField
											control={form.control}
											name="venue"
											render={({ field }) => (
												<FormItem>
													<FormLabel>{m.form_venue_label()}</FormLabel>
													<FormControl>
														<Input
															placeholder={m.form_venue_placeholder()}
															{...field}
															value={field.value || ""}
														/>
													</FormControl>
													<FormDescription>{m.form_venue_description()}</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>

										<Suspense
											fallback={
												<div className="h-20 animate-pulse rounded-xl bg-muted/40" />
											}
										>
											<AddressAutofill
												accessToken={import.meta.env.VITE_PUBLIC_MAPBOX_ACCESS_TOKEN}
												onRetrieve={(res: AddressRetrieveResult) => {
													form.setValue(
														"latitude",
														res.features?.[0]?.geometry?.coordinates?.[1]?.toString() ||
															"",
													);
													form.setValue(
														"longitude",
														res.features?.[0]?.geometry?.coordinates?.[0]?.toString() ||
															"",
													);
												}}
												onSuggestError={(error: unknown) => {
													console.error(error);
												}}
												browserAutofillEnabled={false}
												confirmOnBrowserAutofill={false}
												options={{
													country: "se",
													streets: true,
													proximity: "ip",
													limit: 5,
												}}
												theme={{
													variables: { borderRadius: "1rem", padding: "0.65rem" },
												}}
											>
												<FormField
													control={form.control}
													name="address"
													render={({ field }) => (
														<FormItem>
															<FormLabel>{m.form_address_label()}</FormLabel>
															<FormControl>
																<Input
																	placeholder={m.form_address_placeholder()}
																	{...field}
																	value={field.value}
																	onChange={handleAddressChange}
																	autoComplete="street-address"
																/>
															</FormControl>
															<FormDescription>
																{m.form_address_description()}
															</FormDescription>
															<FormMessage />
														</FormItem>
													)}
												/>
											</AddressAutofill>
										</Suspense>
									</div>
								</div>
							)}

							{stepId === "schedule" && (
								<div className="space-y-5">
									<div className="space-y-1">
										<h2 className="text-xl font-bold tracking-tight">Time it right</h2>
										<p className="text-sm text-muted-foreground">
											Choose start/end times and repeat cadence for recurring events.
										</p>
									</div>

									<div className="grid gap-5 lg:grid-cols-2">
										<FormField
											control={form.control}
											name="startDate"
											render={({ field }) => (
												<FormItem>
													<FormLabel>{m.start_date_label()}</FormLabel>
													<FormControl>
														<Calendar24
															value={field.value}
															onChange={field.onChange}
														/>
													</FormControl>
													<FormDescription>
														{m.form_start_date_description()}
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name="endDate"
											render={({ field }) => (
												<FormItem>
													<FormLabel>{m.end_date_label()}</FormLabel>
													<FormControl>
														<Calendar24
															value={field.value}
															onChange={field.onChange}
														/>
													</FormControl>
													<FormDescription>{m.form_end_date_description()}</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									<FormField
										control={form.control}
										name="repeat"
										render={({ field }) => (
											<FormItem>
												<FormLabel>{m.form_repeat_label()}</FormLabel>
												<FormControl>
													<Select onValueChange={field.onChange} defaultValue={field.value}>
														<SelectTrigger className="w-full md:w-[240px]">
															<SelectValue />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value="none">{m.form_repeat_none()}</SelectItem>
															<SelectItem value="daily">{m.form_repeat_daily()}</SelectItem>
															<SelectItem value="weekly">{m.form_repeat_weekly()}</SelectItem>
															<SelectItem value="monthly">{m.form_repeat_monthly()}</SelectItem>
															<SelectItem value="yearly">{m.form_repeat_yearly()}</SelectItem>
														</SelectContent>
													</Select>
												</FormControl>
												<FormDescription>{m.form_repeat_description()}</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>

									{showRepeatEndDate && (
										<FormField
											control={form.control}
											name="repeatEndDate"
											render={({ field }) => (
												<FormItem>
													<FormLabel>{m.end_repeat_date_label()}</FormLabel>
													<FormControl>
														<Calendar24
															value={field.value ?? undefined}
															onChange={field.onChange}
														/>
													</FormControl>
													<FormDescription>
														{m.end_repeat_date_description()}
													</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>
									)}
								</div>
							)}

							{stepId === "details" && (
								<div className="space-y-5">
									<div className="space-y-1">
										<h2 className="text-xl font-bold tracking-tight">Set the story</h2>
										<p className="text-sm text-muted-foreground">
											Add a description that sells the mood and tells people why they
											should show up.
										</p>
									</div>

									<FormField
										control={form.control}
										name="description"
										render={({ field }) => (
											<FormItem>
												<FormLabel>{m.form_description_label()}</FormLabel>
												<FormControl>
													<Textarea
														placeholder={m.form_description_placeholder()}
														{...field}
														className="min-h-[180px] resize-y"
													/>
												</FormControl>
												<FormDescription>
													{m.form_description_description()}
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							)}
						</div>

						<div className="flex flex-col gap-3 border-t border-border/60 pt-5 sm:flex-row sm:items-center sm:justify-between">
							<p className="text-xs text-muted-foreground">
								Step {currentStep + 1} of {STEP_CONFIG.length} ·
								{" "}
								{STEP_CONFIG[currentStep]?.description}
							</p>

							<div className="flex items-center justify-end gap-2">
								{currentStep > 0 ? (
									<Button type="button" variant="outline" onClick={goToPreviousStep}>
										Back
									</Button>
								) : null}

								{isLastStep ? (
									<Button type="submit" className="min-w-[140px]">
										{m.button_submit_event()}
									</Button>
								) : (
									<Button type="button" onClick={goToNextStep} className="min-w-[140px]">
										Continue
									</Button>
								)}
							</div>
						</div>
					</form>
				</Form>
			</section>
		</div>
	);
}
