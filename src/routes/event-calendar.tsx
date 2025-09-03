import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/event-calendar')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/event-calendar"!</div>
}
