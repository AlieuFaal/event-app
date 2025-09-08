import EventCard from '@/components/event-components/create-event-card'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/create-event')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <EventCard />
  )
}
