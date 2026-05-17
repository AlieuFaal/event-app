import type { EventColor, Genre } from "@vibespot/validation";
import { type eventInsertSchema, genres } from "@vibespot/validation";
import type { UseFormReturn } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import type { z } from "zod";

interface Props {
	form: UseFormReturn<z.infer<typeof eventInsertSchema>>;
}

const genreAccents: Record<EventColor, string> = {
	Blue: "border-sky-400 bg-sky-400/20",
	Green: "border-emerald-400 bg-emerald-400/20",
	Orange: "border-orange-400 bg-orange-400/20",
	Purple: "border-fuchsia-400 bg-fuchsia-400/20",
	Red: "border-rose-400 bg-rose-400/20",
	Yellow: "border-amber-400 bg-amber-300/25",
};

const getColorForGenre = (genre: Genre): EventColor => {
	switch (genre) {
		case "Hip-Hop":
		case "R&B":
		case "Soul":
		case "Funk":
		case "Jazz":
		case "Gospel":
		case "Ambient":
		case "New Wave":
			return "Purple";
		case "Rock":
		case "Metal":
		case "Punk":
		case "Hard Rock":
		case "Grunge":
		case "Progressive Rock":
		case "Soft Rock":
			return "Red";
		case "Indie":
		case "Alternative":
		case "Acoustic":
		case "Classical":
		case "Instrumental":
			return "Yellow";
		case "Pop":
		case "Disco":
		case "Synthpop":
		case "Electronic":
		case "Techno":
		case "Blues":
			return "Blue";
		case "House":
		case "Trance":
		case "Dubstep":
			return "Orange";
		case "Country":
		case "Folk":
		case "Reggae":
		case "Afrobeat":
			return "Green";
		default:
			return "Blue";
	}
};

export function GenreSelection({ form }: Props) {
	return (
		<View className="flex-1 gap-6 bg-transparent pb-8">
			<Controller
				control={form.control}
				name="genre"
				render={({ field, fieldState }) => (
					<View className="gap-4">
						<View className="rounded-[28px] border border-purple-200 bg-white/70 p-3 dark:border-white/10 dark:bg-[#211039]/70">
							<View className="flex-row flex-wrap justify-between gap-y-3">
								{genres.map((genre) => {
									const color = getColorForGenre(genre);
									const selected = field.value === genre;

									return (
										<Pressable
											accessibilityRole="button"
											accessibilityState={{ selected }}
											className={`min-h-14 w-[31.5%] justify-center rounded-2xl border px-2 active:scale-95 ${
												selected
													? `${genreAccents[color]} border-2`
													: "border-purple-200 bg-white/75 dark:border-white/10 dark:bg-white/5"
											}`}
											key={genre}
											onPress={() => {
												field.onChange(genre);
												form.setValue("color", color, {
													shouldDirty: true,
													shouldValidate: true,
												});
											}}
										>
											<Text
												className={`text-center font-semibold text-sm ${
													selected
														? "text-gray-950 dark:text-white"
														: "text-gray-700 dark:text-purple-100/80"
												}`}
											>
												{genre}
											</Text>
										</Pressable>
									);
								})}
							</View>
						</View>

						{fieldState.error?.message ? (
							<Text className="px-2 font-medium text-rose-600 text-sm dark:text-rose-200">
								{fieldState.error.message}
							</Text>
						) : null}
					</View>
				)}
			/>
		</View>
	);
}
