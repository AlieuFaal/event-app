import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import Constants from "expo-constants";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { auth } from "@vibespot/database/src/auth";

const getBaseUrl = () => {
  const debuggerHost = Constants.expoConfig?.hostUri?.split(":").shift();

  if (__DEV__) {
    if (Platform.OS === "android") {
      return "http://10.0.2.2:3001";
    } else if (Platform.OS === "ios" && debuggerHost) {
      return `http://${debuggerHost}:3001`;
    } else {
      return "http://localhost:3001";
    }
  } else {
    return "http://localhost:3001";
  }
};

const baseURL = getBaseUrl();

console.log("Auth Client Base URL:", baseURL);

export const authClient = createAuthClient({
  baseURL: baseURL,
  plugins: [
    inferAdditionalFields<typeof auth>(),
    expoClient({
      scheme: "vibespot",
      storagePrefix: "vibespot-auth",
      storage: SecureStore,
    }),
  ],
});
