import { View, Text } from "react-native";
import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight, CircleCheck } from "lucide-react-native";

interface Props {
    currentStep: number;
    totalSteps: number;
    onNext: () => void;
    onBack: () => void;
    onSubmit: () => void;
}

export function NavigationButtons({ currentStep, totalSteps, onBack, onNext, onSubmit }: Props) {
    return (
        <View className="flex-row justify-between items-center">
            {currentStep > 1 ? (
                <Button variant="outline" onPress={onBack} className="w-24">
                    <ArrowLeft size={16} />
                    <Text>Back</Text>
                </Button>
            ) : (
                <View />
            )}
            <View>
                {currentStep < totalSteps ? (
                    <Button onPress={onNext} className="w-24">
                        <Text>Next</Text>
                        <ArrowRight size={16} />
                    </Button>
                ) : (
                    <Button onPress={onSubmit} className="w-32 flex-row items-center justify-center">
                        <Text>Submit Event</Text>
                        <CircleCheck size={16} />
                    </Button>
                )}
            </View>
        </View >
    );
}
