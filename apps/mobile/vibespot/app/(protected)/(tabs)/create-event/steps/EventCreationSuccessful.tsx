import { Button } from "@/components/ui/button";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { useRef } from "react";
import { Text, View } from "react-native";

export function EventCreationsSuccessful() {
	const router = useRouter();

	const animationRef = useRef<LottieView>(null);

	// function playAnimation() {
	//     animationRef.current?.play();
	// }

	const backToStart = () => {
		console.log("Resetting event creation steps");
		router.replace("/(protected)/(tabs)/create-event");
	};

	return (
		<View className="justify-center items-center">
			<View className="mb-6">
				<LottieView
					ref={animationRef}
					source={require("../../../../../assets/animations/success.json")}
					autoPlay={true}
					loop={false}
					style={{
						width: 350,
						height: 300,
					}}
					resizeMode="cover"
				/>
			</View>
			<Text className="text-2xl font-bold text-center mb-4 text-gray-900 dark:text-white">
				Event Created Successfully!
			</Text>
			<Text className="text-base text-center text-gray-700 dark:text-gray-300">
				Your event has been created and is now live. You can view it on the map
				and share it with others.
			</Text>
			<Button className="mt-5">
				<Text className="text-white" onPress={backToStart}>
					Create Another Event
				</Text>
			</Button>
		</View>
	);
}
