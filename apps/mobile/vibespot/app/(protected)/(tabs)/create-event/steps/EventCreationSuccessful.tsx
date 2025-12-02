import { View, Text } from "react-native";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
// DotLottieReact is breaking the app for now.
export function EventCreationsSuccessful() {
    return (
        <View className="flex-1 justify-center items-center px-6">
            <Text className="text-2xl font-bold text-center mb-4 text-gray-900 dark:text-white">
                Event Created Successfully!
            </Text>
            <Text className="text-base text-center text-gray-700 dark:text-gray-300">
                Your event has been created and is now live. You can view it on the map and share it with others.
            </Text>
            {/* <DotLottieReact
                src="https://lottie.host/9097a671-7cc4-443a-bbd4-db09cff949a2/F8jdNF0bg8.lottie"
                loop
                autoplay
            /> */}
        </View>
    );
}   