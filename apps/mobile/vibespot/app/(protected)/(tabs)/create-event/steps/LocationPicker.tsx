import React, { useState } from "react";
import { z } from "zod";
import { eventInsertSchema } from "@vibespot/validation";
import type { UseFormReturn } from "react-hook-form";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useGoogleAutocomplete } from '@appandflow/react-native-google-autocomplete';
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import MapView, { Marker } from 'react-native-maps';


interface Props {
    form: UseFormReturn<z.infer<typeof eventInsertSchema>>;
}

export function LocationPicker({ form }: Props) {
    const [suggestionPicked, setSuggestionPicked] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number }>({
        lat: 59.3293,
        lng: 18.0686
    });
    const { locationResults, setTerm, clearSearch, searchDetails, term } =
        useGoogleAutocomplete(`${process.env.GOOGLE_MAPS_API_KEY}`, {
            language: "sv",
            debounce: 200,
            queryTypes: 'geocode|establishment',
        });

    return (
        <View className="flex-1">
            <View className="flex-1">
                <CardHeader className="flex flex-col items-center mt-5 gap-2">
                    <CardTitle className="text-5xl text-primary text-center">Where&apos;s the spot?</CardTitle>
                    <CardDescription className="text-primary text-xl text-center mt-2">
                        Pick a location for your event.
                    </CardDescription>
                </CardHeader>
                <View className="p-10">
                    <TextInput
                        value={term}
                        onChangeText={setTerm}
                        placeholder="Enter a Location"
                        className="border rounded-xl p-5 bg-white text-gray-900 dark:text-black shadow"
                    >
                    </TextInput>
                </View>
                <View className="px-3 -mt-5 mb-3">
                    {locationResults.length > 0 && (
                        <View className="bg-white/90 dark:bg-gray-800/80 border rounded-xl p-1 shadow">
                            <Text className="text-gray-900 dark:text-white m-3">Please pick a suggestion:</Text>
                            {locationResults.slice(0, 3).map((place, i) => (
                                <TouchableOpacity
                                    key={String(i)}
                                    onPress={async () => {
                                        const details = await searchDetails(place.place_id);
                                        console.log(JSON.stringify(details, null, 2));
                                        form.setValue("address", details.formatted_address || "");
                                        if (details.geometry?.location) {
                                            const coordinates = details.geometry.location;
                                            form.setValue("latitude", coordinates.lat.toString());
                                            form.setValue("longitude", coordinates.lng.toString());
                                            setSelectedLocation({ lat: coordinates.lat, lng: coordinates.lng });
                                            console.log(form.getValues());
                                        }
                                        clearSearch();
                                        setSuggestionPicked(true);
                                    }}
                                    className="border rounded-xl p-3 bg-white dark:bg-gray-700 m-2 shadow"
                                >
                                    <Text className="text-gray-900 dark:text-white">{place.structured_formatting.main_text.concat(", ", place.structured_formatting.secondary_text)}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>
                {suggestionPicked && (
                    <>
                        <View className="w-full h-64 mx-auto border rounded-2xl shadow overflow-hidden -mt-3">
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
                                    onDragEnd={async (e) => {
                                        const { latitude, longitude } = e.nativeEvent.coordinate;
                                        setSelectedLocation({ lat: latitude, lng: longitude });
                                        form.setValue("latitude", latitude.toString());
                                        form.setValue("longitude", longitude.toString());
                                        console.log("Marker dragged to:", latitude, longitude);
                                    }}
                                    draggable
                                    coordinate={{
                                        latitude: selectedLocation.lat,
                                        longitude: selectedLocation.lng,
                                    }} />
                            </MapView>
                        </View>
                        <View>
                            <Text className="mx-5 my-3 text-white">Note: If the position is incorrect, drag the marker to adjust its position.</Text>
                        </View>
                    </>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%',
    },
});