import { registerRootComponent } from "expo";
import { ExpoRoot } from "expo-router";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";

// Must be exported or Fast Refresh won't update the context
export function App() {
  const ctx = require.context("./app");
  configureReanimatedLogger({
    level: ReanimatedLogLevel.warn,
    strict: false,
  });
  return <ExpoRoot context={ctx} />;
}

registerRootComponent(App);
