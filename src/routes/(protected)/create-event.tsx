import EventCard from '@/components/event-components/create-event-card'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(protected)/create-event')({
  loader: async (ctx) => {
    const currentUser = ctx.context.currentUser;
    console.log("Current User in Create Event Route:", currentUser?.name);

    return { currentUser }
  },
  component: CreateEventsComponent,
})

function CreateEventsComponent() {
  const { currentUser } = Route.useLoaderData();
  return (
    <EventCard currentUser={currentUser} />
  )
}
