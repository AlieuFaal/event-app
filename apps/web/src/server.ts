import {
	createStartHandler,
	defaultStreamHandler,
	type RequestHandler,
} from "@tanstack/react-start/server";
import type { Register } from "@tanstack/react-router";
import { overwriteGetLocale } from "./paraglide/runtime";
import { paraglideMiddleware } from "./paraglide/server";
import { handleImageUploadRequest } from "./lib/server/image-upload-handler";

const startFetch = createStartHandler(defaultStreamHandler);

const fetch = ((request, requestOpts) => {
	const method = request.method.toUpperCase();
	const pathname = new URL(request.url).pathname;

	if (method === "POST" && pathname === "/api/uploads/images") {
		return handleImageUploadRequest(request);
	}

	// Avoid locale middleware on non-GET requests so request bodies remain readable
	// for server functions and auth handlers.
	if (method !== "GET" && method !== "HEAD") {
		return startFetch(request, requestOpts);
	}

	return paraglideMiddleware(request, ({ locale }) => {
		overwriteGetLocale(() => locale);
		return startFetch(request, requestOpts);
	});
}) as RequestHandler<Register>;

const serverEntry = {
	fetch,
} as const;

export default serverEntry;
