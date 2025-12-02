import { View, Text, TouchableOpacity, useColorScheme } from "react-native";
import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight, CircleCheck } from "lucide-react-native";
import { use } from "react";

interface Props {
    currentStep: number;
    totalSteps: number;
    onNext: () => void;
    onBack: () => void;
    onSubmit: () => void;
    stepTitle?: string;
}

export function NavigationButtons({ currentStep, totalSteps, onBack, onNext, onSubmit, stepTitle }: Props) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    if (currentStep === 1) {
        return (
            <Button onPress={onNext} className="px-6">
                <View className="flex-row items-center gap-2">
                    <Text className="text-white font-semibold">Next</Text>
                    <ArrowRight size={18} color="white" />
                </View>
            </Button>
        );
    }

    return (
        <View className="flex-row items-center justify-between flex-1">
            <TouchableOpacity onPress={onBack} className="p-2">
                <ArrowLeft size={32} className="" color={isDark ? "white" : "black"} />
            </TouchableOpacity>

            {stepTitle && (
                <Text className="text-xl font-bold text-gray-900 dark:text-white flex-1 text-center mx-4">
                    {stepTitle}
                </Text>
            )}

            {currentStep < totalSteps ? (
                <TouchableOpacity onPress={onNext} className="p-2">
                    <ArrowRight size={32} className="" color={isDark ? "white" : "black"} />
                </TouchableOpacity>
            ) : (
                <Button onPress={onSubmit} className="px-4">
                    <View className="flex-row items-center gap-2">
                        <Text className="text-white font-semibold">Submit</Text>
                        <CircleCheck size={18} color="white" />
                    </View>
                </Button>
            )}
        </View>
    );
}
