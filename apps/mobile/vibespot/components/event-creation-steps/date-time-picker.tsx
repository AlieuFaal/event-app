import RNDateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import type { eventInsertSchema } from "@vibespot/validation";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import {
	Calendar,
	CalendarSync,
	CalendarX,
	ChevronRight,
} from "lucide-react-native";
import type { ReactNode } from "react";
import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import {
	Modal,
	Pressable,
	Text,
	TouchableOpacity,
	useColorScheme,
	View,
} from "react-native";
import type z from "zod";
import { Button } from "@/components/ui/button";

interface Props {
	form: UseFormReturn<z.infer<typeof eventInsertSchema>>;
}

type ModalType = "start" | "end" | null;
type RepeatOption = "none" | "daily" | "weekly" | "monthly" | "yearly";

const repeatLabels: Record<RepeatOption, string> = {
	daily: "Daily",
	monthly: "Monthly",
	none: "Never",
	weekly: "Weekly",
	yearly: "Yearly",
};

const lightModeColors: [string, string, string] = [
	"#f9f8fc",
	"#f5f3ff",
	"#faf8ff",
];
const darkModeColors: [string, string, string] = [
	"#14101f",
	"#1b1230",
	"#090411",
];

const formatDateTime = (value: string | Date | null | undefined) => {
	if (!value) return "Select date & time";
	return new Date(value).toLocaleString("sv-SE", {
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		month: "short",
		year: "numeric",
	});
};

const getRepeatEndFallback = (endDate: string | Date | null | undefined) => {
	const fallback = endDate ? new Date(endDate) : new Date();
	fallback.setMonth(fallback.getMonth() + 1);
	return fallback;
};

