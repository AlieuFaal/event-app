import z from "zod";
import { eventInsertSchema } from "@/schemas/ZodSchemas";
import { Controller, UseFormReturn } from "react-hook-form";
import { View, Text } from "react-native";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

interface Props {
    form: UseFormReturn<z.infer<typeof eventInsertSchema>>;
}

export function EventDetails(form: Props) {
    return (
        <Card className="rounded-xl flex-1 bg-primary dark:bg-gray-900/30 shadow mt-5 pb-16">
            <CardHeader className="flex flex-col items-center mt-5 gap-2">
                <CardTitle className="text-5xl text-white dark:text-purple-400 text-center">Event Details</CardTitle>
                <CardDescription className="text-gray-100 text-xl text-center mt-5">
                    Provide additional information about your event.
                </CardDescription>
            </CardHeader>
            <KeyboardAwareScrollView keyboardDismissMode='interactive' contentContainerStyle={{ flexGrow: 1 }} >
                <CardContent className="mt-10">
                    <Text nativeID="title" className="text-white">Event Title:</Text>
                    <View className="mt-2">
                        <Controller
                            control={form.form.control}
                            name="title"
                            render={({ field }) => (
                                <Input
                                    placeholder="Jazz Night at The Blue Note"
                                    className="w-full h-12 border-2 bg-white dark:bg-white text-gray-900 dark:text-gray-900"
                                    placeholderTextColor="#6b7280"
                                    value={field.value}
                                    onChangeText={field.onChange}
                                />
                            )}
                        />
                    </View>
                    <Text nativeID="description" className="mt-4 text-white">Event Description:</Text>
                    <View className="mt-2">
                        <Controller
                            control={form.form.control}
                            name="description"
                            render={({ field }) => (
                                <Input
                                    placeholder="Brief description of your event"
                                    className="w-full h-12 border-2 bg-white dark:bg-white text-gray-900 dark:text-gray-900"
                                    placeholderTextColor="#6b7280"
                                    value={field.value}
                                    onChangeText={field.onChange}
                                />
                            )}
                        />
                    </View>
                    <Text className="mt-4 text-white">Venue (optional):</Text>
                    <View className="mt-2">
                        <Controller
                            control={form.form.control}
                            name="venue"
                            render={({ field }) => (
                                <Input
                                    placeholder="Kungsportsavenyen 34, Gothenburg, Sweden"
                                    className="w-full h-12 border-2 bg-white dark:bg-white text-gray-900 dark:text-gray-900"
                                    placeholderTextColor="#6b7280"
                                    value={field.value || ""}
                                    onChangeText={field.onChange}
                                />
                            )}
                        />
                    </View>
                </CardContent>
            </KeyboardAwareScrollView>
        </Card>
    );
}
