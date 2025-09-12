import { Calendar2 } from '@/components/calendar/calendar';
import { Card } from '@/components/shadcn/ui/card';
import { getEventData } from '@/utils/eventService';
import { getUserData } from '@/utils/user-service';
import { createFileRoute } from '@tanstack/react-router';
import { CalendarProvider2 } from "@/components/calendar/contexts/calendar-context";

export const Route = createFileRoute('/event-calendar')({
  component: RouteComponent,
  loader: async () => {
    // const eventsforcalendar1 = await getCalendarEventData();
    const events = await getEventData();
    const users = await getUserData();
    return {
      events,
      // eventsforcalendar1,
      users
    };
  }
})

function RouteComponent() {
  const { events, users } = Route.useLoaderData();

  return (
    <div className=''>
      <Card className='m-10 p-10 py-15 shadow-lg border rounded-2xl'>
        <CalendarProvider2 events={events} users={users} view='month'>
          <Calendar2 />
        </CalendarProvider2>
        {/* <CalendarProvider events={eventsforcalendar1} users={users}>
          <CalendarHeader />
          <Calendar events={eventsforcalendar1} />
        </CalendarProvider> */}
      </Card>
    </div>
  )
}