export function DateTimePicker({ form }: Props) {
	const [modalVisible, setModalVisible] = useState<ModalType>(null);
	const [repeatModalVisible, setRepeatModalVisible] = useState(false);
	const [tempDate, setTempDate] = useState<Date>(new Date());
	const [repeatEndDate, setRepeatEndDate] = useState<Date>(
		getRepeatEndFallback(form.getValues("endDate")),
	);
	const [repeatOption, setRepeatOption] = useState<RepeatOption>(
		(form.getValues("repeat") as RepeatOption | undefined) || "none",
	);

	const startDate = form.watch("startDate");
	const endDate = form.watch("endDate");
	const theme = useColorScheme();
	const isDarkMode = theme === "dark";

	const handleOpenModal = (type: ModalType) => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

		if (type === "start") {
			setTempDate(startDate ? new Date(startDate) : new Date());
		} else if (type === "end") {
			setTempDate(
				endDate ? new Date(endDate) : new Date(startDate || Date.now()),
			);
		}

		setModalVisible(type);
	};

	const handleConfirmDate = () => {
		if (modalVisible === "start") {
			form.setValue("startDate", tempDate.toISOString(), {
				shouldDirty: true,
				shouldValidate: true,
			});
		} else if (modalVisible === "end") {
			form.setValue("endDate", tempDate.toISOString(), {
				shouldDirty: true,
				shouldValidate: true,
			});
		}

		Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
		setModalVisible(null);
	};

	const openRepeatModal = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		setRepeatOption(
			(form.getValues("repeat") as RepeatOption | undefined) || "none",
		);
		setRepeatEndDate(
			form.getValues("repeatEndDate")
				? new Date(form.getValues("repeatEndDate") as string)
				: getRepeatEndFallback(form.getValues("endDate")),
		);
		setRepeatModalVisible(true);
	};

	const confirmRepeat = () => {
		form.setValue("repeat", repeatOption, {
			shouldDirty: true,
			shouldValidate: true,
		});

		if (repeatOption === "none") {
			form.setValue("repeatEndDate", null, {
				shouldDirty: true,
				shouldValidate: true,
			});
		} else {
			const minimumRepeatEnd = endDate ? new Date(endDate) : new Date();
			const selectedRepeatEnd =
				repeatEndDate >= minimumRepeatEnd
					? repeatEndDate
					: getRepeatEndFallback(endDate);

			setRepeatEndDate(selectedRepeatEnd);
			form.setValue("repeatEndDate", selectedRepeatEnd.toISOString(), {
				shouldDirty: true,
				shouldValidate: true,
			});
		}

		Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
		setRepeatModalVisible(false);
	};

	const currentRepeat =
		(form.watch("repeat") as RepeatOption | undefined) ||
		repeatOption ||
		"none";

	return (
		<View className="gap-4">
			<ScheduleRow
				icon={<Calendar size={28} color="#c084fc" />}
				label="Start Date"
				onPress={() => handleOpenModal("start")}
				value={formatDateTime(startDate)}
			/>
			<ScheduleRow
				icon={<CalendarX size={28} color="#c084fc" />}
				label="End Date"
				onPress={() => handleOpenModal("end")}
				value={formatDateTime(endDate)}
			/>
			<ScheduleRow
				icon={<CalendarSync size={28} color="#c084fc" />}
				label="Repeat"
				onPress={openRepeatModal}
				value={repeatLabels[currentRepeat]}
			/>

			<Modal
				animationType="fade"
				onRequestClose={() => setModalVisible(null)}
				transparent
				visible={modalVisible !== null}
			>
				<Pressable
					className="flex-1 justify-end bg-black/60"
					onPress={() => setModalVisible(null)}
				>
					<Pressable onPress={(event) => event.stopPropagation()}>
						<LinearGradient
							colors={isDarkMode ? darkModeColors : lightModeColors}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 1 }}
							style={{
								borderTopLeftRadius: 34,
								borderTopRightRadius: 34,
								paddingBottom: 40,
							}}
						>
							<View className="gap-5 p-6">
								<View className="mx-auto h-1.5 w-20 rounded-full bg-white/20" />
								<View className="flex-row items-center justify-between">
									<View className="flex-row items-center gap-3">
										<View className="h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/20">
											<Calendar size={24} color="#c084fc" />
										</View>
										<View>
											<Text className="font-bold text-2xl text-gray-950 dark:text-white">
												{modalVisible === "start"
													? "Select Start Date"
													: "Select End Date"}
											</Text>
											<Text className="mt-1 text-base text-gray-600 dark:text-white/60">
												Pick the date and time for your event.
											</Text>
										</View>
									</View>
									<TouchableOpacity onPress={() => setModalVisible(null)}>
										<Text className="font-semibold text-lg text-purple-600 dark:text-purple-300">
											Cancel
										</Text>
									</TouchableOpacity>
								</View>

								<View className="overflow-hidden rounded-3xl bg-white/70 dark:bg-white/10">
									<RNDateTimePicker
										display="spinner"
										is24Hour
										locale="sv"
										minimumDate={
											modalVisible === "end" && startDate
												? new Date(startDate)
												: new Date()
										}
										mode="datetime"
										onChange={(_, selectedDate) => {
											if (selectedDate) {
												setTempDate(selectedDate);
											}
										}}
										themeVariant={isDarkMode ? "dark" : "light"}
										value={tempDate}
									/>
								</View>

								<Button
									className="h-14 rounded-full"
									onPress={handleConfirmDate}
								>
									<Text className="font-semibold text-lg text-white">
										Confirm {modalVisible === "start" ? "Start" : "End"} Date
									</Text>
								</Button>
							</View>
						</LinearGradient>
					</Pressable>
				</Pressable>
			</Modal>

			<Modal
				animationType="fade"
				onRequestClose={() => setRepeatModalVisible(false)}
				transparent
				visible={repeatModalVisible}
			>
				<Pressable
					className="flex-1 justify-end bg-black/60"
					onPress={() => setRepeatModalVisible(false)}
				>
					<Pressable onPress={(event) => event.stopPropagation()}>
						<LinearGradient
							colors={isDarkMode ? darkModeColors : lightModeColors}
							start={{ x: 0, y: 0 }}
							end={{ x: 1, y: 1 }}
							style={{
								borderTopLeftRadius: 34,
								borderTopRightRadius: 34,
								paddingBottom: 40,
							}}
						>
							<View className="gap-5 p-6">
								<View className="mx-auto h-1.5 w-20 rounded-full bg-white/20" />
								<View className="flex-row items-center justify-between">
									<Text className="font-bold text-2xl text-gray-950 dark:text-white">
										Repeat Event
									</Text>
									<TouchableOpacity
										onPress={() => setRepeatModalVisible(false)}
									>
										<Text className="font-semibold text-lg text-purple-600 dark:text-purple-300">
											Cancel
										</Text>
									</TouchableOpacity>
								</View>

								<View className="overflow-hidden rounded-3xl bg-white/70 dark:bg-white/10">
									<Picker
										dropdownIconColor={isDarkMode ? "#c084fc" : "#7c3aed"}
										itemStyle={{ height: 150 }}
										onValueChange={(value) =>
											setRepeatOption(value as RepeatOption)
										}
										selectedValue={repeatOption}
										style={{
											color: isDarkMode ? "#ffffff" : "#111827",
											height: 150,
										}}
									>
										<Picker.Item label="Never" value="none" />
										<Picker.Item label="Daily" value="daily" />
										<Picker.Item label="Weekly" value="weekly" />
										<Picker.Item label="Monthly" value="monthly" />
										<Picker.Item label="Yearly" value="yearly" />
									</Picker>
								</View>

								{repeatOption !== "none" ? (
									<View className="gap-3">
										<Text className="text-center text-base text-gray-600 dark:text-white/70">
											When should the repetition end?
										</Text>
										<View className="overflow-hidden rounded-3xl bg-white/70 dark:bg-white/10">
											<RNDateTimePicker
												display="inline"
												locale="sv"
												maximumDate={
													new Date(
														new Date().setFullYear(
															new Date().getFullYear() + 10,
														),
													)
												}
												minimumDate={endDate ? new Date(endDate) : new Date()}
												mode="datetime"
												onChange={(_, selectedDate) => {
													if (selectedDate) {
														setRepeatEndDate(selectedDate);
													}
												}}
												themeVariant={isDarkMode ? "dark" : "light"}
												value={repeatEndDate}
											/>
										</View>
									</View>
								) : null}

								<Button className="h-14 rounded-full" onPress={confirmRepeat}>
									<Text className="font-semibold text-lg text-white">
										Confirm Repeat Option
									</Text>
								</Button>
							</View>
						</LinearGradient>
					</Pressable>
				</Pressable>
			</Modal>
		</View>
	);
}

function ScheduleRow({
	icon,
	label,
	onPress,
	value,
}: {
	icon: ReactNode;
	label: string;
	onPress: () => void;
	value: string;
}) {
	return (
		<TouchableOpacity
			className="min-h-[96px] flex-row items-center rounded-3xl border border-purple-200 bg-white/75 px-5 active:opacity-75 dark:border-white/10 dark:bg-white/10"
			onPress={onPress}
		>
			<View className="mr-5 h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/15">
				{icon}
			</View>
			<View className="min-w-0 flex-1">
				<Text className="text-gray-600 text-lg dark:text-white/80">
					{label}
				</Text>
				<Text
					className="mt-1 font-semibold text-2xl text-gray-950 dark:text-white"
					numberOfLines={1}
				>
					{value}
				</Text>
			</View>
			<ChevronRight size={26} color="#a8a2b8" />
		</TouchableOpacity>
	);
}
