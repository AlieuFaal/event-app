import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export type ConnectionUser = {
	id: string;
	name: string;
	image: string | null;
	bio: string | null;
};

type UserListItemProps = {
	user: ConnectionUser;
};

export function UserListItem({ user }: UserListItemProps) {
	const router = useRouter();
	const initials = user.name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);

	const openProfile = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		router.push({
			pathname: "/users/[id]",
			params: { id: user.id },
		});
	};

	return (
		<Pressable
			onPress={openProfile}
			className="flex-row items-center px-4 py-3 active:opacity-70"
		>
			<Avatar
				className="h-12 w-12 items-center justify-center overflow-hidden rounded-full"
				alt={`${user.name}'s avatar`}
			>
				<AvatarImage source={{ uri: user.image ?? undefined }} />
				<AvatarFallback className="bg-primary">
					<Text className="font-bold text-sm text-white">{initials}</Text>
				</AvatarFallback>
			</Avatar>

			<View className="ml-3 flex-1">
				<Text
					className="font-semibold text-gray-900 text-sm dark:text-white"
					numberOfLines={1}
				>
					{user.name}
				</Text>
				{user.bio ? (
					<Text
						className="mt-0.5 text-muted-foreground text-xs dark:text-gray-400"
						numberOfLines={1}
					>
						{user.bio}
					</Text>
				) : null}
			</View>
		</Pressable>
	);
}
