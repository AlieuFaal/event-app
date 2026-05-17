import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { eventInsertSchema } from "@vibespot/validation";
import * as Crypto from "expo-crypto";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect, useRouter } from "expo-router";
import { ArrowLeft, ArrowRight, Rocket } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
	ActivityIndicator,
	Alert,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	Text,
	useColorScheme,
	View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import type { z } from "zod";
import { DateTimePicker } from "@/components/event-creation-steps/date-time-picker";
import { EventCreationsSuccessful } from "@/components/event-creation-steps/event-creation-successful";
import { EventDetails } from "@/components/event-creation-steps/event-details";
import { GenreSelection } from "@/components/event-creation-steps/genre-selection";
import { ImageUpload } from "@/components/event-creation-steps/image-upload";
import { LocationPicker } from "@/components/event-creation-steps/location-picker";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api-client";
import { authClient } from "@/lib/auth-client";
import { queryClient } from "@/lib/query-client";
import { useTabBarVisibility } from "@/lib/tab-bar-visibility";

type EventFormValues = z.infer<typeof eventInsertSchema>;

const totalSteps = 5;
const stepNumbers = [1, 2, 3, 4, 5] as const;

const stepContent: Record<
	number,
	{
		accent: string;
		beforeAccent: string;
		afterAccent?: string;
		description: string;
	}
> = {
	1: {
		beforeAccent: "What kind of",
		accent: "event",
		afterAccent: "is it?",
		description:
			"Choose the genre that best matches your event's vibe and audience.",
	},
	2: {
		beforeAccent: "Tell people",
		accent: "about it",
		description:
			"Add a catchy title, short description, and venue to bring your event to life.",
	},
	3: {
		beforeAccent: "Where's",
		accent: "the vibe?",
		description: "Pick a location that sets the perfect scene for your event.",
	},
	4: {
		beforeAccent: "When's it",
		accent: "happening?",
		description: "Set the date, time, and schedule for your event.",
	},
	5: {
		beforeAccent: "Add an",
		accent: "event image",
		description:
			"A great image grabs attention and sets the perfect vibe for your event.",
	},
};

const getDefaultStartDate = () => {
	const tomorrow = new Date();
	tomorrow.setDate(tomorrow.getDate() + 1);
	tomorrow.setHours(18, 0, 0, 0);
	return tomorrow.toISOString();
};

const getDefaultEndDate = () => {
	const tomorrow = new Date();
	tomorrow.setDate(tomorrow.getDate() + 1);
	tomorrow.setHours(22, 30, 0, 0);
	return tomorrow.toISOString();
};

