import React, { useState } from "react";
import { z } from "zod";
import { eventInsertSchema } from "@vibespot/validation";
import { UseFormReturn } from "react-hook-form";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useGoogleAutocomplete } from '@appandflow/react-native-google-autocomplete';
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import MapView, { Marker } from 'react-native-maps';


interface Props {
    form: UseFormReturn<z.infer<typeof eventInsertSchema>>;
}

export function LocationPicker({ form }: Props) {
    const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number }>({
        lat: 59.3293, // Stockholm default
        lng: 18.0686
    });
    const { locationResults, setTerm, clearSearch, searchDetails, term } =
        useGoogleAutocomplete(`${process.env.GOOGLE_MAPS_API_KEY}`, {
            language: "sv",
            debounce: 200,
            queryTypes: 'geocode|establishment',
        });

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
            <Card className="rounded-3xl flex-1 h-full bg-purple-600/80 dark:bg-purple-900/80 shadow mt-2 pb-16">
                <CardHeader className="flex flex-col items-center mt-5 gap-2">
                    <CardTitle className="text-4xl text-white text-center">Where&apos;s the spot?</CardTitle>
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
                                    }}
                                    className="border rounded-xl p-3 bg-white dark:bg-gray-700 m-2 shadow"
                                >
                                    <Text className="text-gray-900 dark:text-white">{place.structured_formatting.main_text.concat(", ", place.structured_formatting.secondary_text)}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>
                <View className="w-11/12 h-48 mx-auto border rounded-2xl shadow overflow-hidden">
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
                            coordinate={{
                                latitude: selectedLocation.lat,
                                longitude: selectedLocation.lng,
                            }}
                            title="Event Location"
                        />
                    </MapView>
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