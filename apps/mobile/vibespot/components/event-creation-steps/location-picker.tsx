import { useGoogleAutocomplete } from "@appandflow/react-native-google-autocomplete";
import type { eventInsertSchema } from "@vibespot/validation";
import * as Haptics from "expo-haptics";
import { Check, Info, LocateFixed, MapPin, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import {
	Alert,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import type z from "zod";

interface Props {
	form: UseFormReturn<z.infer<typeof eventInsertSchema>>;
}

type SelectedLocation = {
	lat: number;
	lng: number;
	label: string;
};

export function LocationPicker({ form }: Props) {
	const initialLatitudeValue = form.getValues("latitude");
	const initialLongitudeValue = form.getValues("longitude");
	const initialAddressValue = form.getValues("address");
	const initialLatitude = Number(initialLatitudeValue);
	const initialLongitude = Number(initialLongitudeValue);
	const hasInitialLocation =
		initialLatitudeValue.trim().length > 0 &&
		initialLongitudeValue.trim().length > 0 &&
		initialAddressValue.trim().length > 0 &&
		Number.isFinite(initialLatitude) &&
		Number.isFinite(initialLongitude);
	const [selectedLocation, setSelectedLocation] =
		useState<SelectedLocation | null>(
			hasInitialLocation
				? {
						lat: initialLatitude,
						lng: initialLongitude,
						label: initialAddressValue,
					}
				: null,
		);
	const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
	const { locationResults, setTerm, clearSearch, searchDetails, term } =
		useGoogleAutocomplete(`${process.env.GOOGLE_MAPS_API_KEY}`, {
			language: "sv",
			debounce: 200,
			queryTypes: "geocode|establishment",
		});

	const address = form.watch("address");

	useEffect(() => {
		if (!term && address) {
			setTerm(address);
		}
	}, [address, setTerm, term]);

	const resetSelectedLocation = () => {
		form.setValue("address", "", { shouldDirty: true, shouldValidate: true });
		form.setValue("latitude", "", { shouldDirty: true, shouldValidate: true });
		form.setValue("longitude", "", { shouldDirty: true, shouldValidate: true });
		setSelectedLocation(null);
		setSelectedPlaceId(null);
	};

	const handleSearchChange = (value: string) => {
		setTerm(value);

		if (selectedLocation && value !== selectedLocation.label) {
			resetSelectedLocation();
		}
	};

	const handlePickSuggestion = async (placeId: string) => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		const details = await searchDetails(placeId);
		const coordinates = details.geometry?.location;

		if (!coordinates) {
			return;
		}

		const label = details.formatted_address || "";
		form.setValue("address", label, {
			shouldDirty: true,
			shouldValidate: true,
		});
		form.setValue("latitude", coordinates.lat.toString(), {
			shouldDirty: true,
			shouldValidate: true,
		});
		form.setValue("longitude", coordinates.lng.toString(), {
			shouldDirty: true,
			shouldValidate: true,
		});
		setSelectedLocation({
			lat: coordinates.lat,
			lng: coordinates.lng,
			label,
		});
		setSelectedPlaceId(placeId);
		clearSearch();
		setTerm(label);
	};

	const clearLocation = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		resetSelectedLocation();
		clearSearch();
		setTerm("");
	};

	return (
		<View className="gap-6">
			<View className="flex-row gap-3">
				<View className="min-h-[64px] flex-1 flex-row items-center rounded-3xl border border-purple-400 bg-white/80 px-4 dark:border-purple-500 dark:bg-white/5">
					<MapPin size={24} color="#8b5cf6" />
					<TextInput
						value={term}
						onChangeText={handleSearchChange}
						placeholder="Search for an address or venue"
						placeholderTextColor="#8f8aa3"
						className="ml-3 flex-1 text-gray-950 text-lg dark:text-white"
						autoCapitalize="words"
						autoCorrect={false}
					/>
					{term.length > 0 ? (
						<Pressable
							onPress={clearLocation}
							className="h-9 w-9 items-center justify-center rounded-full bg-gray-950/10 dark:bg-white/20"
						>
							<X size={18} color="#8b5cf6" />
						</Pressable>
					) : null}
				</View>

				<TouchableOpacity
					className="w-24 items-center justify-center rounded-3xl border border-purple-200 bg-white/80 active:opacity-70 dark:border-white/10 dark:bg-white/10"
					onPress={() => {
						Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
						Alert.alert(
							"Near me is coming soon",
							"Search for an address or venue for now, then pick a suggestion.",
						);
					}}
				>
					<LocateFixed size={24} color="#c084fc" />
					<Text className="mt-1 font-semibold text-purple-600 text-sm dark:text-purple-300">
						Near me
					</Text>
				</TouchableOpacity>
			</View>

			<View className="gap-3">
				<Text className="font-bold text-2xl text-gray-950 dark:text-white">
					Suggestions
				</Text>
				<View className="rounded-3xl border border-purple-200 bg-white/70 p-2 dark:border-white/10 dark:bg-white/10">
					{locationResults.length > 0 ? (
						locationResults.slice(0, 4).map((place) => {
							const isSelected = selectedPlaceId === place.place_id;

							return (
								<TouchableOpacity
									key={place.place_id}
									onPress={() => handlePickSuggestion(place.place_id)}
									className={`flex-row items-center gap-4 rounded-2xl border p-4 active:opacity-80 ${
										isSelected
											? "border-purple-500 bg-purple-500/15"
											: "border-purple-100 dark:border-white/10"
									}`}
								>
									<View
										className={`h-9 w-9 items-center justify-center rounded-full ${
											isSelected
												? "bg-purple-500"
												: "border border-purple-300 dark:border-white/30"
										}`}
									>
										{isSelected ? <Check size={18} color="#ffffff" /> : null}
									</View>
									<MapPin size={28} color="#8b5cf6" />
									<View className="min-w-0 flex-1">
										<Text
											className="font-bold text-gray-950 text-lg dark:text-white"
											numberOfLines={1}
										>
											{place.structured_formatting.main_text}
										</Text>
										<Text
											className="text-base text-gray-600 dark:text-white/60"
											numberOfLines={1}
										>
											{place.structured_formatting.secondary_text}
										</Text>
									</View>
								</TouchableOpacity>
							);
						})
					) : (
						<View className="rounded-2xl border border-purple-200 border-dashed p-5 dark:border-white/10">
							<Text className="text-center text-base text-gray-500 dark:text-white/55">
								Start typing to find matching venues and addresses.
							</Text>
						</View>
					)}
				</View>
			</View>

			{selectedLocation ? (
				<View className="gap-3">
					<Text className="font-bold text-2xl text-gray-950 dark:text-white">
						Selected location
					</Text>
					<View className="overflow-hidden rounded-3xl border border-purple-400 bg-white/70 dark:border-purple-500/70 dark:bg-white/10">
						<View className="h-72">
							<MapView
								style={styles.map}
								region={{
									latitude: selectedLocation.lat,
									longitude: selectedLocation.lng,
									latitudeDelta: 0.01,
									longitudeDelta: 0.01,
								}}
							>
								<Marker
									titleVisibility="adaptive"
									onDragEnd={(e) => {
										const { latitude, longitude } = e.nativeEvent.coordinate;
										setSelectedLocation((current) =>
											current
												? { ...current, lat: latitude, lng: longitude }
												: null,
										);
										form.setValue("latitude", latitude.toString(), {
											shouldDirty: true,
											shouldValidate: true,
										});
										form.setValue("longitude", longitude.toString(), {
											shouldDirty: true,
											shouldValidate: true,
										});
									}}
									draggable
									coordinate={{
										latitude: selectedLocation.lat,
										longitude: selectedLocation.lng,
									}}
								/>
							</MapView>
						</View>

						<View className="gap-3 border-purple-500/30 border-t p-4">
							<View className="flex-row items-center gap-3 rounded-2xl bg-white/80 p-3 dark:bg-black/30">
								<MapPin size={22} color="#c084fc" />
								<View className="min-w-0 flex-1">
									<Text
										className="font-semibold text-gray-950 dark:text-white"
										numberOfLines={1}
									>
										{selectedLocation.label}
									</Text>
								</View>
							</View>
							<View className="flex-row items-center gap-3">
								<Info size={18} color="#c084fc" />
								<Text className="flex-1 text-base text-gray-600 dark:text-white/70">
									Drag the pin to fine-tune the location.
								</Text>
							</View>
						</View>
					</View>
				</View>
			) : null}
		</View>
	);
}

const styles = StyleSheet.create({
	map: {
		height: "100%",
		width: "100%",
	},
});
