import { createAuthClient } from "better-auth/react";

const normalizeBaseUrl = (value: string): string => {
	const trimmedValue = value.trim().replace(/\/+$/, "");
	const withProtocol =
		trimmedValue.startsWith("http://") || trimmedValue.startsWith("https://")
			? trimmedValue
			: trimmedValue.startsWith("localhost") ||
					trimmedValue.startsWith("127.0.0.1")
				? `http://${trimmedValue}`
				: `https://${trimmedValue}`;

	return new URL(withProtocol).toString().replace(/\/+$/, "");
};

const getBaseUrl = (): string => {
	if (typeof window !== "undefined") {
		return window.location.origin;
	}

	const configuredBaseUrl =
		process.env.BETTER_AUTH_URL || process.env.VERCEL_URL;
	if (!configuredBaseUrl) {
		throw new Error(
			"BETTER_AUTH_URL environment variable is not set and no Vercel URL fallback is available",
		);
	}

	return normalizeBaseUrl(configuredBaseUrl);
};

export const authClient = createAuthClient({
	baseURL: getBaseUrl(),
});
