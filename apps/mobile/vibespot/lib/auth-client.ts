import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const getBaseUrl = () => {
  if (Platform.OS === 'ios') {
    return "http://10.245.20.253:3001";
  } else if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3001';
  }
  return 'http://localhost:3001';
};

const baseURL = getBaseUrl();

console.log('Auth Client Base URL:', baseURL);

export const authClient = createAuthClient({
  baseURL: baseURL,
  plugins: [
    expoClient({
      scheme: "vibespot",
      storagePrefix: "vibespot-auth",
      storage: SecureStore,
    })
  ]
});