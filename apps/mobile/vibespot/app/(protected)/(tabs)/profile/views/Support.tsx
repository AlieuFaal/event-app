import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useRouter } from "expo-router";
import { ArrowLeft, CircleHelp, Mail } from "lucide-react-native";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Support() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-transparent" edges={["top"]}>
      <View className="flex-row items-center border-b border-gray-200 px-4 py-3 dark:border-gray-800">
        <Button
          hitSlop={8}
          onPress={() => router.back()}
          pressRetentionOffset={{ top: 16, right: 16, bottom: 16, left: 16 }}
          className="mr-3 h-12 w-12 bg-transparent p-0 active:opacity-50 dark:bg-transparent dark:active:opacity-50"
        >
          <ArrowLeft size={24} color="#8b5cf6" />
        </Button>
        <Text className="flex-1 text-xl font-semibold text-gray-900 dark:text-white">
          Help & Support
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ gap: 16, padding: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-3 rounded-2xl border border-gray-200 bg-white/80 p-5 dark:border-white/10 dark:bg-gray-900/70">
          <View className="h-11 w-11 items-center justify-center rounded-full bg-purple-500/15">
            <CircleHelp size={24} color="#8b5cf6" />
          </View>
          <Text className="text-lg font-semibold text-gray-900 dark:text-white">
            Need help?
          </Text>
          <Text className="text-sm leading-5 text-gray-600 dark:text-gray-300">
            If something feels broken or confusing, send us a note with what you
            were trying to do and what happened.
          </Text>
        </View>

        <View className="gap-3 rounded-2xl border border-gray-200 bg-white/80 p-5 dark:border-white/10 dark:bg-gray-900/70">
          <View className="h-11 w-11 items-center justify-center rounded-full bg-purple-500/15">
            <Mail size={24} color="#8b5cf6" />
          </View>
          <Text className="text-lg font-semibold text-gray-900 dark:text-white">
            Contact
          </Text>
          <Text className="text-sm leading-5 text-gray-600 dark:text-gray-300">
            Contact options have not been configured yet.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
