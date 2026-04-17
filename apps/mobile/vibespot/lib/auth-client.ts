import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import Constants from "expo-constants";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth as authInstance } from "@vibespot/database/src/auth";

const getBaseUrl = () => {
  const debuggerHost = Constants.expoConfig?.hostUri?.split(":").shift();
  const productionApiUrl = process.env.EXPO_PUBLIC_API_URL;

  if (__DEV__) {
    if (Platform.OS === "android") {
      return "http://10.0.2.2:3001";
    } else if (Platform.OS === "ios" && debuggerHost) {
      return `http://${debuggerHost}:3001`;
    } else {
      return "http://localhost:3001";
    }
  }

  if (!productionApiUrl) {
    throw new Error("EXPO_PUBLIC_API_URL environment variable is not set");
  }

  return productionApiUrl;
};

const baseURL = getBaseUrl();

export const authClient = createAuthClient({
  baseURL: baseURL,
  plugins: [
    inferAdditionalFields<typeof authInstance>(),
    expoClient({
      scheme: "vibespot",
      storagePrefix: "vibespot-auth",
      storage: SecureStore,
    }),
  ],
});
