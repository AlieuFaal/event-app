import { hc } from "hono/client";
import type { AppType } from "../../../api/src/index";
import { Platform } from "react-native";
import Constants from "expo-constants";

const getApiUrl = () => {
  // For physical devices, use the debuggerHost to get your computer's IP
  const debuggerHost = Constants.expoConfig?.hostUri?.split(":").shift();

  if (Platform.OS === "android") {
    // Android emulator uses 10.0.2.2 to access host machine
    return "http://10.0.2.2:3001";
  } else if (Platform.OS === "ios" && debuggerHost) {
    // iOS simulator or physical device - use the same IP as the Metro bundler
    return `http://${debuggerHost}:3001`;
  } else {
    // Fallback for web or unknown platforms
    return "http://localhost:3001";
  }
};

const API_URL = getApiUrl();

console.log("API Client URL:", API_URL);

export const apiClient = hc<AppType>(API_URL);
