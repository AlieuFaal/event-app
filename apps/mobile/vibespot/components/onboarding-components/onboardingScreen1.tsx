import React, {  } from "react";
import { View } from "@rn-primitives/slot";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Text } from '@/components/ui/text';
import { Button } from "../ui/button";
import { useRouter } from "expo-router";

export default function OnboardingScreenComponent1() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
            <View className="flex-1">
                <Card className="flex-1 items-center justify-center rounded-none">
                    <CardHeader className="flex flex-col items-center -mt-64">
                        <CardTitle className="text-3xl text-primary">Welcome to VibeSpot!</CardTitle>
                        <CardDescription className="text-xl">Let&apos;s setup your account!</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center">
                        <Button className="p-3 h-fit w-60 rounded-3xl" onPress={() => {
                            router.replace("/(protected)/onboarding/onboardingScreen2");
                            console.log("Proceeding to onboarding step 2.");
                        }}>
                            <Text>
                                Continue
                            </Text>
                        </Button>
                    </CardContent>
                </Card>
            </View>
        </SafeAreaView>
    )
}