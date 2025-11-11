import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "@vibespot/database";
import { Mail } from "lucide-react-native";
import { View, Text, Pressable } from "react-native";

export function ProfileCard({ user }: { user: User | undefined }) {
    return (
        <Card className="w-11/12 mx-auto rounded-3xl border dark:border-gray-500 dark:bg-secondary-foreground shadow drop-shadow-lg">
            <CardContent className="px-5">

                <View className="flex-row items-center mb-2 gap-3">
                    <Avatar className="w-16 h-16 justify-center items-center overflow-hidden rounded-full border-3 border-white dark:border-gray-800 shadow-xl" alt="ProfileImage">
                        <AvatarImage source={{ uri: user?.image || undefined }} />
                        <AvatarFallback className="bg-primary">
                            <Text className="text-lg font-bold text-white">
                                {user?.name?.split(' ').map((n: string) => n[0]).join('').toLocaleUpperCase()}
                            </Text>
                        </AvatarFallback>
                    </Avatar>

                    <View className="flex-1 flex-row justify-around bg-gray-100 dark:bg-gray-900/50 rounded-2xl py-1.5 px-1.5">
                        <Pressable className="items-center flex-1 active:bg-gray-200 active:rounded-xl">
                            <Text className="text-base font-bold text-foreground dark:text-white">
                                10
                            </Text>
                            <Text className="text-xs text-muted-foreground dark:text-gray-400">
                                Followers
                            </Text>
                        </Pressable>

                        <View className="w-px bg-gray-300 dark:bg-gray-700" />

                        <Pressable className="items-center flex-1 active:bg-gray-200 active:rounded-xl">
                            <Text className="text-base font-bold text-foreground dark:text-white">
                                10
                            </Text>
                            <Text className="text-xs text-muted-foreground dark:text-gray-400">
                                Following
                            </Text>
                        </Pressable>

                        <View className="w-px bg-gray-300 dark:bg-gray-700" />

                        <Pressable className="items-center flex-1 active:bg-gray-200 active:rounded-xl">
                            <Text className="text-base font-bold text-foreground dark:text-white">
                                24
                            </Text>
                            <Text className="text-xs text-muted-foreground dark:text-gray-400">
                                Events
                            </Text>
                        </Pressable>
                    </View>
                </View>

                <View className="mb-1">
                    <Text className="text-lg font-bold dark:text-white">
                        {user?.name}
                    </Text>
                </View>

                <View className="mb-2">
                    <Text className="text-xs text-muted-foreground dark:text-gray-400 leading-4">
                        {user?.bio || "No bio available"}
                    </Text>
                </View>

                <View className="flex-row items-center gap-2">
                    <Mail size={12} className="text-muted-foreground" />
                    <Text className="text-xs text-muted-foreground dark:text-gray-400">
                        {user?.email}
                    </Text>
                </View>
            </CardContent>
        </Card>
    );
}