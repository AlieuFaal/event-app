import { z } from "zod";
import { eventInsertSchema } from "@vibespot/validation";
import { Controller } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";
import { View, Text } from "react-native";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

interface Props {
    form: UseFormReturn<z.infer<typeof eventInsertSchema>>;
}

export function EventDetails(form: Props) {
    return (
        <View className="rounded-3xl flex-1 mt-5 pb-16">
            <CardHeader className="flex flex-col items-center mt-5 gap-2">
                <CardTitle className="text-5xl text-secondary-foreground text-center">Event Details</CardTitle>
                <CardDescription className="text-secondary-foreground text-xl text-center mt-5">
                    Provide additional information about your event.
                </CardDescription>
            </CardHeader>
            <KeyboardAwareScrollView keyboardDismissMode='interactive' contentContainerStyle={{ flexGrow: 1 }} >
                <CardContent className="mt-10">
                    <Text nativeID="title" className="text-secondary-foreground">Event Title:</Text>
                    <View className="mt-2">
                        <Controller
                            control={form.form.control}
                            name="title"
                            render={({ field }) => (
                                <Input
                                    placeholder="Jazz Night at The Blue Note"
                                    className="w-full h-20 border-2 bg-white dark:bg-white text-gray-900 dark:text-gray-900"
                                    placeholderTextColor="#6b7280"
                                    value={field.value}
                                    onChangeText={field.onChange}
                                />
                            )}
                        />
                    </View>
                    <Text nativeID="description" className="mt-4 text-secondary-foreground">Event Description:</Text>
                    <View className="mt-2">
                        <Controller
                            control={form.form.control}
                            name="description"
                            render={({ field }) => (
                                <Input
                                    placeholder="Brief description of your event"
                                    className="w-full h-20 border-2 bg-white dark:bg-white text-gray-900 dark:text-gray-900"
                                    placeholderTextColor="#6b7280"
                                    value={field.value}
                                    onChangeText={field.onChange}
                                />
                            )}
                        />
                    </View>
                    <Text className="mt-4 text-secondary-foreground">Venue (optional):</Text>
                    <View className="mt-2">
                        <Controller
                            control={form.form.control}
                            name="venue"
                            render={({ field }) => (
                                <Input
                                    placeholder="The Blue Note"
                                    className="w-full h-20 border-2 bg-white dark:bg-white text-gray-900 dark:text-gray-900"
                                    placeholderTextColor="#6b7280"
                                    value={field.value || ""}
                                    onChangeText={field.onChange}
                                />
                            )}
                        />
                    </View>
                </CardContent>
            </KeyboardAwareScrollView>
        </View>
    );
}
