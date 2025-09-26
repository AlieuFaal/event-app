import EventCard from '@/components/event-components/create-event-card'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(protected)/create-event')({
  component: CreateEventsComponent,
})

function CreateEventsComponent() {
  return (
    <EventCard />
  )
}
