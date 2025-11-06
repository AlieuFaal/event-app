import React, { } from "react";
import { authClient } from "@/lib/auth-client";
import { apiClient } from "@/lib/api-client";
import { View } from "@rn-primitives/slot";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Text } from '@/components/ui/text';
import { Button } from "../ui/button";
import { useRouter } from "expo-router";

export function OnboardingScreenComponent2() {

    // const updateUser = useServerFn(updateRoleFn);

    const session = authClient.useSession();

    const router = useRouter();

    function updateRoleToUser() {
        if (session.data) {
            apiClient.users.updateroletouser[":id"].$put({ param: { id: session.data.user.id } })
            // updateUser({ data: { id: user.data.user.id, role: "user" } });
            console.log(`${session.data.user.name}'s role has been updated to User / Enthusiast.`);
        }
    }

    function updateRoleToArtist() {
        if (session.data) {
            apiClient.users.updateroletoartist[":id"].$put({ param: { id: session.data.user.id } })
            // updateUser({ data: { id: user.data.user.id, role: "artist" } });
            console.log(`${session.data.user.name}'s role has been updated to Artist.`);
        }
    }

    return (
        <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
            <View className="flex-1">
                <Card className="flex-1 rounded-none bg-background dark:bg-gray-900">
                    <CardHeader className="flex flex-col items-center mt-8 gap-2">
                        <CardTitle className="text-5xl text-primary dark:text-purple-400 text-center">Which of these fits you best?</CardTitle>
                        <CardDescription className="text-xl text-center mt-5">Only Artists will be able to create events.</CardDescription>
                        <CardDescription className="text-xl">You can change this later in settings.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-row items-center justify-center gap-3 mx-auto mt-5">
                        <View>
                            <Button className="h-fit w-40 p-6 rounded-3xl" onPress={() => {
                                updateRoleToUser();
                                router.replace("/(protected)/onboarding/onboardingScreen3");
                                console.log("Selected account type: Enthusiast, proceeding to next step.");
                            }}>
                                <Text className="text-xs text-center">
                                    The Concert Lover
                                </Text>
                            </Button>
                        </View>
                        <Text>or</Text>
                        <View>
                            <Button className="h-fit w-40 p-8 rounded-3xl" onPress={() => {
                                updateRoleToArtist();
                                router.replace("/(protected)/onboarding/onboardingScreen3");
                                console.log("Selected account type: Artist, proceeding to next step.");
                            }}>
                                <Text className="text-xs">
                                    The Artist
                                </Text>
                            </Button>
                        </View>
                    </CardContent>
                </Card>
            </View>
        </SafeAreaView>
    )
}