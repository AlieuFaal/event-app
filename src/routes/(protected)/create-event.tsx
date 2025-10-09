import EventCard from '@/components/event-components/create-event-card'
import { useIsVisible } from '@/hooks/useIsVisible';
import { createFileRoute } from '@tanstack/react-router'
import { useRef } from 'react';

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
  const ref1 = useRef<HTMLDivElement>(null);
  const isVisible1 = useIsVisible(ref1);

  return (
    <div className={`transition-opacity ease-in duration-500 ${isVisible1 ? "opacity-100" : "opacity-0"}`} ref={ref1}>
      <EventCard currentUser={currentUser} />
    </div>
  )
}
