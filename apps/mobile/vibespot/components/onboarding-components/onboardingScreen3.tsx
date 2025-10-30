import React, { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { apiClient } from "@/lib/api-client";
import { View } from "@rn-primitives/slot";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Text } from '@/components/ui/text';
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { useRouter } from "expo-router";
import { Input } from "../ui/input";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { Controller, useForm } from "react-hook-form";
import { onbFormUpdateSchema, OnboardingUpdate } from "@vibespot/database";

export default function OnboardingScreenComponent3() {
    const [phone, setPhone] = useState("");
    const [location, setLocation] = useState("");

    const session = authClient.useSession();

    const router = useRouter();

    const form = useForm<OnboardingUpdate>({
        mode: "onChange",
        // resolver: zodResolver(onbFormUpdateSchema),

        defaultValues: {
            phone: "",
            location: "",
        },
    });

    return (
        <View>
            <Card className="rounded-none h-screen">
                <CardHeader className="flex flex-col items-center mt-14 gap-2">
                    <CardTitle className="text-5xl text-primary text-center">Almost there!</CardTitle>
                    <CardDescription className="text-xl text-center mt-5">We just need a bit more info to set up your profile.</CardDescription>
                </CardHeader>
                <KeyboardAwareScrollView disableScrollOnKeyboardHide={true} keyboardDismissMode='interactive' contentContainerStyle={{ flexGrow: 1 }} >
                    <CardContent>
                        <Label>Phone number</Label>
                        <View>
                            <Controller name="phone" control={form.control} render={({ field: { onChange, onBlur, value } }) => (
                                <Input
                                    placeholder="Enter your phone number"
                                    value={phone}
                                    onChangeText={(text) => setPhone(text)}
                                    keyboardType="phone-pad"
                                />
                            )} />

                        </View>
                        <Label className="mt-4">Location</Label>
                        <View>
                            <Controller name="location" control={form.control} render={({ field: { onChange, onBlur, value } }) => (
                                <Input
                                    placeholder="Enter your phone number"
                                    value={location}
                                    onChangeText={(text) => setLocation(text)}
                                />
                            )} />
                        </View>
                        <Button className="mt-6 p-4 h-fit bg-primary rounded-3xl" onPress={async () => {
                            apiClient.
                                users.
                                updateonboardinginfo[":id"].
                                $put({
                                    param: { id: session.data?.user.id! },
                                    json: { id: session.data?.user.id!, phone, location }
                                });

                            console.log("Phone number:", phone);
                            console.log("Location:", location);
                            console.log("Additional info submitted, onboarding complete.");

                            router.replace("/(protected)/onboarding/onboardingScreen4");
                        }}>
                            <Text>
                                {form.formState?.isDirty ? "Submit" : "Skip"}
                            </Text>
                        </Button>
                    </CardContent>
                </KeyboardAwareScrollView>
            </Card>
        </View>
    )
}   