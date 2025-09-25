import OnboardingCard from '@/components/onboarding-components/onboardingCard'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(protected)/onboarding')({
    component: Onboarding,
})

function Onboarding() {
    return (
        <div>
            <OnboardingCard />
        </div >
    )
}
