import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interaction from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import multiMonthPlugin from '@fullcalendar/multimonth'
import { CalendarEvent } from '@/utils/event'
import { useCalendar } from './contexts/calendar-context'

interface CalendarProps {
  events: CalendarEvent[]
}

export default function Calendar({ events }: CalendarProps) {
  const { calendarRef } = useCalendar();

  return (
    <div>
      <FullCalendar
        ref={calendarRef}
        timeZone="local"
        plugins={[
          dayGridPlugin,
          timeGridPlugin,
          multiMonthPlugin,
          listPlugin,
          interaction,
        ]}
        initialView="dayGridMonth"
        headerToolbar={false}
        allDaySlot={false}
        firstDay={1}
        height={"vh"}
        displayEventEnd={true}
        windowResizeDelay={0}
        events={events}
        slotLabelFormat={{
          hour: "numeric",
          minute: "2-digit",
          hour12: false,
        }}
        eventTimeFormat={{
          hour: "numeric",
          minute: "2-digit",
          hour12: false,
        }}
        contentHeight={"auto"}
        expandRows={true}
        nowIndicator
        editable
        selectable
      />
    </div>
  )
}