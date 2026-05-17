import type { eventInsertSchema } from "@vibespot/validation";
import type { UseFormReturn } from "react-hook-form";
import { Controller } from "react-hook-form";
import {
	Text,
	TextInput,
	type TextInputProps,
	useColorScheme,
	View,
} from "react-native";
import type { z } from "zod";

interface Props {
	form: UseFormReturn<z.infer<typeof eventInsertSchema>>;
}

function FieldError({ message }: { message?: string }) {
	if (!message) {
		return null;
	}

	return (
		<Text className="font-medium text-rose-600 text-sm dark:text-rose-200">
			{message}
		</Text>
	);
}

type CreateInputProps = TextInputProps & {
	hasError?: boolean;
	heightClassName?: string;
};

function CreateInput({
	className = "",
	hasError = false,
	heightClassName = "h-16",
	multiline,
	...props
}: CreateInputProps) {
	const colorScheme = useColorScheme();
	const isDark = colorScheme === "dark";

	return (
		<TextInput
			className={`${heightClassName} rounded-3xl border bg-white px-5 py-4 text-gray-950 text-lg dark:bg-white/10 dark:text-white ${
				hasError ? "border-rose-400" : "border-purple-200 dark:border-white/15"
			} ${className}`}
			multiline={multiline}
			placeholderTextColor={isDark ? "#b9a7d8" : "#9b8aad"}
			textAlignVertical={multiline ? "top" : "center"}
			{...props}
		/>
	);
}

export function EventDetails({ form }: Props) {
	return (
		<View className="flex-1 bg-transparent pb-12">
			<View className="gap-7 rounded-[28px] border border-purple-200 bg-white/70 p-5 dark:border-white/10 dark:bg-[#211039]/70">
				<View className="gap-3">
					<Text
						nativeID="title"
						className="font-semibold text-purple-900/60 text-sm uppercase dark:text-purple-100/70"
					>
						Event title
					</Text>
					<Controller
						control={form.control}
						name="title"
						render={({ field, fieldState }) => (
							<View className="gap-2">
								<CreateInput
									accessibilityLabelledBy="title"
									hasError={Boolean(fieldState.error)}
									onBlur={field.onBlur}
									onChangeText={field.onChange}
									placeholder="Jazz Night at The Blue Note"
									value={field.value}
								/>
								<FieldError message={fieldState.error?.message} />
							</View>
						)}
					/>
				</View>

				<View className="gap-3">
					<Text
						nativeID="description"
						className="font-semibold text-purple-900/60 text-sm uppercase dark:text-purple-100/70"
					>
						Event description
					</Text>
					<Controller
						control={form.control}
						name="description"
						render={({ field, fieldState }) => (
							<View className="gap-2">
								<CreateInput
									accessibilityLabelledBy="description"
									hasError={Boolean(fieldState.error)}
									heightClassName="h-40"
									multiline
									onBlur={field.onBlur}
									onChangeText={field.onChange}
									placeholder="Mood, lineup, dress code, or what guests should know."
									value={field.value}
								/>
								<FieldError message={fieldState.error?.message} />
							</View>
						)}
					/>
				</View>

				<View className="gap-3">
					<View className="flex-row items-center justify-between gap-4">
						<Text
							nativeID="venue"
							className="font-semibold text-purple-900/60 text-sm uppercase dark:text-purple-100/70"
						>
							Venue
						</Text>
						<Text className="shrink-0 text-purple-900/50 text-sm dark:text-purple-100/50">
							Optional
						</Text>
					</View>
					<Controller
						control={form.control}
						name="venue"
						render={({ field, fieldState }) => (
							<View className="gap-2">
								<CreateInput
									accessibilityLabelledBy="venue"
									hasError={Boolean(fieldState.error)}
									onBlur={field.onBlur}
									onChangeText={field.onChange}
									placeholder="The Blue Note"
									value={field.value ?? ""}
								/>
								<FieldError message={fieldState.error?.message} />
							</View>
						)}
					/>
				</View>
			</View>
		</View>
	);
}
