const AUTH_ROUTES = new Set(["/signin", "/signup"]);
const PUBLIC_ROUTES = new Set(["/", "/signin", "/signup", "/forgotpassword"]);

export function isPublicAuthPath(pathname: string): boolean {
	return PUBLIC_ROUTES.has(pathname) || pathname.startsWith("/api/auth");
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