export default function CreateEvents() {
	const [currentStep, setCurrentStep] = useState(1);
	const [isLoading, setIsLoading] = useState(false);
	const [isUploadingImage, setIsUploadingImage] = useState(false);
	const { setTabBarHidden } = useTabBarVisibility();
	const navigation = useRouter();
	const colorScheme = useColorScheme();
	const isDark = colorScheme === "dark";

	const { data: session } = authClient.useSession();
	const canCreateEvents =
		session?.user.role === "artist" || session?.user.role === "admin";

	useFocusEffect(
		useCallback(() => {
			setTabBarHidden(true);

			return () => {
				setTabBarHidden(false);
			};
		}, [setTabBarHidden]),
	);

	useEffect(() => {
		if (!session) {
			return;
		}

		if (!canCreateEvents) {
			Alert.alert(
				"Artist mode required",
				"Switch to Artist mode in Settings to create events.",
			);
			router.replace("/(protected)/(tabs)/profile");
		}
	}, [canCreateEvents, session]);

	const form = useForm<EventFormValues>({
		mode: "onBlur",
		resolver: zodResolver(eventInsertSchema),
		defaultValues: {
			id: undefined,
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
			imageUrl: null,
		},
	});

	const postEvent = useMutation({
		mutationFn: async (data: EventFormValues) => {
			setIsLoading(true);
			const response = await apiClient.events.events.$post({ json: data });

			if (!response.ok) {
				const errorBody = await response.text();
				throw new Error(`Failed to create event: ${errorBody}`);
			}

			return response.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries();
			setIsLoading(false);
		},
		onError: (error) => {
			console.error("Error creating event:", error);
			setIsLoading(false);
		},
	});

	const onSubmit = async (values: EventFormValues) => {
		try {
			const dataToSend = {
				...values,
				userId: session?.user.id,
				id: Crypto.randomUUID(),
				startDate: values.startDate,
				endDate: values.endDate,
			};

			if (dataToSend.latitude === "" || dataToSend.longitude === "") {
				Alert.alert(
					"Pick a location",
					"Please select a valid address from the suggestions.",
				);
				return;
			}

			await postEvent.mutateAsync(dataToSend);
			setCurrentStep(6);
		} catch (error) {
			console.error("Error submitting event:", error);
			if (!session) {
				console.error("User is not authenticated.");
				return;
			}
			console.error("Failed to create event for user:", session.user.name);
		}
	};

	const validateCurrentStep = async () => {
		if (currentStep === 1) {
			return form.trigger("genre");
		}

		if (currentStep === 2) {
			return form.trigger(["title", "description", "venue"]);
		}

		if (currentStep === 3) {
			return form.trigger(["address", "latitude", "longitude"]);
		}

		if (currentStep === 4) {
			return form.trigger(["startDate", "endDate"]);
		}

		return true;
	};

	const handleNext = async () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

		if (currentStep === totalSteps) {
			form.handleSubmit(onSubmit, (errors) => {
				console.log("Form validation errors:", errors);
			})();
			return;
		}

		const isValid = await validateCurrentStep();

		if (isValid) {
			setCurrentStep((step) => step + 1);
		}
	};

	const handleBack = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

		if (currentStep === 1) {
			navigation.back();
			return;
		}

		setCurrentStep((step) => step - 1);
	};

	const activeContent = stepContent[currentStep];
	const isBusy = isLoading || isUploadingImage;

	if (session && !canCreateEvents) {
		return (
			<SafeAreaView
				className="flex-1 bg-[#f6f0ff] dark:bg-[#050711]"
				edges={["top"]}
			>
				<View className="flex-1 items-center justify-center">
					<Text className="text-base text-gray-950 dark:text-white">
						Artist mode required to create events.
					</Text>
				</View>
			</SafeAreaView>
		);
	}

	if (currentStep === 6) {
		return (
			<SafeAreaView
				className="flex-1 bg-[#f6f0ff] dark:bg-[#050711]"
				edges={["top"]}
			>
				<LinearGradient
					colors={
						isDark
							? ["#050711", "#081426", "#25083f"]
							: ["#f9f6ff", "#efe6ff", "#f8fbff"]
					}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 1 }}
					style={{ flex: 1 }}
				>
					<EventCreationsSuccessful />
				</LinearGradient>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView
			className="flex-1 bg-[#f6f0ff] dark:bg-[#050711]"
			edges={["top"]}
		>
			<LinearGradient
				colors={
					isDark
						? ["#02040b", "#071426", "#17082c", "#090411"]
						: ["#fbf8ff", "#f1e9ff", "#eef7ff", "#fffafe"]
				}
				locations={[0, 0.38, 0.74, 1]}
				start={{ x: 0, y: 0 }}
				end={{ x: 1, y: 1 }}
				style={{ flex: 1 }}
			>
				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "padding" : undefined}
					className="flex-1"
				>
					<View className="px-5 pt-3">
						<View className="flex-row items-center justify-between">
							<Pressable
								onPress={handleBack}
								style={{
									backgroundColor: isDark
										? "rgba(15, 23, 42, 0.72)"
										: "rgba(255, 255, 255, 0.78)",
									borderColor: isDark
										? "rgba(255, 255, 255, 0.16)"
										: "rgba(17, 24, 39, 0.10)",
									borderWidth: 1,
								}}
								className="h-14 w-14 items-center justify-center rounded-full active:opacity-70"
							>
								<ArrowLeft size={24} color={isDark ? "#ffffff" : "#111827"} />
							</Pressable>

							<View className="mx-5 flex-1 items-center gap-3">
								<View className="w-full flex-row gap-2">
									{stepNumbers.map((stepNumber) => (
										<View
											className={`h-1.5 flex-1 rounded-full ${
												stepNumber <= currentStep
													? "bg-purple-500"
													: "bg-gray-950/15 dark:bg-white/15"
											}`}
											key={`step-${stepNumber}`}
										/>
									))}
								</View>
								<Text className="font-semibold text-gray-950 text-lg dark:text-white">
									<Text className="text-purple-400">Step {currentStep}</Text> of{" "}
									{totalSteps}
								</Text>
							</View>

							<View className="h-14 w-14" />
						</View>
					</View>

					<ScrollView
						showsVerticalScrollIndicator={false}
						contentContainerStyle={{
							flexGrow: 1,
							paddingHorizontal: 20,
							paddingTop: 28,
							paddingBottom: 120,
						}}
						keyboardDismissMode="interactive"
						scrollEventThrottle={16}
					>
						<View className="mb-7">
							<Text className="font-extrabold text-5xl text-gray-950 leading-[56px] dark:text-white">
								{activeContent.beforeAccent}{" "}
								<Text className="text-purple-400">{activeContent.accent}</Text>{" "}
								{activeContent.afterAccent ?? ""}
							</Text>
							<Text className="mt-4 text-[20px] text-gray-600 leading-8 dark:text-white/70">
								{activeContent.description}
							</Text>
						</View>

						{currentStep === 1 && <GenreSelection form={form} />}
						{currentStep === 2 && <EventDetails form={form} />}
						{currentStep === 3 && <LocationPicker form={form} />}
						{currentStep === 4 && <DateTimePicker form={form} />}
						{currentStep === 5 && (
							<ImageUpload
								form={form}
								onUploadStateChange={setIsUploadingImage}
							/>
						)}
					</ScrollView>

					<View className="absolute right-5 bottom-8 left-5">
						<Button
							disabled={isBusy}
							onPress={handleNext}
							className="h-16 flex-row rounded-full bg-purple-600 shadow-purple-950/40 active:opacity-80"
						>
							{isBusy ? (
								<ActivityIndicator color="#ffffff" />
							) : (
								<>
									{currentStep === totalSteps ? (
										<Rocket size={26} color="#ffffff" />
									) : null}
									<Text className="font-bold text-2xl text-white">
										{currentStep === totalSteps ? "Publish event" : "Continue"}
									</Text>
									<ArrowRight size={28} color="#ffffff" />
								</>
							)}
						</Button>
					</View>
				</KeyboardAvoidingView>
			</LinearGradient>
		</SafeAreaView>
	);
}
