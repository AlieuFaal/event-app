import React, { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { apiClient } from "@/lib/api-client";
import { View } from "@rn-primitives/slot";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Text } from '@/components/ui/text';
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { useRouter } from "expo-router";
import { Input } from "../ui/input";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

export default function OnboardingScreenComponent3() {
    const session = authClient.useSession();
    const router = useRouter();
    const [phone, setPhone] = useState("");
    const [location, setLocation] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const hasContent = phone.trim() !== "" || location.trim() !== "";

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            if (!hasContent) {
                router.replace("/(protected)/onboarding/onboardingScreen4");
                console.log("No additional info provided, will not update. skipping to next step.");
                return;
            }
            await apiClient
                .users
                .updateonboardinginfo[":id"]
                .$put({
                    param: { id: session.data?.user.id! },
                    json: { phone, location }
                });

            console.log("Phone number:", phone);
            console.log("Location:", location);
            console.log("Additional info submitted, onboarding complete.");

            router.replace("/(protected)/onboarding/onboardingScreen4");
        } catch (error) {
            console.error("Error updating user info:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
            <View className="flex-1">
                <Card className="rounded-none flex-1 bg-background dark:bg-gray-900">
                    <CardHeader className="flex flex-col items-center mt-14 gap-2">
                        <CardTitle className="text-5xl text-primary dark:text-purple-400 text-center">Almost there!</CardTitle>
                        <CardDescription className="text-xl text-center mt-5">We just need a bit more info to set up your profile.</CardDescription>
                    </CardHeader>
                    <KeyboardAwareScrollView disableScrollOnKeyboardHide={true} keyboardDismissMode='interactive' contentContainerStyle={{ flexGrow: 1 }} >
                        <CardContent>
                            <Label nativeID="phone" className="text-gray-900 dark:text-white">Phone number</Label>
                            <View className="mt-2">
                                <Input
                                    placeholder="Enter your phone number"
                                    value={phone}
                                    onChangeText={setPhone}
                                    keyboardType="phone-pad"
                                    aria-labelledby="phone"
                                    className="w-full h-12 border-2 bg-white dark:bg-white text-gray-900 dark:text-gray-900"
                                    placeholderTextColor="#6b7280"
                                />
                            </View>
                            <Label nativeID="location" className="mt-4 text-gray-900 dark:text-white">Location</Label>
                            <View className="mt-2">
                                <Input
                                    placeholder="Enter your location"
                                    value={location}
                                    onChangeText={setLocation}
                                    aria-labelledby="location"
                                    className="w-full h-12 border-2 bg-white dark:bg-white text-gray-900 dark:text-gray-900"
                                    placeholderTextColor="#6b7280"
                                />
                            </View>
                            <Button
                                className="mt-6 p-4 h-fit bg-primary rounded-3xl"
                                onPress={handleSubmit}
                                disabled={isSubmitting}
                            >
                                <Text>
                                    {isSubmitting ? "Submitting..." : hasContent ? "Continue" : "Skip"}
                                </Text>
                            </Button>
                        </CardContent>
                    </KeyboardAwareScrollView>
                </Card>
            </View>
        </SafeAreaView>
    )
}   