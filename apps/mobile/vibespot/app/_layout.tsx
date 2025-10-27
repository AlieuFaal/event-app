import "../global.css"
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";


export default function RootLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack>
        <Stack.Protected guard={true}>
          <Stack.Screen name="index" />
        </Stack.Protected>

        <Stack.Protected guard={true}>
          <Stack.Screen name="signin" />
        </Stack.Protected>

        <Stack.Protected guard={true}>
          <Stack.Screen name="signup" />
        </Stack.Protected>

        <Stack.Protected guard={false}>
          <Stack.Screen name="randomfuturescreen" />
        </Stack.Protected>
      </Stack>
    </SafeAreaView>
  )
}
