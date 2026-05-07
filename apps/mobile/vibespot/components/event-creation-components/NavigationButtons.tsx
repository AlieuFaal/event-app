import { Pressable, View, Text, useColorScheme } from "react-native";
import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight, CircleCheck } from "lucide-react-native";

interface Props {
    currentStep: number;
    totalSteps: number;
    onNext: () => void;
    onBack: () => void;
    onSubmit: () => void;
    stepTitle?: string;
    isLoading?: boolean;
}

const ARROW_HIT_SLOP = { top: 8, right: 8, bottom: 8, left: 8 };
const ARROW_PRESS_RETENTION_OFFSET = { top: 16, right: 16, bottom: 16, left: 16 };

export function NavigationButtons({ currentStep, totalSteps, onBack, onNext, onSubmit, stepTitle, isLoading }: Props) {
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
            <Pressable
                accessibilityRole="button"
                accessibilityLabel="Go back"
                hitSlop={ARROW_HIT_SLOP}
                onPress={onBack}
                pressRetentionOffset={ARROW_PRESS_RETENTION_OFFSET}
                className="h-12 w-12 items-center justify-center rounded-full active:bg-black/5 dark:active:bg-white/10"
            >
                <ArrowLeft size={32} className="" color={isDark ? "white" : "black"} />
            </Pressable>

            {stepTitle && (
                <Text className="text-xl font-bold text-gray-900 dark:text-white flex-1 text-center mx-4">
                    {stepTitle}
                </Text>
            )}

            {currentStep < totalSteps ? (
                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Go next"
                    hitSlop={ARROW_HIT_SLOP}
                    onPress={onNext}
                    pressRetentionOffset={ARROW_PRESS_RETENTION_OFFSET}
                    className="h-12 w-12 items-center justify-center rounded-full active:bg-black/5 dark:active:bg-white/10"
                >
                    <ArrowRight size={32} className="" color={isDark ? "white" : "black"} />
                </Pressable>
            ) : (
                <Button onPress={onSubmit} className="px-4" disabled={isLoading}>
                    <View className="flex-row items-center gap-2">
                        <Text className="text-white font-semibold">Submit</Text>
                        <CircleCheck size={18} color="white" />
                    </View>
                </Button>
            )}
        </View>
    );
}
