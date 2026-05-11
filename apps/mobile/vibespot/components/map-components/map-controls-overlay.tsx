import { LocateFixed } from "lucide-react-native";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type MapControlsOverlayProps = {
	isDark: boolean;
	isLocatingUser: boolean;
	showEmptyState: boolean;
	onLocateUser: () => void;
};

export function MapControlsOverlay({
	isDark,
	isLocatingUser,
	showEmptyState,
	onLocateUser,
}: MapControlsOverlayProps) {
	return (
		<SafeAreaView
			pointerEvents="box-none"
			edges={["top"]}
			className="absolute inset-x-0 top-0 z-50"
			style={styles.overlay}
		>
			<View pointerEvents="box-none" className="items-end px-4 pt-3">
				<Pressable
					accessibilityRole="button"
					accessibilityLabel="Center map on my location"
					onPress={onLocateUser}
					className={`h-12 w-12 items-center justify-center rounded-full border shadow-lg active:scale-95 active:opacity-80 ${
						isDark
							? "border-white/15 bg-[#17111f] active:bg-[#241536]"
							: "border-violet-100 bg-white active:bg-violet-50"
					}`}
					style={styles.controlElevation}
				>
					{isLocatingUser ? (
						<ActivityIndicator size="small" color="#8b5cf6" />
					) : (
						<LocateFixed size={22} color="#8b5cf6" strokeWidth={2.5} />
					)}
				</Pressable>
			</View>

			{showEmptyState ? (
				<View pointerEvents="none" className="mt-3 items-center px-4">
					<View
						className={`rounded-2xl px-4 py-3 shadow ${
							isDark ? "bg-[#17111f]" : "bg-white"
						}`}
						style={styles.controlElevation}
					>
						<Text className="text-center text-sm font-semibold text-gray-900 dark:text-white">
							No active events on the map
						</Text>
					</View>
				</View>
			) : null}
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	overlay: {
		elevation: 40,
	},
	controlElevation: {
		elevation: 14,
	},
});
