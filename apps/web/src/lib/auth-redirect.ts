const AUTH_ROUTES = new Set(["/signin", "/signup"]);

export function getRedirectParamFromSearch(search: unknown): unknown {
	if (typeof search !== "object" || search === null) {
		return undefined;
	}

	return "redirect" in search ? search.redirect : undefined;
}

export function getSafeAuthRedirectTarget(
	redirectTo: unknown,
	fallback = "/",
): string {
	if (typeof redirectTo !== "string" || redirectTo.length === 0) {
		return fallback;
	}

	if (!redirectTo.startsWith("/") || redirectTo.startsWith("//")) {
		return fallback;
	}

	const parsed = new URL(redirectTo, "http://vibespot.local");

	if (AUTH_ROUTES.has(parsed.pathname)) {
		return fallback;
	}

	return `${parsed.pathname}${parsed.search}${parsed.hash}`;
}
