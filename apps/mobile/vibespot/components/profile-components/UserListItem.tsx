import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { View, Text } from "react-native";

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
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <View className="flex-row items-center px-4 py-3">
      <Avatar
        className="w-12 h-12 justify-center items-center overflow-hidden rounded-full"
        alt={`${user.name}'s avatar`}
      >
        <AvatarImage source={{ uri: user.image ?? undefined }} />
        <AvatarFallback className="bg-primary">
          <Text className="text-sm font-bold text-white">{initials}</Text>
        </AvatarFallback>
      </Avatar>

      <View className="flex-1 ml-3">
        <Text
          className="text-sm font-semibold text-gray-900 dark:text-white"
          numberOfLines={1}
        >
          {user.name}
        </Text>
        {user.bio ? (
          <Text
            className="text-xs text-muted-foreground dark:text-gray-400 mt-0.5"
            numberOfLines={1}
          >
            {user.bio}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
