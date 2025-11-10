import { hc } from "hono/client";
import type { AppType } from "../../../api/src/index";
import { Platform } from "react-native";
import Constants from "expo-constants";
import { authClient } from "./auth-client"; 

const getApiUrl = () => {
  const debuggerHost = Constants.expoConfig?.hostUri?.split(":").shift();

  if (Platform.OS === "android") {
    return "http://10.0.2.2:3001";
  } else if (Platform.OS === "ios" && debuggerHost) {
    return `http://${debuggerHost}:3001`;
  } else {
    return "http://localhost:3001";
  }
};

const API_URL = getApiUrl();

console.log("API Client URL:", API_URL);

export const apiClient = hc<AppType>(API_URL, {
  init: {
    credentials: "omit", 
  },
  headers(): Record<string, string> {
    const cookies = authClient.getCookie();
    
    if (cookies) {
      return {
        "Cookie": cookies,
      };
    }
    
    return {};
  },
});

