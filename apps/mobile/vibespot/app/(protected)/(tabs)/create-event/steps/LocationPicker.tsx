import React, { useState } from "react";
import { z } from "zod";
import { eventInsertSchema } from "@vibespot/validation";
import { UseFormReturn } from "react-hook-form";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useGoogleAutocomplete } from '@appandflow/react-native-google-autocomplete';
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";


interface Props {
    form: UseFormReturn<z.infer<typeof eventInsertSchema>>;
}

export function LocationPicker({ form }: Props) {
    const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
    const { locationResults, setTerm, clearSearch, searchDetails, term } =
        useGoogleAutocomplete(`${process.env.GOOGLE_MAPS_API_KEY}`, {
            language: "sv",
            debounce: 200,
            queryTypes: 'geocode|establishment',
        });

    // Generate static map URL
    const getStaticMapUrl = () => {
        if (!selectedLocation) {
            return `https://maps.googleapis.com/maps/api/staticmap?center=59.3293,18.0686&zoom=12&size=600x300&maptype=roadmap&key=${process.env.GOOGLE_MAPS_API_KEY}`;
        }
        return `https://maps.googleapis.com/maps/api/staticmap?center=${selectedLocation.lat},${selectedLocation.lng}&zoom=15&size=600x300&maptype=roadmap&markers=color:red%7C${selectedLocation.lat},${selectedLocation.lng}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
    };

    // const GooglePlacesInput = () => {
    //     const [place, setPlace] = React.useState(' ')
    //     return (
    //         <GooglePlacesAutocomplete
    //             placeholder="Search"
    //             query={{
    //                 key: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    //                 language: 'sv',
    //                 components: 'country:se',
    //             }}
    //             keyboardShouldPersistTaps='handled'
    //             fetchDetails={true}
    //             onPress={(data, details = null) => {
    //                 if (details?.geometry?.location) {
    //                     const coordinates = details.geometry.location;
    //                     form.setValue("address", details.formatted_address || "");
    //                     form.setValue("latitude", coordinates.lat.toString());
    //                     form.setValue("longitude", coordinates.lng.toString());
    //                 }
    //             }}
    //             onFail={(error) => console.error(error)}
    //             onNotFound={() => console.log('no results')}
    //             nearbyPlacesAPI="GooglePlacesSearch"
    //             GooglePlacesSearchQuery={{
    //                 rankby: "distance",
    //                 type: "bar",
    //             }}
    //             filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']}
    //             debounce={200}
    //             styles={{
    //                 container: {
    //                     flex: 0,
    //                 },
    //                 textInput: {
    //                     height: 44,
    //                     fontSize: 16,
    //                 },
    //             }}
    //         />
    //     );
    // };

    return (
        <View className="flex-1">
            <Card className="rounded-3xl flex-1 h-full bg-primary dark:bg-gray-900/30 shadow mt-2 pb-16">
                <CardHeader className="flex flex-col items-center mt-5 gap-2">
                    <CardTitle className="text-4xl text-white dark:text-purple-400 text-center">Where&apos;s the spot?</CardTitle>
                    <CardDescription className="text-gray-100 text-xl text-center mt-2">
                        Pick a location for your event.
                    </CardDescription>
                </CardHeader>
                <View className="px-10">
                    <TextInput
                        value={term}
                        onChangeText={setTerm}
                        placeholder="Enter a Location"
                        className="border rounded-xl p-5 bg-white text-gray-900 dark:text-black shadow"
                    >
                    </TextInput>
                </View>
                <View className="px-10">
                    {locationResults.length > 0 && (
                        <View className="bg-white/40 dark:bg-gray-800/20 border rounded-xl p-1 shadow">
                            <Text className="text-black dark:text-white m-3">Please pick a suggestion:</Text>
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
                                    }}
                                    className="border rounded-xl p-3 bg-white/90 dark:bg-secondary-foreground m-2 shadow"
                                >
                                    <Text className="dark:text-white">{place.structured_formatting.main_text.concat(", ", place.structured_formatting.secondary_text)}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>
                <View className="w-11/12 h-48 items-center justify-center mx-auto border rounded-2xl shadow overflow-hidden bg-gray-100">
                    <Image
                        source={{ uri: getStaticMapUrl() }}
                        style={styles.map}
                        resizeMode="cover"
                    />
                    {!selectedLocation && (
                        <View className="absolute inset-0 items-center justify-center bg-black/10">
                            <Text className="text-gray-600 font-semibold">Select a location to preview</Text>
                        </View>
                    )}
                </View>
            </Card>
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