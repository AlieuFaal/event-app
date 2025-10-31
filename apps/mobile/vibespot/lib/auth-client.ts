import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import Constants from 'expo-constants';
import { inferAdditionalFields } from "better-auth/client/plugins";
import { auth } from "@vibespot/database/src/auth";

const getBaseUrl = () => {
  // For physical devices, use the debuggerHost to get your computer's IP
  const debuggerHost = Constants.expoConfig?.hostUri?.split(':').shift();
  
  if (__DEV__) {
    // Development mode
    if (Platform.OS === 'android') {
      // Android emulator uses 10.0.2.2 to access host machine
      return 'http://10.0.2.2:3001';
    } else if (Platform.OS === 'ios' && debuggerHost) {
      // iOS simulator or physical device - use the same IP as the Metro bundler
      return `http://${debuggerHost}:3001`;
    } else {
      // Fallback for web or unknown platforms
      return 'http://localhost:3001';
    }
  } else {
    // Production mode - use your deployed API URL
    return 'http://localhost:3001'; // TODO: Replace with your production API URL
  }
};

const baseURL = getBaseUrl();

console.log('Auth Client Base URL:', baseURL);

export const authClient = createAuthClient({
  baseURL: baseURL,
  plugins: [ inferAdditionalFields<typeof auth>() ,
    expoClient({
      scheme: "vibespot",
      storagePrefix: "vibespot-auth",
      storage: SecureStore,
    }),
    
  ],
});