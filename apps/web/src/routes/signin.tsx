import { createFileRoute, redirect } from "@tanstack/react-router";
import SignIn from "@/components/auth-components/sign-in";
import {
	getRedirectParamFromSearch,
	getSafeAuthRedirectTarget,
} from "@/lib/auth-redirect";

export const Route = createFileRoute("/signin")({
	component: SignInComponent,
	beforeLoad: async ({ context, search }) => {
		// If user is already authenticated, redirect them away from signin
		if (context.IsAuthenticated && context.currentUser) {
			const safeRedirect = getSafeAuthRedirectTarget(
				getRedirectParamFromSearch(search),
			);
			throw redirect({ to: safeRedirect, replace: true });
		}
	},
});

function SignInComponent() {
	const search = Route.useSearch();
	const redirectTo = getSafeAuthRedirectTarget(
		getRedirectParamFromSearch(search),
	);

	return (
		<div>
			<div className="flex min-h-screen flex-col items-center justify-center px-6">
				<SignIn redirectTo={redirectTo} />
			</div>
		</div>
	);
}
