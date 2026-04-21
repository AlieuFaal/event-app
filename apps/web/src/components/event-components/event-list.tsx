import { EventWithComments, User } from "@vibespot/database/schema";
import EventCards from "./event-cards";

export default function EventList({ events, users, currentUser }: { events: EventWithComments[], users: User[], currentUser: User | null }) {
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    const nextMonth = new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleString('default', { month: 'long' });

    const currentMonthEvents = events.filter(event => {
        const eventMonth = new Date(event.startDate).getMonth();
        return eventMonth === new Date().getMonth();
    });

    const nextMonthEvents = events.filter(event => {
        const eventMonth = new Date(event.startDate).getMonth();
        return eventMonth === new Date(new Date().setMonth(new Date().getMonth() + 1)).getMonth();
    });

    const sections = [
        { label: currentMonth, events: currentMonthEvents },
        { label: nextMonth, events: nextMonthEvents },
    ].filter((section) => section.events.length > 0);

    return (
        <div className="space-y-10">
            {sections.length === 0 && (
                <div className="rounded-2xl border border-border/60 bg-background/75 p-12 text-center shadow-sm">
                    <p className="text-lg font-semibold text-foreground">No events found</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Try adjusting your search or genre filters.
                    </p>
                </div>
            )}

            {sections.map((section) => (
                <section key={section.label} className="space-y-4">
                    <div className="flex items-center gap-3">
                        <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-primary">
                            {section.label}
                        </span>
                        <div className="h-px flex-1 bg-gradient-to-r from-primary/70 to-transparent" />
                        <span className="text-xs text-muted-foreground">{section.events.length} events</span>
                    </div>

                    <EventCards events={section.events} users={users} currentUser={currentUser}/>
                </section>
            ))}
        </div>
    )
}
