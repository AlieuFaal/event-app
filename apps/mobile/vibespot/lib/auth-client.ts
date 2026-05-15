import { expoClient } from "@better-auth/expo/client";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export const MOBILE_AUTH_CALLBACK_URL = "/";
export const MOBILE_AUTH_NEW_USER_CALLBACK_URL = "/onboarding";

const getAuthScheme = (): string => {
	const scheme = Constants.expoConfig?.scheme;

	if (Array.isArray(scheme)) {
		return scheme[0] ?? "vibespot";
	}

	return scheme ?? "vibespot";
};

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
const authScheme = getAuthScheme();

export const authClient = createAuthClient({
	baseURL: baseURL,
	plugins: [
		inferAdditionalFields({
			user: {
				bio: {
					type: "string",
					required: false,
					defaultValue: "",
					input: false,
				},
				location: {
					type: "string",
					required: false,
					defaultValue: "",
					input: false,
				},
				phone: {
					type: "string",
					required: false,
					defaultValue: "",
					input: false,
				},
				role: {
					type: "string",
					required: true,
					defaultValue: "New User",
					input: false,
				},
			},
		}),
		expoClient({
			scheme: authScheme,
			storagePrefix: "vibespot-auth",
			storage: SecureStore,
		}),
	],
});
