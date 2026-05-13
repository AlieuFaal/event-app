import { createMiddleware } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { auth } from "@vibespot/database/src/auth";

export const authMiddleware = createMiddleware({ type: "function" }).server(
	async ({ next }) => {
		const request = getRequest();

		const session = await auth.api.getSession({ headers: request.headers });

		return next({
			context: {
				session: session,
				currentUser: session?.user,
				IsAuthenticated: !!session,
			},
		});
	},
);
