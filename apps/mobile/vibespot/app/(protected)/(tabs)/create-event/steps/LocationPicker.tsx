import { eventInsertSchema } from "@vibespot/validation";
import { UseFormReturn } from "react-hook-form";
import { View, Text } from "react-native";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import { z } from "zod";

interface Props {
    form: UseFormReturn<z.infer<typeof eventInsertSchema>>;
}


export function LocationPicker(form: Props) {
    // const GooglePlacesInput = () => {
    //     return (
    //         <GooglePlacesAutocomplete
    //             placeholder='Search'
    //             onPress={(data, details = null) => {
    //                 // 'details' is provided when fetchDetails = true
    //                 console.log(data, details);
    //             }}
    //             query={{
    //                 key: 'YOUR API KEY',
    //                 language: 'en',
    //             }}
    //         />
    //     );
    // };

    return (
        <View className="flex-1 px-4 pt-6 bg-primary dark:bg-gray-900/30">
            <GooglePlacesAutocomplete
                placeholder="Search"
                query={{
                    key: "GOOGLE_PLACES_API_KEY",
                    language: 'sv', // language of the results
                    components: 'country:se',
                }}
                onPress={(data, details = null) => {
                    let coordinates = details?.geometry.location;
                    form.form.setValue("address", details?.formattedAddress || "");
                    form.form.setValue("latitude", coordinates?.lat.toString() || "");
                    form.form.setValue("longitude", coordinates?.lng.toString() || "");
                }}
                onFail={(error) => console.error(error)}
                nearbyPlacesAPI="GooglePlacesSearch"
                GooglePlacesSearchQuery={{
                    rankby: "distance",
                    type: "bar",
                }}
                filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']}
                debounce={200}
            />
        </View>
    );
}