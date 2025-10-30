import React, { } from "react";
import { View } from "@rn-primitives/slot";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Text } from '@/components/ui/text';
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "expo-router";

export default function OnboardingScreenComponent4() {
    const router = useRouter();

    return (
        <View>
            <Card className="h-screen">
                <CardHeader className='mt-10'>
                    <CardTitle className="text-center text-3xl sm:text-left">Onboarding Complete!</CardTitle>
                    <CardDescription className="text-center sm:text-left">
                        You&apos;re all set! Tap the button below to explore VibeSpot.
                    </CardDescription>
                </CardHeader>
                <CardContent className="mt-48 gap-6">
                    <Text className={cn("text-center")}>
                        Thank you for completing the onboarding process. We&apos;re excited to have you on board!
                    </Text>
                    <Button className="mt-4" onPress={() => {
                        // Navigate to main app screen
                    }}>
                        <Text className="h-fit">
                            Go to VibeSpot
                        </Text>
                    </Button>
                </CardContent>
            </Card>
        </View>
    )
}