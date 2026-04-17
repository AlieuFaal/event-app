import { Calendar2 } from '@/components/calendar/calendar';
import { Card } from '@/components/shadcn/ui/card';
import { getEventDataFn } from '@/services/eventService';
import { getUserDataFn } from '@/services/user-service';
import { createFileRoute } from '@tanstack/react-router';
import { CalendarProvider2 } from "@/components/calendar/contexts/calendar-context";

export const Route = createFileRoute('/(protected)/event-calendar')({
  component: EventCalendarComponent,
  loader: async (ctx) => {
    const [events, users] = await Promise.all([
      getEventDataFn(),
      getUserDataFn(),
    ]);
    const currentUser = ctx.context.currentUser;
    return {
      events,
      users,
      currentUser
    };
  }
})

function EventCalendarComponent() {
  const { events, users, currentUser } = Route.useLoaderData();

  return (
      <Card className="p-10 shadow-lg border rounded-2xl max-w-350 mx-auto">
        <CalendarProvider2 events={events} users={users} view='month'>
          <Calendar2 currentUser={currentUser} />
        </CalendarProvider2>
      </Card>
  )
}
