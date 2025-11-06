import React, { } from "react";
import { View } from "@rn-primitives/slot";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Text } from '@/components/ui/text';
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "expo-router";

export default function OnboardingScreenComponent4() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
            <View className="flex-1">
                <Card className="flex-1 bg-background dark:bg-gray-900">
                    <CardHeader className='mt-10'>
                        <CardTitle className="text-center text-3xl sm:text-left text-gray-900 dark:text-white">Onboarding Complete!</CardTitle>
                        <CardDescription className="text-center sm:text-left">
                            You&apos;re all set! Tap the button below to explore VibeSpot.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="mt-5 gap-6">
                        <Text className={cn("text-center")}>
                            Thank you for completing the onboarding process. We&apos;re excited to have you on board!
                        </Text>
                        <Button className="mt-4" onPress={() => {
                            router.navigate("/(protected)/(tabs)")
                        }}>
                            <Text className="h-fit">
                                Go to VibeSpot
                            </Text>
                        </Button>
                    </CardContent>
                </Card>
            </View>
        </SafeAreaView>
    )
}