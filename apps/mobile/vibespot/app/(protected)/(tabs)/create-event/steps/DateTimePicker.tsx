import { z } from "zod";
import { eventInsertSchema } from "@vibespot/validation";
import type { UseFormReturn } from "react-hook-form";
import { View, Text } from "react-native";
import RNDateTimePicker from '@react-native-community/datetimepicker';

interface Props {
    form: UseFormReturn<z.infer<typeof eventInsertSchema>>;
}

export function DateTimePicker({ form }: Props) {

    return (
        <View className="flex-1 ">
            <Text className="text-3xl text-gray-900 dark:text-white">DateTimePicker Step</Text>
        </View>
    );
}