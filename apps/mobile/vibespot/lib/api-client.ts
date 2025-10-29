import { hc } from "hono/client";
import type { AppType } from "../../../api/src/index";
import { Platform } from "react-native";

const getApiUrl = () => {
  if (Platform.OS === 'ios') {
    return "http://10.245.20.253:3001";
  } else if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3001';
  }
  return 'http://localhost:3001';
};

const API_URL = getApiUrl();

console.log('API Client URL:', API_URL);

export const apiClient = hc<AppType>(API_URL);
