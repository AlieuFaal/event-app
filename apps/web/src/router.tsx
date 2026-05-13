import {
	createRouter as createTanstackRouter,
	Link,
} from "@tanstack/react-router";
import { Button } from "./components/shadcn/ui/button";
// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
export const createRouter = () =>
	createTanstackRouter({
		routeTree,
		scrollRestoration: true,
		scrollRestorationBehavior: "smooth",
		defaultPreload: false, // Disabled to prevent auth issues with server functions
		defaultPreloadDelay: 50,
		defaultPreloadStaleTime: 30_000,
		defaultPendingMs: 1000,
		defaultPendingMinMs: 500,
		context: {
			IsAuthenticated: false,
			currentUser: null,
		},
		defaultStaleTime: 0,

		defaultNotFoundComponent: () => {
			return (
				<div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
					<h1 className="font-bold text-4xl">404 - Page Not Found</h1>
					<p className="mt-4 text-lg">
						The page you are looking for does not seem to exist.
					</p>
					<div className="mt-6">
						<Button
							className="rounded-2xl transition-transform hover:scale-105 hover:bg-secondary"
							variant="outline"
						>
							<Link to={"/"}>Return home</Link>
						</Button>
					</div>
				</div>
			);
		},

		defaultErrorComponent: ({ error }) => {
			return (
				<div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
					<h1 className="font-bold text-4xl">Oops something went wrong! 🫠</h1>
					<p className="mt-2 text-lg text-red-600">{error.message}</p>
					<div className="mt-6">
						<Button
							className="rounded-2xl transition-transform hover:scale-105 hover:bg-secondary"
							variant="outline"
						>
							<Link to={"/"}>Return home</Link>
						</Button>
					</div>
				</div>
			);
		},
	});

let clientRouter: ReturnType<typeof createRouter> | undefined;

const getClientRouter = (): ReturnType<typeof createRouter> => {
	if (!clientRouter) {
		clientRouter = createRouter();
	}

	return clientRouter;
};

export const getRouter = (): ReturnType<typeof createRouter> => {
	if (typeof window === "undefined") {
		return createRouter();
	}

	return getClientRouter();
};

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof createRouter>;
	}
}
