import { createFileRoute } from "@tanstack/react-router";
import OnboardingCard from "@/components/onboarding-components/onboardingCard";

export const Route = createFileRoute("/(protected)/onboarding")({
	component: Onboarding,
});

function Onboarding() {
	return (
		<div>
			<OnboardingCard />
		</div>
	);
}
